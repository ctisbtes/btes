import io from 'socket.io';
import { TypedSocketApiManifest } from '../../common/typedSockets/TypedSocketApiManifest';
import { ServerToClientListener } from './ServerToClientListener';
import { ServerToClientNames } from './ServerToClientNames';
import { ServerToClientPayload } from './ServerToClientPayload';

export class TypedSocketNamespace<TManifest extends TypedSocketApiManifest> {
  public readonly raw: io.Namespace;

  constructor(actual: io.Namespace) {
    this.raw = actual;
  }

  public readonly emit = <TEventName extends ServerToClientNames<TManifest>>(
    eventName: TEventName,
    payload: ServerToClientPayload<TManifest, TEventName>
  ): void => {
    this.raw.emit(eventName, payload);
  };

  public readonly on = <TEventName extends ServerToClientNames<TManifest>>(
    eventName: TEventName,
    listener: ServerToClientListener<TManifest, TEventName>
  ): void => {
    this.raw.on(eventName, listener);
  };

  public readonly off = <TEventName extends ServerToClientNames<TManifest>>(
    eventName: TEventName,
    listener: ServerToClientListener<TManifest, TEventName>
  ): void => {
    this.raw.off(eventName, listener);
  };
}
