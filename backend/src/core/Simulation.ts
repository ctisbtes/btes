import { simulationBridge } from './simulationBridge';
import { nodeUidGenerator } from '../utils/uidGenerators';
import { SimulationNode } from './SimulationNode';
import { SimulationPingPayload } from '../common/socketPayloads/SimulationPingPayload';
import { SimulationPongPayload } from '../common/socketPayloads/SimulationPongPayload';
import { SimulationCreateNodePayload } from '../common/socketPayloads/SimulationCreateNodePayload';
import { SimulationNodeCreatedPayload } from '../common/socketPayloads/SimulationNodeCreatedPayload';
import { SimulationDeleteNodePayload } from '../common/socketPayloads/SimulationDeleteNodePayload';
import { SimulationNodeDeletedPayload } from '../common/socketPayloads/SimulationNodeDeletedPayload';

export class Simulation {
  private readonly simulationUid: string;
  private readonly nodeMap: { [nodeUid: string]: SimulationNode } = {};

  constructor(simulationUid: string) {
    this.simulationUid = simulationUid;
  }

  public readonly handleSimulationPing = (
    body: SimulationPingPayload
  ): void => {
    this.sendSimulationPong({
      pingDate: body.date,
      pongDate: Date.now(),
    });
  };

  private readonly sendSimulationPong = (body: SimulationPongPayload): void => {
    simulationBridge.sendSimulationPong(this.simulationUid, body);
  };

  public readonly handleSimulationCreateNode = (
    body: SimulationCreateNodePayload
  ): void => {
    const nodeUid = nodeUidGenerator.next().toString();
    const newNode = new SimulationNode(nodeUid, body.positionX, body.positionY);
    this.nodeMap[nodeUid] = newNode;

    this.sendSimulationNodeCreated(newNode);
  };

  private readonly sendSimulationNodeCreated = (
    body: SimulationNodeCreatedPayload
  ) => {
    simulationBridge.sendSimulationNodeCreated(this.simulationUid, body);
  };

  public readonly handleSimulationDeleteNode = (
    body: SimulationDeleteNodePayload
  ): void => {
    const node = this.nodeMap[body.nodeUid];
    node.teardown();
    delete this.nodeMap[body.nodeUid];

    this.sendSimulationNodeDeleted({ nodeUid: body.nodeUid });
  };

  private readonly sendSimulationNodeDeleted = (
    body: SimulationNodeDeletedPayload
  ) => {
    simulationBridge.sendSimulationNodeDeleted(this.simulationUid, body);
  };
}
