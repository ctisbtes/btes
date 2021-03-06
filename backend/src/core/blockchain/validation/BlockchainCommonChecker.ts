import _ from 'lodash';

import { BlockchainBlock } from '../../../common/blockchain/block/BlockchainBlock';
import { BlockchainTx } from '../../../common/blockchain/tx/BlockchainTx';
import { TreeNode } from '../../../common/tree/TreeNode';
import { checkScriptsUnlock } from '../utils/checkScriptsUnlock';
import { makePartialTx } from '../../../common/blockchain/utils/makePartialTx';
import { BlockchainConfig } from '../../../common/blockchain/BlockchainConfig';
import { BlockchainBlockDb } from '../modules/BlockchainBlockDb';
import { BlockchainTxDb } from '../modules/BlockchainTxDb';
import { hashTx } from '../../../common/blockchain/utils/hashTx';
import { hashJsonObj } from '../../../common/crypto/hashJsonObj';
import { getTxType } from '../../../common/blockchain/utils/getTxType';

type TxLookupResult = {
  tx: BlockchainTx;
  block: BlockchainBlock | null;
  node: TreeNode<BlockchainBlock> | null;
} | null;

export type CheckTxForReceiveResult =
  | { checkResult: 'valid'; sumOfInputs: number; sumOfOutputs: number }
  | { checkResult: 'orphan' | 'invalid' };

export class BlockchainCommonChecker {
  private readonly config: BlockchainConfig;
  private readonly blockDb: BlockchainBlockDb;
  private readonly txDb: BlockchainTxDb;

  constructor(
    config: BlockchainConfig,
    blockDb: BlockchainBlockDb,
    txDb: BlockchainTxDb
  ) {
    this.config = config;
    this.blockDb = blockDb;
    this.txDb = txDb;
  }

  public readonly checkTxForReceive = (
    tx: BlockchainTx,
    options: {
      canSearchMempoolForOutput: boolean;
    }
  ): CheckTxForReceiveResult => {
    const { canSearchMempoolForOutput } = options;

    const partialTxHash = hashJsonObj(makePartialTx(tx));

    let sumOfInputs = 0;

    for (const input of tx.inputs) {
      if (input.isCoinbase) {
        throw new Error('Input is coinbase!');
      }

      const { previousOutput, unlockingScript } = input;

      // tx10. & bc16.1.1. For each input, look in the main branch (if canSearchMempoolForOutput: also look in the transaction pool) to find the referenced output transaction. If the output transaction is missing for any input, this will be an orphan transaction...
      const refOutputLookup = this.findTxInMainBranchOrMempool(
        previousOutput.txHash,
        {
          canSearchMempool: canSearchMempoolForOutput,
        }
      );

      if (refOutputLookup === null) {
        return { checkResult: 'orphan' };
      }

      const { tx: refOutputTx, node: refOutputNode } = refOutputLookup;

      // bc16.1.2. For each input, if we are using the nth output of the earlier transaction, but it has fewer than n+1 outputs, reject.
      if (refOutputTx.outputs.length < previousOutput.outputIndex + 1) {
        return { checkResult: 'invalid' };
      }

      const refOutput = refOutputTx.outputs[previousOutput.outputIndex];
      sumOfInputs += refOutput.value;

      // tx11. & bc16.1.3. For each input, if the referenced output transaction is coinbase, it must have at least COINBASE_MATURITY confirmations; else reject this transaction
      const refOutputTxType = getTxType(refOutputTx);

      if (refOutputTxType === 'invalid') {
        throw new Error('Referenced output tx type is invalid!');
      }

      if (refOutputTxType === 'coinbase') {
        if (refOutputNode === null) {
          throw new Error(
            'refOutputTx is coinbase, but refOutputNode is null!'
          );
        }

        if (refOutputNode.depth < this.config.coinbaseMaturity) {
          return { checkResult: 'invalid' };
        }
      }

      // tx12. & bc16.1.5. For each input, if the referenced output does not exist (e.g. never existed or has already been spent), reject this transaction[6]
      // > existence is checked by tx10 and bc16.1.2 rules. we only need to check if it was spent before.
      if (this.blockDb.isOutPointInMainBranch(previousOutput)) {
        return { checkResult: 'invalid' };
      }

      // tx16. & bc16.1.4. Verify the scriptPubKey accepts for each input; reject if any are bad
      if (
        !checkScriptsUnlock(
          partialTxHash,
          refOutput.lockingScript,
          unlockingScript
        )
      ) {
        return { checkResult: 'invalid' };
      }
    }

    const sumOfOutputs = _.sumBy(tx.outputs, (o) => o.value);

    // tx14. & bc16.1.7. Reject if the sum of input values < sum of output values
    if (sumOfInputs < sumOfOutputs) {
      return { checkResult: 'invalid' };
    }

    return { checkResult: 'valid', sumOfInputs, sumOfOutputs };
  };

  public readonly checkTxContextFree = (
    tx: BlockchainTx,
    options: {
      canSearchMainBranchForDupes: boolean;
    }
  ): 'invalid' | 'valid' => {
    const { canSearchMainBranchForDupes } = options;
    const txHash = hashTx(tx);

    // tx2. Make sure neither in or out lists are empty
    if (tx.inputs.length === 0 || tx.outputs.length === 0) {
      return 'invalid';
    }

    // tx5. Make sure none of the inputs have hash=0, n=-1 (coinbase transactions)
    // > The intended purpose of this rule is to prevent relaying of coinbase transactions, since they can only exist in blocks.
    // > Instead of the check mentioned in the rule, we simply look at the `isConbase` field, which is intended for ease of development.
    if (tx.inputs.some((i) => i.isCoinbase)) {
      return 'invalid';
    }

    // tx8. Reject if we already have matching tx in the pool...
    if (this.txDb.isTxInMempool(txHash)) {
      return 'invalid';
    }

    // if canSearchMainBranchForDupes:
    //   tx8... or in a block in the main branch
    if (canSearchMainBranchForDupes && this.blockDb.isTxInMainBranch(txHash)) {
      return 'invalid';
    }

    // tx9. For each input, if the referenced output exists in any other tx in the pool, reject this transaction.[5]
    // > Clarification: https://bitcoin.stackexchange.com/questions/103342
    // > The output referenced by the input must not be referenced by another input of a transaction already in the pool.
    for (const input of tx.inputs) {
      if (input.isCoinbase) {
        throw new Error('Input is coinbase!');
      }

      if (this.txDb.isOutPointInMempool(input.previousOutput)) {
        return 'invalid';
      }
    }

    return 'valid';
  };

  private readonly findTxInMainBranchOrMempool = (
    txHash: string,
    options: {
      canSearchMempool: boolean;
    }
  ): TxLookupResult => {
    const lookupFromMainBranch = this.blockDb.findTxInMainBranch(txHash);

    if (lookupFromMainBranch !== null) {
      return lookupFromMainBranch;
    }

    if (options.canSearchMempool) {
      const lookupFromMempool = this.txDb.findTxInMempool(txHash);

      if (lookupFromMempool !== null) {
        return {
          block: null,
          node: null,
          tx: lookupFromMempool,
        };
      }
    }

    return null;
  };
}
