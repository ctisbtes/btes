import { SimulationSnapshot } from '../SimulationSnapshot';
import { SocketEventPayload } from '../typedSocketsCore/SocketEventPayload';

export interface SimulationSnapshotReportPayload extends SocketEventPayload {
  snapshot: SimulationSnapshot;
}
