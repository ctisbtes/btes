import React from 'react';
import { useSelector } from 'react-redux';
import { Card } from 'react-bootstrap';

import './BlockchainTxPoolPane.scss';
import { RootState } from '../../../state/RootState';
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
        <Card.Header>Mempool ({mempool.length})</Card.Header>
        <Card.Body>
          {mempool.length <= 0 ? (
            <Card.Text className="text-muted">Mempool is empty.</Card.Text>
          ) : (
            mempool.map((tx) => (
              <div className="comp-blockchain-tx-pool-pane--tx-card">
                <BlockchainTxCard {...props} tx={tx} />
              </div>
            ))
          )}
        </Card.Body>
      </Card>
      <Card className="mt-3">
        <Card.Header>Orphan Transactions ({orphanage.length})</Card.Header>
        <Card.Body>
          {orphanage.length <= 0 ? (
            <Card.Text className="text-muted">
              No orphan transactions.
            </Card.Text>
          ) : (
            orphanage.map((tx) => (
              <div className="comp-blockchain-tx-pool-pane--tx-card">
                <BlockchainTxCard {...props} tx={tx} />
              </div>
            ))
          )}
        </Card.Body>
      </Card>
    </div>
  );
};
