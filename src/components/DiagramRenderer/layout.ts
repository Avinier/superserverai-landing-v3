import type { DiagramSchema, DiagramNode, Bounds, NodePosition } from './types';
import { diagramTheme } from './theme';
import { calculateBoxDimensions } from './nodes/BoxNode';
import { calculateContainerDimensions } from './nodes/ContainerNode';
import { calculatePillDimensions } from './nodes/PillNode';

interface LayoutResult {
  nodePositions: Map<string, NodePosition>;
  childPositions: Map<string, Map<string, Bounds>>;
  canvasWidth: number;
  canvasHeight: number;
}

/**
 * Expand nodes with repeat property into individual nodes
 */
function expandRepeatedNodes(nodes: DiagramNode[]): DiagramNode[] {
  const expanded: DiagramNode[] = [];

  for (const node of nodes) {
    if (node.repeat && node.repeat > 1) {
      for (let i = 1; i <= node.repeat; i++) {
        expanded.push({
          ...node,
          id: `${node.id}_${i}`,
          repeat: undefined,
        });
      }
    } else {
      expanded.push(node);

      // Also expand children
      if (node.children) {
        const expandedChildren = expandRepeatedNodes(node.children);
        expanded[expanded.length - 1] = {
          ...node,
          children: expandedChildren,
        };
      }
    }
  }

  return expanded;
}

/**
 * Calculate dimensions for a single node
 */
function calculateNodeDimensions(
  node: DiagramNode
): { width: number; height: number; childBounds?: Map<string, Bounds> } {
  switch (node.type) {
    case 'container':
      return calculateContainerDimensions(node);
    case 'pill':
      return calculatePillDimensions(node);
    case 'box':
    default:
      return calculateBoxDimensions(node);
  }
}

/**
 * Group nodes by their type for layout purposes
 */
function groupNodes(nodes: DiagramNode[]): {
  primary: DiagramNode[];
  containers: DiagramNode[];
  pills: DiagramNode[];
} {
  const primary: DiagramNode[] = [];
  const containers: DiagramNode[] = [];
  const pills: DiagramNode[] = [];

  for (const node of nodes) {
    if (node.type === 'container' && node.variant === 'highlight') {
      containers.push(node);
    } else if (node.type === 'pill') {
      pills.push(node);
    } else {
      primary.push(node);
    }
  }

  return { primary, containers, pills };
}

/**
 * Calculate extra vertical space needed for connection labels/annotations
 * between nodes based on the schema connections
 */
function calculateConnectionSpace(schema: DiagramSchema): number {
  let maxAnnotationHeight = 0;

  for (const conn of schema.connections) {
    // Check if connection has a label
    if (conn.label) {
      maxAnnotationHeight = Math.max(maxAnnotationHeight, 30); // Space for label
    }

    // Check if connection has annotations
    if (conn.annotation && conn.annotation.bullets) {
      const annotationHeight = conn.annotation.bullets.length * 18 + 20;
      maxAnnotationHeight = Math.max(maxAnnotationHeight, annotationHeight);
    }
  }

  return maxAnnotationHeight;
}

/**
 * Simple automatic layout algorithm
 * Positions nodes in a left-to-right, top-to-bottom flow
 */
export function calculateLayout(schema: DiagramSchema, padding: number = 60): LayoutResult {
  const expandedNodes = expandRepeatedNodes(schema.nodes);
  const nodePositions = new Map<string, NodePosition>();
  const childPositions = new Map<string, Map<string, Bounds>>();

  // Base gap + extra space for connection labels/annotations
  const baseGap = diagramTheme.spacing.nodeGap;
  const connectionSpace = calculateConnectionSpace(schema);
  const containerGap = baseGap + connectionSpace; // Larger gap for containers to fit annotations

  // Group nodes for layout
  const { primary, containers, pills } = groupNodes(expandedNodes);

  let currentX = padding;
  let currentY = padding;
  let maxHeightInRow = 0;
  let maxX = padding;
  let maxY = padding;

  // Layout primary boxes (left column)
  for (const node of primary) {
    const dims = calculateNodeDimensions(node);

    nodePositions.set(node.id, {
      id: node.id,
      x: currentX,
      y: currentY,
      width: dims.width,
      height: dims.height,
    });

    maxHeightInRow = Math.max(maxHeightInRow, dims.height);
    currentY += dims.height + baseGap;
    maxY = Math.max(maxY, currentY);
  }

  // Move to next column for containers
  currentX = padding + 200;
  currentY = padding;

  // Layout containers (center column) with extra gap for annotations
  for (const node of containers) {
    const dims = calculateNodeDimensions(node);

    nodePositions.set(node.id, {
      id: node.id,
      x: currentX,
      y: currentY,
      width: dims.width,
      height: dims.height,
    });

    // Store child positions relative to parent
    if (dims.childBounds) {
      const absoluteChildBounds = new Map<string, Bounds>();
      dims.childBounds.forEach((bounds, childId) => {
        absoluteChildBounds.set(childId, {
          x: currentX + bounds.x,
          y: currentY + bounds.y,
          width: bounds.width,
          height: bounds.height,
        });

        // Also register child in main positions map
        nodePositions.set(childId, {
          id: childId,
          parentId: node.id,
          x: currentX + bounds.x,
          y: currentY + bounds.y,
          width: bounds.width,
          height: bounds.height,
        });
      });
      childPositions.set(node.id, absoluteChildBounds);
    }

    maxX = Math.max(maxX, currentX + dims.width);
    // Use larger gap between containers to accommodate labels and annotations
    currentY += dims.height + containerGap;
    maxY = Math.max(maxY, currentY);
  }

  // Move to next column for pills
  currentX = maxX + baseGap + 40;
  currentY = padding + 20;

  // Layout pills (right column, vertical stack)
  for (const node of pills) {
    const dims = calculateNodeDimensions(node);

    nodePositions.set(node.id, {
      id: node.id,
      x: currentX,
      y: currentY,
      width: dims.width,
      height: dims.height,
    });

    maxX = Math.max(maxX, currentX + dims.width);
    currentY += dims.height + 16; // Smaller gap for pills
    maxY = Math.max(maxY, currentY);
  }

  return {
    nodePositions,
    childPositions,
    canvasWidth: maxX + padding,
    canvasHeight: maxY + padding,
  };
}

/**
 * Find node position by ID, including children
 */
export function findNodePosition(
  nodeId: string,
  nodePositions: Map<string, NodePosition>
): NodePosition | undefined {
  // Direct lookup
  const direct = nodePositions.get(nodeId);
  if (direct) return direct;

  // Check for nested ID (parent.child)
  if (nodeId.includes('.')) {
    const childId = nodeId.split('.').pop()!;
    return nodePositions.get(childId);
  }

  return undefined;
}
