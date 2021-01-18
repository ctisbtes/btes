import { TypedSocketEventPayload } from '../typedSocketsCore/TypedSocketEventPayload';

export interface SimulationWelcomePayload extends TypedSocketEventPayload {
  message: string;
}
