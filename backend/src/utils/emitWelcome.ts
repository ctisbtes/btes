import { socketEvents } from '../common/constants/socketEvents';
import { SimulationSocketApiManifest } from '../common/socketApiManifests/SimulationSocketApiManifest';
import { SimulationWelcomePayload } from '../common/socketPayloads/SimulationWelcomePayload';
import { TypedSocket } from './typedSocketsBackend/TypedSocketSocket';

/**
 * Emits a welcome event.
 * @param socket Event will be emitted to this socket.
 * @param namespace From which namespace are we welcoming?
 */
export const emitWelcome = (
  socket: TypedSocket<SimulationSocketApiManifest>,
  namespace: string
): void => {
  const body: SimulationWelcomePayload = {
    message: `Connected to socket endpoint on ${namespace} namespace with socket id: ${socket.raw.id}`,
  };

  socket.emit(socketEvents.simulation.serverToClient.welcome, body);
};
