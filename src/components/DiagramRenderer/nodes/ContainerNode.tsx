import { diagramTheme } from '../theme';
import type { DiagramNode, Bounds } from '../types';
import { BrandIcon } from './BrandIcon';
import { BoxNode, calculateBoxDimensions } from './BoxNode';

interface ContainerNodeProps {
  node: DiagramNode;
  bounds: Bounds;
  childPositions?: Map<string, Bounds>;
}

export function ContainerNode({ node, bounds, childPositions }: ContainerNodeProps) {
  const isHighlight = node.variant === 'highlight';
  const theme = isHighlight ? diagramTheme.nodes.highlight : diagramTheme.nodes.default;
  const { x, y, width, height } = bounds;
  const padding = diagramTheme.spacing.nodePadding;

  const hasIcon = !!node.icon;
  const hasBullets = node.bullets && node.bullets.length > 0;
  const hasChildren = node.children && node.children.length > 0;

  // Header dimensions - fixed height for consistency
  const headerHeight = 44;

  // Icon and text positioning
  const iconSize = diagramTheme.spacing.iconSize;
  const iconGap = diagramTheme.spacing.iconGap;
  const headerPadding = padding;

  // Icon vertical center
  const iconY = y + (headerHeight - iconSize) / 2;
  const iconX = x + headerPadding;

  // Label horizontal position
  const labelX = hasIcon ? iconX + iconSize + iconGap : x + headerPadding;

  // Content area starts after header
  const contentY = y + headerHeight + 4;

  return (
    <g className="diagram-container-node">
      {/* Main container background */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={theme.radius}
        ry={theme.radius}
        fill={theme.fill}
        stroke={theme.stroke}
        strokeWidth={theme.strokeWidth}
      />

      {/* Header background bar for highlighted containers */}
      {isHighlight && (
        <>
          <defs>
            <clipPath id={`header-clip-${node.id}`}>
              <rect
                x={x}
                y={y}
                width={width}
                height={headerHeight}
                rx={theme.radius}
                ry={theme.radius}
              />
            </clipPath>
          </defs>
          <rect
            x={x}
            y={y}
            width={width}
            height={headerHeight}
            fill={theme.stroke}
            fillOpacity={0.15}
            clipPath={`url(#header-clip-${node.id})`}
          />
        </>
      )}

      {/* Icon - vertically centered in header */}
      {hasIcon && (
        <g transform={`translate(${iconX}, ${iconY})`}>
          <BrandIcon name={node.icon!} size={iconSize} />
        </g>
      )}

      {/* Label - vertically centered in header */}
      <text
        x={labelX}
        y={y + headerHeight / 2 + 5}
        fill={theme.text}
        fontSize={diagramTheme.text.title.fontSize}
        fontFamily={diagramTheme.text.title.fontFamily}
        fontWeight={diagramTheme.text.title.fontWeight}
      >
        {node.label}
      </text>

      {/* Bullets - positioned in content area */}
      {hasBullets && (
        <g>
          {node.bullets!.map((bullet, idx) => (
            <text
              key={idx}
              x={x + padding}
              y={contentY + 14 + idx * 18}
              fill={theme.textMuted}
              fontSize={diagramTheme.text.bullet.fontSize}
              fontFamily={diagramTheme.text.bullet.fontFamily}
            >
              • {bullet}
            </text>
          ))}
        </g>
      )}

      {/* Children - positioned below bullets */}
      {hasChildren &&
        node.children!.map((child) => {
          const childBounds = childPositions?.get(child.id);
          if (!childBounds) return null;

          return <BoxNode key={child.id} node={child} bounds={childBounds} />;
        })}
    </g>
  );
}

/**
 * Calculate the required dimensions for a container node
 */
export function calculateContainerDimensions(
  node: DiagramNode
): { width: number; height: number; childBounds: Map<string, Bounds> } {
  const padding = diagramTheme.spacing.nodePadding;
  const headerHeight = 44;
  const hasIcon = !!node.icon;
  const hasBullets = node.bullets && node.bullets.length > 0;
  const hasChildren = node.children && node.children.length > 0;

  // Calculate label width
  const charWidth = 9;
  const labelWidth = node.label.length * charWidth;
  const iconWidth = hasIcon ? diagramTheme.spacing.iconSize + diagramTheme.spacing.iconGap : 0;
  const minWidth = labelWidth + iconWidth + padding * 2;

  // Calculate bullets height and width
  let bulletsHeight = 0;
  let bulletMaxWidth = 0;
  if (hasBullets) {
    bulletsHeight = 4 + node.bullets!.length * 18 + 8;
    bulletMaxWidth = Math.max(...node.bullets!.map((b) => b.length * 7)) + padding * 2 + 16;
  }

  // Calculate children dimensions
  const childBounds = new Map<string, Bounds>();
  let maxChildWidth = 0;
  let childrenTotalHeight = 0;

  if (hasChildren) {
    // Calculate all child dimensions
    const childDimensions = node.children!.map((child) => ({
      child,
      dims: calculateBoxDimensions(child),
    }));

    // Find max width
    maxChildWidth = Math.max(...childDimensions.map((c) => c.dims.width));

    // Position children vertically
    let childY = headerHeight + 4 + bulletsHeight;
    const childX = padding + diagramTheme.spacing.childIndent;

    childDimensions.forEach(({ child, dims }) => {
      childBounds.set(child.id, {
        x: childX,
        y: childY,
        width: dims.width,
        height: dims.height,
      });

      childY += dims.height + diagramTheme.spacing.childGap;
    });

    childrenTotalHeight = childY - (headerHeight + 4 + bulletsHeight);
  }

  // Calculate final dimensions
  const childContentWidth = maxChildWidth + diagramTheme.spacing.childIndent + padding;
  const width = Math.max(minWidth, bulletMaxWidth, childContentWidth + padding, 200);
  const height = headerHeight + 4 + bulletsHeight + childrenTotalHeight + padding;

  return {
    width,
    height: Math.max(height, 80),
    childBounds,
  };
}
