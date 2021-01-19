import _ from 'lodash';
import io from 'socket.io';
import { TypedSocketApiManifest } from '../../common/typedSocketsCore/TypedSocketApiManifest';
import { TypedSocketEventListener } from '../../common/typedSocketsCore/TypedSocketEventListener';
import { TypedSocketEventNamesOf } from '../../common/typedSocketsCore/utils/TypedSocketEventNamesOf';

export class TypedSocketSocket<TManifest extends TypedSocketApiManifest> {
  public readonly raw: io.Socket;

  constructor(actual: io.Socket) {
    this.raw = actual;
  }

  public readonly emit = <
    TEventName extends TypedSocketEventNamesOf<TManifest, 'serverToClient'>
  >(
    eventName: TEventName,
    payload: TManifest['serverToClient'][TEventName]
  ): void => {
    this.raw.emit(eventName, payload);
  };

  public readonly on = <
    TEventName extends TypedSocketEventNamesOf<TManifest, 'clientToServer'>
  >(
    eventName: TEventName,
    listener: TypedSocketEventListener<TManifest['clientToServer'][TEventName]>
  ): void => {
    this.raw.on(eventName, listener);
  };

  public readonly off = <
    TEventName extends TypedSocketEventNamesOf<TManifest, 'clientToServer'>
  >(
    eventName: TEventName,
    listener: TypedSocketEventListener<TManifest['clientToServer'][TEventName]>
  ): void => {
    this.raw.off(eventName, listener);
  };
}
