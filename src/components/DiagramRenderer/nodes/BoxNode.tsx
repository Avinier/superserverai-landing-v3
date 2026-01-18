import { diagramTheme } from '../theme';
import type { DiagramNode, Bounds } from '../types';
import { BrandIcon } from './BrandIcon';

interface BoxNodeProps {
  node: DiagramNode;
  bounds: Bounds;
}

export function BoxNode({ node, bounds }: BoxNodeProps) {
  const theme = diagramTheme.nodes.default;
  const { x, y, width, height } = bounds;
  const padding = diagramTheme.spacing.nodePadding;

  const hasIcon = !!node.icon;
  const hasBullets = node.bullets && node.bullets.length > 0;
  const hasSubtitle = !!node.subtitle;

  // Layout calculations - use consistent line heights
  const lineHeight = 18;
  const iconSize = diagramTheme.spacing.iconSize;
  const iconGap = diagramTheme.spacing.iconGap;

  // Content X positions
  const iconX = x + padding;
  const textX = hasIcon ? iconX + iconSize + iconGap : x + padding;

  // Y positions - calculate from top, accumulating heights
  let currentY = y + padding;

  // Label position (baseline)
  const labelY = currentY + 14;
  currentY += lineHeight + 4; // Move past label

  // Subtitle position (if exists)
  const subtitleY = hasSubtitle ? currentY + 10 : 0;
  if (hasSubtitle) {
    currentY += lineHeight; // Move past subtitle
  }

  // Bullets start position
  const bulletsStartY = currentY + 4;

  return (
    <g className="diagram-box-node">
      {/* Background */}
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

      {/* Icon - vertically aligned with label */}
      {hasIcon && (
        <g transform={`translate(${iconX}, ${y + padding})`}>
          <BrandIcon name={node.icon!} size={iconSize} />
        </g>
      )}

      {/* Label */}
      <text
        x={textX}
        y={labelY}
        fill={theme.text}
        fontSize={
          node.labelStyle === 'code'
            ? diagramTheme.text.code.fontSize
            : diagramTheme.text.label.fontSize
        }
        fontFamily={
          node.labelStyle === 'code'
            ? diagramTheme.text.code.fontFamily
            : diagramTheme.text.label.fontFamily
        }
        fontWeight={diagramTheme.text.label.fontWeight}
      >
        {node.label}
      </text>

      {/* Subtitle */}
      {hasSubtitle && (
        <text
          x={textX}
          y={subtitleY}
          fill={theme.textMuted}
          fontSize={diagramTheme.text.subtitle.fontSize}
          fontFamily={diagramTheme.text.subtitle.fontFamily}
        >
          {node.subtitle}
        </text>
      )}

      {/* Bullets */}
      {hasBullets && (
        <g>
          {node.bullets!.map((bullet, idx) => {
            const bulletY = bulletsStartY + idx * lineHeight;
            return (
              <text
                key={idx}
                x={x + padding}
                y={bulletY}
                fill={theme.textMuted}
                fontSize={diagramTheme.text.bullet.fontSize}
                fontFamily={diagramTheme.text.bullet.fontFamily}
              >
                • {bullet}
              </text>
            );
          })}
        </g>
      )}
    </g>
  );
}

/**
 * Calculate the required dimensions for a box node
 */
export function calculateBoxDimensions(node: DiagramNode): { width: number; height: number } {
  const padding = diagramTheme.spacing.nodePadding;
  const lineHeight = 18;
  const hasIcon = !!node.icon;
  const hasBullets = node.bullets && node.bullets.length > 0;
  const hasSubtitle = !!node.subtitle;

  // Estimate text widths (approx 8px per character)
  const charWidth = 8;
  const labelWidth = node.label.length * charWidth;
  const subtitleWidth = hasSubtitle ? node.subtitle!.length * 7 : 0;
  const iconWidth = hasIcon ? diagramTheme.spacing.iconSize + diagramTheme.spacing.iconGap : 0;
  const bulletMaxWidth = hasBullets
    ? Math.max(...node.bullets!.map((b) => b.length * 7)) + 20
    : 0;

  // Width is the max of all content widths + padding
  const contentWidth = Math.max(labelWidth + iconWidth, subtitleWidth, bulletMaxWidth);
  const width = contentWidth + padding * 2;

  // Calculate height - accumulate all content
  let height = padding; // Top padding
  height += lineHeight + 4; // Label
  if (hasSubtitle) height += lineHeight; // Subtitle
  if (hasBullets) height += 4 + node.bullets!.length * lineHeight; // Gap + bullets
  height += padding; // Bottom padding

  return {
    width: Math.max(width, 140),
    height: Math.max(height, 56),
  };
}
