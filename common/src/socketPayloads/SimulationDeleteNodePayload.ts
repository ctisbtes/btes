import { SocketEventPayload } from '../typedSocketsCore/SocketEventPayload';

export interface SimulationDeleteNodePayload extends SocketEventPayload {
  nodeUid: string;
}
