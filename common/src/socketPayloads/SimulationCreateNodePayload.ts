import { TypedSocketEventPayload } from '../typedSocketsCore/TypedSocketEventPayload';

export interface SimulationCreateNodePayload extends TypedSocketEventPayload {
  positionX: number;
  positionY: number;
}
