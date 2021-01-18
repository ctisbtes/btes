import { TypedSocketEventPayload } from '../typedSocketsCore/TypedSocketEventPayload';

export interface SimulationNodeDeletedPayload extends TypedSocketEventPayload {
  nodeUid: string;
}
