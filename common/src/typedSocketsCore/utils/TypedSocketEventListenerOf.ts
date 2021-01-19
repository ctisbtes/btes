import { TypedSocketApiManifest } from '../TypedSocketApiManifest';
import { TypedSocketEventNamesOf } from './TypedSocketEventNamesOf';
import { TypedSocketEventListener } from '../TypedSocketEventListener';

export type TypedSocketEventListenerOf<
  TManifest extends TypedSocketApiManifest,
  TDirection extends keyof TManifest,
  TEventName extends TypedSocketEventNamesOf<TManifest, TDirection>
> = TypedSocketEventListener<TManifest[TDirection][TEventName]>;
