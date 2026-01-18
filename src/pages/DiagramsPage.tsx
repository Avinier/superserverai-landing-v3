import { useState, useEffect } from 'react';
import { DiagramRenderer, parseDiagramObject } from '../components/DiagramRenderer';

// Import all diagram JSON files from the diagrams folder
const diagramModules = import.meta.glob('../diagrams/*.json', { eager: true });

interface DiagramEntry {
  name: string;
  schema: ReturnType<typeof parseDiagramObject>;
}

export function DiagramsPage() {
  const [diagrams, setDiagrams] = useState<DiagramEntry[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const entries: DiagramEntry[] = [];

    for (const [path, module] of Object.entries(diagramModules)) {
      const fileName = path.split('/').pop()?.replace('.json', '') || 'unknown';
      try {
        const json = module as { default?: unknown } | { diagram?: unknown };
        const data = 'default' in json ? json.default : json;
        const schemaData = (data as { diagram?: unknown }).diagram || data;
        const schema = parseDiagramObject(schemaData);
        entries.push({ name: fileName, schema });
      } catch (e) {
        console.error(`Failed to parse ${fileName}:`, e);
      }
    }

    setDiagrams(entries);
    if (entries.length > 0 && !selected) {
      setSelected(entries[0].name);
    }
  }, []);

  const selectedDiagram = diagrams.find((d) => d.name === selected);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-surface px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="font-title text-xl text-text">Diagram Preview</h1>
          <a
            href="/"
            className="text-sm text-text-muted transition-colors hover:text-text"
          >
            Back to Home
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-6">
        {diagrams.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface p-12 text-center">
            <p className="text-text-muted">No diagrams found in src/diagrams/</p>
            <p className="mt-2 text-sm text-text-muted">
              Run <code className="rounded bg-background px-2 py-1">/diagram "your description"</code> to generate one
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
            {/* Sidebar */}
            <div className="rounded-lg border border-border bg-surface p-4">
              <h2 className="mb-3 text-sm font-medium text-text-muted">Diagrams</h2>
              <div className="space-y-1">
                {diagrams.map((d) => (
                  <button
                    key={d.name}
                    onClick={() => setSelected(d.name)}
                    className={`w-full rounded px-3 py-2 text-left text-sm transition-colors ${
                      selected === d.name
                        ? 'bg-primary text-text'
                        : 'text-text-muted hover:bg-surface-elevated hover:text-text'
                    }`}
                  >
                    {d.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Canvas */}
            <div className="rounded-lg border border-border bg-surface p-4">
              {selectedDiagram ? (
                <div className="overflow-auto">
                  <DiagramRenderer
                    schema={selectedDiagram.schema}
                    autoSize={true}
                  />
                </div>
              ) : (
                <p className="p-8 text-center text-text-muted">Select a diagram</p>
              )}
            </div>
          </div>
        )}

        {/* Usage instructions */}
        <div className="mt-8 rounded-lg border border-border bg-surface p-6">
          <h2 className="mb-3 font-title text-lg text-text">Generate New Diagrams</h2>
          <p className="mb-4 text-sm text-text-muted">
            Use the <code className="rounded bg-background px-2 py-1">/diagram</code> skill in Claude Code:
          </p>
          <pre className="overflow-x-auto rounded bg-background p-4 text-sm text-text-muted">
{`/diagram my-architecture "App connects to Redis for caching and Postgres for data.
Data replicates to ClickHouse via CDC for analytics."`}
          </pre>
          <p className="mt-4 text-sm text-text-muted">
            The diagram will appear here automatically after generation.
          </p>
        </div>
      </div>
    </div>
  );
}
