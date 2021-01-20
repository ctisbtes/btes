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
import { SocketApiManifest } from '../typedSocketsCore/SocketApiManifest';
import { SocketEventPayload } from '../../common/typedSocketsCore/SocketEventPayload';

export interface SimulationSocketApiManifest
  extends SocketApiManifest<'simulation'> {
  serverToClient: {
    [socketEvents.simulation.serverToClient.welcome]: SimulationWelcomePayload;
    [socketEvents.simulation.serverToClient.pong]: SimulationPongPayload;

    [socketEvents.simulation.serverToClient
      .nodeCreated]: SimulationNodeCreatedPayload;

    [socketEvents.simulation.serverToClient
      .nodeDeleted]: SimulationNodeDeletedPayload;

    [socketEvents.simulation.serverToClient
      .snapshotReport]: SimulationSnapshotReportPayload;

    [socketEvents.simulation.serverToClient
      .nodePositionUpdated]: SimulationNodePositionUpdatedPayload;
  };

  clientToServer: {
    [socketEvents.simulation.clientToServer.ping]: SimulationPingPayload;

    [socketEvents.simulation.clientToServer
      .createNode]: SimulationCreateNodePayload;

    [socketEvents.simulation.clientToServer
      .deleteNode]: SimulationDeleteNodePayload;

    [socketEvents.simulation.clientToServer
      .requestSnapshot]: SimulationRequestSnapshotPayload;

    [socketEvents.simulation.clientToServer
      .updateNodePosition]: SimulationUpdateNodePositionPayload;
  };

  foo: { bat: SocketEventPayload };
}
