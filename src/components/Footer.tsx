import React from 'react';
import { MessageSquare, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string, params?: Record<string, string>) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-700 text-amber-300 flex items-center justify-center font-bold text-lg">
                B
              </span>
              <span className="text-xl font-bold tracking-tight text-white">
                Busia Stays
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Stay Better in Busia. A curated accommodation discovery and direct-booking platform connecting travelers with verified apartments, Airbnbs, and guesthouses across Busia County, Kenya.
            </p>
            <div className="pt-2 flex flex-col gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Busia Town, Western Kenya</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Onboarding Concierge: +254 712 345 678</span>
              </div>
            </div>
          </div>

          {/* Stays Categories */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Explore Stays
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('stays', { type: 'Apartment' })}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Furnished Apartments
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('stays', { type: 'Airbnb' })}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Curated Airbnbs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('stays', { type: 'Villa' })}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Private Villas & Lawns
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('stays', { type: 'Guesthouse' })}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Budget Guesthouses
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('stays', { type: 'Hotel' })}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Border Transit Hotels
                </button>
              </li>
            </ul>
          </div>

          {/* Key Areas */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Key Areas
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('stays', { location: 'loc-cbd' })}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Busia CBD
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('stays', { location: 'loc-border' })}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Busia Border / Customs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('stays', { location: 'loc-matayos' })}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Matayos Suburb
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('stays', { location: 'loc-korinda' })}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Korinda Estates
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('stays', { location: 'loc-nambale' })}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Nambale
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('stays', { location: 'loc-alupe' })}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Alupe
                </button>
              </li>
            </ul>
          </div>

          {/* For Hosts */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Property Owners
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('list-property')}
                  className="text-amber-300 hover:text-amber-200 font-medium transition-colors"
                >
                  List via WhatsApp
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Why Busia Stays
                </button>
              </li>
              <li>
                <a
                  href="https://wa.me/254712345678?text=Hello%20Busia%20Stays%2C%20I%20have%20an%20accommodation%20in%20Busia%20and%20want%20to%20list."
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-xs"
                >
                  <span>Chat with Host Concierge</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Busia Stays. Built for Busia, Kenya.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Direct WhatsApp Communication</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>Zero Booking Commission</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
