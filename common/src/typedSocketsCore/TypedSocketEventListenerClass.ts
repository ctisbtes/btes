import { CamelCase } from '../utils/CamelCase';
import { TypedSocketApiManifest } from './TypedSocketApiManifest';

export type TypedSocketEventListenerClass<
  TManifest extends TypedSocketApiManifest,
  TDirection extends keyof TManifest
> = {
  [TEventName in keyof TManifest[TDirection] &
    string as CamelCase<`handle-${TEventName}`>]: (
    payload: TManifest[TDirection][TEventName]
  ) => void;
};
