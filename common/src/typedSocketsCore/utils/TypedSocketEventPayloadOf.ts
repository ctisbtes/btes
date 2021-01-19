import { TypedSocketEventNamesOf } from './TypedSocketEventNamesOf';
import { TypedSocketApiManifest } from '../TypedSocketApiManifest';

export type TypedSocketEventPayloadOf<
  TManifest extends TypedSocketApiManifest,
  TDirection extends keyof TManifest,
  TEventName extends TypedSocketEventNamesOf<TManifest, TDirection>
> = TManifest[TDirection][TEventName];
