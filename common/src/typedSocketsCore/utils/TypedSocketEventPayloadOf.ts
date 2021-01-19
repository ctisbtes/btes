import { TypedSocketApiManifest } from '../../common/typedSockets/manifest';
import { TypedSocketEventNamesOf } from './TypedSocketEventNamesOf';
import { TypedSocketEventDirectionsOf } from './TypedSocketEventDirectionsOf';

export type TypedSocketEventPayloadOf<
  TManifest extends TypedSocketApiManifest,
  TDirection extends TypedSocketEventDirectionsOf<TManifest>,
  TEventName extends TypedSocketEventNamesOf<TManifest, TDirection>
> = TManifest[TDirection][TEventName];
