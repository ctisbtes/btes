import _ from 'lodash';
import io from 'socket.io';
import { EventCategory } from '../../common/constants/socketEvents';
import { SocketApiManifest } from '../../common/typedSocketsCore/SocketApiManifest';
import { SocketEventHandler } from '../../common/typedSocketsCore/SocketEventHandler';
import { StringKeyOf } from '../../common/utils/StringKeyOf';

export class TypedSocket<TManifest extends SocketApiManifest<EventCategory>> {
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
    handler: SocketEventHandler<TManifest['clientToServer'][TEventName]>
  ): void => {
    this.raw.on(eventName, handler);
  };

  public readonly off = <
    TEventName extends StringKeyOf<TManifest['clientToServer']>
  >(
    eventName: TEventName,
    handler: SocketEventHandler<TManifest['clientToServer'][TEventName]>
  ): void => {
    this.raw.off(eventName, handler);
  };
}
