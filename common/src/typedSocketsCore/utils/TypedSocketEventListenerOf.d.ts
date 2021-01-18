import { TypedSocketApiManifest } from '../TypedSocketApiManifest';
import { TypedSocketEventNamesOf } from './TypedSocketEventNamesOf';
import { TypedSocketEventDirectionsOf } from './TypedSocketEventDirectionsOf';
import { TypedSocketEventListener } from '../TypedSocketEventListener';

export type TypedSocketEventListenerOf<
  TManifest extends TypedSocketApiManifest,
  TDirection extends TypedSocketEventDirectionsOf<TManifest>,
  TEventName extends TypedSocketEventNamesOf<TManifest, TDirection>
> = TypedSocketEventListener<TManifest[TDirection][TEventName]>;
