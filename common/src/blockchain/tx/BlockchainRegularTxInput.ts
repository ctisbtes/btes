import { BlockchainTxOutPoint } from './BlockchainTxOutPoint';
import { BlockchainUnlockingScript } from '../crypto/BlockchainUnlockingScript';

/**
 * https://en.bitcoin.it/wiki/Protocol_documentation#tx
 * https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch06.asciidoc#transaction-inputs
 */
export interface BlockchainRegularTxInput {
  /*
   * Omitted fields:
   * - sequence (number): Transaction version as defined by the sender. Intended for "replacement" of transactions when information is updated before inclusion into a block.
   *
   * Implied fields:
   * - script length (number): this is the length of unlockingScript
   */

  /**
   * Indicates if this input is coinbase.
   * Not in the actual protocol, intended for ease of development.
   */
  readonly isCoinbase: false;

  /**
   * The previous output transaction reference, as an OutPoint structure.
   */
  readonly previousOutput: BlockchainTxOutPoint;

  /**
   * `scriptSig` = `signature script`
   * Computational Script for confirming transaction authorization
   */
  readonly unlockingScript: BlockchainUnlockingScript;
}
