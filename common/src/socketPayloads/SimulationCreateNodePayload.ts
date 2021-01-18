import { TypedSocketEventPayload } from '../typedSockets/TypedSocketEventPayload';

export interface SimulationCreateNodePayload extends TypedSocketEventPayload {
  positionX: number;
  positionY: number;
}
