import { BlockchainBlock } from '../../../../common/blockchain/block/BlockchainBlock';
import { TreeJsonObject } from '../../../../common/tree/TreeJsonObject';

export interface BlockchainBlockDbData {
  readonly blockchain: TreeJsonObject<BlockchainBlock>;
  readonly orphanage: BlockchainBlock[];
}