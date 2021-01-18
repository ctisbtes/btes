import { TypedSocketEventPayload } from '../typedSocketsCore/TypedSocketEventPayload';

export interface SimulationPongPayload extends TypedSocketEventPayload {
  pingDate: number;
  pongDate: number;
}
