import { SocketApiManifest } from './SocketApiManifest';
import { CamelCase } from 'type-fest';

export type SocketEventListenerClass<
  TManifest extends SocketApiManifest,
  TDirection extends keyof TManifest
> = {
  [TEventName in keyof TManifest[TDirection] &
    string as CamelCase<`handle-${TEventName}`>]: (
    payload: TManifest[TDirection][TEventName]
  ) => void;
};
