import { SocketEventPayload } from '../typedSocketsCore/SocketEventPayload';

export interface SimulationNodeDeletedPayload extends SocketEventPayload {
  nodeUid: string;
}
