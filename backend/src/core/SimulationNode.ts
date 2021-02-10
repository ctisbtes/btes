import { SimulationNodeSnapshot } from '../common/SimulationNodeSnapshot';

export class SimulationNode {
  public readonly nodeUid: string;

  private _positionX: number;
  public get positionX(): number {
    return this._positionX;
  }

  private _positionY: number;
  public get positionY(): number {
    return this._positionY;
  }

  private _latency: number;
  public get latency(): number {
    return this._latency;
  }

  constructor(
    nodeUid: string,
    positionX: number,
    positionY: number,
    latency: number
  ) {
    this.nodeUid = nodeUid;
    this._positionX = positionX;
    this._positionY = positionY;
    this._latency = latency;
  }

  public readonly teardown = (): void => {
    // no-op for now
  };

  public readonly updatePosition = (x: number, y: number): void => {
    this._positionX = x;
    this._positionY = y;
  };

  public readonly changeLatency = (latency: number): void => {
    this._latency = latency;
  };

  public readonly takeSnapshot = (): SimulationNodeSnapshot => {
    return {
      nodeUid: this.nodeUid,
      positionX: this._positionX,
      positionY: this._positionY,
      latency: this._latency,
    };
  };
}
