import { NodeData } from './NodeData';
import { SimulationLog } from './SimulationLog';
import { BlockchainData } from './BlockchainData';

export interface SimulationData {
  // synced state
  readonly simulationUid: string;
  readonly nodeMap: {
    [nodeUid: string]: NodeData;
  };
  readonly blockchainData: BlockchainData;

  // local-only state
  readonly pongs: Array<{ pingDate: number; pongDate: number }>;
  readonly logs: SimulationLog[];
}
