import { NodeConnectionMap } from '../../network/NodeConnectionMap';
import { ControlledTimerService } from '../../network/ControlledTimerService';
import { BlockchainBlock } from '../../../common/blockchain/block/BlockchainBlock';
import { BlockchainNetworkSnapshot } from '../../../common/blockchain/snapshots/BlockchainNetworkSnapshot';
import { BlockchainTx } from '../../../common/blockchain/tx/BlockchainTx';

export class BlockchainNetwork {
  private readonly connectionMap: NodeConnectionMap;
  private readonly timerService: ControlledTimerService;
  private readonly nodeUid: string;

  private get connections() {
    return this.connectionMap.getAll(this.nodeUid);
  }

  constructor(
    connectionMap: NodeConnectionMap,
    timerService: ControlledTimerService,
    nodeUid: string
  ) {
    this.connectionMap = connectionMap;
    this.timerService = timerService;
    this.nodeUid = nodeUid;
  }

  public readonly takeSnapshot = (): BlockchainNetworkSnapshot => {
    // TODO: implement
    return {};
  };

  public readonly broadcastBlock = (block: BlockchainBlock): void => {
    for (const connection of this.connections) {
      const recipientNode = connection.getOtherNode(this.nodeUid);

      this.timerService.createTimer({
        waitTimeInMs: connection.latencyInMs,
        onDone: () => {
          recipientNode.blockchainApp.receiveBlock(block, this.nodeUid);
        },
      });
    }
  };

  public readonly broadcastTx = (tx: BlockchainTx): void => {
    for (const connection of this.connections) {
      const recipientNode = connection.getOtherNode(this.nodeUid);

      this.timerService.createTimer({
        waitTimeInMs: connection.latencyInMs,
        onDone: () => {
          recipientNode.blockchainApp.receiveTx(tx);
        },
      });
    }
  };

  public readonly requestBlock = (
    blockHash: string,
    fromNodeUid: string
  ): void => {
    for (const connection of this.connections) {
      const otherNode = connection.getOtherNode(this.nodeUid);

      if (otherNode.nodeUid === fromNodeUid) {
        this.timerService.createTimer({
          waitTimeInMs: connection.latencyInMs,
          onDone: () => {
            otherNode.blockchainApp.sendBlockIfWeHaveIt(
              blockHash,
              this.nodeUid
            );
          },
        });

        return;
      }
    }

    throw new Error(`No connection to node with uid ${fromNodeUid}`);
  };

  public readonly sendBlock = (
    block: BlockchainBlock,
    toNodeUid: string
  ): void => {
    for (const connection of this.connections) {
      const otherNode = connection.getOtherNode(this.nodeUid);

      if (otherNode.nodeUid === toNodeUid) {
        this.timerService.createTimer({
          waitTimeInMs: connection.latencyInMs,
          onDone: () => {
            otherNode.blockchainApp.receiveBlock(block, this.nodeUid);
          },
        });

        return;
      }
    }

    throw new Error(`No connection to node with uid ${toNodeUid}`);
  };
}
