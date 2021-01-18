import _ from 'lodash';
import io from 'socket.io';
import { TypedSocketApiManifest } from '../../common/typedSocketsCore/TypedSocketApiManifest';
import { TypedSocketEventListenerOf } from '../../common/typedSocketsCore/utils/TypedSocketEventListenerOf';
import { TypedSocketEventNamesOf } from '../../common/typedSocketsCore/utils/TypedSocketEventNamesOf';
import { TypedSocketEventPayloadOf } from '../../common/typedSocketsCore/utils/TypedSocketEventPayloadOf';

export class TypedSocketSocket<TManifest extends TypedSocketApiManifest> {
  public readonly raw: io.Socket;

  constructor(actual: io.Socket) {
    this.raw = actual;
  }

  public readonly emit = <
    TEventName extends TypedSocketEventNamesOf<TManifest, 'serverToClient'>
  >(
    eventName: TEventName,
    payload: TypedSocketEventPayloadOf<TManifest, 'serverToClient', TEventName>
  ): void => {
    this.raw.emit(eventName, payload);
  };

  public readonly on = <
    TEventName extends TypedSocketEventNamesOf<TManifest, 'clientToServer'>
  >(
    eventName: TEventName,
    listener: TypedSocketEventListenerOf<
      TManifest,
      'clientToServer',
      TEventName
    >
  ): void => {
    this.raw.on(eventName, listener);
  };

  public readonly off = <
    TEventName extends TypedSocketEventNamesOf<TManifest, 'clientToServer'>
  >(
    eventName: TEventName,
    listener: TypedSocketEventListenerOf<
      TManifest,
      'clientToServer',
      TEventName
    >
  ): void => {
    this.raw.off(eventName, listener);
  };
}
