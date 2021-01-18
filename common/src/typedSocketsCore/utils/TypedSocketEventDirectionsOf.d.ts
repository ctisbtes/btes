import { TypedSocketApiManifest } from '../TypedSocketApiManifest';

export type TypedSocketEventDirectionsOf<
  TManifest extends TypedSocketApiManifest
> = keyof TManifest;
