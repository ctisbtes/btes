import io from 'socket.io';
import http from 'http';
import { socketEvents } from './common/constants/socketEvents';
import { emitWelcome } from './utils/emitWelcome';
import { socketLoggerMiddleware } from './socketMiddleware/socketLoggerMiddleware';
import { TypedSocketNamespace } from './utils/typedSocketsBackend/TypedSocketNamespace';
import { SimulationSocketApiManifest } from './common/socketApiManifests/SimulationSocketApiManifest';

class SocketManager {
  private httpServer: http.Server = http.createServer();
  private socketServer: io.Server = new io.Server(this.httpServer);

  constructor() {
    this.socketServer.use(socketLoggerMiddleware);

    this.socketServer.on(socketEvents.native.connect, (socket) => {
      emitWelcome(socket, 'root');
    });
  }

  public readonly start = (
    port: string | number,
    listeningListener?: () => void
  ) => {
    this.httpServer.listen(port, listeningListener);
  };

  public readonly getOrCreateNamespace = (
    namespace: string
  ): TypedSocketNamespace<SimulationSocketApiManifest> => {
    const ns = this.socketServer.of(namespace);
    ns.use(socketLoggerMiddleware);
    return new TypedSocketNamespace<SimulationSocketApiManifest>(ns);
  };
}

export const socketManager = new SocketManager();
