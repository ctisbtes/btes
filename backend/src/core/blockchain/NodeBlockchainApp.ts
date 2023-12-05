import { NodeBlockchainAppSnapshot } from '../../common/blockchain/snapshots/NodeBlockchainAppSnapshot';
import { BlockchainWallet } from './modules/BlockchainWallet';
import { BlockchainTxDb } from './modules/BlockchainTxDb';
import { BlockchainBlockDb } from './modules/BlockchainBlockDb';
import { BlockchainConfig } from '../../common/blockchain/BlockchainConfig';
import { BlockchainBlock } from '../../common/blockchain/block/BlockchainBlock';
import { BlockchainBlockChecker } from './validation/BlockchainBlockChecker';
import { BlockchainTxChecker } from './validation/BlockchainTxChecker';
import { BlockchainCommonChecker } from './validation/BlockchainCommonChecker';
import { hashBlock } from '../../common/blockchain/utils/hashBlock';
import { hashTx } from '../../common/blockchain/utils/hashTx';
import { BlockchainMiner } from './modules/miner/BlockchainMiner';
import { BlockchainNetwork } from './modules/BlockchainNetwork';
import { BlockchainTx } from '../../common/blockchain/tx/BlockchainTx';

/** Deals with everything related to blockchain, for a specific node. */
export class NodeBlockchainApp {
  // Data
  private readonly config: BlockchainConfig;
  private readonly blockHashToSenderNodeUidMap: Record<string, string>;

  // Stateful Modules
  public readonly wallet: BlockchainWallet;
  public readonly miner: BlockchainMiner;
  private readonly network: BlockchainNetwork;
  private readonly txDb: BlockchainTxDb;
  private readonly blockDb: BlockchainBlockDb;

  // Stateless modules
  private readonly blockChecker: BlockchainBlockChecker;
  private readonly txChecker: BlockchainTxChecker;

  constructor(
    network: BlockchainNetwork,
    wallet: BlockchainWallet,
    txDb: BlockchainTxDb,
    blockDb: BlockchainBlockDb,
    miner: BlockchainMiner,
    config: BlockchainConfig,
    blockHashToSenderNodeUidMap: Record<string, string>
  ) {
    this.network = network;
    this.wallet = wallet;
    this.miner = miner;
    this.txDb = txDb;
    this.blockDb = blockDb;
    this.config = config;
    this.blockHashToSenderNodeUidMap = blockHashToSenderNodeUidMap;

    const commonChecker = new BlockchainCommonChecker(config, blockDb, txDb);
    this.txChecker = new BlockchainTxChecker(commonChecker);
    this.blockChecker = new BlockchainBlockChecker(
      config,
      blockDb,
      txDb,
      wallet,
      commonChecker
    );
  }

  public readonly takeSnapshot = (): NodeBlockchainAppSnapshot => {
    return {
      network: this.network.takeSnapshot(),
      wallet: this.wallet.takeSnapshot(),
      miner: this.miner.takeSnapshot(),
      txDb: this.txDb.takeSnapshot(),
      blockDb: this.blockDb.takeSnapshot(),
      config: this.config,
      blockHashToSenderNodeUidMap: this.blockHashToSenderNodeUidMap,
    };
  };

  public readonly receiveBlock = (
    block: BlockchainBlock,
    senderNodeUid: string
  ): void => {
    // remember the sender
    this.blockHashToSenderNodeUidMap[hashBlock(block.header)] = senderNodeUid;

    // CheckBlockForReceiveBlock
    const checkResult = this.blockChecker.checkBlockForReceiveBlock(block);

    // if orphan:
    if (checkResult.validity === 'orphan') {
      // bc11... add this to orphan blocks...
      this.blockDb.addToOrphanage(block);

      // bc11... then query peer we got this from for 1st missing orphan block in prev chain...
      this.network.requestBlock(block.header.previousHash, senderNodeUid);

      // bc11... done with block
      return;
    }

    // if valid:
    if (checkResult.validity === 'valid') {
      // AddBlock
      const { isValid, canRelay } = this.blockChecker.addBlock(
        block,
        checkResult.parentNode
      );

      // if did not reject:
      if (isValid) {
        // if relay:
        if (canRelay) {
          // bc16.6. & bc18.7. Relay block to our peers
          this.network.broadcastBlock(block);
        }

        // bc19. For each orphan block for which this block is its prev, run all these steps (including this one) recursively on that orphan
        const blockHash = hashBlock(block.header);
        const orphanChildren = this.blockDb.popOrphansWithParent(blockHash);
        for (const orphanChild of orphanChildren) {
          const senderNodeUid = this.blockHashToSenderNodeUidMap[
            hashBlock(orphanChild.header)
          ];
          this.receiveBlock(orphanChild, senderNodeUid);
        }
      }
    }
  };

  public readonly receiveTx = (tx: BlockchainTx): void => {
    // CheckTxForReceiveTx
    const checkResult = this.txChecker.checkTxForReceiveTx(tx);

    // if orphan:
    if (checkResult === 'orphan') {
      // tx10... Add to the orphan transactions, if a matching transaction is not in there already.
      this.txDb.addToOrphanage(tx);
    }

    // if valid:
    if (checkResult === 'valid') {
      // tx17. Add to transaction pool[7]
      this.txDb.addToMempool(tx);

      // tx18. "Add to wallet if mine"
      this.wallet.addToWalletIfMine(tx);

      // tx19. Relay transaction to peers
      this.network.broadcastTx(tx);

      // tx20. For each orphan transaction that uses this one as one of its inputs, run all these steps (including this one) recursively on that orphan
      const txHash = hashTx(tx);
      this.txDb.popOrphansWithTxAsInput(txHash).forEach(this.receiveTx);
    }
  };

  public readonly sendBlockIfWeHaveIt = (
    blockHash: string,
    toNodeUid: string
  ): void => {
    const getBlockResult = this.blockDb.getBlockAnywhere(blockHash);

    if (getBlockResult.foundIn === 'blockchain') {
      const block = getBlockResult.result.data;
      this.network.sendBlock(block, toNodeUid);
    } else if (getBlockResult.foundIn === 'orphanage') {
      const block = getBlockResult.result;
      this.network.sendBlock(block, toNodeUid);
    }

    // we do not have the requested block. do nothing.
  };
}
