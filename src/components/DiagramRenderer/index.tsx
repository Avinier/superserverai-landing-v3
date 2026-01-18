import { useMemo } from 'react';
import type { DiagramSchema, Bounds, Point, Side } from './types';
import { diagramTheme } from './theme';
import { calculateLayout, findNodePosition } from './layout';
import { BoxNode, ContainerNode, PillNode } from './nodes';
import { Connection, getConnectionPoint, determineSides } from './connections';
import { collectNodeIds, resolveConnectionTargets } from './parser';

interface DiagramRendererProps {
  schema: DiagramSchema;
  width?: number;
  height?: number;
  className?: string;
  autoSize?: boolean;
}

interface ProcessedConnection {
  id: string;
  from: Point;
  to: Point;
  exitSide: Side;
  enterSide: Side;
  style: 'primary' | 'secondary' | 'solid';
  label?: string;
  annotation?: {
    position: 'left' | 'right';
    bullets: string[];
  };
}

/**
 * Detect and offset overlapping vertical connections
 */
function offsetOverlappingConnections(connections: ProcessedConnection[]): ProcessedConnection[] {
  const HORIZONTAL_OFFSET = 20; // Offset for parallel connections

  // Group connections by their general vertical path (similar x coordinates)
  const verticalPaths: Map<string, ProcessedConnection[]> = new Map();

  connections.forEach((conn) => {
    const isVertical =
      (conn.exitSide === 'bottom' && conn.enterSide === 'top') ||
      (conn.exitSide === 'top' && conn.enterSide === 'bottom');

    if (isVertical) {
      // Round to nearest 50px to group nearby vertical paths
      const pathKey = `v-${Math.round(conn.from.x / 50) * 50}`;
      if (!verticalPaths.has(pathKey)) {
        verticalPaths.set(pathKey, []);
      }
      verticalPaths.get(pathKey)!.push(conn);
    }
  });

  // Offset connections that share a vertical path
  verticalPaths.forEach((conns) => {
    if (conns.length > 1) {
      const offsetStep = HORIZONTAL_OFFSET;
      const totalOffset = (conns.length - 1) * offsetStep;
      const startOffset = -totalOffset / 2;

      conns.forEach((conn, idx) => {
        const offset = startOffset + idx * offsetStep;
        conn.from = { x: conn.from.x + offset, y: conn.from.y };
        conn.to = { x: conn.to.x + offset, y: conn.to.y };
      });
    }
  });

  return connections;
}

export function DiagramRenderer({
  schema,
  width = 800,
  height = 600,
  className = '',
  autoSize = true,
}: DiagramRendererProps) {
  // Calculate layout
  const layout = useMemo(() => calculateLayout(schema), [schema]);

  // Use calculated dimensions if autoSize is enabled
  const canvasWidth = autoSize ? layout.canvasWidth : width;
  const canvasHeight = autoSize ? layout.canvasHeight : height;

  // Expand nodes for rendering
  const expandedNodes = useMemo(() => {
    const nodes = [];
    for (const node of schema.nodes) {
      if (node.repeat && node.repeat > 1) {
        for (let i = 1; i <= node.repeat; i++) {
          nodes.push({
            ...node,
            id: `${node.id}_${i}`,
            repeat: undefined,
          });
        }
      } else {
        nodes.push(node);
      }
    }
    return nodes;
  }, [schema.nodes]);

  // Collect all node IDs for connection resolution
  const nodeIds = useMemo(() => collectNodeIds(schema.nodes), [schema.nodes]);

  // Render a single node based on its type
  const renderNode = (nodeId: string) => {
    const position = layout.nodePositions.get(nodeId);
    if (!position || position.parentId) return null; // Skip children, they're rendered by parent

    const node = expandedNodes.find((n) => n.id === nodeId);
    if (!node) return null;

    const bounds: Bounds = {
      x: position.x,
      y: position.y,
      width: position.width,
      height: position.height,
    };

    switch (node.type) {
      case 'container':
        return (
          <ContainerNode
            key={nodeId}
            node={node}
            bounds={bounds}
            childPositions={layout.childPositions.get(nodeId)}
          />
        );
      case 'pill':
        return <PillNode key={nodeId} node={node} bounds={bounds} />;
      case 'box':
      default:
        return <BoxNode key={nodeId} node={node} bounds={bounds} />;
    }
  };

  // Process all connections and handle overlaps
  const processedConnections = useMemo(() => {
    const connections: ProcessedConnection[] = [];

    schema.connections.forEach((conn, idx) => {
      const fromPosition = findNodePosition(conn.from, layout.nodePositions);
      if (!fromPosition) return;

      const targets = resolveConnectionTargets(conn.to, nodeIds);

      targets.forEach((target, targetIdx) => {
        const toPosition = findNodePosition(target, layout.nodePositions);
        if (!toPosition) return;

        const fromBounds: Bounds = {
          x: fromPosition.x,
          y: fromPosition.y,
          width: fromPosition.width,
          height: fromPosition.height,
        };

        const toBounds: Bounds = {
          x: toPosition.x,
          y: toPosition.y,
          width: toPosition.width,
          height: toPosition.height,
        };

        const { exitSide, enterSide } = determineSides(
          fromBounds,
          toBounds,
          conn.exitSide,
          conn.enterSide
        );

        const fromPoint = getConnectionPoint(fromBounds, exitSide);
        const toPoint = getConnectionPoint(toBounds, enterSide);

        connections.push({
          id: `${conn.from}-${target}-${idx}-${targetIdx}`,
          from: fromPoint,
          to: toPoint,
          exitSide,
          enterSide,
          style: conn.style,
          label: targetIdx === 0 ? conn.label : undefined,
          annotation: targetIdx === targets.length - 1 ? conn.annotation : undefined,
        });
      });
    });

    // Offset overlapping connections
    return offsetOverlappingConnections(connections);
  }, [schema.connections, layout.nodePositions, nodeIds]);

  // Render connections
  const renderConnections = () => {
    return processedConnections.map((conn) => (
      <Connection
        key={conn.id}
        from={conn.from}
        to={conn.to}
        exitSide={conn.exitSide}
        enterSide={conn.enterSide}
        style={conn.style}
        label={conn.label}
        annotation={conn.annotation}
      />
    ));
  };

  // Collect unique connection styles for marker definitions
  const connectionStyles = useMemo(() => {
    const styles = new Set<'primary' | 'secondary' | 'solid'>();
    processedConnections.forEach((conn) => styles.add(conn.style));
    return Array.from(styles);
  }, [processedConnections]);

  return (
    <svg
      width={canvasWidth}
      height={canvasHeight}
      viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
      className={`diagram-renderer ${className}`}
      style={{ backgroundColor: diagramTheme.background }}
    >
      {/* Global marker definitions - must be at SVG root level */}
      <defs>
        {connectionStyles.map((style) => {
          const theme = diagramTheme.connections[style];
          return (
            <marker
              key={`arrow-marker-${style}`}
              id={`arrow-marker-${style}`}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth={10}
              markerHeight={10}
              orient="auto"
              markerUnits="userSpaceOnUse"
            >
              <path d="M 0 1 L 8 5 L 0 9 Z" fill={theme.arrowColor} />
            </marker>
          );
        })}
      </defs>

      {/* Title */}
      {schema.title && (
        <text
          x={30}
          y={30}
          fill={diagramTheme.nodes.default.text}
          fontSize={18}
          fontFamily={diagramTheme.text.title.fontFamily}
          fontWeight={600}
        >
          {schema.title}
        </text>
      )}

      {/* Connections (render first so they're behind nodes) */}
      <g className="diagram-connections">{renderConnections()}</g>

      {/* Nodes */}
      <g className="diagram-nodes">
        {Array.from(layout.nodePositions.keys()).map(renderNode)}
      </g>
    </svg>
  );
}

// Export types for consumers
export type { DiagramSchema, DiagramNode, DiagramConnection } from './types';
export { parseDiagramYaml, parseDiagramObject } from './parser';
export { diagramTheme } from './theme';
