export interface SimulationBlockchainDataSnapshot {
  readonly hash: string;
  readonly children: SimulationBlockchainDataSnapshot[];
}
