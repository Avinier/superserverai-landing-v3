const FeaturesGrid2 = () => {
  const complianceBadges = [
    { name: 'SOC2', subtitle: 'Type II' },
    { name: 'HIPAA', subtitle: 'Compliant' },
    { name: 'GDPR', subtitle: 'Ready' },
    { name: 'ISO', subtitle: '27001' },
  ];

  const securityFeatures = [
    'End-to-end encryption',
    'Zero-trust architecture',
    'Audit logging',
    'Role-based access control',
  ];

  return (
    <section className="py-20 md:py-28 bg-surface">
      <div className="mx-auto max-w-7xl px-6">
        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1: Network Illustration */}
          <div className="rounded-2xl border border-border bg-background p-6 md:p-8 card-hover">
            <h3 className="font-title text-xl md:text-2xl font-medium text-text mb-2">
              Global edge network
            </h3>
            <p className="text-text-muted mb-6">
              Deploy sandboxes close to your users. Automatic routing to the nearest region for minimal latency.
            </p>

            {/* Network/Globe Illustration */}
            <div className="flex items-center justify-center py-8">
              <div className="relative w-64 h-64">
                {/* Globe circles */}
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  {/* Outer circle */}
                  <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="1" className="text-border" />
                  {/* Horizontal ellipse */}
                  <ellipse cx="100" cy="100" rx="90" ry="30" fill="none" stroke="currentColor" strokeWidth="1" className="text-border" />
                  {/* Vertical ellipse */}
                  <ellipse cx="100" cy="100" rx="30" ry="90" fill="none" stroke="currentColor" strokeWidth="1" className="text-border" />
                  {/* Center point */}
                  <circle cx="100" cy="100" r="4" fill="currentColor" className="text-primary" />

                  {/* Edge nodes */}
                  <circle cx="30" cy="100" r="6" fill="currentColor" className="text-primary" />
                  <circle cx="170" cy="100" r="6" fill="currentColor" className="text-primary" />
                  <circle cx="100" cy="30" r="6" fill="currentColor" className="text-primary" />
                  <circle cx="100" cy="170" r="6" fill="currentColor" className="text-primary" />
                  <circle cx="55" cy="55" r="5" fill="currentColor" className="text-secondary" />
                  <circle cx="145" cy="55" r="5" fill="currentColor" className="text-secondary" />
                  <circle cx="55" cy="145" r="5" fill="currentColor" className="text-secondary" />
                  <circle cx="145" cy="145" r="5" fill="currentColor" className="text-secondary" />

                  {/* Connection lines */}
                  <line x1="100" y1="100" x2="30" y2="100" stroke="currentColor" strokeWidth="1" className="text-primary opacity-50" />
                  <line x1="100" y1="100" x2="170" y2="100" stroke="currentColor" strokeWidth="1" className="text-primary opacity-50" />
                  <line x1="100" y1="100" x2="100" y2="30" stroke="currentColor" strokeWidth="1" className="text-primary opacity-50" />
                  <line x1="100" y1="100" x2="100" y2="170" stroke="currentColor" strokeWidth="1" className="text-primary opacity-50" />
                </svg>
              </div>
            </div>

            {/* Region badges */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {['US-East', 'US-West', 'EU-Central', 'Asia-Pacific'].map((region) => (
                <span key={region} className="px-3 py-1 rounded-full bg-surface border border-border text-xs text-text-muted transition-all duration-300 hover:border-primary/30 hover:bg-primary/10 cursor-default">
                  {region}
                </span>
              ))}
            </div>
          </div>

          {/* Card 2: Security & Compliance */}
          <div className="rounded-2xl border border-border bg-background p-6 md:p-8 card-hover">
            <h3 className="font-title text-xl md:text-2xl font-medium text-text mb-2">
              Enterprise-grade security
            </h3>
            <p className="text-text-muted mb-6">
              Built from the ground up with security in mind. Meet the strictest compliance requirements.
            </p>

            {/* Compliance Badges */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {complianceBadges.map((badge) => (
                <div
                  key={badge.name}
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-surface border border-border transition-all duration-300 hover:border-primary/30 hover:scale-105 cursor-default"
                >
                  <span className="font-bold text-lg text-text">{badge.name}</span>
                  <span className="text-xs text-text-muted">{badge.subtitle}</span>
                </div>
              ))}
            </div>

            {/* Security Features */}
            <div className="space-y-3">
              {securityFeatures.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-text-muted">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid2;
