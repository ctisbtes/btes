export interface SimulationNodeBroadcastMailPayload {
  senderNodeUid: string;
  mailBody: string;
  shouldPropagate: boolean;
}
