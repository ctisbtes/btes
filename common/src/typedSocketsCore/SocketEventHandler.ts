import { SocketEventPayload } from './SocketEventPayload';

export type SocketEventHandler<TPayload extends SocketEventPayload> = (
  payload: TPayload
) => void;
