import { diagramTheme } from '../theme';
import type { DiagramNode, Bounds } from '../types';
import { BrandIcon } from './BrandIcon';

interface PillNodeProps {
  node: DiagramNode;
  bounds: Bounds;
}

export function PillNode({ node, bounds }: PillNodeProps) {
  const theme = diagramTheme.nodes.pill;
  const { x, y, width, height } = bounds;

  const hasIcon = !!node.icon;

  // Center content vertically
  const centerY = y + height / 2;
  const iconX = x + 12;
  const labelX = hasIcon ? iconX + 16 + 6 : x + 16;

  return (
    <g className="diagram-pill-node">
      {/* Background - full rounded corners */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={height / 2}
        ry={height / 2}
        fill={theme.fill}
        stroke={theme.stroke}
        strokeWidth={theme.strokeWidth}
      />

      {/* Icon */}
      {hasIcon && (
        <g transform={`translate(${iconX}, ${centerY - 8})`}>
          <BrandIcon name={node.icon!} size={16} />
        </g>
      )}

      {/* Label */}
      <text
        x={labelX}
        y={centerY + 4}
        fill={theme.text}
        fontSize={diagramTheme.text.label.fontSize}
        fontFamily={diagramTheme.text.label.fontFamily}
        fontWeight={diagramTheme.text.label.fontWeight}
      >
        {node.label}
      </text>
    </g>
  );
}

/**
 * Calculate the required dimensions for a pill node
 */
export function calculatePillDimensions(node: DiagramNode): { width: number; height: number } {
  const hasIcon = !!node.icon;
  const labelWidth = node.label.length * 8;
  const iconWidth = hasIcon ? 16 + 6 : 0;

  return {
    width: labelWidth + iconWidth + 32,
    height: 36,
  };
}
