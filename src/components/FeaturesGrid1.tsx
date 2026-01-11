const FeaturesGrid1 = () => {
  const featureBadges = [
    {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      text: 'Sub-25ms latency',
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      text: 'Run AI-generated arbitrary code',
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      text: 'Stateful even after weeks',
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      text: 'Air-tight isolation',
    },
  ];

  const sandboxInstances = [
    { id: '8F7D6C5E', cpu: '2 vCPU', memory: '512MB', status: 'running' },
    { id: '4B3A2D1C', cpu: '4 vCPU', memory: '1GB', status: 'running' },
    { id: '9E8D7C6B', cpu: '2 vCPU', memory: '256MB', status: 'idle' },
  ];

  return (
    <section id="platform" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-title text-3xl md:text-4xl lg:text-5xl font-medium text-text mb-4">
            Sandboxes for your AI agents
          </h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Equip your codegen agents with secure & flexible VMs. Run untrusted code, install packages,
            and execute complex workflows in isolated environments.
          </p>
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 stagger-children">
          {featureBadges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border text-sm text-text-muted transition-all duration-300 hover:border-primary/30 hover:bg-surface-elevated cursor-default"
            >
              <span className="text-primary animate-pulse-subtle">{badge.icon}</span>
              <span>{badge.text}</span>
            </div>
          ))}
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1: Sandbox Instances */}
          <div className="rounded-2xl border border-border bg-surface p-6 md:p-8 card-hover">
            <h3 className="font-title text-xl md:text-2xl font-medium text-text mb-2">
              Compute resources, made for both humans and agents
            </h3>
            <p className="text-text-muted mb-6">
              Provision dedicated sandbox instances with configurable resources for any workload.
            </p>

            {/* Sandbox Instances Illustration */}
            <div className="space-y-3 stagger-children">
              {sandboxInstances.map((instance) => (
                <div
                  key={instance.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-surface-elevated border border-border transition-all duration-300 hover:border-primary/20 hover:bg-surface-elevated/80"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="font-mono text-sm text-text">{instance.id}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-text-muted">
                    <span className="px-2 py-1 rounded bg-grey/50">{instance.cpu}</span>
                    <span className="px-2 py-1 rounded bg-grey/50">{instance.memory}</span>
                    <span className={`px-2 py-1 rounded ${instance.status === 'running' ? 'bg-green-500/20 text-green-400' : 'bg-grey/50'}`}>
                      {instance.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Features List */}
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="flex items-center gap-2 text-sm text-text-muted">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Auto-scaling
              </span>
              <span className="flex items-center gap-2 text-sm text-text-muted">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Snapshot & restore
              </span>
              <span className="flex items-center gap-2 text-sm text-text-muted">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Resource limits
              </span>
            </div>
          </div>

          {/* Card 2: Background Tasks */}
          <div className="rounded-2xl border border-border bg-surface p-6 md:p-8 card-hover">
            <h3 className="font-title text-xl md:text-2xl font-medium text-text mb-2">
              Background tasks for reliable AI products
            </h3>
            <p className="text-text-muted mb-6">
              Long-running tasks that persist across sessions. Never lose progress on complex operations.
            </p>

            {/* Timer Illustration */}
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative w-48 h-48">
                {/* Outer ring */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-border"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray="553"
                    strokeDashoffset="138"
                    className="text-primary"
                    strokeLinecap="round"
                  />
                </svg>
                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono text-4xl font-bold text-text">72:34:15</span>
                  <span className="text-sm text-text-muted mt-1">Task running</span>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="flex items-center gap-2 text-sm text-text-muted">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Persistent execution
              </span>
              <span className="flex items-center gap-2 text-sm text-text-muted">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Progress checkpoints
              </span>
              <span className="flex items-center gap-2 text-sm text-text-muted">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Auto-recovery
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid1;
