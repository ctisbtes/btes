import io from 'socket.io';

import { TypedSocketApiManifest } from '../../common/typedSocketsCore/TypedSocketApiManifest';
import { StringKeyOf } from '../../common/utils/StringKeyOf';

export class TypedSocketNamespace<TManifest extends TypedSocketApiManifest> {
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
