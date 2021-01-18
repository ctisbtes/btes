import { TypedSocketApiManifest } from '../../common/typedSockets/manifest';
import { ServerToClientNames } from './ServerToClientNames';

export type ServerToClientPayload<
  TManifest extends TypedSocketApiManifest,
  TEventName extends ServerToClientNames<TManifest>
> = TManifest['serverToClient'][TEventName];
