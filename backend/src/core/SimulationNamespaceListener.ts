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
import { SimulationNodeBroadcastMessagePayload } from '../common/socketPayloads/SimulationNodeBroadcastMessagePayload';
import { SimulationNodeBroadcastMessageCommand } from './commands/SimulationNodeBroadcastMessageCommand';
import { SimulationNodeMessageReceivedPayload } from '../common/socketPayloads/SimulationNodeMessageReceivedPayload';
import { SimulationNodeMessageSentPayload } from '../common/socketPayloads/SimulationNodeMessageSentPayload';
import { SimulationNodeUnicastMessagePayload } from '../common/socketPayloads/SimulationNodeUnicastMessagePayload';
import { SimulationNodeUnicastMessageCommand } from './commands/SimulationNodeUnicastMessageCommand';
import { SimulationConnectNodesPayload } from '../common/socketPayloads/SimulationConnectNodesPayload';
import { SimulationDisconnectNodesPayload } from '../common/socketPayloads/SimulationDisconnectNodesPayload';
import { SimulationNodesConnectedPayload } from '../common/socketPayloads/SimulationNodesConnectedPayload';
import { SimulationNodesDisconnectedPayload } from '../common/socketPayloads/SimulationNodesDisconnectedPayload';
import { SimulationConnectNodesCommand } from './commands/SimulationConnectNodesCommand';
import { SimulationDisconnectNodesCommand } from './commands/SimulationDisconnectNodesCommand';

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
      socketEvents.simulation.nodeBroadcastMessage,
      this.handleSimulationNodeBroadcastMessage
    );
    socket.on(
      socketEvents.simulation.nodeUnicastMessage,
      this.handleSimulationNodeUnicastMessage
    );
    socket.on(
      socketEvents.simulation.connectNodes,
      this.handleSimulationConnectNodes
    );
    socket.on(
      socketEvents.simulation.disconnectNodes,
      this.handleSimulationDisconnectNodes
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

  private readonly handleSimulationNodeBroadcastMessage = (
    body: SimulationNodeBroadcastMessagePayload
  ) => {
    const createCommand = new SimulationNodeBroadcastMessageCommand(
      this.simulation,
      this,
      body
    );

    this.actionHistoryKeeper.register(createCommand);
    createCommand.execute();
  };

  private readonly handleSimulationNodeUnicastMessage = (
    body: SimulationNodeUnicastMessagePayload
  ) => {
    const createCommand = new SimulationNodeUnicastMessageCommand(
      this.simulation,
      this,
      body
    );

    this.actionHistoryKeeper.register(createCommand);
    createCommand.execute();
  };

  public readonly sendSimulationNodeMessageReceived = (
    body: SimulationNodeMessageReceivedPayload
  ): void => {
    this.ns.emit(socketEvents.simulation.nodeMessageReceived, body);
  };

  public readonly sendSimulationNodeMessageSent = (
    body: SimulationNodeMessageSentPayload
  ): void => {
    this.ns.emit(socketEvents.simulation.nodeMessageSent, body);
  };

  private readonly handleSimulationConnectNodes = (
    body: SimulationConnectNodesPayload
  ) => {
    const createCommand = new SimulationConnectNodesCommand(
      this.simulation,
      this,
      body
    );

    this.actionHistoryKeeper.register(createCommand);
    createCommand.execute();
  };

  private readonly handleSimulationDisconnectNodes = (
    body: SimulationDisconnectNodesPayload
  ) => {
    const createCommand = new SimulationDisconnectNodesCommand(
      this.simulation,
      this,
      body
    );

    this.actionHistoryKeeper.register(createCommand);
    createCommand.execute();
  };

  public readonly sendSimulationNodesConnected = (
    body: SimulationNodesConnectedPayload
  ): void => {
    this.ns.emit(socketEvents.simulation.nodesConnected, body);
  };

  public readonly sendSimulationNodesDisconnected = (
    body: SimulationNodesDisconnectedPayload
  ): void => {
    this.ns.emit(socketEvents.simulation.nodesDisconnected, body);
  };
}
