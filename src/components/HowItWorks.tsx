import { useEffect, useRef, useState } from 'react';

const HowItWorks = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  // Intersection Observer for scroll-triggered animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      number: 1,
      title: 'Install',
      description: 'Run one Docker command on your infrastructure',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
    },
    {
      number: 2,
      title: 'Discover',
      description: 'ssai auto-maps all running services, ports, and connections',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      number: 3,
      title: 'Connect',
      description: 'Link your tools - GitHub, Datadog, Sentry, AWS',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
    },
    {
      number: 4,
      title: 'Deploy',
      description: 'Push code, ssai handles the rest',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-title text-3xl md:text-4xl lg:text-5xl font-medium text-text mb-4">
            How it works
          </h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            From install to deploy in minutes
          </p>
        </div>

        {/* Steps Grid */}
        <div
          ref={sectionRef}
          className="grid md:grid-cols-4 gap-8 md:gap-6"
        >
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.5s ease ${index * 0.15}s, transform 0.5s ease ${index * 0.15}s`
              }}
            >
              {/* Connector line (hidden on mobile and last item) */}
              {index < steps.length - 1 && (
                <>
                  {/* Desktop: Horizontal gradient line with arrow */}
                  <div className="hidden md:block absolute top-10 left-[60%] w-full h-[2px]">
                    <div
                      className="h-full bg-gradient-to-r from-primary/50 via-primary/30 to-transparent"
                      style={{
                        opacity: inView ? 1 : 0,
                        transition: `opacity 0.5s ease ${(index + 1) * 0.15 + 0.3}s`
                      }}
                    />
                    {/* Arrow indicator */}
                    <div
                      className="absolute right-4 -top-1 w-0 h-0 border-t-4 border-b-4 border-l-6 border-t-transparent border-b-transparent border-l-primary/40"
                      style={{
                        borderLeftWidth: '6px',
                        opacity: inView ? 1 : 0,
                        transition: `opacity 0.5s ease ${(index + 1) * 0.15 + 0.4}s`
                      }}
                    />
                  </div>
                  {/* Mobile: Vertical connector dot */}
                  <div className="md:hidden flex justify-center mt-6 mb-2">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-primary/40" />
                      <div className="w-1 h-1 rounded-full bg-primary/30" />
                      <div className="w-1 h-1 rounded-full bg-primary/20" />
                    </div>
                  </div>
                </>
              )}

              {/* Step Card */}
              <div className="flex flex-col items-center text-center">
                {/* Icon Container with Number Badge */}
                <div className="relative mb-4 group">
                  <div className="w-20 h-20 rounded-2xl bg-surface border border-border flex items-center justify-center transition-all duration-300 hover:border-primary/30 hover:bg-surface-elevated group-hover:scale-105">
                    <span className="text-primary transition-transform duration-300 group-hover:scale-110">
                      {step.icon}
                    </span>
                  </div>
                  {/* Number Badge */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-primary/30">
                    {step.number}
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-title text-xl font-medium text-text mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-text-muted max-w-[200px]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
