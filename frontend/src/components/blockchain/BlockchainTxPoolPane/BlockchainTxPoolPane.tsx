import _ from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { Card } from 'react-bootstrap';

import './BlockchainTxPoolPane.scss';
import { RootState } from '../../../state/RootState';
import { hashTx } from '../../../common/blockchain/utils/hashTx';
import { BlockchainTxCard } from '../BlockchainTxCard/BlockchainTxCard';

interface BlockchainTxPoolPaneProps {
  simulationUid: string;
  nodeUid: string;
}

export const BlockchainTxPoolPane: React.FC<BlockchainTxPoolPaneProps> = (
  props
) => {
  const { simulationUid, nodeUid } = props;

  const mempool = useSelector(
    (state: RootState) =>
      state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp.txDb
        .mempool
  );

  const orphanage = useSelector(
    (state: RootState) =>
      state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp.txDb
        .orphanage
  );

  return (
    <div className="comp-blockchain-tx-pool-pane">
      <Card>
        <Card.Header>Mempool</Card.Header>
        <Card.Body>
          {mempool.map((tx) => (
            <BlockchainTxCard tx={tx} />
          ))}
        </Card.Body>
      </Card>
      <Card className="mt-3">
        <Card.Header>Orphan Transactions</Card.Header>
        <Card.Body>
          {orphanage.map((tx) => (
            <BlockchainTxCard tx={tx} />
          ))}
        </Card.Body>
      </Card>
    </div>
  );
};
