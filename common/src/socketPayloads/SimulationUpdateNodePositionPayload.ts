import { SocketEventPayload } from '../typedSocketsCore/SocketEventPayload';

export interface SimulationUpdateNodePositionPayload
  extends SocketEventPayload {
  nodeUid: string;
  positionX: number;
  positionY: number;
}
