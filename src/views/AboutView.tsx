import React from 'react';
import { ShieldCheck, Heart, MapPin, Users, Compass, Check, ArrowRight } from 'lucide-react';

interface AboutViewProps {
  onNavigate: (view: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 pb-20">
      
      {/* 1. Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-emerald-800 font-bold text-xs tracking-wider uppercase">
          About Busia Stays
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Stay Better in Busia.
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed text-balance">
          We are building the digital front door for accommodation businesses across Busia County, Kenya — replacing scattered WhatsApp statuses with discovery, trust, and direct host contact.
        </p>
      </div>

      {/* 2. The Problem & Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
          <h2 className="text-2xl font-bold text-slate-900">
            The Problem We Are Solving
          </h2>
          <p>
            Busia is a thriving frontier economy. Hundreds of business executives, cross-border traders, NGO teams, government consultants and visiting families arrive every week.
          </p>
          <p>
            Yet discovering a clean, reliable furnished apartment or Airbnb has historically required asking around, scrolling through dozens of temporary WhatsApp statuses, or dealing with unverified Facebook posts. Many great local accommodation owners had no web presence of their own.
          </p>
          <p className="font-semibold text-emerald-900">
            Busia Stays gives these properties a clean, professional digital home.
          </p>
        </div>

        <div className="bg-stone-50 p-6 sm:p-8 rounded-2xl border border-stone-200/90 space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Our Core Principles</h3>
          <ul className="space-y-3 text-xs text-slate-600">
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
              <span><strong>Local curation:</strong> We personally verify property locations and key amenities like backup generators and reliable water.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
              <span><strong>Direct host contact:</strong> Guests connect directly on WhatsApp with pre-filled enquiry dates. No middleman friction.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
              <span><strong>Transparent pricing:</strong> Real rates in Kenyan Shillings (KES). No hidden surcharges.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
              <span><strong>Zero commission launch:</strong> We empower local entrepreneurs to keep 100% of their earnings during the launch phase.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. Expansion Roadmap */}
      <div className="space-y-6 pt-8 border-t border-stone-200">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-2xl font-bold text-slate-900">
            Our Phased Roadmap
          </h2>
          <p className="text-xs text-slate-500">
            From Busia foundation to Western Kenya and nationwide
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white rounded-xl border-2 border-emerald-800 shadow-2xs space-y-2">
            <div className="text-xs font-bold text-emerald-800 uppercase">Phase 1 (Live Now)</div>
            <h4 className="font-bold text-slate-900 text-sm">Busia Marketplace MVP</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Curated marketplace, verified host directory, WhatsApp integration, and direct enquiry management in Busia.
            </p>
          </div>

          <div className="p-5 bg-stone-50 rounded-xl border border-stone-200 space-y-2 opacity-90">
            <div className="text-xs font-bold text-slate-500 uppercase">Phase 2</div>
            <h4 className="font-bold text-slate-900 text-sm">Host Portal & M-Pesa</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Dedicated host self-service dashboard, live availability calendar, review verification, and optional direct M-Pesa deposits.
            </p>
          </div>

          <div className="p-5 bg-stone-50 rounded-xl border border-stone-200 space-y-2 opacity-80">
            <div className="text-xs font-bold text-slate-500 uppercase">Phase 3</div>
            <h4 className="font-bold text-slate-900 text-sm">Maps & Subscriptions</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Google Maps interactive place finder, host marketing analytics, and featured listing subscriptions.
            </p>
          </div>

          <div className="p-5 bg-stone-50 rounded-xl border border-stone-200 space-y-2 opacity-70">
            <div className="text-xs font-bold text-slate-500 uppercase">Phase 4</div>
            <h4 className="font-bold text-slate-900 text-sm">Regional Expansion</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Expanding across Western Kenya: Bungoma, Kakamega, Kisumu, Kitale, Eldoret, and nationwide.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Host CTA */}
      <div className="p-8 rounded-2xl bg-emerald-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-xl font-bold">Are you a property host in Busia?</h3>
          <p className="text-xs text-emerald-200 max-w-md">
            Join the forward-thinking hosts building digital storefronts on Busia Stays.
          </p>
        </div>
        <button
          onClick={() => onNavigate('list-property')}
          className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
        >
          List Your Property
        </button>
      </div>

    </div>
  );
};
