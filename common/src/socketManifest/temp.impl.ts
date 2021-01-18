import { socketEvents } from '../constants/socketEvents';
import { SimulationCreateNodePayload } from '../socketPayloads/SimulationCreateNodePayload';
import { SocketApiManifest, SocketServer } from './SocketManifest';
import { SimulationDeleteNodePayload } from '../socketPayloads/SimulationDeleteNodePayload';

export interface BtesSocketApiManifest extends SocketApiManifest {
  clientToServer: {
    [socketEvents.simulation.createNode]: SimulationCreateNodePayload;
  };
  serverToClient: {
    [socketEvents.simulation.createNode]: SimulationCreateNodePayload;
    [socketEvents.simulation.deleteNode]: SimulationDeleteNodePayload;
  };
}

const server = new SocketServer<BtesSocketApiManifest>();

const listener = (payload: SimulationCreateNodePayload) => {
  return;
};

server.emit(socketEvents.simulation.createNode, {});
server.listen('simulation-create-node', listener);

server.emit('simulation-delete-node', {});
server.listen('simulation-delete-node', listener);
