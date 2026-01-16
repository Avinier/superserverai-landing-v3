import { useState } from 'react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2 transition-colors duration-300 hover:text-primary cursor-pointer">
          <img src="/logo-icon.png" alt="SuperServer AI Logo" className="w-10 h-10" />
          <span className="font-title text-2xl font-medium">
            SuperServer<span className="text-primary">AI</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#platform" className="nav-link text-text-muted hover:text-text transition-colors text-sm">
            Platform
          </a>
          <a href="#docs" className="nav-link text-text-muted hover:text-text transition-colors text-sm">
            Docs
          </a>
          <a href="#blog" className="nav-link text-text-muted hover:text-text transition-colors text-sm">
            Blog
          </a>
          <a href="#pricing" className="nav-link text-text-muted hover:text-text transition-colors text-sm">
            Pricing
          </a>
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#contact" className="nav-link text-text-muted hover:text-text transition-colors text-sm">
            Contact
          </a>
          <button className="btn-glow rounded-full bg-primary px-5 py-2 text-sm font-medium text-text hover:bg-primary/90">
            Get started
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-text"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-t border-border">
          <div className="px-6 py-4 flex flex-col gap-4">
            <a href="#platform" className="text-text-muted hover:text-text transition-colors text-sm">
              Platform
            </a>
            <a href="#docs" className="text-text-muted hover:text-text transition-colors text-sm">
              Docs
            </a>
            <a href="#blog" className="text-text-muted hover:text-text transition-colors text-sm">
              Blog
            </a>
            <a href="#pricing" className="text-text-muted hover:text-text transition-colors text-sm">
              Pricing
            </a>
            <a href="#contact" className="text-text-muted hover:text-text transition-colors text-sm">
              Contact
            </a>
            <button className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-text hover:bg-primary/90 transition-colors w-fit">
              Get started
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
