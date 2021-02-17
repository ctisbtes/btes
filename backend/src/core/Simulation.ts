import _ from 'lodash';

import { nodeUidGenerator } from '../utils/uidGenerators';
import { SimulationNode } from './SimulationNode';
import { SimulationSnapshot } from '../common/SimulationSnapshot';
import { SimulationNodeSnapshot } from '../common/SimulationNodeSnapshot';
import { BlockchainData } from './BlockchainData';

export class Simulation {
  public readonly simulationUid: string;
  public readonly nodeMap: { [nodeUid: string]: SimulationNode } = {};
  public readonly blockchainData: BlockchainData = {
    hash: '34ec7g',
    children: [
      {
        hash: '32380',
        children: [
          {
            hash: 'e21c6',
            children: [
              {
                hash: 'a6877',
                children: [
                  {
                    hash: 'b1416',
                    children: [
                      {
                        hash: '904e2',
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                hash: '2f8b1',
                children: [],
              },
            ],
          },
        ],
      },
    ],
  };

  constructor(simulationUid: string) {
    this.simulationUid = simulationUid;
  }

  public readonly createNode = (
    positionX: number,
    positionY: number
  ): SimulationNode => {
    const nodeUid = nodeUidGenerator.next().toString();
    const newNode = new SimulationNode(nodeUid, positionX, positionY);
    this.nodeMap[nodeUid] = newNode;
    return newNode;
  };

  public readonly createNodeWithSnapshot = (
    nodeSnapshot: SimulationNodeSnapshot
  ): SimulationNode => {
    const { nodeUid, positionX, positionY } = nodeSnapshot;
    const newNode = new SimulationNode(nodeUid, positionX, positionY);
    this.nodeMap[nodeUid] = newNode;
    return newNode;
  };

  public readonly deleteNode = (nodeUid: string): void => {
    const node = this.nodeMap[nodeUid];
    node.teardown();
    delete this.nodeMap[nodeUid];
  };

  public readonly updateNodePosition = (
    nodeUid: string,
    positionX: number,
    positionY: number
  ): void => {
    const node = this.nodeMap[nodeUid];
    node.updatePosition(positionX, positionY);
  };

  public readonly takeSnapshot = (): SimulationSnapshot => {
    const nodeSnapshots = _.mapValues(this.nodeMap, (node) =>
      node.takeSnapshot()
    );
    return {
      simulationUid: this.simulationUid,
      nodeMap: nodeSnapshots,
      blockchainData: this.blockchainData,
    };
  };
}
