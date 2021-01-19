import { TypedSocketApiManifest } from '../TypedSocketApiManifest';
import { TypedSocketEventDirectionsOf } from './TypedSocketEventDirectionsOf';

export type TypedSocketEventNamesOf<
  TManifest extends TypedSocketApiManifest,
  TDirection extends TypedSocketEventDirectionsOf<TManifest>
> = Extract<keyof TManifest[TDirection], string>;
