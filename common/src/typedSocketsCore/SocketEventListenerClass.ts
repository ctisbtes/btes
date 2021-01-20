import { SocketApiManifest } from './SocketApiManifest';
import { CamelCase } from 'type-fest';
import { EventCategory } from '../constants/socketEvents';

export type SocketEventListenerClass<
  TManifest extends SocketApiManifest<EventCategory>,
  TDirection extends keyof TManifest
> = {
  [TEventName in keyof TManifest[TDirection] &
    string as CamelCase<`handle-${TEventName}`>]: (
    payload: TManifest[TDirection][TEventName]
  ) => void;
};
