import { useEffect, useRef, useState } from 'react';

const Integrations = () => {
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

  const integrationCategories = [
    {
      category: 'Cloud',
      tools: ['AWS', 'GCP', 'Azure'],
    },
    {
      category: 'Git',
      tools: ['GitHub', 'GitLab', 'Bitbucket'],
    },
    {
      category: 'Observability',
      tools: ['Datadog', 'Sentry', 'New Relic', 'PagerDuty'],
    },
    {
      category: 'Communication',
      tools: ['Slack', 'Discord'],
    },
    {
      category: 'Containers',
      tools: ['Docker', 'Kubernetes'],
    },
  ];

  // Flatten all tools for the grid display
  const allTools = integrationCategories.flatMap(cat => cat.tools);

  return (
    <section className="py-20 md:py-28 bg-surface">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-title text-3xl md:text-4xl lg:text-5xl font-medium text-text mb-4">
            Works with your stack
          </h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Connect the tools you already use. ssai plays nice with everyone.
          </p>
        </div>

        {/* Integration Logos Grid */}
        <div
          ref={sectionRef}
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mb-12"
        >
          {allTools.map((tool, index) => (
            <div
              key={tool}
              className="group flex items-center justify-center h-20 rounded-xl bg-background border border-border transition-all duration-300 hover:border-primary/30 hover:scale-105 hover:bg-surface-elevated cursor-default"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(10px)',
                transition: `opacity 0.4s ease ${index * 0.05}s, transform 0.4s ease ${index * 0.05}s, border-color 0.3s ease, background-color 0.3s ease, scale 0.3s ease`
              }}
            >
              <span className="text-text-muted font-medium text-sm transition-colors duration-300 group-hover:text-primary">
                {tool}
              </span>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3">
          {integrationCategories.map((cat, index) => (
            <div
              key={cat.category}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border text-sm transition-all duration-300 hover:border-primary/30 hover:bg-surface-elevated cursor-default"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(10px)',
                transition: `opacity 0.4s ease ${0.7 + index * 0.1}s, transform 0.4s ease ${0.7 + index * 0.1}s, border-color 0.3s ease, background-color 0.3s ease`
              }}
            >
              <span className="text-primary font-medium">{cat.category}</span>
              <span className="text-text-muted">({cat.tools.length})</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Integrations;
