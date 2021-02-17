import { SimulationNodeSnapshot } from './SimulationNodeSnapshot';
import { BlockchainData } from 'frontend/src/state/simulation/BlockchainData';

export interface SimulationSnapshot {
  readonly simulationUid: string;
  readonly nodeMap: { [nodeUid: string]: SimulationNodeSnapshot };
  readonly blockchainData: BlockchainData;
}
