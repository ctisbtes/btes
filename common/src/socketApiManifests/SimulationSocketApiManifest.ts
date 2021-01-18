import { socketEvents } from '../constants/socketEvents';
import { SimulationCreateNodePayload } from '../socketPayloads/SimulationCreateNodePayload';
import { SimulationDeleteNodePayload } from '../socketPayloads/SimulationDeleteNodePayload';
import { SimulationNodeCreatedPayload } from '../socketPayloads/SimulationNodeCreatedPayload';
import { SimulationNodeDeletedPayload } from '../socketPayloads/SimulationNodeDeletedPayload';
import { SimulationNodePositionUpdatedPayload } from '../socketPayloads/SimulationNodePositionUpdatedPayload';
import { SimulationPingPayload } from '../socketPayloads/SimulationPingPayload';
import { SimulationPongPayload } from '../socketPayloads/SimulationPongPayload';
import { SimulationRequestSnapshotPayload } from '../socketPayloads/SimulationRequestStatePayload';
import { SimulationSnapshotReportPayload } from '../socketPayloads/SimulationSnapshotReportPayload';
import { SimulationUpdateNodePositionPayload } from '../socketPayloads/SimulationUpdateNodePositionPayload';
import { SimulationWelcomePayload } from '../socketPayloads/SimulationWelcomePayload';
import { TypedSocketApiManifest } from '../typedSocketsCore/TypedSocketApiManifest';

export interface SimulationSocketApiManifest extends TypedSocketApiManifest {
  serverToClient: {
    [socketEvents.simulation.welcome]: SimulationWelcomePayload;
    [socketEvents.simulation.pong]: SimulationPongPayload;
    [socketEvents.simulation.nodeCreated]: SimulationNodeCreatedPayload;
    [socketEvents.simulation.nodeDeleted]: SimulationNodeDeletedPayload;
    [socketEvents.simulation.snapshotReport]: SimulationSnapshotReportPayload;

    [socketEvents.simulation
      .nodePositionUpdated]: SimulationNodePositionUpdatedPayload;
  };

  clientToServer: {
    [socketEvents.simulation.ping]: SimulationPingPayload;
    [socketEvents.simulation.createNode]: SimulationCreateNodePayload;
    [socketEvents.simulation.deleteNode]: SimulationDeleteNodePayload;
    [socketEvents.simulation.requestSnapshot]: SimulationRequestSnapshotPayload;

    [socketEvents.simulation
      .updateNodePosition]: SimulationUpdateNodePositionPayload;
  };
}
