import { CamelCase } from '../utils/CamelCase';
import { TypedSocketApiManifest } from './TypedSocketApiManifest';
import { TypedSocketEventDirectionsOf } from './utils/TypedSocketEventDirectionsOf';

export type TypedSocketEventListenerClass<
  TManifest extends TypedSocketApiManifest,
  TDirection extends TypedSocketEventDirectionsOf<TManifest>
> = {
  [TEventName in keyof TManifest[TDirection] &
    string as CamelCase<`handle-${TEventName}`>]: (
    payload: TManifest[TDirection][TEventName]
  ) => void;
};
