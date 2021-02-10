import { Simulation } from '../Simulation';
import { SimulationNamespaceListener } from '../SimulationNamespaceListener';
import { UndoubleAction } from '../undoRedo/UndoubleAction';
import { SimulationNodeChangeLatencyPayload } from '../../common/socketPayloads/SimulationNodeChangeLatencyPayload';

export class SimulationNodeSendMailCommand implements UndoubleAction {
  private readonly simulation: Simulation;
  private readonly socketEventEmitter: SimulationNamespaceListener;
  private readonly eventPayload: SimulationNodeChangeLatencyPayload;

  private previousLatency: number | undefined;

  constructor(
    simulation: Simulation,
    socketEventEmitter: SimulationNamespaceListener,
    eventPayload: SimulationNodeChangeLatencyPayload
  ) {
    this.simulation = simulation;
    this.socketEventEmitter = socketEventEmitter;
    this.eventPayload = eventPayload;
  }

  private readonly getNode = () =>
    this.simulation.nodeMap[this.eventPayload.nodeUid];

  private readonly perform = () => {
    this.getNode().changeLatency(this.eventPayload.latency);
    this.socketEventEmitter.sendNodeLatencyChanged({ ...this.eventPayload });
  };

  public readonly execute = (): void => {
    this.previousLatency = this.getNode().latency;
    this.perform();
  };

  public readonly redo = this.perform;

  public readonly undo = (): void => {
    if (undefined === this.previousLatency) {
      throw new Error('undo invoked before execute!');
    }

    this.getNode().changeLatency(this.previousLatency);
    this.socketEventEmitter.sendNodeLatencyChanged({
      nodeUid: this.eventPayload.nodeUid,
      latency: this.previousLatency,
    });
  };
}
