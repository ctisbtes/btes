import { SocketEventPayload } from '../typedSocketsCore/SocketEventPayload';

export interface SimulationWelcomePayload extends SocketEventPayload {
  message: string;
}
