import { TypedSocketEventPayload } from '../typedSocketsCore/TypedSocketEventPayload';

export interface SimulationNodeCreatedPayload extends TypedSocketEventPayload {
  nodeUid: string;
  positionX: number;
  positionY: number;
}
