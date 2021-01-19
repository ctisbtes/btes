import { SocketEventPayload } from '../typedSocketsCore/SocketEventPayload';

export interface SimulationPongPayload extends SocketEventPayload {
  pingDate: number;
  pongDate: number;
}
