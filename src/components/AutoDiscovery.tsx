import { useEffect, useRef, useState } from 'react';

interface Service {
  id: string;
  name: string;
  port: string;
  status: 'healthy' | 'warning' | 'error';
  connections: number;
}

// Health indicator with animated ping effect
const HealthIndicator = ({ status }: { status: 'healthy' | 'warning' | 'error' }) => {
  const colorClass = status === 'healthy'
    ? 'bg-green-500'
    : status === 'warning'
      ? 'bg-yellow-500'
      : 'bg-secondary';

  return (
    <div className="relative">
      <div className={`w-2 h-2 rounded-full ${colorClass}`} />
      {status === 'healthy' && (
        <div className={`absolute inset-0 w-2 h-2 rounded-full ${colorClass} animate-ping opacity-75`} />
      )}
    </div>
  );
};

// Service node card component
const ServiceNode = ({ service, index, inView }: { service: Service; index: number; inView: boolean }) => (
  <div
    className="flex items-center justify-between p-4 rounded-lg bg-surface-elevated border border-border transition-all duration-300 hover:border-primary/20 hover:bg-surface-elevated/80"
    style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateX(0)' : 'translateX(-20px)',
      transition: `opacity 0.4s ease ${index * 0.15}s, transform 0.4s ease ${index * 0.15}s, border-color 0.3s ease, background-color 0.3s ease`
    }}
  >
    <div className="flex items-center gap-3">
      <HealthIndicator status={service.status} />
      <span className="font-mono text-sm text-text">{service.name}</span>
      <span className="px-2 py-1 rounded bg-grey/50 text-xs text-text-muted">:{service.port}</span>
    </div>
    <div className="flex items-center gap-4 text-sm text-text-muted">
      <span
        className={`px-2 py-1 rounded ${
          service.status === 'healthy'
            ? 'bg-green-500/20 text-green-400'
            : service.status === 'warning'
              ? 'bg-yellow-500/20 text-yellow-400'
              : 'bg-secondary/20 text-secondary'
        }`}
      >
        {service.status}
      </span>
      <span className="text-xs">{service.connections} connections</span>
    </div>
  </div>
);

const AutoDiscovery = () => {
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

  const featureBadges = [
    {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      text: 'Zero-config setup',
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      text: 'Auto service detection',
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      text: 'Real-time health status',
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      text: 'Connection mapping',
    },
  ];

  const discoveredServices: Service[] = [
    { id: 'api-service', name: 'API', port: '3000', status: 'healthy', connections: 12 },
    { id: 'redis-cache', name: 'Redis', port: '6379', status: 'healthy', connections: 8 },
    { id: 'worker-queue', name: 'Worker', port: '8080', status: 'healthy', connections: 4 },
    { id: 'postgres-db', name: 'PostgreSQL', port: '5432', status: 'healthy', connections: 32 },
  ];

  const connectedTools = [
    { name: 'Datadog', connected: true },
    { name: 'Sentry', connected: true },
    { name: 'AWS', connected: true },
    { name: 'GitHub', connected: true },
  ];

  return (
    <section id="platform" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-title text-3xl md:text-4xl lg:text-5xl font-medium text-text mb-4">
            Install once. See everything.
          </h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            ssai automatically discovers your entire infrastructure - services, connections, health status, and more.
          </p>
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {featureBadges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border text-sm text-text-muted transition-all duration-300 hover:border-primary/30 hover:bg-surface-elevated cursor-default"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(10px)',
                transition: `opacity 0.4s ease ${index * 0.1}s, transform 0.4s ease ${index * 0.1}s, border-color 0.3s ease, background-color 0.3s ease`
              }}
            >
              <span className="text-primary animate-pulse-subtle">{badge.icon}</span>
              <span>{badge.text}</span>
            </div>
          ))}
        </div>

        {/* Infrastructure Map Card */}
        <div
          ref={sectionRef}
          className="rounded-2xl border border-border bg-surface p-6 md:p-8 card-hover"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.5s ease 0.3s, transform 0.5s ease 0.3s'
          }}
        >
          <h3 className="font-title text-xl md:text-2xl font-medium text-text mb-2">
            Your infrastructure, mapped automatically
          </h3>
          <p className="text-text-muted mb-6">
            See every service, port, and connection at a glance. ssai discovers it all without any configuration.
          </p>

          {/* Services List */}
          <div className="space-y-3 mb-6">
            {discoveredServices.map((service, index) => (
              <ServiceNode
                key={service.id}
                service={service}
                index={index}
                inView={inView}
              />
            ))}
          </div>

          {/* Connected Tools */}
          <div
            className="flex flex-wrap gap-2 pt-4 border-t border-border"
            style={{
              opacity: inView ? 1 : 0,
              transition: 'opacity 0.4s ease 0.8s'
            }}
          >
            {connectedTools.map((tool, index) => (
              <div
                key={tool.name}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-elevated border border-border text-xs transition-all duration-300 hover:border-primary/30"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(10px)',
                  transition: `opacity 0.4s ease ${0.9 + index * 0.1}s, transform 0.4s ease ${0.9 + index * 0.1}s, border-color 0.3s ease`
                }}
              >
                <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-text">{tool.name}</span>
              </div>
            ))}
          </div>

          {/* Features List */}
          <div
            className="mt-6 flex flex-wrap gap-3"
            style={{
              opacity: inView ? 1 : 0,
              transition: 'opacity 0.4s ease 1.2s'
            }}
          >
            <span className="flex items-center gap-2 text-sm text-text-muted">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Dependency graph
            </span>
            <span className="flex items-center gap-2 text-sm text-text-muted">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Port detection
            </span>
            <span className="flex items-center gap-2 text-sm text-text-muted">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Health monitoring
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AutoDiscovery;
