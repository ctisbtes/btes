import { TypedSocketEventPayload } from '../typedSocketsCore/TypedSocketEventPayload';

export interface SimulationDeleteNodePayload extends TypedSocketEventPayload {
  nodeUid: string;
}
