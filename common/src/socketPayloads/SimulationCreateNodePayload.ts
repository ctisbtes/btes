import { SocketEventPayload } from '../socketManifest/SocketManifest';

export interface SimulationCreateNodePayload extends SocketEventPayload {
  positionX: number;
  positionY: number;
}
