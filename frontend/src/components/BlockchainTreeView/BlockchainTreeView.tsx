import React from 'react';
import Tree from 'react-d3-tree';
import { useSelector } from 'react-redux';
import { RawNodeDatum } from 'react-d3-tree/lib/types/common';

import './BlockchainTreeView.scss';
import { RootState } from '../../state/RootState';
import { BlockchainBlock } from '../../common/blockchain/BlockchainBlock';

interface BlockchainTreeViewProps {
  simulationUid: string;
  nodeUid: string | null;
}

function format(rootBlock: BlockchainBlock): RawNodeDatum {
  return {
    name: rootBlock.hash,
    children: rootBlock.children?.map((child) => format(child)),
  };
}

export const BlockchainTreeView: React.FC<BlockchainTreeViewProps> = (
  props
) => {
  const { simulationUid, nodeUid } = props;

  const rootBlock = useSelector((state: RootState) => {
    return nodeUid
      ? state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp
          .blockchainBlock
      : null;
  });

  return (
    <div className="d-flex justify-content-center align-items-center border comp-blockchain-tree-view">
      {null === rootBlock ? (
        <p>This node has no blockchain data yet.</p>
      ) : (
        <Tree data={format(rootBlock)} />
      )}
    </div>
  );
};
