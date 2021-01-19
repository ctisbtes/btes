import { SocketEventPayload } from '../typedSocketsCore/SocketEventPayload';

export interface SimulationNodePositionUpdatedPayload
  extends SocketEventPayload {
  nodeUid: string;
  positionX: number;
  positionY: number;
}
