// Diagram Theme - Smart extraction from CSS variables with intelligent fallbacks

/**
 * Get a CSS variable value from the document
 */
function getCSSVar(name: string): string | null {
  if (typeof window === 'undefined') return null;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || null;
}

/**
 * Try multiple CSS variable names and return the first one that exists
 */
function findCSSVar(names: string[], fallback: string): string {
  for (const name of names) {
    const value = getCSSVar(name);
    if (value) return value;
  }
  return fallback;
}

/**
 * Detect primary brand color by checking common naming conventions
 */
function detectPrimaryColor(): string {
  // Check common naming patterns for primary/brand color (ordered by specificity)
  const candidates = [
    // Explicit primary naming
    '--color-primary',
    '--primary',
    '--primary-color',
    '--brand-color',
    '--brand',
    '--accent',
    '--accent-color',
    // Tailwind patterns
    '--tw-color-primary',
    '--colors-primary',
    // Chakra/MUI patterns
    '--chakra-colors-primary-500',
    '--mui-palette-primary-main',
    // Generic blue (common primary)
    '--color-blue',
    '--blue',
    '--blue-500',
    '--color-blue-500',
  ];

  for (const name of candidates) {
    const value = getCSSVar(name);
    if (value && isValidColor(value)) return value;
  }

  // Fallback: a nice blue
  return '#254bf1';
}

/**
 * Detect secondary/accent color
 */
function detectSecondaryColor(): string {
  const candidates = [
    '--color-secondary',
    '--secondary',
    '--secondary-color',
    '--color-accent',
    '--accent',
    '--highlight',
    '--color-highlight',
    // Tailwind patterns
    '--tw-color-secondary',
    '--colors-secondary',
    // Common accent colors
    '--color-orange',
    '--orange',
    '--color-red',
    '--red',
  ];

  for (const name of candidates) {
    const value = getCSSVar(name);
    if (value && isValidColor(value)) return value;
  }

  return '#FF3C5B';
}

/**
 * Detect background color
 */
function detectBackgroundColor(): string {
  const candidates = [
    '--color-background',
    '--background',
    '--bg',
    '--color-bg',
    '--background-color',
    '--body-bg',
    '--color-body',
    // Dark theme patterns
    '--dark-bg',
    '--color-dark',
    // Tailwind
    '--tw-bg-opacity',
  ];

  for (const name of candidates) {
    const value = getCSSVar(name);
    if (value && isValidColor(value)) return value;
  }

  // Check if body has a background
  if (typeof window !== 'undefined') {
    const bodyBg = getComputedStyle(document.body).backgroundColor;
    if (bodyBg && bodyBg !== 'rgba(0, 0, 0, 0)' && bodyBg !== 'transparent') {
      return bodyBg;
    }
  }

  return '#0a0a0a';
}

/**
 * Detect surface/card color
 */
function detectSurfaceColor(): string {
  const candidates = [
    '--color-surface',
    '--surface',
    '--card',
    '--color-card',
    '--card-bg',
    '--color-card-bg',
    '--surface-color',
    '--panel',
    '--color-panel',
    // Elevated variants
    '--color-surface-elevated',
    '--surface-elevated',
  ];

  for (const name of candidates) {
    const value = getCSSVar(name);
    if (value && isValidColor(value)) return value;
  }

  return '#141414';
}

/**
 * Detect border color
 */
function detectBorderColor(): string {
  const candidates = [
    '--color-border',
    '--border',
    '--border-color',
    '--divider',
    '--color-divider',
    '--separator',
    '--color-grey',
    '--grey',
    '--gray',
    '--color-gray',
  ];

  for (const name of candidates) {
    const value = getCSSVar(name);
    if (value && isValidColor(value)) return value;
  }

  return '#2a2a2a';
}

/**
 * Detect primary text color
 */
function detectTextColor(): string {
  const candidates = [
    '--color-text',
    '--text',
    '--text-color',
    '--foreground',
    '--color-foreground',
    '--body-color',
    '--font-color',
  ];

  for (const name of candidates) {
    const value = getCSSVar(name);
    if (value && isValidColor(value)) return value;
  }

  // Check body text color
  if (typeof window !== 'undefined') {
    const bodyColor = getComputedStyle(document.body).color;
    if (bodyColor) return bodyColor;
  }

  return '#fefdfa';
}

/**
 * Detect muted/secondary text color
 */
function detectTextMutedColor(): string {
  const candidates = [
    '--color-text-muted',
    '--text-muted',
    '--muted',
    '--color-muted',
    '--text-secondary',
    '--color-text-secondary',
    '--text-subtle',
    '--color-subtle',
    '--grey',
    '--color-grey',
  ];

  for (const name of candidates) {
    const value = getCSSVar(name);
    if (value && isValidColor(value)) return value;
  }

  return '#a0a0a0';
}

/**
 * Detect title/heading font
 */
function detectTitleFont(): string {
  const candidates = [
    '--font-title',
    '--font-heading',
    '--font-display',
    '--heading-font',
    '--title-font',
    '--font-family-heading',
    '--font-family-display',
    // Tailwind
    '--font-sans',
    '--font-serif',
  ];

  for (const name of candidates) {
    const value = getCSSVar(name);
    if (value && value.length > 0) return value;
  }

  // Try to detect from h1 element
  if (typeof window !== 'undefined') {
    const h1 = document.querySelector('h1');
    if (h1) {
      const fontFamily = getComputedStyle(h1).fontFamily;
      if (fontFamily) return fontFamily;
    }
  }

  return "'Tiempos', Georgia, serif";
}

/**
 * Detect body/content font
 */
function detectContentFont(): string {
  const candidates = [
    '--font-content',
    '--font-body',
    '--font-sans',
    '--body-font',
    '--font-family-body',
    '--font-family-sans',
    '--font-base',
  ];

  for (const name of candidates) {
    const value = getCSSVar(name);
    if (value && value.length > 0) return value;
  }

  // Try to detect from body
  if (typeof window !== 'undefined') {
    const fontFamily = getComputedStyle(document.body).fontFamily;
    if (fontFamily) return fontFamily;
  }

  return "'Geist', system-ui, sans-serif";
}

/**
 * Detect monospace/code font
 */
function detectMonoFont(): string {
  const candidates = [
    '--font-mono',
    '--font-code',
    '--font-monospace',
    '--code-font',
    '--font-family-mono',
    '--font-family-code',
  ];

  for (const name of candidates) {
    const value = getCSSVar(name);
    if (value && value.length > 0) return value;
  }

  // Try to detect from code element
  if (typeof window !== 'undefined') {
    const code = document.querySelector('code');
    if (code) {
      const fontFamily = getComputedStyle(code).fontFamily;
      if (fontFamily) return fontFamily;
    }
  }

  return "'Montserrat', 'Fira Code', monospace";
}

/**
 * Check if a string is a valid CSS color
 */
function isValidColor(color: string): boolean {
  if (!color) return false;
  // Hex colors
  if (/^#([0-9A-Fa-f]{3}){1,2}$/.test(color)) return true;
  // RGB/RGBA
  if (/^rgba?\(/.test(color)) return true;
  // HSL/HSLA
  if (/^hsla?\(/.test(color)) return true;
  // Named colors (basic check)
  if (/^[a-z]+$/i.test(color)) return true;
  return false;
}

/**
 * Create the diagram theme with smart detection
 */
export function createDiagramTheme() {
  // Detect colors
  const primary = detectPrimaryColor();
  const secondary = detectSecondaryColor();
  const background = detectBackgroundColor();
  const surface = detectSurfaceColor();
  const border = detectBorderColor();
  const text = detectTextColor();
  const textMuted = detectTextMutedColor();

  // Detect elevated surface (slightly lighter than surface)
  const surfaceElevated = findCSSVar(
    ['--color-surface-elevated', '--surface-elevated', '--card-hover', '--surface-hover'],
    '#1a1a1a'
  );

  // Detect fonts
  const fontTitle = detectTitleFont();
  const fontContent = detectContentFont();
  const fontMono = detectMonoFont();

  return {
    // Canvas
    background,

    // Colors (for direct access)
    colors: {
      primary,
      secondary,
      text,
      textMuted,
      border,
      surface,
      surfaceElevated,
    },

    // Node styles - thin borders like reference
    nodes: {
      default: {
        fill: surface,
        stroke: border,
        strokeWidth: 0.5,
        radius: 6,
        text: text,
        textMuted: textMuted,
      },
      highlight: {
        fill: surface,
        stroke: primary, // Uses detected primary color
        strokeWidth: 1,
        radius: 6,
        text: text,
        textMuted: textMuted,
      },
      pill: {
        fill: surfaceElevated,
        stroke: border,
        strokeWidth: 0.5,
        radius: 16,
        text: text,
        textMuted: textMuted,
      },
    },

    // Connection styles - thinner like reference
    connections: {
      primary: {
        stroke: primary, // Uses detected primary color
        strokeWidth: 1,
        dashArray: '5 3',
        arrowColor: primary,
      },
      secondary: {
        stroke: textMuted,
        strokeWidth: 1,
        dashArray: '4 3',
        arrowColor: textMuted,
      },
      solid: {
        stroke: textMuted,
        strokeWidth: 1,
        dashArray: 'none',
        arrowColor: textMuted,
      },
    },

    // Typography - compact sizing
    text: {
      title: {
        fontSize: 12,
        fontWeight: 600,
        fontFamily: fontTitle,
      },
      label: {
        fontSize: 11,
        fontWeight: 500,
        fontFamily: fontContent,
      },
      subtitle: {
        fontSize: 9,
        fontWeight: 400,
        fontFamily: fontContent,
      },
      code: {
        fontSize: 10,
        fontWeight: 500,
        fontFamily: fontMono,
      },
      bullet: {
        fontSize: 9,
        fontWeight: 400,
        fontFamily: fontContent,
      },
      connectionLabel: {
        fontSize: 9,
        fontWeight: 500,
        fontFamily: fontContent,
      },
      annotation: {
        fontSize: 8,
        fontWeight: 400,
        fontFamily: fontContent,
      },
    },

    // Spacing - tighter, cleaner like reference
    spacing: {
      nodePadding: 10,
      nodeGap: 40,
      bulletGap: 3,
      iconSize: 14,
      iconGap: 6,
      childIndent: 10,
      childGap: 8,
      annotationOffset: 16,
      minConnectionDistance: 24,
    },

    // Arrow settings - smaller, cleaner
    arrow: {
      size: 6,
      cornerRadius: 12,
    },
  };
}

// Create theme instance (will re-detect on each call if needed)
export const diagramTheme = createDiagramTheme();

export type DiagramTheme = ReturnType<typeof createDiagramTheme>;

/**
 * Force re-detection of theme (useful after CSS changes)
 */
export function refreshTheme(): DiagramTheme {
  return createDiagramTheme();
}
