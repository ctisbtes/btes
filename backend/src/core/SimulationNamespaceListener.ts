import { socketEvents } from '../common/constants/socketEvents';
import { getClientCount } from '../utils/getClientCount';
import { emitWelcome } from '../utils/emitWelcome';
import { SimulationSocketApiManifest } from '../common/socketApiManifests/SimulationSocketApiManifest';
import { TypedSocketNamespace } from '../utils/typedSocketsBackend/TypedSocketNamespace';
import { TypedSocket } from '../utils/typedSocketsBackend/TypedSocketSocket';
import { SocketEventListenerClass } from '../common/typedSocketsCore/SocketEventListenerClass';

export class SimulationNamespaceListener {
  private readonly simulationUid: string;
  private readonly ns: TypedSocketNamespace<SimulationSocketApiManifest>;
  private readonly eventListenerClass: SocketEventListenerClass<
    SimulationSocketApiManifest,
    'clientToServer'
  >;

  constructor(
    simulationUid: string,
    ns: TypedSocketNamespace<SimulationSocketApiManifest>,
    eventListenerClass: SocketEventListenerClass<
      SimulationSocketApiManifest,
      'clientToServer'
    >
  ) {
    this.simulationUid = simulationUid;
    this.ns = ns;
    this.eventListenerClass = eventListenerClass;

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
    socket.on(
      socketEvents.simulation.ping,
      this.eventListenerClass.handleSimulationPing
    );

    socket.on(
      socketEvents.simulation.createNode,
      this.eventListenerClass.handleSimulationCreateNode
    );

    socket.on(
      socketEvents.simulation.deleteNode,
      this.eventListenerClass.handleSimulationDeleteNode
    );

    socket.on(
      socketEvents.simulation.requestSnapshot,
      this.eventListenerClass.handleSimulationRequestSnapshot
    );

    socket.on(
      socketEvents.simulation.updateNodePosition,
      this.eventListenerClass.handleSimulationUpdateNodePosition
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
}
