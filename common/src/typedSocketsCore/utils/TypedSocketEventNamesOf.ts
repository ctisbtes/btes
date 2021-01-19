import { TypedSocketApiManifest } from '../../common/typedSockets/manifest';
import { TypedSocketEventDirectionsOf } from './TypedSocketEventDirectionsOf';

export type TypedSocketEventNamesOf<
  TManifest extends TypedSocketApiManifest,
  TDirection extends TypedSocketEventDirectionsOf<TManifest>
> = Extract<keyof TManifest[TDirection], string>;
