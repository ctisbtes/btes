import { SimulationSnapshot } from '../SimulationSnapshot';
import { TypedSocketEventPayload } from '../typedSocketsCore/TypedSocketEventPayload';

export interface SimulationSnapshotReportPayload
  extends TypedSocketEventPayload {
  snapshot: SimulationSnapshot;
}
