import { Simulation } from './Simulation';
import { fatalAssert } from '../utils/fatalAssert';
import { socketEvents } from '../common/constants/socketEvents';
import { SimulationPongPayload } from '../common/socketPayloads/SimulationPongPayload';
import { SimulationNodeCreatedPayload } from '../common/socketPayloads/SimulationNodeCreatedPayload';
import { SimulationNamespaceListener } from './SimulationNamespaceListener';
import { SimulationNodeDeletedPayload } from '../common/socketPayloads/SimulationNodeDeletedPayload';
import { SimulationSnapshotReportPayload } from '../common/socketPayloads/SimulationSnapshotReportPayload';
import { SimulationNodePositionUpdatedPayload } from '../common/socketPayloads/SimulationNodePositionUpdatedPayload';
import { TypedSocketNamespace } from '../utils/typedSocketsBackend/TypedSocketNamespace';
import { SimulationSocketApiManifest } from '../common/socketApiManifests/SimulationSocketApiManifest';

class SimulationBridge {
  private readonly simulationMap: { [simulationUid: string]: Simulation } = {};
  private readonly nsMap: {
    [simulationUid: string]: TypedSocketNamespace<SimulationSocketApiManifest>;
  } = {};

  private readonly listenerMap: {
    [simulaitonUid: string]: SimulationNamespaceListener;
  } = {};

  public readonly setupNewSimulation = (
    simulationUid: string,
    ns: TypedSocketNamespace<SimulationSocketApiManifest>
  ) => {
    const newSimulation = new Simulation(simulationUid);
    const listener = new SimulationNamespaceListener(
      simulationUid,
      ns,
      newSimulation
    );

    this.simulationMap[simulationUid] = newSimulation;
    this.nsMap[simulationUid] = ns;
    this.listenerMap[simulationUid] = listener;
  };

  public readonly checkSimulationExists = (simulationUid: string): boolean => {
    const simulationExists = !!this.simulationMap[simulationUid];
    const namespaceExists = !!this.nsMap[simulationUid];

    fatalAssert(
      simulationExists === namespaceExists,
      `Desync between simulation map and namespace map! simulationUid: ${simulationUid}, simulationExists: ${simulationExists}, namespaceExists: ${namespaceExists}`
    );

    return simulationExists;
  };

  public readonly sendSimulationPong = (
    simulationUid: string,
    body: SimulationPongPayload
  ) => {
    const ns = this.nsMap[simulationUid];
    ns.emit(socketEvents.simulation.serverToClient.pong, body);
  };

  public readonly sendSimulationNodeCreated = (
    simulationUid: string,
    body: SimulationNodeCreatedPayload
  ) => {
    const ns = this.nsMap[simulationUid];
    ns.emit(socketEvents.simulation.serverToClient.nodeCreated, body);
  };

  public readonly sendSimulationNodeDeleted = (
    simulationUid: string,
    body: SimulationNodeDeletedPayload
  ) => {
    const ns = this.nsMap[simulationUid];
    ns.emit(socketEvents.simulation.serverToClient.nodeDeleted, body);
  };

  public readonly sendSimulationSnapshotReport = (
    simulationUid: string,
    body: SimulationSnapshotReportPayload
  ): void => {
    const ns = this.nsMap[simulationUid];
    ns.emit(socketEvents.simulation.serverToClient.snapshotReport, body);
  };

  public readonly sendSimulationNodePositionUpdated = (
    simulationUid: string,
    body: SimulationNodePositionUpdatedPayload
  ) => {
    const ns = this.nsMap[simulationUid];
    ns.emit(socketEvents.simulation.serverToClient.nodePositionUpdated, body);
  };
}

export const simulationBridge = new SimulationBridge();
