import { NodeConnectionMap } from '../../network/NodeConnectionMap';
import { ControlledTimerService } from '../../network/ControlledTimerService';
import { BlockchainBlock } from '../../../common/blockchain/block/BlockchainBlock';
import { BlockchainNetworkSnapshot } from '../../../common/blockchain/snapshots/BlockchainNetworkSnapshot';
import { BlockchainTx } from '../../../common/blockchain/tx/BlockchainTx';
import { NodeConnection } from '../../network/NodeConnection';
import { SimulationNode } from '../../SimulationNode';
import { fatalAssert } from '../../../common/utils/fatalAssert';

type RpcTarget =
  | {
      arity: 'broadcast';
    }
  | {
      arity: 'unicast';
      targetNodeId: string;
    };

type Rpc = (recipientNode: SimulationNode) => void;

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
    this.broadcast((recipientNode) => {
      recipientNode.blockchainApp.receiveBlock(block, this.nodeUid);
    });
  };

  public readonly broadcastTx = (tx: BlockchainTx): void => {
    this.broadcast((recipientNode) => {
      recipientNode.blockchainApp.receiveTx(tx);
    });
  };

  public readonly requestBlock = (
    blockHash: string,
    fromNodeUid: string
  ): void => {
    this.unicast(fromNodeUid, (recipientNode) => {
      recipientNode.blockchainApp.sendBlockIfWeHaveIt(blockHash, this.nodeUid);
    });
  };

  public readonly sendBlock = (
    block: BlockchainBlock,
    toNodeUid: string
  ): void => {
    this.unicast(toNodeUid, (recipientNode) => {
      recipientNode.blockchainApp.receiveBlock(block, this.nodeUid);
    });
  };

  private readonly broadcast = (rpc: Rpc): void => {
    this.sendRpc({ arity: 'broadcast' }, rpc);
  };

  private readonly unicast = (targetNodeId: string, rpc: Rpc): void => {
    this.sendRpc({ arity: 'unicast', targetNodeId }, rpc);
  };

  private readonly sendRpc = (target: RpcTarget, rpc: Rpc): void => {
    const connections = this.getRpcTargetConections(target);

    for (const connection of connections) {
      this.timerService.createTimer({
        waitTimeInMs: connection.latencyInMs,
        onDone: () => rpc(connection.getOtherNode(this.nodeUid)),
      });
    }
  };

  private readonly getRpcTargetConections = (
    target: RpcTarget
  ): NodeConnection[] => {
    if (target.arity === 'broadcast') {
      return this.connections;
    }

    if (target.arity === 'unicast') {
      const filtered = this.connections.filter(
        (c) => c.getOtherNode(this.nodeUid).nodeUid === target.targetNodeId
      );

      fatalAssert(
        filtered.length === 1,
        `Expected exactly one connection for unicast, got ${filtered.length}`
      );

      return filtered;
    }

    throw new Error(`Invalid rpc target: ${target}`);
  };
}
