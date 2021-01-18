import io from 'socket.io';

import { TypedSocketApiManifest } from '../../common/typedSocketsCore/TypedSocketApiManifest';
import { TypedSocketEventNamesOf } from '../../common/typedSocketsCore/utils/TypedSocketEventNamesOf';
import { TypedSocketEventPayloadOf } from '../../common/typedSocketsCore/utils/TypedSocketEventPayloadOf';

export class TypedSocketNamespace<TManifest extends TypedSocketApiManifest> {
  public readonly raw: io.Namespace;

  constructor(actual: io.Namespace) {
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
}
