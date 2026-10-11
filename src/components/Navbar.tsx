import React, { useState } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string, params?: Record<string, string>) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRouteClick = (route: string, params?: Record<string, string>) => {
    onNavigate(route, params);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => handleRouteClick('home')}
            className="flex items-center gap-2 group text-left focus:outline-none"
            aria-label="Busia Stays Home"
          >
            <span className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-lg shadow-xs group-hover:bg-emerald-900 transition-colors">
              B
            </span>
            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-emerald-900 transition-colors">
              Busia Stays
            </span>
          </button>

          {/* Zone 2: Multi-Page Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button
              onClick={() => handleRouteClick('home')}
              className={`hover:text-emerald-900 transition-colors ${
                currentRoute === 'home' ? 'text-emerald-900 font-semibold' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleRouteClick('stays')}
              className={`hover:text-emerald-900 transition-colors ${
                currentRoute === 'stays' ? 'text-emerald-900 font-semibold' : ''
              }`}
            >
              Browse Stays
            </button>
            <button
              onClick={() => handleRouteClick('locations')}
              className={`hover:text-emerald-900 transition-colors ${
                currentRoute === 'locations' ? 'text-emerald-900 font-semibold' : ''
              }`}
            >
              Neighborhoods
            </button>
            <button
              onClick={() => handleRouteClick('list-property')}
              className={`hover:text-emerald-900 transition-colors ${
                currentRoute === 'list-property' ? 'text-emerald-900 font-semibold' : ''
              }`}
            >
              For Hosts
            </button>
            <button
              onClick={() => handleRouteClick('about')}
              className={`hover:text-emerald-900 transition-colors ${
                currentRoute === 'about' ? 'text-emerald-900 font-semibold' : ''
              }`}
            >
              About
            </button>
          </nav>

          {/* Zone 3: Direct Action */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => handleRouteClick('list-property')}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white text-emerald-800" />
              <span>List via WhatsApp</span>
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-white px-4 pt-2 pb-5 space-y-2">
          <button
            onClick={() => handleRouteClick('home')}
            className={`w-full text-left py-2.5 px-3 rounded-md text-sm font-medium ${
              currentRoute === 'home' ? 'text-emerald-900 bg-emerald-50 font-semibold' : 'text-slate-700 hover:bg-stone-50'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleRouteClick('stays')}
            className={`w-full text-left py-2.5 px-3 rounded-md text-sm font-medium ${
              currentRoute === 'stays' ? 'text-emerald-900 bg-emerald-50 font-semibold' : 'text-slate-700 hover:bg-stone-50'
            }`}
          >
            Browse All Stays
          </button>
          <button
            onClick={() => handleRouteClick('locations')}
            className={`w-full text-left py-2.5 px-3 rounded-md text-sm font-medium ${
              currentRoute === 'locations' ? 'text-emerald-900 bg-emerald-50 font-semibold' : 'text-slate-700 hover:bg-stone-50'
            }`}
          >
            Busia Neighborhoods
          </button>
          <button
            onClick={() => handleRouteClick('about')}
            className={`w-full text-left py-2.5 px-3 rounded-md text-sm font-medium ${
              currentRoute === 'about' ? 'text-emerald-900 bg-emerald-50 font-semibold' : 'text-slate-700 hover:bg-stone-50'
            }`}
          >
            About Busia Stays
          </button>
          <button
            onClick={() => handleRouteClick('list-property')}
            className="w-full text-left py-2.5 px-3 rounded-md text-sm font-medium text-emerald-900 bg-emerald-50 hover:bg-emerald-100 flex items-center justify-between"
          >
            <span>List Property via WhatsApp</span>
            <MessageCircle className="w-4 h-4 text-emerald-700" />
          </button>
        </div>
      )}
    </header>
  );
};
