import { TypedSocketEventNamesOf } from './TypedSocketEventNamesOf';
import { TypedSocketEventDirectionsOf } from './TypedSocketEventDirectionsOf';
import { TypedSocketApiManifest } from '../TypedSocketApiManifest';

export type TypedSocketEventPayloadOf<
  TManifest extends TypedSocketApiManifest,
  TDirection extends TypedSocketEventDirectionsOf<TManifest>,
  TEventName extends TypedSocketEventNamesOf<TManifest, TDirection>
> = TManifest[TDirection][TEventName];
