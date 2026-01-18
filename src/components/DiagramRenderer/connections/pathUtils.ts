import type { Point, Side, Bounds } from '../types';

const MIN_SEGMENT_LENGTH = 30; // Minimum length for any straight segment
const DEFAULT_CORNER_RADIUS = 16;

/**
 * Get the connection point on a node based on the side
 * Points are exactly on the node boundary - arrow marker handles its own positioning
 */
export function getConnectionPoint(bounds: Bounds, side: Side): Point {
  switch (side) {
    case 'top':
      return { x: bounds.x + bounds.width / 2, y: bounds.y };
    case 'right':
      return { x: bounds.x + bounds.width, y: bounds.y + bounds.height / 2 };
    case 'bottom':
      return { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height };
    case 'left':
      return { x: bounds.x, y: bounds.y + bounds.height / 2 };
  }
}

/**
 * Determine the best sides for connection based on relative positions
 */
export function determineSides(
  fromBounds: Bounds,
  toBounds: Bounds,
  preferredExitSide?: Side,
  preferredEnterSide?: Side
): { exitSide: Side; enterSide: Side } {
  if (preferredExitSide && preferredEnterSide) {
    return { exitSide: preferredExitSide, enterSide: preferredEnterSide };
  }

  const fromCenter = {
    x: fromBounds.x + fromBounds.width / 2,
    y: fromBounds.y + fromBounds.height / 2,
  };
  const toCenter = {
    x: toBounds.x + toBounds.width / 2,
    y: toBounds.y + toBounds.height / 2,
  };

  const dx = toCenter.x - fromCenter.x;
  const dy = toCenter.y - fromCenter.y;

  let exitSide: Side;
  let enterSide: Side;

  // Determine based on relative position with some hysteresis
  if (Math.abs(dx) > Math.abs(dy) * 1.2) {
    // Clearly horizontal relationship
    if (dx > 0) {
      exitSide = preferredExitSide || 'right';
      enterSide = preferredEnterSide || 'left';
    } else {
      exitSide = preferredExitSide || 'left';
      enterSide = preferredEnterSide || 'right';
    }
  } else if (Math.abs(dy) > Math.abs(dx) * 1.2) {
    // Clearly vertical relationship
    if (dy > 0) {
      exitSide = preferredExitSide || 'bottom';
      enterSide = preferredEnterSide || 'top';
    } else {
      exitSide = preferredExitSide || 'top';
      enterSide = preferredEnterSide || 'bottom';
    }
  } else {
    // Diagonal - choose based on which axis has more distance
    if (Math.abs(dx) >= Math.abs(dy)) {
      if (dx > 0) {
        exitSide = preferredExitSide || 'right';
        enterSide = preferredEnterSide || 'left';
      } else {
        exitSide = preferredExitSide || 'left';
        enterSide = preferredEnterSide || 'right';
      }
    } else {
      if (dy > 0) {
        exitSide = preferredExitSide || 'bottom';
        enterSide = preferredEnterSide || 'top';
      } else {
        exitSide = preferredExitSide || 'top';
        enterSide = preferredEnterSide || 'bottom';
      }
    }
  }

  return { exitSide, enterSide };
}

/**
 * Generate a rounded corner path segment
 */
function roundedCorner(
  current: Point,
  corner: Point,
  next: Point,
  radius: number
): string {
  // Calculate vectors
  const v1 = { x: current.x - corner.x, y: current.y - corner.y };
  const v2 = { x: next.x - corner.x, y: next.y - corner.y };

  // Normalize and get the distance we can move
  const len1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
  const len2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

  // Limit radius to half the shortest segment
  const effectiveRadius = Math.min(radius, len1 / 2, len2 / 2);

  if (effectiveRadius < 2) {
    // Too small for a curve, just go to the corner
    return `L ${corner.x} ${corner.y}`;
  }

  // Calculate the start and end points of the arc
  const startX = corner.x + (v1.x / len1) * effectiveRadius;
  const startY = corner.y + (v1.y / len1) * effectiveRadius;
  const endX = corner.x + (v2.x / len2) * effectiveRadius;
  const endY = corner.y + (v2.y / len2) * effectiveRadius;

  return `L ${startX} ${startY} Q ${corner.x} ${corner.y} ${endX} ${endY}`;
}

/**
 * Generate a curved SVG path between two points with proper minimum distances
 */
export function generateCurvedPath(
  from: Point,
  to: Point,
  exitSide: Side,
  enterSide: Side,
  cornerRadius: number = DEFAULT_CORNER_RADIUS
): string {
  const segments: string[] = [];
  segments.push(`M ${from.x} ${from.y}`);

  const dx = to.x - from.x;
  const dy = to.y - from.y;

  // Calculate minimum offset to ensure we have space for nice curves
  const minOffset = Math.max(MIN_SEGMENT_LENGTH, cornerRadius * 2);

  // Same side exits and entries need special handling
  if (exitSide === enterSide) {
    // Route around
    const offset = minOffset;
    if (exitSide === 'right' || exitSide === 'left') {
      const sign = exitSide === 'right' ? 1 : -1;
      const midX = Math.max(from.x, to.x) + offset * sign;
      const waypoints = [
        { x: from.x + offset * sign, y: from.y },
        { x: midX, y: from.y },
        { x: midX, y: to.y },
        { x: to.x + offset * sign, y: to.y },
      ];

      segments.push(roundedCorner(from, waypoints[0], waypoints[1], cornerRadius));
      segments.push(roundedCorner(waypoints[0], waypoints[1], waypoints[2], cornerRadius));
      segments.push(roundedCorner(waypoints[1], waypoints[2], waypoints[3], cornerRadius));
      segments.push(`L ${to.x} ${to.y}`);
    } else {
      const sign = exitSide === 'bottom' ? 1 : -1;
      const midY = Math.max(from.y, to.y) + offset * sign;
      const waypoints = [
        { x: from.x, y: from.y + offset * sign },
        { x: from.x, y: midY },
        { x: to.x, y: midY },
        { x: to.x, y: to.y + offset * sign },
      ];

      segments.push(roundedCorner(from, waypoints[0], waypoints[1], cornerRadius));
      segments.push(roundedCorner(waypoints[0], waypoints[1], waypoints[2], cornerRadius));
      segments.push(roundedCorner(waypoints[1], waypoints[2], waypoints[3], cornerRadius));
      segments.push(`L ${to.x} ${to.y}`);
    }
    return segments.join(' ');
  }

  // Horizontal to horizontal (right to left or left to right)
  if ((exitSide === 'right' && enterSide === 'left') || (exitSide === 'left' && enterSide === 'right')) {
    const goingRight = exitSide === 'right';

    if (Math.abs(dy) < 5) {
      // Straight horizontal
      segments.push(`L ${to.x} ${to.y}`);
    } else {
      // Need to bend - ensure minimum distance from both nodes
      const midX = goingRight
        ? Math.max(from.x + minOffset, to.x - minOffset, (from.x + to.x) / 2)
        : Math.min(from.x - minOffset, to.x + minOffset, (from.x + to.x) / 2);

      const corner1 = { x: midX, y: from.y };
      const corner2 = { x: midX, y: to.y };

      segments.push(roundedCorner(from, corner1, corner2, cornerRadius));
      segments.push(roundedCorner(corner1, corner2, to, cornerRadius));
      segments.push(`L ${to.x} ${to.y}`);
    }
  }
  // Vertical to vertical (bottom to top or top to bottom)
  else if ((exitSide === 'bottom' && enterSide === 'top') || (exitSide === 'top' && enterSide === 'bottom')) {
    const goingDown = exitSide === 'bottom';

    if (Math.abs(dx) < 5) {
      // Straight vertical
      segments.push(`L ${to.x} ${to.y}`);
    } else {
      // Need to bend
      const midY = goingDown
        ? Math.max(from.y + minOffset, to.y - minOffset, (from.y + to.y) / 2)
        : Math.min(from.y - minOffset, to.y + minOffset, (from.y + to.y) / 2);

      const corner1 = { x: from.x, y: midY };
      const corner2 = { x: to.x, y: midY };

      segments.push(roundedCorner(from, corner1, corner2, cornerRadius));
      segments.push(roundedCorner(corner1, corner2, to, cornerRadius));
      segments.push(`L ${to.x} ${to.y}`);
    }
  }
  // L-shaped connections (horizontal exit to vertical entry or vice versa)
  else if (exitSide === 'right' && enterSide === 'top') {
    const corner = { x: to.x, y: from.y };
    // Ensure minimum horizontal distance
    if (to.x - from.x < minOffset) {
      const midX = from.x + minOffset;
      const corner1 = { x: midX, y: from.y };
      const corner2 = { x: midX, y: to.y - minOffset };
      const corner3 = { x: to.x, y: to.y - minOffset };

      segments.push(roundedCorner(from, corner1, corner2, cornerRadius));
      segments.push(roundedCorner(corner1, corner2, corner3, cornerRadius));
      segments.push(roundedCorner(corner2, corner3, to, cornerRadius));
    } else {
      segments.push(roundedCorner(from, corner, to, cornerRadius));
    }
    segments.push(`L ${to.x} ${to.y}`);
  }
  else if (exitSide === 'right' && enterSide === 'bottom') {
    const corner = { x: to.x, y: from.y };
    if (to.x - from.x < minOffset || from.y - to.y < minOffset) {
      const midX = from.x + minOffset;
      const corner1 = { x: midX, y: from.y };
      const corner2 = { x: midX, y: to.y + minOffset };
      const corner3 = { x: to.x, y: to.y + minOffset };

      segments.push(roundedCorner(from, corner1, corner2, cornerRadius));
      segments.push(roundedCorner(corner1, corner2, corner3, cornerRadius));
      segments.push(roundedCorner(corner2, corner3, to, cornerRadius));
    } else {
      segments.push(roundedCorner(from, corner, to, cornerRadius));
    }
    segments.push(`L ${to.x} ${to.y}`);
  }
  else if (exitSide === 'left' && enterSide === 'top') {
    const corner = { x: to.x, y: from.y };
    if (from.x - to.x < minOffset) {
      const midX = from.x - minOffset;
      const corner1 = { x: midX, y: from.y };
      const corner2 = { x: midX, y: to.y - minOffset };
      const corner3 = { x: to.x, y: to.y - minOffset };

      segments.push(roundedCorner(from, corner1, corner2, cornerRadius));
      segments.push(roundedCorner(corner1, corner2, corner3, cornerRadius));
      segments.push(roundedCorner(corner2, corner3, to, cornerRadius));
    } else {
      segments.push(roundedCorner(from, corner, to, cornerRadius));
    }
    segments.push(`L ${to.x} ${to.y}`);
  }
  else if (exitSide === 'left' && enterSide === 'bottom') {
    const corner = { x: to.x, y: from.y };
    segments.push(roundedCorner(from, corner, to, cornerRadius));
    segments.push(`L ${to.x} ${to.y}`);
  }
  else if (exitSide === 'bottom' && enterSide === 'left') {
    const corner = { x: from.x, y: to.y };
    if (to.y - from.y < minOffset) {
      const midY = from.y + minOffset;
      const corner1 = { x: from.x, y: midY };
      const corner2 = { x: to.x - minOffset, y: midY };
      const corner3 = { x: to.x - minOffset, y: to.y };

      segments.push(roundedCorner(from, corner1, corner2, cornerRadius));
      segments.push(roundedCorner(corner1, corner2, corner3, cornerRadius));
      segments.push(roundedCorner(corner2, corner3, to, cornerRadius));
    } else {
      segments.push(roundedCorner(from, corner, to, cornerRadius));
    }
    segments.push(`L ${to.x} ${to.y}`);
  }
  else if (exitSide === 'bottom' && enterSide === 'right') {
    const corner = { x: from.x, y: to.y };
    segments.push(roundedCorner(from, corner, to, cornerRadius));
    segments.push(`L ${to.x} ${to.y}`);
  }
  else if (exitSide === 'top' && enterSide === 'left') {
    const corner = { x: from.x, y: to.y };
    segments.push(roundedCorner(from, corner, to, cornerRadius));
    segments.push(`L ${to.x} ${to.y}`);
  }
  else if (exitSide === 'top' && enterSide === 'right') {
    const corner = { x: from.x, y: to.y };
    segments.push(roundedCorner(from, corner, to, cornerRadius));
    segments.push(`L ${to.x} ${to.y}`);
  }
  else {
    // Fallback: S-curve using cubic bezier
    // Calculate control points for smooth S-curve
    let cp1: Point, cp2: Point;

    if (exitSide === 'right' || exitSide === 'left') {
      const offsetX = exitSide === 'right' ? minOffset : -minOffset;
      cp1 = { x: from.x + offsetX, y: from.y };
      cp2 = { x: to.x - (enterSide === 'left' ? minOffset : -minOffset), y: to.y };
    } else {
      const offsetY = exitSide === 'bottom' ? minOffset : -minOffset;
      cp1 = { x: from.x, y: from.y + offsetY };
      cp2 = { x: to.x, y: to.y - (enterSide === 'top' ? minOffset : -minOffset) };
    }

    segments.push(`C ${cp1.x} ${cp1.y} ${cp2.x} ${cp2.y} ${to.x} ${to.y}`);
  }

  return segments.join(' ');
}

/**
 * Get the position for a connection label
 * Positioned near the start of the connection, offset from the line
 */
export function getLabelPosition(
  from: Point,
  _to: Point,
  exitSide: Side,
  offset: number = 24
): Point {
  switch (exitSide) {
    case 'right':
      return { x: from.x + offset, y: from.y - 16 };
    case 'left':
      return { x: from.x - offset - 60, y: from.y - 16 };
    case 'bottom':
      return { x: from.x + 12, y: from.y + offset + 4 };
    case 'top':
      return { x: from.x + 12, y: from.y - offset - 8 };
  }
}

/**
 * Get the anchor position for a label (for text-anchor attribute)
 */
export function getLabelAnchor(exitSide: Side): 'start' | 'middle' | 'end' {
  switch (exitSide) {
    case 'right':
      return 'start';
    case 'left':
      return 'end';
    case 'bottom':
    case 'top':
      return 'start';
  }
}
