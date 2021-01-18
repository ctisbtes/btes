import { TypedSocketEventPayload } from '../typedSockets/TypedSocketEventPayload';

export interface SimulationDeleteNodePayload extends TypedSocketEventPayload {
  nodeUid: string;
}
