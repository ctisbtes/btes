import { TypedSocketEventPayload } from '../typedSocketsCore/TypedSocketEventPayload';

export interface SimulationPingPayload extends TypedSocketEventPayload {
  date: number;
}
