import { Socket, Namespace } from 'socket.io';
import { SimulationPingPayload } from '../common/socketPayloads/SimulationPingPayload';
import { SimulationCreateNodePayload } from '../common/socketPayloads/SimulationCreateNodePayload';
import { socketEvents } from '../common/constants/socketEvents';
import { getClientCount } from '../utils/getClientCount';
import { emitWelcome } from '../utils/emitWelcome';
import { SimulationDeleteNodePayload } from '../common/socketPayloads/SimulationDeleteNodePayload';
import { SimulationRequestSnapshotPayload } from '../common/socketPayloads/SimulationRequestStatePayload';
import { SimulationUpdateNodePositionPayload } from '../common/socketPayloads/SimulationUpdateNodePositionPayload';
import { Simulation } from './Simulation';
import { SimulationPongPayload } from '../common/socketPayloads/SimulationPongPayload';
import { SimulationNodeCreatedPayload } from '../common/socketPayloads/SimulationNodeCreatedPayload';
import { SimulationNodeDeletedPayload } from '../common/socketPayloads/SimulationNodeDeletedPayload';
import { SimulationNodePositionUpdatedPayload } from '../common/socketPayloads/SimulationNodePositionUpdatedPayload';
import { SimulationSnapshotReportPayload } from '../common/socketPayloads/SimulationSnapshotReportPayload';
import { ActionHistoryKeeper } from './undoRedo/ActionHistoryKeeper';
import { SimulationNode } from './SimulationNode';
import { SimulationNodeSnapshot } from '../common/SimulationNodeSnapshot';

export class SimulationNamespaceListener {
  private readonly simulation: Simulation;
  private readonly ns: Namespace;
  private readonly actionHistoryKeeper: ActionHistoryKeeper;

  constructor(
    simulation: Simulation,
    ns: Namespace,
    actionHistoryKeeper: ActionHistoryKeeper
  ) {
    this.simulation = simulation;
    this.ns = ns;
    this.actionHistoryKeeper = actionHistoryKeeper;

    ns.on(socketEvents.native.connect, (socket) => {
      this.setupSocket(socket);
    });
  }

  private readonly setupSocket = (socket: Socket) => {
    this.registerListeners(socket);
    emitWelcome(socket, this.simulation.simulationUid);
  };

  private readonly registerListeners = (socket: Socket): void => {
    // native events
    socket.on(
      socketEvents.native.disconnect,
      this.teardownSocket.bind(this, socket)
    );

    // simulation events
    socket.on(socketEvents.simulation.ping, this.handleSimulationPing);
    socket.on(
      socketEvents.simulation.createNode,
      this.handleSimulationCreateNode
    );
    socket.on(
      socketEvents.simulation.deleteNode,
      this.handleSimulationDeleteNode
    );
    socket.on(
      socketEvents.simulation.requestSnapshot,
      this.handleSimulationRequestSnapshot
    );
    socket.on(
      socketEvents.simulation.updateNodePosition,
      this.handleSimulationUpdateNodePosition
    );
  };

  private readonly teardownSocket = (socket: Socket): void => {
    /* This would NOT work:
     *    socket.removeListener(socketEvents.simulation.ping, this.handleSimulationPing);
     * because the socketLoggerMiddleware is wrapping the listeners.
     * This would work:
     *    socket.removeAllListeners(socketEvents.simulation.ping);
     * Tarık, 2020-12-22 07:02
     */
    socket.removeAllListeners();

    const clientsLeft = getClientCount(this.ns);
    console.log(
      `${clientsLeft} clients remaining in namespace ${this.simulation.simulationUid}`
    );

    // TODO: teardown the namsepace itself when 0 clients left.
  };

  private readonly handleSimulationPing = (body: SimulationPingPayload) => {
    this.sendSimulationPong({
      pingDate: body.date,
      pongDate: Date.now(),
    });
  };

  private readonly sendSimulationPong = (body: SimulationPongPayload) => {
    this.ns.emit(socketEvents.simulation.pong, body);
  };

  private readonly handleSimulationCreateNode = (
    body: SimulationCreateNodePayload
  ) => {
    let nodeUid: string;

    this.actionHistoryKeeper.registerAndExecute({
      execute: () => {
        const newNode = this.simulation.createNode(
          body.positionX,
          body.positionY
        );
        nodeUid = newNode.nodeUid;
        const nodeSnapshot = newNode.takeSnapshot();
        this.sendSimulationNodeCreated(nodeSnapshot);
      },
      undo: () => {
        this.simulation.deleteNode(nodeUid);
        this.sendSimulationNodeDeleted({ nodeUid });
      },
    });
  };

  private readonly sendSimulationNodeCreated = (
    body: SimulationNodeCreatedPayload
  ) => {
    this.ns.emit(socketEvents.simulation.nodeCreated, body);
  };

  private readonly handleSimulationDeleteNode = (
    body: SimulationDeleteNodePayload
  ) => {
    let nodeSnapshot: SimulationNodeSnapshot;
    this.actionHistoryKeeper.registerAndExecute({
      execute: () => {
        nodeSnapshot = this.simulation.nodeMap[body.nodeUid].takeSnapshot();
        this.simulation.deleteNode(body.nodeUid);
        this.sendSimulationNodeDeleted({ nodeUid: body.nodeUid });
      },
      undo: () => {
        this.simulation.createNodeWithSnapshot(nodeSnapshot);
        this.sendSimulationNodeCreated(nodeSnapshot);
      },
    });
  };

  private readonly sendSimulationNodeDeleted = (
    body: SimulationNodeDeletedPayload
  ) => {
    this.ns.emit(socketEvents.simulation.nodeDeleted, body);
  };

  private readonly handleSimulationRequestSnapshot = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    body: SimulationRequestSnapshotPayload
  ) => {
    const snapshot = this.simulation.takeSnapshot();
    this.sendSimulationSnapshotReport({ snapshot });
  };

  private readonly sendSimulationSnapshotReport = (
    body: SimulationSnapshotReportPayload
  ): void => {
    this.ns.emit(socketEvents.simulation.snapshotReport, body);
  };

  private readonly handleSimulationUpdateNodePosition = (
    body: SimulationUpdateNodePositionPayload
  ) => {
    this.simulation.updateNodePosition(
      body.nodeUid,
      body.positionX,
      body.positionY
    );
    this.sendSimulationNodePositionUpdated(body);
  };

  private readonly sendSimulationNodePositionUpdated = (
    body: SimulationNodePositionUpdatedPayload
  ) => {
    this.ns.emit(socketEvents.simulation.nodePositionUpdated, body);
  };
}
