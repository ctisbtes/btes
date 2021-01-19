import { simulationBridge } from './simulationBridge';
import { SimulationPingPayload } from '../common/socketPayloads/SimulationPingPayload';
import { SimulationCreateNodePayload } from '../common/socketPayloads/SimulationCreateNodePayload';
import { socketEvents } from '../common/constants/socketEvents';
import { getClientCount } from '../utils/getClientCount';
import { emitWelcome } from '../utils/emitWelcome';
import { SimulationDeleteNodePayload } from '../common/socketPayloads/SimulationDeleteNodePayload';
import { SimulationRequestSnapshotPayload } from '../common/socketPayloads/SimulationRequestStatePayload';
import { SimulationUpdateNodePositionPayload } from '../common/socketPayloads/SimulationUpdateNodePositionPayload';
import { SimulationSocketApiManifest } from '../common/socketApiManifests/SimulationSocketApiManifest';
import { TypedSocketNamespace } from '../utils/typedSocketsBackend/TypedSocketNamespace';
import { TypedSocket } from '../utils/typedSocketsBackend/TypedSocketSocket';

export class SimulationNamespaceListener {
  private readonly simulationUid: string;
  private readonly ns: TypedSocketNamespace<SimulationSocketApiManifest>;

  constructor(
    simulationUid: string,
    ns: TypedSocketNamespace<SimulationSocketApiManifest>
  ) {
    this.simulationUid = simulationUid;
    this.ns = ns;

    ns.raw.on(socketEvents.native.connect, (socket) => {
      const typedSocket = new TypedSocket<SimulationSocketApiManifest>(socket);

      this.setupSocket(typedSocket);
    });
  }

  private readonly setupSocket = (
    socket: TypedSocket<SimulationSocketApiManifest>
  ) => {
    this.registerListeners(socket);
    emitWelcome(socket, this.simulationUid);
  };

  private readonly registerListeners = (
    socket: TypedSocket<SimulationSocketApiManifest>
  ): void => {
    // native events
    socket.raw.on(
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

  private readonly teardownSocket = (
    socket: TypedSocket<SimulationSocketApiManifest>
  ): void => {
    /* This would NOT work:
     *    socket.removeListener(socketEvents.simulation.ping, this.handleSimulationPing);
     * because the socketLoggerMiddleware is wrapping the listeners.
     * This would work:
     *    socket.removeAllListeners(socketEvents.simulation.ping);
     * Tarık, 2020-12-22 07:02
     */
    socket.raw.removeAllListeners();

    const clientsLeft = getClientCount(this.ns.raw);
    console.log(
      `${clientsLeft} clients remaining in namespace ${this.simulationUid}`
    );

    // TODO: teardown the namsepace itself when 0 clients left.
  };

  private readonly handleSimulationPing = (
    body: SimulationPingPayload
  ): void => {
    simulationBridge.handleSimulationPing(this.simulationUid, body);
  };

  private readonly handleSimulationCreateNode = (
    body: SimulationCreateNodePayload
  ) => {
    simulationBridge.handleSimulationCreateNode(this.simulationUid, body);
  };

  private readonly handleSimulationDeleteNode = (
    body: SimulationDeleteNodePayload
  ) => {
    simulationBridge.handleSimulationDeleteNode(this.simulationUid, body);
  };

  private readonly handleSimulationRequestSnapshot = (
    body: SimulationRequestSnapshotPayload
  ) => {
    simulationBridge.handleSimulationRequestSnapshot(this.simulationUid, body);
  };

  private readonly handleSimulationUpdateNodePosition = (
    body: SimulationUpdateNodePositionPayload
  ) => {
    simulationBridge.handleSimulationUpdateNodePosition(
      this.simulationUid,
      body
    );
  };
}
