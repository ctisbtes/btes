import {
  TypedSocketApiManifest,
  TypedSocketEventListener,
} from '../../common/typedSockets/manifest';
import { ServerToClientNames } from './ServerToClientNames';
import { ServerToClientPayload } from './ServerToClientPayload';

export type ServerToClientListener<
  TManifest extends TypedSocketApiManifest,
  TEventName extends ServerToClientNames<TManifest>
> = TypedSocketEventListener<ServerToClientPayload<TManifest, TEventName>>;
