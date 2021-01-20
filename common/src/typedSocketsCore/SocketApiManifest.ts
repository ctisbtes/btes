import { SocketEventPayload } from './SocketEventPayload';
import {
  EventCategory,
  EventDirection,
  EventName,
  // EventKey,
} from '../../common/constants/socketEvents';

export type SocketApiManifest<TCategory extends EventCategory> = {
  [TDirection in EventDirection]: {
    [TEventName in EventName<TCategory, TDirection>]: SocketEventPayload;
    // [TEventName in EventKey<TCategory, TDirection>]: SocketEventPayload;
  };
};
