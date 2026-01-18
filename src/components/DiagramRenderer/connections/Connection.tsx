import { diagramTheme } from '../theme';
import type { ConnectionStyle, Point, Side, ConnectionAnnotation } from '../types';
import { generateCurvedPath } from './pathUtils';

interface ConnectionProps {
  from: Point;
  to: Point;
  exitSide: Side;
  enterSide: Side;
  style: ConnectionStyle;
  label?: string;
  annotation?: ConnectionAnnotation;
}

/**
 * Calculate label position along the connection path
 * Labels should be CENTERED along the connection, positioned to the side
 */
function calculateLabelPosition(
  from: Point,
  to: Point,
  exitSide: Side
): { x: number; y: number; anchor: 'start' | 'middle' | 'end' } {
  const sideOffset = 14; // Distance from the line itself

  // For horizontal connections (left/right exit) - center vertically
  if (exitSide === 'right') {
    const midX = (from.x + to.x) / 2;
    return {
      x: midX,
      y: from.y - sideOffset,
      anchor: 'middle',
    };
  } else if (exitSide === 'left') {
    const midX = (from.x + to.x) / 2;
    return {
      x: midX,
      y: from.y - sideOffset,
      anchor: 'middle',
    };
  }
  // For vertical connections (top/bottom exit) - CENTER along the path, to the LEFT
  else if (exitSide === 'bottom') {
    const midY = (from.y + to.y) / 2;
    return {
      x: from.x - sideOffset,
      y: midY,
      anchor: 'end', // Right-align text so it doesn't cross the line
    };
  } else {
    // top
    const midY = (from.y + to.y) / 2;
    return {
      x: from.x - sideOffset,
      y: midY,
      anchor: 'end',
    };
  }
}

/**
 * Calculate annotation position - CENTERED along the connection path
 * positioned to the specified side (left/right)
 */
function calculateAnnotationPosition(
  from: Point,
  to: Point,
  enterSide: Side,
  position: 'left' | 'right',
  bulletCount: number
): { x: number; y: number } {
  const sideOffset = 20;
  const bulletHeight = bulletCount * 16;

  // For vertical connections - center along the Y axis
  if (enterSide === 'top' || enterSide === 'bottom') {
    const midY = (from.y + to.y) / 2;
    const midX = (from.x + to.x) / 2;

    if (position === 'right') {
      return {
        x: midX + sideOffset,
        y: midY - bulletHeight / 2 + 8,
      };
    } else {
      return {
        x: midX - sideOffset,
        y: midY - bulletHeight / 2 + 8,
      };
    }
  }

  // For horizontal connections - center along the X axis
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;

  if (position === 'right') {
    return {
      x: midX,
      y: midY + sideOffset,
    };
  } else {
    return {
      x: midX,
      y: midY - sideOffset - bulletHeight,
    };
  }
}

export function Connection({
  from,
  to,
  exitSide,
  enterSide,
  style,
  label,
  annotation,
}: ConnectionProps) {
  const theme = diagramTheme.connections[style];
  const path = generateCurvedPath(from, to, exitSide, enterSide, diagramTheme.arrow.cornerRadius);

  // Use global marker ID (defined at SVG root level in DiagramRenderer)
  const markerId = `arrow-marker-${style}`;

  // Calculate label position if needed
  const labelInfo = label ? calculateLabelPosition(from, to, exitSide) : null;

  // Calculate annotation position if needed
  const annotationPos = annotation
    ? calculateAnnotationPosition(from, to, enterSide, annotation.position, annotation.bullets.length)
    : null;

  return (
    <g className="diagram-connection">
      {/* Connection path - uses global marker from DiagramRenderer defs */}
      <path
        d={path}
        fill="none"
        stroke={theme.stroke}
        strokeWidth={theme.strokeWidth}
        strokeDasharray={theme.dashArray}
        markerEnd={`url(#${markerId})`}
      />

      {/* Connection label - positioned to the side of the line */}
      {label && labelInfo && (
        <text
          x={labelInfo.x}
          y={labelInfo.y}
          fill={diagramTheme.colors.textMuted}
          fontSize={diagramTheme.text.connectionLabel.fontSize}
          fontFamily={diagramTheme.text.connectionLabel.fontFamily}
          fontWeight={diagramTheme.text.connectionLabel.fontWeight}
          textAnchor={labelInfo.anchor}
          dominantBaseline="middle"
        >
          {label}
        </text>
      )}

      {/* Annotation bullets - positioned to the side */}
      {annotation && annotationPos && (
        <g>
          {annotation.bullets.map((bullet, idx) => (
            <text
              key={idx}
              x={annotationPos.x}
              y={annotationPos.y + idx * 16}
              fill={diagramTheme.colors.textMuted}
              fontSize={diagramTheme.text.annotation.fontSize}
              fontFamily={diagramTheme.text.annotation.fontFamily}
              textAnchor={annotation.position === 'right' ? 'start' : 'end'}
              dominantBaseline="middle"
            >
              • {bullet}
            </text>
          ))}
        </g>
      )}
    </g>
  );
}
