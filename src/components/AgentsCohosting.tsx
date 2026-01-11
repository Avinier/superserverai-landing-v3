const AgentsCohosting = () => {
  const deploymentMessages = [
    { type: 'success', message: 'Agent deployed successfully', timestamp: '2m ago' },
    { type: 'success', message: 'Evaluation passed: 98.7% accuracy', timestamp: '5m ago' },
    { type: 'info', message: 'Running test suite...', timestamp: '8m ago' },
    { type: 'success', message: 'Build completed', timestamp: '10m ago' },
  ];

  const mcpConnections = [
    { name: 'PostgreSQL', status: 'connected' },
    { name: 'Redis', status: 'connected' },
    { name: 'S3 Storage', status: 'connected' },
    { name: 'OpenAI API', status: 'connected' },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-title text-3xl md:text-4xl lg:text-5xl font-medium text-text mb-4">
            SuperServer Agents Cohosting
          </h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Co-locate your AI agents with their sandboxes for maximum performance.
            Deploy, evaluate, and iterate faster than ever.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1: Deployment Pipeline */}
          <div className="rounded-2xl border border-border bg-surface p-6 md:p-8 card-hover">
            <h3 className="font-title text-xl md:text-2xl font-medium text-text mb-2">
              Iterate. Evaluate. Deploy.
            </h3>
            <p className="text-text-muted mb-6">
              Continuous deployment pipeline for AI agents. Test in staging, evaluate performance, ship to production.
            </p>

            {/* Deployment Messages Illustration */}
            <div className="space-y-3 stagger-children">
              {deploymentMessages.map((msg, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-surface-elevated border border-border transition-all duration-300 hover:border-primary/20"
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    msg.type === 'success' ? 'bg-green-500/20' : 'bg-primary/20'
                  }`}>
                    {msg.type === 'success' ? (
                      <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <span className="flex-1 text-sm text-text">{msg.message}</span>
                  <span className="text-xs text-text-muted">{msg.timestamp}</span>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex gap-3">
              <button className="flex-1 px-4 py-2 rounded-lg bg-primary text-text text-sm font-medium btn-glow">
                Deploy to Production
              </button>
              <button className="px-4 py-2 rounded-lg border border-border bg-surface-elevated text-text-muted text-sm hover:text-text hover:border-primary/30 transition-all duration-300">
                View Logs
              </button>
            </div>
          </div>

          {/* Card 2: MCP Server Connections */}
          <div className="rounded-2xl border border-border bg-surface p-6 md:p-8 card-hover">
            <h3 className="font-title text-xl md:text-2xl font-medium text-text mb-2">
              MCP servers that just work
            </h3>
            <p className="text-text-muted mb-6">
              Connect your agents to databases, APIs, and services through standardized MCP protocol.
            </p>

            {/* MCP Connections Illustration */}
            <div className="relative py-8">
              {/* Central hub */}
              <div className="flex justify-center">
                <div className="relative">
                  {/* Agent icon in center */}
                  <div className="w-20 h-20 rounded-2xl bg-primary/20 border border-primary/50 flex items-center justify-center animate-pulse-subtle">
                    <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>

                  {/* Connection lines */}
                  <svg className="absolute inset-0 w-full h-full" style={{ transform: 'scale(3)', transformOrigin: 'center' }}>
                    <line x1="50%" y1="0" x2="50%" y2="35%" stroke="currentColor" strokeWidth="0.5" className="text-primary opacity-50" strokeDasharray="2 2" />
                    <line x1="50%" y1="65%" x2="50%" y2="100%" stroke="currentColor" strokeWidth="0.5" className="text-primary opacity-50" strokeDasharray="2 2" />
                    <line x1="0" y1="50%" x2="35%" y2="50%" stroke="currentColor" strokeWidth="0.5" className="text-primary opacity-50" strokeDasharray="2 2" />
                    <line x1="65%" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeWidth="0.5" className="text-primary opacity-50" strokeDasharray="2 2" />
                  </svg>
                </div>
              </div>

              {/* Connection nodes */}
              <div className="grid grid-cols-2 gap-4 mt-8 stagger-children">
                {mcpConnections.map((conn) => (
                  <div
                    key={conn.name}
                    className="flex items-center gap-3 p-3 rounded-lg bg-surface-elevated border border-border transition-all duration-300 hover:border-green-500/30"
                  >
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-subtle"></div>
                    <span className="text-sm text-text">{conn.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features List */}
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="flex items-center gap-2 text-sm text-text-muted">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Auto-reconnect
              </span>
              <span className="flex items-center gap-2 text-sm text-text-muted">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Connection pooling
              </span>
              <span className="flex items-center gap-2 text-sm text-text-muted">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Secure tunneling
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgentsCohosting;
