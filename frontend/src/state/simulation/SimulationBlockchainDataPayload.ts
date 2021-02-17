import { BlockchainData } from './BlockchainData';

export interface SimulationBlockchainDataPayload {
  readonly simulationUid: string;
  readonly blockchainData: BlockchainData;
}
