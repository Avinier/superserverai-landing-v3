// Diagram Schema Types

export type NodeType = 'box' | 'container' | 'pill';
export type NodeVariant = 'default' | 'highlight';
export type LabelStyle = 'normal' | 'code';
export type ConnectionStyle = 'primary' | 'secondary' | 'solid';
export type Side = 'top' | 'right' | 'bottom' | 'left';
export type LayoutDirection = 'horizontal' | 'vertical';
export type AnnotationPosition = 'left' | 'right';

export interface DiagramNode {
  id: string;
  label: string;
  type: NodeType;
  icon?: string;
  variant?: NodeVariant;
  labelStyle?: LabelStyle;
  subtitle?: string;
  bullets?: string[];
  children?: DiagramNode[];
  repeat?: number;
  layout?: LayoutDirection;
}

export interface ConnectionAnnotation {
  position: AnnotationPosition;
  bullets: string[];
}

export interface DiagramConnection {
  from: string;
  to: string | string[];
  label?: string;
  style: ConnectionStyle;
  exitSide?: Side;
  enterSide?: Side;
  annotation?: ConnectionAnnotation;
}

export interface DiagramSchema {
  title?: string;
  nodes: DiagramNode[];
  connections: DiagramConnection[];
}

export interface ParsedDiagram {
  diagram: DiagramSchema;
}

// Rendering types
export interface Point {
  x: number;
  y: number;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface NodePosition extends Bounds {
  id: string;
  parentId?: string;
}

export interface RenderedNode {
  node: DiagramNode;
  position: NodePosition;
  children?: RenderedNode[];
}

export interface ConnectionPath {
  from: Point;
  to: Point;
  fromSide: Side;
  toSide: Side;
  path: string;
}
