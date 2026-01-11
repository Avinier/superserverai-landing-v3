const CTABanner = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-primary">
        {/* Gradient overlay with animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#1e42d9] to-[#1a3ad4] animate-gradient-shift"></div>

        {/* Geometric shapes with float animation */}
        <svg className="absolute right-0 top-0 h-full w-1/2 opacity-20 animate-float" viewBox="0 0 400 400" preserveAspectRatio="xMaxYMid slice" style={{ animationDuration: '8s' }}>
          {/* Large circle */}
          <circle cx="300" cy="200" r="200" fill="none" stroke="white" strokeWidth="1" />
          <circle cx="300" cy="200" r="150" fill="none" stroke="white" strokeWidth="0.5" />
          <circle cx="300" cy="200" r="100" fill="none" stroke="white" strokeWidth="0.5" />

          {/* Diagonal lines */}
          <line x1="100" y1="0" x2="400" y2="300" stroke="white" strokeWidth="0.5" />
          <line x1="150" y1="0" x2="450" y2="300" stroke="white" strokeWidth="0.5" />
          <line x1="200" y1="0" x2="500" y2="300" stroke="white" strokeWidth="0.5" />

          {/* Rectangles */}
          <rect x="250" y="50" width="100" height="100" fill="none" stroke="white" strokeWidth="0.5" transform="rotate(15 300 100)" />
          <rect x="300" y="250" width="80" height="80" fill="none" stroke="white" strokeWidth="0.5" transform="rotate(-10 340 290)" />
        </svg>

        {/* Additional decorative elements with float animation */}
        <svg className="absolute left-0 bottom-0 h-1/2 w-1/3 opacity-10 animate-float" viewBox="0 0 200 200" preserveAspectRatio="xMinYMax slice" style={{ animationDuration: '10s', animationDelay: '1s' }}>
          <circle cx="50" cy="150" r="100" fill="none" stroke="white" strokeWidth="1" />
          <circle cx="50" cy="150" r="50" fill="white" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <h2 className="font-title text-3xl md:text-4xl lg:text-5xl font-medium text-white mb-6">
            Achieve near instant latency today.
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Start building with SuperServer in minutes. No credit card required for the free tier.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <a
              href="#get-started"
              className="inline-flex items-center gap-2 rounded-lg bg-white text-primary px-6 py-3 text-sm font-medium transition-all duration-300 hover:bg-white/90 hover:scale-[1.02] hover:shadow-lg hover:shadow-white/20"
            >
              Get started on SuperServer
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="#demo"
              className="inline-flex items-center gap-2 rounded-lg border border-white/50 bg-transparent text-white px-6 py-3 text-sm font-medium transition-all duration-300 hover:bg-white/10 hover:border-white hover:scale-[1.02]"
            >
              Get a demo
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
