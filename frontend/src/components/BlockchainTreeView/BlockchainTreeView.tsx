import React from 'react';
import './BlockchainTreeView.css';
import Tree from 'react-d3-tree';

export interface BlockchainBlock {
  hash: string;
  children: BlockchainBlock[];
}

interface BlockchainTreeViewProps {
  rootBlock: BlockchainBlock;
}

type TreeNode = {
  name: string;
  children: TreeNode[];
};

function format(rootBlock: BlockchainBlock, isRoot = true): TreeNode {
  return {
    name: rootBlock.hash,
    children: rootBlock.children.map((child) => format(child, false)),
  };
}

export default function BlockchainTreeView(props: BlockchainTreeViewProps) {
  const { rootBlock } = props;

  return (
    <div className="d-flex justify-content-center align-items-center border blockchain-tree-view-container">
      <Tree data={format(rootBlock)} />
    </div>
  );
}
