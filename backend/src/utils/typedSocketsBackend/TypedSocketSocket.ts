import _ from 'lodash';
import io from 'socket.io';
import { TypedSocketApiManifest } from '../../common/typedSocketsCore/TypedSocketApiManifest';
import { TypedSocketEventListener } from '../../common/typedSocketsCore/TypedSocketEventListener';
import { StringKeyOf } from '../../common/utils/StringKeyOf';

export class TypedSocketSocket<TManifest extends TypedSocketApiManifest> {
  public readonly raw: io.Socket;

  constructor(actual: io.Socket) {
    this.raw = actual;
  }

  public readonly emit = <
    TEventName extends StringKeyOf<TManifest['serverToClient']>
  >(
    eventName: TEventName,
    payload: TManifest['serverToClient'][TEventName]
  ): void => {
    this.raw.emit(eventName, payload);
  };

  public readonly on = <
    TEventName extends StringKeyOf<TManifest['clientToServer']>
  >(
    eventName: TEventName,
    listener: TypedSocketEventListener<TManifest['clientToServer'][TEventName]>
  ): void => {
    this.raw.on(eventName, listener);
  };

  public readonly off = <
    TEventName extends StringKeyOf<TManifest['clientToServer']>
  >(
    eventName: TEventName,
    listener: TypedSocketEventListener<TManifest['clientToServer'][TEventName]>
  ): void => {
    this.raw.off(eventName, listener);
  };
}
