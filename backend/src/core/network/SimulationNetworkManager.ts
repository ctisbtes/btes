import { Simulation } from '../Simulation';
import { SimulationNamespaceListener } from '../SimulationNamespaceListener';

export class SimulationNetworkManager {
  private readonly simulation: Simulation;
  private readonly socketEmitter: SimulationNamespaceListener;

  constructor(
    simulation: Simulation,
    socketEmitter: SimulationNamespaceListener
  ) {
    this.simulation = simulation;
    this.socketEmitter = socketEmitter;
  }

  public readonly send = (config: NetworkMessageConfig) => {
    // TODO: implement
  };

  public readonly abort = (messageUid: string) => {
    // TODO: implement
  };
}

export interface NetworkMessage {}

export interface NetworkMessageConfig {
  senderNodeUid: string;
  targetNodeUid: string;
  callbacks?: {
    created?: (meta: NetworkMessageInfo) => void;
    sent?: (meta: NetworkMessageInfo) => void;
    aborted?: (meta: NetworkMessageInfo) => void;
    delivered?: (meta: NetworkMessageInfo) => void;
  };
}

export interface NetworkMessageInfo {
  messageUid: string;
  senderNodeUid: string;
  targetNodeUid: string;
}
