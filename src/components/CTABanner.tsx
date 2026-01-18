import { Button, ArrowIcon } from './ui/Button';

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
            Ready to stop babysitting your infrastructure?
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Install ssai in minutes. Ship like you have a platform team.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Button as="a" href="#get-started" variant="solid-inverted">
              Try it now
              <ArrowIcon />
            </Button>
            <Button as="a" href="#contact" variant="outline-inverted">
              Talk to founders
              <ArrowIcon />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
