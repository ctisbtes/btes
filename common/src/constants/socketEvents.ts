import { ValueOf } from 'type-fest';

const nativeEventDef = {
  connect: 'connect',
  disconnect: 'disconnect',
} as const;

const nativeEvents = {
  clientToServer: nativeEventDef,
  serverToClient: nativeEventDef,
} as const;

const simulationEvents = {
  clientToServer: {
    ping: 'simulation-ping',
    createNode: 'simulation-create-node',
    deleteNode: 'simulation-delete-node',
    requestSnapshot: 'simulation-request-snapshot',
    updateNodePosition: 'simulation-update-node-position',
  },
  serverToClient: {
    welcome: 'simulation-welcome',
    pong: 'simulation-pong',
    nodeCreated: 'simulation-node-created',
    nodeDeleted: 'simulation-node-deleted',
    snapshotReport: 'simulation-snapshot-report',
    nodePositionUpdated: 'simulation-node-position-updated',
  },
} as const;

export const socketEvents = {
  native: nativeEvents,
  simulation: simulationEvents,
} as const;

//
// ---------- Types ----------
//

export type SocketEventsType = typeof socketEvents;

export type EventCategory = keyof SocketEventsType;

export type EventDirection = keyof SocketEventsType[EventCategory];

export type EventKey<
  TCategory extends EventCategory,
  TDirection extends EventDirection
> = keyof SocketEventsType[TCategory][TDirection];

export type EventName<
  TCategory extends EventCategory,
  TDirection extends EventDirection
> = ValueOf<SocketEventsType[TCategory][TDirection]> & string;

// export type EventNameFromKey<
//   TCategory extends EventCategory,
//   TDirection extends EventDirection,
//   TEventKey extends EventKey<TCategory, TDirection>
// > = SocketEventsType[TCategory][TDirection][TEventKey];

// //
// // ---------- Enumerations ----------
// //

// export const getEventNames = <
//   TCategory extends EventCategory,
//   TDirection extends EventDirection
// >(
//   category: TCategory,
//   direction: TDirection
// ): string[] => Object.values(socketEvents[category][direction]);

// export const getEventKeys = <
//   TCategory extends EventCategory,
//   TDirection extends EventDirection
// >(
//   category: TCategory,
//   direction: TDirection
// ): string[] => {
//   return Object.keys(socketEvents[category][direction]);
// };
