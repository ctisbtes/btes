import { SocketEventPayload } from './SocketEventPayload';

export interface SocketApiManifest {
  clientToServer: {
    [eventName: string]: SocketEventPayload;
  };
  serverToClient: {
    [eventName: string]: SocketEventPayload;
  };
}
