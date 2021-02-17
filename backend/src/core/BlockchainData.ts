export class BlockchainData {
  public readonly hash: string;
  public readonly children: BlockchainData[];

  constructor(hash: string, children: BlockchainData[]) {
    this.hash = hash;
    this.children = children;
  }
}
