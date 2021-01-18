import { SocketEventPayload } from '../socketManifest/SocketManifest';

export interface SimulationDeleteNodePayload extends SocketEventPayload {
  nodeUid: string;
}
