/**
 * Abstract Infrastructure Background Animation
 * - Interactive grid with pulse wave reveal effect
 * - Random pulse visibility waves across the grid
 * - Data flow animation through grid lines
 *
 * Adapted for dark theme landing page
 */

import { useEffect, useRef, useState, useCallback } from 'react';

interface GridNode {
  id: number;
  x: number;
  y: number;
  row: number;
  col: number;
}

interface PulseWave {
  id: number;
  x: number;
  y: number;
  startTime: number;
  duration: number;
  maxRadius: number;
  color: 'primary' | 'secondary';
}

interface DataFlow {
  id: number;
  startNode: GridNode;
  endNode: GridNode;
  progress: number;
  speed: number;
  direction: 'horizontal' | 'vertical';
  color: 'primary' | 'secondary';
}

const AbstractBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const [isClient, setIsClient] = useState(false);
  const pulseWavesRef = useRef<PulseWave[]>([]);
  const dataFlowsRef = useRef<DataFlow[]>([]);
  const gridNodesRef = useRef<GridNode[]>([]);
  const lastPulseTimeRef = useRef(0);

  const GRID_SPACING = 60;
  const PULSE_RADIUS = 250;

  // Generate grid nodes
  const generateGrid = useCallback((width: number, height: number) => {
    const nodes: GridNode[] = [];
    const cols = Math.ceil(width / GRID_SPACING) + 2;
    const rows = Math.ceil(height / GRID_SPACING) + 2;

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        nodes.push({
          id: col * rows + row,
          x: col * GRID_SPACING,
          y: row * GRID_SPACING,
          row,
          col,
        });
      }
    }
    return nodes;
  }, []);

  // Create random pulse wave with its own color
  const createPulseWave = useCallback((width: number, height: number): PulseWave => {
    const color: 'primary' | 'secondary' = Math.random() > 0.5 ? 'primary' : 'secondary';
    return {
      id: Date.now() + Math.random(),
      x: Math.random() * width,
      y: Math.random() * height,
      startTime: Date.now(),
      duration: 2000 + Math.random() * 1500,
      maxRadius: PULSE_RADIUS + Math.random() * 100,
      color,
    };
  }, []);

  // Create data flow along grid lines
  const createDataFlow = useCallback((nodes: GridNode[], width: number, height: number): DataFlow => {
    const direction: 'horizontal' | 'vertical' = Math.random() > 0.5 ? 'horizontal' : 'vertical';
    const cols = Math.ceil(width / GRID_SPACING) + 2;
    const rows = Math.ceil(height / GRID_SPACING) + 2;

    let startNode: GridNode;
    let endNode: GridNode;

    if (direction === 'horizontal') {
      const row = Math.floor(Math.random() * rows);
      const startCol = Math.random() > 0.5 ? 0 : cols - 1;
      const endCol = startCol === 0 ? cols - 1 : 0;
      startNode = nodes.find(n => n.row === row && n.col === startCol) || nodes[0];
      endNode = nodes.find(n => n.row === row && n.col === endCol) || nodes[nodes.length - 1];
    } else {
      const col = Math.floor(Math.random() * cols);
      const startRow = Math.random() > 0.5 ? 0 : rows - 1;
      const endRow = startRow === 0 ? rows - 1 : 0;
      startNode = nodes.find(n => n.col === col && n.row === startRow) || nodes[0];
      endNode = nodes.find(n => n.col === col && n.row === endRow) || nodes[nodes.length - 1];
    }

    return {
      id: Date.now() + Math.random(),
      startNode,
      endNode,
      progress: 0,
      speed: 0.003 + Math.random() * 0.004,
      direction,
      color: Math.random() > 0.5 ? 'primary' : 'secondary',
    };
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { width, height } = dimensions;
    ctx.clearRect(0, 0, width, height);

    const now = Date.now();
    const nodes = gridNodesRef.current;

    // Add new pulse waves periodically
    if (now - lastPulseTimeRef.current > 1500 + Math.random() * 2000) {
      pulseWavesRef.current.push(createPulseWave(width, height));
      if (pulseWavesRef.current.length > 5) {
        pulseWavesRef.current.shift();
      }
      lastPulseTimeRef.current = now;
    }

    // Add new data flows periodically
    if (dataFlowsRef.current.length < 4 && Math.random() < 0.02) {
      dataFlowsRef.current.push(createDataFlow(nodes, width, height));
    }

    // Calculate visibility and color for each node based on pulse waves
    const getNodeStyle = (node: GridNode): { opacity: number; color: 'primary' | 'secondary' } => {
      let opacity = 0;
      let dominantColor: 'primary' | 'secondary' = 'primary';
      let maxContribution = 0;

      // Pulse wave effects - each pulse has its own color
      for (const pulse of pulseWavesRef.current) {
        const elapsed = now - pulse.startTime;
        const progress = elapsed / pulse.duration;

        if (progress <= 1) {
          const currentRadius = progress * pulse.maxRadius;
          const distToPulse = Math.sqrt(
            Math.pow(node.x - pulse.x, 2) + Math.pow(node.y - pulse.y, 2)
          );

          // Ring effect - visible near the wave edge
          const ringWidth = 80;
          const distFromRing = Math.abs(distToPulse - currentRadius);

          if (distFromRing < ringWidth) {
            const fadeInOut = progress < 0.1 ? progress / 0.1 :
                             progress > 0.7 ? (1 - progress) / 0.3 : 1;
            const ringOpacity = (1 - distFromRing / ringWidth) * 0.6 * fadeInOut;

            // Track which pulse contributes most to this node's visibility
            if (ringOpacity > maxContribution) {
              maxContribution = ringOpacity;
              dominantColor = pulse.color;
            }
            opacity = Math.max(opacity, ringOpacity);
          }
        }
      }

      return { opacity, color: dominantColor };
    };

    // Draw grid lines with dynamic opacity (dark theme colors)
    ctx.lineWidth = 0.8;

    for (const node of nodes) {
      const { opacity, color } = getNodeStyle(node);
      if (opacity < 0.01) continue;

      // Find connected nodes (right and down)
      const rightNode = nodes.find(n => n.row === node.row && n.col === node.col + 1);
      const downNode = nodes.find(n => n.col === node.col && n.row === node.row + 1);

      // Draw lines to connected nodes - color based on pulse wave
      if (rightNode) {
        const rightStyle = getNodeStyle(rightNode);
        const lineOpacity = Math.min(opacity, rightStyle.opacity) * 2;
        if (lineOpacity > 0.01) {
          // Use the node's color from its dominant pulse wave
          ctx.strokeStyle = color === 'primary'
            ? `rgba(37, 75, 241, ${lineOpacity * 0.4})`
            : `rgba(255, 60, 91, ${lineOpacity * 0.35})`;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(rightNode.x, rightNode.y);
          ctx.stroke();
        }
      }

      if (downNode) {
        const downStyle = getNodeStyle(downNode);
        const lineOpacity = Math.min(opacity, downStyle.opacity) * 2;
        if (lineOpacity > 0.01) {
          ctx.strokeStyle = color === 'primary'
            ? `rgba(37, 75, 241, ${lineOpacity * 0.4})`
            : `rgba(255, 60, 91, ${lineOpacity * 0.35})`;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(downNode.x, downNode.y);
          ctx.stroke();
        }
      }

      // Draw node dot with pulse wave color
      if (opacity > 0.05) {
        ctx.fillStyle = color === 'primary'
          ? `rgba(37, 75, 241, ${opacity})`
          : `rgba(255, 60, 91, ${opacity * 0.9})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw data flows (moving highlights along grid lines) - duo colors
    ctx.lineWidth = 2.5;
    dataFlowsRef.current = dataFlowsRef.current.filter(flow => {
      flow.progress += flow.speed;

      if (flow.progress >= 1) return false;

      const currentX = flow.startNode.x + (flow.endNode.x - flow.startNode.x) * flow.progress;
      const currentY = flow.startNode.y + (flow.endNode.y - flow.startNode.y) * flow.progress;

      // Draw glowing segment with duo colors
      const segmentLength = 120;
      const gradient = ctx.createLinearGradient(
        currentX - (flow.direction === 'horizontal' ? segmentLength / 2 : 0),
        currentY - (flow.direction === 'vertical' ? segmentLength / 2 : 0),
        currentX + (flow.direction === 'horizontal' ? segmentLength / 2 : 0),
        currentY + (flow.direction === 'vertical' ? segmentLength / 2 : 0)
      );

      // Primary: #254bf1 (37, 75, 241) | Secondary: #FF3C5B (255, 60, 91)
      if (flow.color === 'primary') {
        gradient.addColorStop(0, 'rgba(37, 75, 241, 0)');
        gradient.addColorStop(0.3, 'rgba(37, 75, 241, 0.35)');
        gradient.addColorStop(0.5, 'rgba(37, 75, 241, 0.6)');
        gradient.addColorStop(0.7, 'rgba(37, 75, 241, 0.35)');
        gradient.addColorStop(1, 'rgba(37, 75, 241, 0)');
      } else {
        gradient.addColorStop(0, 'rgba(255, 60, 91, 0)');
        gradient.addColorStop(0.3, 'rgba(255, 60, 91, 0.3)');
        gradient.addColorStop(0.5, 'rgba(255, 60, 91, 0.5)');
        gradient.addColorStop(0.7, 'rgba(255, 60, 91, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 60, 91, 0)');
      }

      ctx.strokeStyle = gradient;
      ctx.beginPath();

      if (flow.direction === 'horizontal') {
        ctx.moveTo(currentX - segmentLength / 2, currentY);
        ctx.lineTo(currentX + segmentLength / 2, currentY);
      } else {
        ctx.moveTo(currentX, currentY - segmentLength / 2);
        ctx.lineTo(currentX, currentY + segmentLength / 2);
      }
      ctx.stroke();

      // Draw leading dot with matching color
      ctx.fillStyle = flow.color === 'primary'
        ? 'rgba(37, 75, 241, 0.8)'
        : 'rgba(255, 60, 91, 0.7)';
      ctx.beginPath();
      ctx.arc(currentX, currentY, 3, 0, Math.PI * 2);
      ctx.fill();

      return true;
    });

    // Clean up old pulse waves
    pulseWavesRef.current = pulseWavesRef.current.filter(
      pulse => now - pulse.startTime < pulse.duration
    );

    animationRef.current = requestAnimationFrame(animate);
  }, [dimensions, createPulseWave, createDataFlow]);

  // Setup
  useEffect(() => {
    setIsClient(true);

    const updateDimensions = () => {
      if (containerRef.current) {
        const newDimensions = {
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        };
        setDimensions(newDimensions);
        gridNodesRef.current = generateGrid(newDimensions.width, newDimensions.height);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [generateGrid]);

  // Start animation
  useEffect(() => {
    if (isClient) {
      gridNodesRef.current = generateGrid(dimensions.width, dimensions.height);
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isClient, dimensions, animate, generateGrid]);

  if (!isClient) {
    return <div className="fixed inset-0 overflow-hidden pointer-events-none" />;
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Canvas for grid animation */}
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0"
      />

      {/* Subtle vignette effect for dark theme */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(10, 10, 10, 0.6) 100%)'
        }}
      />
    </div>
  );
};

export default AbstractBackground;
