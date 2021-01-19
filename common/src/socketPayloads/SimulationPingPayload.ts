import { SocketEventPayload } from '../typedSocketsCore/SocketEventPayload';

export interface SimulationPingPayload extends SocketEventPayload {
  date: number;
}
