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
import { SimulationCreateNodeCommand } from './commands/SimulationCreateNodeCommand';
import { SimulationDeleteNodeCommand } from './commands/SimulationDeleteNodeCommand';
import { SimulationUpdateNodePositionCommand } from './commands/SimulationUpdateNodePositionCommand';
import { SimulationNodeChangeLatencyCommand } from './commands/SimulationNodeChangeLatencyCommand';
import { SimulationNodeLatencyChangedPayload } from '../common/socketPayloads/SimulationNodeLatencyChangedPayload';
import { SimulationNodeChangeLatencyPayload } from '../common/socketPayloads/SimulationNodeChangeLatencyPayload';
import { SimulationNodeSendMailPayload } from '../common/socketPayloads/SimulationNodeSendMailPayload';
import { SimulationNodeBroadcastMailPayload } from '../common/socketPayloads/SimulationNodeBroadcastMailPayload';
import { SimulationNodeMailReceivedPayload } from '../common/socketPayloads/SimulationNodeMailReceivedPayload';

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
    socket.on(socketEvents.simulation.undo, this.handleSimulationUndo);
    socket.on(socketEvents.simulation.redo, this.handleSimulationRedo);

    socket.on(
      socketEvents.simulation.nodeChangeLatency,
      this.handleNodeChangeLatency
    );

    socket.on(socketEvents.simulation.nodeSendMail, this.handleNodeSendMail);

    socket.on(
      socketEvents.simulation.nodeBroadcastMail,
      this.handleNodeBroadcastMail
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
    const createCommand = new SimulationCreateNodeCommand(
      this.simulation,
      this,
      body
    );

    this.actionHistoryKeeper.register(createCommand);
    createCommand.execute();
  };

  public readonly sendSimulationNodeCreated = (
    body: SimulationNodeCreatedPayload
  ): void => {
    this.ns.emit(socketEvents.simulation.nodeCreated, body);
  };

  private readonly handleSimulationDeleteNode = (
    body: SimulationDeleteNodePayload
  ) => {
    const createCommand = new SimulationDeleteNodeCommand(
      this.simulation,
      this,
      body
    );

    this.actionHistoryKeeper.register(createCommand);
    createCommand.execute();
  };

  public readonly sendSimulationNodeDeleted = (
    body: SimulationNodeDeletedPayload
  ): void => {
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
    const createCommand = new SimulationUpdateNodePositionCommand(
      this.simulation,
      this,
      body
    );

    this.actionHistoryKeeper.register(createCommand);
    createCommand.execute();
  };

  public readonly sendSimulationNodePositionUpdated = (
    body: SimulationNodePositionUpdatedPayload
  ): void => {
    this.ns.emit(socketEvents.simulation.nodePositionUpdated, body);
  };

  private readonly handleSimulationUndo = () => {
    this.actionHistoryKeeper.undo();
  };

  private readonly handleSimulationRedo = () => {
    this.actionHistoryKeeper.redo();
  };

  private readonly handleNodeChangeLatency = (
    body: SimulationNodeChangeLatencyPayload
  ) => {
    const createCommand = new SimulationNodeChangeLatencyCommand(
      this.simulation,
      this,
      body
    );

    this.actionHistoryKeeper.register(createCommand);
    createCommand.execute();
  };

  public readonly sendNodeLatencyChanged = (
    body: SimulationNodeLatencyChangedPayload
  ): void => {
    this.ns.emit(socketEvents.simulation.nodeLatencyChanged, body);
  };

  private readonly handleNodeSendMail = (
    body: SimulationNodeSendMailPayload
  ) => {
    const createCommand = new SimulationNodeChangeLatencyCommand(
      this.simulation,
      this,
      body
    );

    this.actionHistoryKeeper.register(createCommand);
    createCommand.execute();
  };

  private readonly handleNodeBroadcastMail = (
    body: SimulationNodeBroadcastMailPayload
  ) => {
    const createCommand = new SimulationNodeChangeLatencyCommand(
      this.simulation,
      this,
      body
    );

    this.actionHistoryKeeper.register(createCommand);
    createCommand.execute();
  };

  public readonly sendNodeMailReceived = (
    body: SimulationNodeMailReceivedPayload
  ): void => {
    this.ns.emit(socketEvents.simulation.nodeMailReceived, body);
  };
}
