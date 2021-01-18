import { TypedSocketEventPayload } from '../typedSocketsCore/TypedSocketEventPayload';

export interface SimulationNodePositionUpdatedPayload
  extends TypedSocketEventPayload {
  nodeUid: string;
  positionX: number;
  positionY: number;
}
