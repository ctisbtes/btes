import io from 'socket.io';
import { EventCategory } from '../../common/constants/socketEvents';

import { SocketApiManifest } from '../../common/typedSocketsCore/SocketApiManifest';
import { StringKeyOf } from '../../common/utils/StringKeyOf';

export class TypedSocketNamespace<
  TManifest extends SocketApiManifest<EventCategory>
> {
  public readonly raw: io.Namespace;

  constructor(actual: io.Namespace) {
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
}
