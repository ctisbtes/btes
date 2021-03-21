import React, { useMemo, useState } from 'react';
import { Button, Card, Form, InputGroup } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import './BlockchainMinerIdleView.scss';
import { Tree } from '../../../../../common/tree/Tree';
import { BlockchainMinerIdleState } from '../../../../../../../common/src/blockchain/miner/BlockchainMinerStateData';
import { simulationBridge } from '../../../../../services/simulationBridge';
import { RootState } from '../../../../../state/RootState';
import { hasValue } from '../../../../../common/utils/hasValue';

interface BlockchainMinerIdleViewProps {
  simulationUid: string;
  nodeUid: string;
  state: BlockchainMinerIdleState;
}

export const BlockchainMinerIdleView: React.FC<BlockchainMinerIdleViewProps> = (
  props
) => {
  const { simulationUid, nodeUid, state } = props;

  const appData = useSelector(
    (state: RootState) =>
      state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp
  );

  const tree = useMemo(() => Tree.fromJsonObject(appData.blockDb.blockchain), [
    appData.blockDb.blockchain,
  ]);

  const [coinbase, setCoinbase] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [value, setValue] = useState(appData.config.blockCreationFee);
  const [previousHash, setPreviousHash] = useState(
    tree.mainBranchHead?.id ?? ''
  );
  const [difficultyTarget, setDifficultyTarget] = useState(
    appData.config.targetLeadingZeroCount
  );

  const startMining = () => {
    simulationBridge.sendBlockchainStartMining(simulationUid, {
      nodeUid,
      miningTask: {
        blockTemplate: {
          coinbase,
          recipientAddress,
          value,
          previousHash,
          difficultyTarget,
        },
      },
    });
  };

  const ownAddress = appData.wallet.keyPair?.address;

  return (
    <div className="comp-blockchain-miner-idle-view">
      <Card>
        <Card.Header>Block Template</Card.Header>
        <Card.Body>
          <Form>
            <Card.Title>Coinbase Transaction</Card.Title>
            <Card.Text className="text-muted">
              Each miner has the right to put a single transaction at the top of
              the block they are creating, which generates currency out of thin
              air. This transaction is called a <b>coinbase transaction</b>.
            </Card.Text>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Coinbase</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Arbitrary data to be put in the coinabase transaction's input..."
                value={coinbase}
                onChange={(e) => setCoinbase(e.target.value)}
              />
              <Form.Text className="text-muted">
                This field carries no algorithmic significance. Fill it to your
                heart's content.
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Recipient Address</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Base58 encoded blockchain address of the recipient..."
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                />
                <InputGroup.Append>
                  <Button
                    disabled={!hasValue(ownAddress)}
                    variant="info"
                    onClick={() =>
                      setRecipientAddress(ownAddress ?? recipientAddress)
                    }
                    title={
                      hasValue(ownAddress)
                        ? 'Set to own blockchain address.'
                        : 'This node does not have a blockchain address yet.'
                    }
                  >
                    Set to own address
                  </Button>
                </InputGroup.Append>
              </InputGroup>
              <Form.Text className="text-muted">
                Please note that we use <code>base58</code> encoding for the
                addresses and keys, not <code>base58check</code>.
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Value</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  value={value}
                  onChange={(e) => setValue(Number.parseFloat(e.target.value))}
                />
                <InputGroup.Append>
                  <Button
                    variant="info"
                    title="Automatically select a value based on the blockchain configuration of this simulation."
                    onClick={() => setValue(appData.config.blockCreationFee)}
                  >
                    Use configuration
                  </Button>
                </InputGroup.Append>
              </InputGroup>
              <Form.Text className="text-muted">
                The amount of currency generated by this block, mining reward.
                Setting this above what the blockchain configuration allows will
                cause other nodes to reject this block.
              </Form.Text>
            </Form.Group>

            <hr />
            <Card.Title>Block Header</Card.Title>
            <Card.Text className="text-muted">
              These fields are about the block itself.
            </Card.Text>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Previous Hash</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Hash of the parent block..."
                  value={previousHash}
                  onChange={(e) => setPreviousHash(e.target.value)}
                />
                <InputGroup.Append>
                  <Button
                    variant="info"
                    onClick={() =>
                      setPreviousHash(tree.mainBranchHead?.id ?? '')
                    }
                  >
                    Set to active branch leaf
                  </Button>
                </InputGroup.Append>
              </InputGroup>
              <Form.Text className="text-muted">
                Selecting the leaf of the active branch as the previous block
                (which means extending the main branch) minimises the chances of
                this block becoming <em>stale</em>.
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Difficulty Target</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  value={difficultyTarget}
                  onChange={(e) =>
                    setDifficultyTarget(Number.parseInt(e.target.value))
                  }
                />
                <InputGroup.Append>
                  <Button
                    variant="info"
                    title="Automatically select a value based on the blockchain configuration of this simulation."
                    onClick={() =>
                      setDifficultyTarget(appData.config.targetLeadingZeroCount)
                    }
                  >
                    Use configuration
                  </Button>
                </InputGroup.Append>
              </InputGroup>
              <Form.Text className="text-muted">
                The amount of leading zeros this block's hash must have. Setting
                this below what the blockchain configuration requires will cause
                other nodes to reject this block.
              </Form.Text>
            </Form.Group>

            <hr />
            <Card.Title>Other Transactions</Card.Title>
            <Card.Text className="text-muted">
              You can add other transacitons to your block in order to collect
              their <b>transaction fees</b>.
            </Card.Text>
            <Card.Text className="text-muted">To be implemented</Card.Text>
          </Form>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-center">
          <Button variant="success" onClick={() => startMining()}>
            Start Mining
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
};