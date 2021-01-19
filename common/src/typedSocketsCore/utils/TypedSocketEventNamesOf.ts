import { TypedSocketApiManifest } from '../TypedSocketApiManifest';

export type TypedSocketEventNamesOf<
  TManifest extends TypedSocketApiManifest,
  TDirection extends keyof TManifest
> = Extract<keyof TManifest[TDirection], string>;
