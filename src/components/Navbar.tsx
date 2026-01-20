import { useState } from 'react';
import { Button } from './ui/Button';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="/" className="flex items-center cursor-pointer">
          <img src="/logo-icon.png" alt="SuperServer AI" className="h-8 w-auto" />
        </a>

        {/* Desktop Navigation + CTA */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="nav-link text-text-muted hover:text-text transition-colors text-sm">
            Features
          </a>
          <a href="#security" className="nav-link text-text-muted hover:text-text transition-colors text-sm">
            Security
          </a>
          <Button variant="primary" size="sm" className="btn-glow">
            Book a demo
          </Button>
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
            <a href="#features" className="text-text-muted hover:text-text transition-colors text-sm">
              Features
            </a>
            <a href="#security" className="text-text-muted hover:text-text transition-colors text-sm">
              Security
            </a>
            <Button variant="primary" size="sm" className="w-fit">
              Book a demo
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
