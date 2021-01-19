import { SocketEventPayload } from '../typedSocketsCore/SocketEventPayload';

export interface SimulationCreateNodePayload extends SocketEventPayload {
  positionX: number;
  positionY: number;
}
