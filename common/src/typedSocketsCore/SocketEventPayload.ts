/*
 * Reason for rule exception: `unknown` doesn't behave, so we have to use `any` here.
 * See: https://github.com/Microsoft/TypeScript/issues/15300#issuecomment-702872440
 * - Tarık, 2021-01-20 05:45
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SocketEventPayload = Readonly<Record<string, any>>;
