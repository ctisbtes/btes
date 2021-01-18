import { socketEvents } from '../constants/socketEvents';
import { SimulationCreateNodePayload } from '../socketPayloads/SimulationCreateNodePayload';

export type SocketEventPayload = Record<string | number | symbol, unknown>;

export type SocketEventListener<TPayload> = (payload: TPayload) => void;

export interface SocketApiManifest {
  clientToServer: {
    [eventName: string]: SocketEventPayload;
  };
  serverToClient: {
    [eventName: string]: SocketEventPayload;
  };
}

export interface SocketInterface {
  emit: <TEventName, TPayload>(
    eventName: TEventName,
    payload: TPayload
  ) => void;

  listen: <TEventName, TPayload>(
    eventName: TEventName,
    callback: SocketEventListener<TPayload>
  ) => void;
}

export class SocketServer<TManifest extends SocketApiManifest> {
  //   private readonly socketInterface: SocketInterface;

  //   constructor(socketInterface: SocketInterface) {
  //     this.socketInterface = socketInterface;
  //   }

  public readonly emit = <TEventName extends keyof TManifest['serverToClient']>(
    eventName: TEventName,
    payload: TManifest['serverToClient'][TEventName]
  ): void => {
    // this.socketInterface.emit(eventName, payload);
    return;
  };

  public readonly listen = <
    TEventName extends keyof TManifest['serverToClient']
  >(
    eventName: TEventName,
    listener: SocketEventListener<TManifest['serverToClient'][TEventName]>
  ): void => {
    // this.socketInterface.listen(eventName, listener);
    return;
  };
}
