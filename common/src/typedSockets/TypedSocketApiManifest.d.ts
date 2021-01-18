import { TypedSocketEventPayload } from './TypedSocketEventPayload';

export interface TypedSocketApiManifest {
  clientToServer: {
    [eventName: string]: TypedSocketEventPayload;
  };
  serverToClient: {
    [eventName: string]: TypedSocketEventPayload;
  };
}
