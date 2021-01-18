import { TypedSocketEventPayload } from '../typedSocketsCore/TypedSocketEventPayload';

export interface SimulationUpdateNodePositionPayload
  extends TypedSocketEventPayload {
  nodeUid: string;
  positionX: number;
  positionY: number;
}
