import { SocketEventPayload } from '../typedSocketsCore/SocketEventPayload';

export interface SimulationNodeCreatedPayload extends SocketEventPayload {
  nodeUid: string;
  positionX: number;
  positionY: number;
}
