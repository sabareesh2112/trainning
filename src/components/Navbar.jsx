import React, { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle.jsx';

export const Navbar = ({
  activeTab,
  onNavigate,
  onOpenSearch
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'telescopes', label: 'Telescopes' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'compare', label: 'Compare' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#080706]/92 backdrop-blur-md border-b border-[rgba(234,145,98,0.20)] shadow-[0_4px_20px_rgba(8,7,6,0.8)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="text-left flex items-center gap-2 group focus:outline-none cursor-pointer"
        >
          <span className="text-xl font-heading font-bold tracking-tight text-[#FFFFFF] group-hover:text-[#EA9162] transition-colors">
            COSMIC LENS
          </span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#EA9162] animate-pulse shadow-[0_0_8px_#EA9162]" />
        </button>

        {/* Zone 2: Navigation Links (Home, Telescopes, Gallery, Compare) */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive =
              activeTab === link.id ||
              (link.id === 'compare' && activeTab === 'comparison');
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`text-sm font-medium transition-colors whitespace-nowrap py-1 relative cursor-pointer ${
                  isActive
                    ? 'text-[#EA9162] font-semibold'
                    : 'text-[#C7B8B0] hover:text-[#FFFFFF]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#EA9162] rounded-full shadow-[0_0_8px_#EA9162]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions (Search & Light/Dark Theme Switch) */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-[#C7B8B0] bg-[#120D0A] hover:bg-[#18100C] hover:text-[#EA9162] border border-[rgba(234,145,98,0.25)] hover:border-[#EA9162] rounded-lg transition-colors cursor-pointer shadow-[0_0_10px_rgba(234,145,98,0.1)]"
            title="Search astronomical catalog (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5 text-[#EA9162]" />
            <span className="hidden lg:inline">Search</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.2 bg-[#080706] text-[10px] text-[#F2B08E] rounded border border-[rgba(234,145,98,0.30)]">
              ⌘K
            </kbd>
          </button>

          {/* Light / Dark Mode Toggle Switch */}
          <div className="flex items-center pl-1">
            <ThemeToggle />
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#C7B8B0] hover:text-[#FFFFFF] rounded-lg focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#EA9162]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0D0A08] border-b border-[rgba(234,145,98,0.25)] px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 text-sm rounded-md font-medium transition-colors ${
                activeTab === link.id ||
                (link.id === 'compare' && activeTab === 'comparison')
                  ? 'bg-[#18100C] text-[#EA9162] font-semibold border-l-2 border-[#EA9162]'
                  : 'text-[#C7B8B0] hover:text-[#FFFFFF]'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-[rgba(234,145,98,0.20)] flex items-center justify-between px-1">
            <button
              onClick={() => {
                onOpenSearch();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 py-1.5 px-3 text-xs font-mono text-[#C7B8B0] bg-[#120D0A] rounded-md border border-[rgba(234,145,98,0.25)]"
            >
              <Search className="w-3.5 h-3.5 text-[#EA9162]" /> Search
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#9F8D84]">Theme:</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
