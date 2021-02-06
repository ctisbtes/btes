export const socketEvents = {
  native: {
    connect: 'connect',
    disconnect: 'disconnect',
  },
  simulation: {
    welcome: 'simulation-welcome',
    ping: 'simulation-ping',
    pong: 'simulation-pong',
    createNode: 'simulation-create-node',
    nodeCreated: 'simulation-node-created',
    deleteNode: 'simulation-delete-node',
    nodeDeleted: 'simulation-node-deleted',
    requestSnapshot: 'simulation-request-snapshot',
    snapshotReport: 'simulation-snapshot-report',
    updateNodePosition: 'simulation-update-node-position',
    nodePositionUpdated: 'simulation-node-position-updated',
    undo: 'simulation-undo',
    redo: 'simulation-redo',
  },
} as const;
