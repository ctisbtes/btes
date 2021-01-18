import { TypedSocketEventPayload } from './TypedSocketEventPayload';

export type TypedSocketEventListener<
  TPayload extends TypedSocketEventPayload
> = (payload: TPayload) => void;
