const GatewaySection = () => {
  const aiModels = [
    { name: 'GPT-4', provider: 'OpenAI' },
    { name: 'Claude', provider: 'Anthropic' },
    { name: 'Gemini', provider: 'Google' },
    { name: 'Llama', provider: 'Meta' },
    { name: 'Mistral', provider: 'Mistral' },
    { name: 'Command', provider: 'Cohere' },
  ];

  const observabilityMetrics = [
    { label: 'Requests', value: '1.2M', change: '+12%' },
    { label: 'Avg Latency', value: '23ms', change: '-8%' },
    { label: 'Success Rate', value: '99.9%', change: '+0.1%' },
    { label: 'Token Usage', value: '847K', change: '+5%' },
  ];

  return (
    <section className="py-20 md:py-28 bg-surface">
      <div className="mx-auto max-w-7xl px-6">
        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1: AI Gateway */}
          <div className="rounded-2xl border border-border bg-background p-6 md:p-8 card-hover">
            <h3 className="font-title text-xl md:text-2xl font-medium text-text mb-2">
              One gateway. Hundreds of AI models.
            </h3>
            <p className="text-text-muted mb-6">
              Unified API for all major AI providers. Switch models without changing your code.
            </p>

            {/* Globe/World Illustration */}
            <div className="flex items-center justify-center py-6">
              <div className="relative w-56 h-56">
                {/* Concentric circles */}
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  {/* Outer glow */}
                  <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary opacity-20" />
                  <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary opacity-30" />
                  <circle cx="100" cy="100" r="65" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary opacity-40" />
                  <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary opacity-50" />

                  {/* Central hub */}
                  <circle cx="100" cy="100" r="30" fill="currentColor" className="text-primary opacity-20" />
                  <circle cx="100" cy="100" r="20" fill="currentColor" className="text-primary opacity-40" />
                  <circle cx="100" cy="100" r="10" fill="currentColor" className="text-primary" />

                  {/* Orbiting dots representing models */}
                  <circle cx="100" cy="20" r="6" fill="currentColor" className="text-text">
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 100 100"
                      to="360 100 100"
                      dur="20s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx="180" cy="100" r="5" fill="currentColor" className="text-secondary">
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="90 100 100"
                      to="450 100 100"
                      dur="25s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx="100" cy="180" r="5" fill="currentColor" className="text-text-muted">
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="180 100 100"
                      to="540 100 100"
                      dur="30s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx="20" cy="100" r="4" fill="currentColor" className="text-primary">
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="270 100 100"
                      to="630 100 100"
                      dur="35s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </svg>
              </div>
            </div>

            {/* Model badges */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {aiModels.map((model) => (
                <div
                  key={model.name}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border transition-all duration-300 hover:border-primary/30 hover:bg-primary/10 cursor-default"
                >
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse-subtle"></div>
                  <span className="text-xs text-text">{model.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Observability */}
          <div className="rounded-2xl border border-border bg-background p-6 md:p-8 card-hover">
            <h3 className="font-title text-xl md:text-2xl font-medium text-text mb-2">
              Embedded LLM observability
            </h3>
            <p className="text-text-muted mb-6">
              Monitor every request, track costs, debug issues. Full visibility into your AI operations.
            </p>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {observabilityMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="p-4 rounded-xl bg-surface border border-border transition-all duration-300 hover:border-primary/20 hover:-translate-y-1"
                >
                  <p className="text-xs text-text-muted mb-1">{metric.label}</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-text">{metric.value}</span>
                    <span className={`text-xs ${metric.change.startsWith('+') ? 'text-green-500' : 'text-secondary'}`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chart Illustration */}
            <div className="h-32 rounded-lg bg-surface border border-border p-4 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 300 80" preserveAspectRatio="none">
                {/* Grid lines */}
                <line x1="0" y1="20" x2="300" y2="20" stroke="currentColor" strokeWidth="0.5" className="text-border" />
                <line x1="0" y1="40" x2="300" y2="40" stroke="currentColor" strokeWidth="0.5" className="text-border" />
                <line x1="0" y1="60" x2="300" y2="60" stroke="currentColor" strokeWidth="0.5" className="text-border" />

                {/* Area chart */}
                <path
                  d="M0,60 L30,50 L60,55 L90,40 L120,45 L150,30 L180,35 L210,25 L240,30 L270,20 L300,25 L300,80 L0,80 Z"
                  fill="currentColor"
                  className="text-primary opacity-20"
                />
                {/* Line chart */}
                <path
                  d="M0,60 L30,50 L60,55 L90,40 L120,45 L150,30 L180,35 L210,25 L240,30 L270,20 L300,25"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-primary"
                />
                {/* Data points */}
                <circle cx="0" cy="60" r="3" fill="currentColor" className="text-primary" />
                <circle cx="90" cy="40" r="3" fill="currentColor" className="text-primary" />
                <circle cx="150" cy="30" r="3" fill="currentColor" className="text-primary" />
                <circle cx="210" cy="25" r="3" fill="currentColor" className="text-primary" />
                <circle cx="300" cy="25" r="3" fill="currentColor" className="text-primary" />
              </svg>
            </div>

            {/* Features */}
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="flex items-center gap-2 text-sm text-text-muted">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Real-time metrics
              </span>
              <span className="flex items-center gap-2 text-sm text-text-muted">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Cost tracking
              </span>
              <span className="flex items-center gap-2 text-sm text-text-muted">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Request tracing
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GatewaySection;
