import type { DiagramSchema, DiagramNode, DiagramConnection } from './types';

/**
 * Parse a YAML string into a DiagramSchema
 * Uses a simple parser since js-yaml would be an external dependency
 */
export function parseDiagramYaml(yamlString: string): DiagramSchema {
  // For now, we expect the YAML to be imported as JSON via vite
  // This function validates and normalizes the structure
  try {
    const parsed = typeof yamlString === 'string' ? JSON.parse(yamlString) : yamlString;
    return validateSchema(parsed);
  } catch {
    throw new Error('Failed to parse diagram YAML');
  }
}

/**
 * Parse from a JSON/object structure (when imported directly)
 */
export function parseDiagramObject(obj: unknown): DiagramSchema {
  return validateSchema(obj as Record<string, unknown>);
}

/**
 * Validate and normalize the diagram schema
 */
function validateSchema(parsed: Record<string, unknown>): DiagramSchema {
  // Handle both { diagram: {...} } and direct schema
  const schema = (parsed.diagram ? parsed.diagram : parsed) as Record<string, unknown>;

  if (!schema.nodes || !Array.isArray(schema.nodes)) {
    throw new Error('Diagram must have a nodes array');
  }

  if (!schema.connections || !Array.isArray(schema.connections)) {
    throw new Error('Diagram must have a connections array');
  }

  // Validate and normalize nodes
  const nodes = schema.nodes.map((n) => validateNode(n as Record<string, unknown>));

  // Validate connections
  const connections = schema.connections.map((c) => validateConnection(c as Record<string, unknown>));

  return {
    title: schema.title as string | undefined,
    nodes,
    connections,
  };
}

/**
 * Validate a single node
 */
function validateNode(node: Record<string, unknown>): DiagramNode {
  if (!node.id || typeof node.id !== 'string') {
    throw new Error('Node must have a string id');
  }

  if (!node.label || typeof node.label !== 'string') {
    throw new Error(`Node ${node.id} must have a string label`);
  }

  // Validate type
  const validTypes = ['box', 'container', 'pill'];
  const nodeType = validTypes.includes(node.type as string) ? node.type as DiagramNode['type'] : 'box';

  // Validate variant
  const validVariants = ['default', 'highlight'];
  const nodeVariant = validVariants.includes(node.variant as string) ? node.variant as DiagramNode['variant'] : 'default';

  // Validate labelStyle
  const validLabelStyles = ['normal', 'code'];
  const labelStyle = validLabelStyles.includes(node.labelStyle as string) ? node.labelStyle as DiagramNode['labelStyle'] : 'normal';

  // Set defaults
  const normalized: DiagramNode = {
    id: node.id,
    label: node.label,
    type: nodeType,
    variant: nodeVariant,
    labelStyle: labelStyle,
    icon: node.icon as string | undefined,
    subtitle: node.subtitle as string | undefined,
    bullets: node.bullets as string[] | undefined,
    repeat: node.repeat as number | undefined,
    layout: node.layout as DiagramNode['layout'],
  };

  // Validate children recursively
  if (Array.isArray(node.children)) {
    normalized.children = node.children.map((child) => validateNode(child as Record<string, unknown>));
  }

  return normalized;
}

/**
 * Validate a single connection
 */
function validateConnection(conn: Record<string, unknown>): DiagramConnection {
  if (!conn.from || typeof conn.from !== 'string') {
    throw new Error('Connection must have a from string');
  }

  if (!conn.to) {
    throw new Error('Connection must have a to property');
  }

  // Validate style
  const validStyles = ['primary', 'secondary', 'solid'];
  const style = validStyles.includes(conn.style as string) ? conn.style as DiagramConnection['style'] : 'secondary';

  // Validate sides
  const validSides = ['top', 'right', 'bottom', 'left'];
  const exitSide = validSides.includes(conn.exitSide as string) ? conn.exitSide as DiagramConnection['exitSide'] : undefined;
  const enterSide = validSides.includes(conn.enterSide as string) ? conn.enterSide as DiagramConnection['enterSide'] : undefined;

  return {
    from: conn.from,
    to: conn.to as string | string[],
    label: conn.label as string | undefined,
    style,
    exitSide,
    enterSide,
    annotation: conn.annotation as DiagramConnection['annotation'],
  };
}

/**
 * Resolve connection targets (handle arrays and nested IDs)
 */
export function resolveConnectionTargets(
  to: string | string[],
  nodeIds: Set<string>
): string[] {
  const targets = Array.isArray(to) ? to : [to];

  return targets.map((target) => {
    // Check if target exists directly
    if (nodeIds.has(target)) return target;

    // Check for nested reference (parent.child)
    if (target.includes('.')) {
      const childId = target.split('.').pop()!;
      if (nodeIds.has(childId)) return childId;
    }

    // Return as-is, layout will handle missing references
    return target;
  });
}

/**
 * Collect all node IDs including children and repeated nodes
 */
export function collectNodeIds(nodes: DiagramNode[]): Set<string> {
  const ids = new Set<string>();

  function collect(nodeList: DiagramNode[]) {
    for (const node of nodeList) {
      if (node.repeat && node.repeat > 1) {
        for (let i = 1; i <= node.repeat; i++) {
          ids.add(`${node.id}_${i}`);
        }
      } else {
        ids.add(node.id);
      }

      if (node.children) {
        collect(node.children);
      }
    }
  }

  collect(nodes);
  return ids;
}
