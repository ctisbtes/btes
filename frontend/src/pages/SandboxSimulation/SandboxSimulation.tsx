import React, { useCallback, useEffect, useRef, useState } from 'react';
import './SandboxSimulation.scss';
import { useParams } from 'react-router-dom';
import { simulationBridge } from '../../services/simulationBridge';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/RootState';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import NodeModal from '../../components/NodeModal/NodeModal';
// import nodeIcon from './pcIcon.png';
import { NodeData } from '../../state/simulation/NodeData';
import Draggable from 'react-draggable';

interface SandboxSimulationParamTypes {
  simulationUid: string;
}

const SandboxSimulation: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const simulationPongTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const { simulationUid } = useParams<SandboxSimulationParamTypes>();

  const simulationPongs = useSelector(
    (state: RootState) => state.simulation[simulationUid]?.pongs || []
  );

  const nodes = useSelector((state: RootState) =>
    Object.values(state.simulation[simulationUid]?.nodeMap || {})
  );

  const [viewingNode, setViewingNode] = useState<NodeData | null>(null);

  const connect = useCallback(async () => {
    await simulationBridge.connect(simulationUid);
    setConnected(true);
  }, [simulationUid]);

  const teardown = useCallback(() => {
    simulationBridge.teardown(simulationUid);
  }, [simulationUid]);

  const sendSimulationPingOnClick = () => {
    simulationBridge.sendSimulationPing(simulationUid, { date: Date.now() });
  };

  const formatSimulationPongs = () => {
    const result = simulationPongs
      ?.map(
        (simPong) =>
          `ping: ${new Date(simPong.pingDate).toUTCString()}\t` +
          `pong: ${new Date(simPong.pongDate).toUTCString()}`
      )
      .reverse()
      .join('\n');

    return result || '';
  };

  const deleteNode = (nodeUid: string, event: React.UIEvent) => {
    event.preventDefault();
    event.stopPropagation();
    simulationBridge.sendSimulationDeleteNode(simulationUid, { nodeUid });
  };

  const createNode = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    simulationBridge.sendSimulationCreateNode(simulationUid, {
      positionX: event.pageX,
      positionY: event.pageY,
    });
  };

  useEffect(() => {
    connect();

    return () => {
      teardown();
    };
  }, [connect, teardown]);

  return (
    <div className="sandbox-simulation-page container-fluid">
      {connected ? (
        <>
          <div className="row">
            <ContextMenuTrigger id="rightClickArea">
              <div className="d-flex position-absolute h-75 border w-100">
                <Draggable>
                  <div className="position-absolute">
                    <span>sldfkjksjf</span>
                  </div>
                </Draggable>
                {nodes.map((node) => {
                  const style = {
                    top: node.positionY - 50, //from element height
                    left: node.positionX,
                    cursor: 'pointer',
                  };
                  return (
                    <div>
                      <ContextMenuTrigger
                        id={`nodeRightClickArea_${node.nodeUid}`}
                      >
                        <Draggable>
                          <div
                            className="node-card card position-absolute justify-content-center"
                            style={style}
                            onDoubleClick={() => setViewingNode(node)}
                            key={node.nodeUid}
                          >
                            <span className="alert-info">NODE</span>
                            <p className="card-text text-center">
                              {node.nodeUid}
                            </p>
                          </div>
                        </Draggable>
                      </ContextMenuTrigger>
                      <ContextMenu id={`nodeRightClickArea_${node.nodeUid}`}>
                        <MenuItem
                          data={{ event: 'deleteNode' }}
                          onClick={(event) => deleteNode(node.nodeUid, event)}
                        >
                          <span className="menu-item bg-success border p-2">
                            Delete Node
                          </span>
                        </MenuItem>
                      </ContextMenu>
                    </div>
                  );
                })}
              </div>
            </ContextMenuTrigger>
            <ContextMenu id="rightClickArea">
              <MenuItem data={{ event: 'createNode' }} onClick={createNode}>
                <span className="menu-item bg-success border p-2">
                  Create Node
                </span>
              </MenuItem>
            </ContextMenu>
            {viewingNode && (
              <NodeModal
                show={true}
                closeHandler={() => setViewingNode(null)}
                node={viewingNode}
              />
            )}
          </div>
          <div className="fixed-bottom d-flex row align-content-center m-3">
            <div className="input-group">
              <div className="input-group-append">
                <input
                  type="button"
                  className="form-control btn btn-outline-success"
                  onClick={sendSimulationPingOnClick}
                  value="Send Simulation Ping"
                />
              </div>
              <textarea
                className="form-control"
                style={{ resize: 'both' }}
                readOnly
                ref={simulationPongTextAreaRef}
                value={formatSimulationPongs()}
              ></textarea>
            </div>
          </div>
        </>
      ) : (
        <div>
          <span>Connecting to simulation {simulationUid}...</span>
        </div>
      )}
    </div>
  );
};

export default SandboxSimulation;
