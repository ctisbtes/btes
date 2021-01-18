import { TypedSocketApiManifest } from '../../common/typedSockets/manifest';

export type ServerToClientNames<
  TManifest extends TypedSocketApiManifest
> = Extract<keyof TManifest['serverToClient'], string>;
