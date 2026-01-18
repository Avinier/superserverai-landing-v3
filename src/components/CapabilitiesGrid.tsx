import { useEffect, useRef, useState } from 'react';

// Deploy Pipeline Visualization
const DeployVisualization = () => {
  const stages = [
    { name: 'Build', status: 'complete' as const },
    { name: 'Test', status: 'complete' as const },
    { name: 'Deploy', status: 'running' as const },
  ];

  return (
    <div className="p-4 rounded-lg bg-surface border border-border">
      <div className="flex items-center justify-between gap-2">
        {stages.map((stage, index) => (
          <div key={stage.name} className="flex items-center flex-1">
            {/* Stage Node */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  stage.status === 'complete'
                    ? 'bg-green-500/20 border border-green-500/50'
                    : stage.status === 'running'
                    ? 'bg-primary/20 border border-primary/50'
                    : 'bg-surface-elevated border border-border'
                }`}
              >
                {stage.status === 'complete' ? (
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : stage.status === 'running' ? (
                  <svg className="w-5 h-5 text-primary animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-text-muted" />
                )}
              </div>
              <span className="text-xs text-text-muted">{stage.name}</span>
            </div>

            {/* Connector */}
            {index < stages.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  stage.status === 'complete' ? 'bg-green-500' : 'bg-border'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Status message */}
      <div className="mt-4 flex items-center gap-2 text-sm">
        <div className="relative">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping opacity-75" />
        </div>
        <span className="text-text-muted">Deploying to production...</span>
      </div>
    </div>
  );
};

// Monitor Metrics Visualization
const MonitorVisualization = () => {
  const metrics: { label: string; value: string; trend: 'down' | 'up' | 'stable' }[] = [
    { label: 'Response', value: '23ms', trend: 'down' },
    { label: 'Errors', value: '0.01%', trend: 'down' },
    { label: 'Uptime', value: '99.99%', trend: 'stable' },
  ];

  return (
    <div className="space-y-3">
      {/* Metrics row */}
      <div className="grid grid-cols-3 gap-2">
        {metrics.map((metric) => (
          <div key={metric.label} className="p-2 rounded-lg bg-surface border border-border text-center">
            <p className="text-xs text-text-muted truncate">{metric.label}</p>
            <p className="text-lg font-bold text-text">{metric.value}</p>
            <span
              className={`text-xs ${
                metric.trend === 'down'
                  ? 'text-green-500'
                  : metric.trend === 'up'
                  ? 'text-secondary'
                  : 'text-text-muted'
              }`}
            >
              {metric.trend === 'down' ? '^ Good' : metric.trend === 'up' ? 'v Bad' : '- Stable'}
            </span>
          </div>
        ))}
      </div>

      {/* Sparkline chart */}
      <div className="h-16 rounded-lg bg-surface border border-border p-2">
        <svg className="w-full h-full" viewBox="0 0 200 50" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(37, 75, 241, 0.3)" />
              <stop offset="100%" stopColor="rgba(37, 75, 241, 0)" />
            </linearGradient>
          </defs>
          {/* Area fill */}
          <path
            d="M0,40 L25,35 L50,42 L75,25 L100,30 L125,20 L150,25 L175,15 L200,20 L200,50 L0,50 Z"
            fill="url(#chartGradient)"
          />
          {/* Line */}
          <path
            d="M0,40 L25,35 L50,42 L75,25 L100,30 L125,20 L150,25 L175,15 L200,20"
            fill="none"
            stroke="#254bf1"
            strokeWidth="2"
            className="animate-draw-line"
          />
          {/* Current point */}
          <circle cx="200" cy="20" r="3" fill="#254bf1" className="animate-pulse-subtle" />
        </svg>
      </div>

      {/* Alert indicator */}
      <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-xs text-green-400">All systems nominal</span>
      </div>
    </div>
  );
};

// Security Scan Visualization
const SecurityVisualization = () => {
  const checks = [
    { name: 'Dependencies', status: 'passed' as const, count: 0 },
    { name: 'Secrets', status: 'passed' as const, count: 0 },
    { name: 'Config', status: 'warning' as const, count: 2 },
  ];

  return (
    <div className="space-y-3">
      {/* Shield icon with status */}
      <div className="flex items-center justify-center py-4">
        <div className="relative">
          <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Scan results */}
      <div className="space-y-2">
        {checks.map((check) => (
          <div
            key={check.name}
            className="flex items-center justify-between p-2 rounded-lg bg-surface border border-border"
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  check.status === 'passed' ? 'bg-green-500' : 'bg-yellow-500'
                }`}
              />
              <span className="text-sm text-text-muted">{check.name}</span>
            </div>
            <span
              className={`text-xs ${
                check.status === 'passed' ? 'text-green-500' : 'text-yellow-500'
              }`}
            >
              {check.count === 0 ? 'Clean' : `${check.count} issues`}
            </span>
          </div>
        ))}
      </div>

      {/* Last scan time */}
      <p className="text-xs text-text-muted text-center">Last scan: 2 minutes ago</p>
    </div>
  );
};

const CapabilitiesGrid = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const capabilities = [
    {
      title: 'Intelligent Deployment',
      description: 'Push code, ssai handles the rest. Auto-scaling, resource allocation, and zero-downtime deploys.',
      features: [
        'Auto resource allocation',
        'Kubernetes orchestration',
        'CI/CD pipelines',
        'Auto-scaling',
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      visualization: <DeployVisualization />,
    },
    {
      title: 'AI-Assisted Monitoring',
      description: 'Proactive incident detection and intelligent alerting. Know about issues before your users do.',
      features: [
        'On-call incident response',
        'Log observability',
        'AI-assisted root cause analysis',
        'Intelligent alerting',
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      visualization: <MonitorVisualization />,
    },
    {
      title: 'Continuous Security',
      description: "Vulnerability scanning that doesn't just warn - it fixes. Security built into every deploy.",
      features: [
        'Vulnerability scanning',
        'Security warnings',
        'Auto-fix suggestions',
        'Compliance monitoring',
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      visualization: <SecurityVisualization />,
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-surface">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-title text-3xl md:text-4xl lg:text-5xl font-medium text-text mb-4">
            Everything your infrastructure needs
          </h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Monitor, deploy, and secure - all on autopilot.
          </p>
        </div>

        {/* Capabilities Grid */}
        <div ref={sectionRef} className="grid md:grid-cols-3 gap-6">
          {capabilities.map((capability, index) => (
            <div
              key={capability.title}
              className="rounded-2xl border border-border bg-background p-6 md:p-8 card-hover"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.5s ease ${index * 0.15}s, transform 0.5s ease ${index * 0.15}s`
              }}
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                <span className="text-primary">{capability.icon}</span>
              </div>

              {/* Title */}
              <h3 className="font-title text-xl md:text-2xl font-medium text-text mb-3">
                {capability.title}
              </h3>

              {/* Description */}
              <p className="text-text-muted mb-6">
                {capability.description}
              </p>

              {/* Visualization */}
              <div className="mb-6">
                {capability.visualization}
              </div>

              {/* Features List */}
              <div className="space-y-3">
                {capability.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-text-muted">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CapabilitiesGrid;
