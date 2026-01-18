import { DiagramRenderer, parseDiagramObject } from './DiagramRenderer';
import postgresAnalyticsJson from '../diagrams/postgres-analytics.json';

// Parse and validate the JSON schema
const postgresAnalytics = parseDiagramObject(postgresAnalyticsJson.diagram);

export function DiagramDemo() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 font-title text-3xl text-text">
          Diagram Renderer Demo
        </h1>

        <div className="rounded-lg border border-border bg-surface p-4">
          <DiagramRenderer
            schema={postgresAnalytics}
            autoSize={true}
            className="mx-auto"
          />
        </div>

        <div className="mt-8 rounded-lg border border-border bg-surface p-6">
          <h2 className="mb-4 font-title text-xl text-text">Usage</h2>
          <pre className="overflow-x-auto rounded bg-background p-4 text-sm text-text-muted">
{`import { DiagramRenderer } from '@/components/DiagramRenderer';
import schema from '@/diagrams/postgres-analytics.json';

<DiagramRenderer
  schema={schema.diagram}
  autoSize={true}
/>`}
          </pre>
        </div>

        <div className="mt-8 rounded-lg border border-border bg-surface p-6">
          <h2 className="mb-4 font-title text-xl text-text">Generate with Claude</h2>
          <p className="text-text-muted">
            Use the <code className="rounded bg-background px-2 py-1">/diagram</code> skill:
          </p>
          <pre className="mt-4 overflow-x-auto rounded bg-background p-4 text-sm text-text-muted">
{`/diagram my-arch "App connects to Redis for caching and Postgres for data.
Postgres replicates to ClickHouse via CDC for analytics."`}
          </pre>
        </div>
      </div>
    </div>
  );
}
