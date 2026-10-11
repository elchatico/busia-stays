import React, { useState } from 'react';
import { db } from '../services/db';
import { Property, Location } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { ScrollReveal } from '../components/ScrollReveal';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Building, 
  Home, 
  Hotel, 
  Sparkles, 
  Compass, 
  Check, 
  ArrowRight, 
  Tag
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: string, params?: Record<string, string>) => void;
  onViewProperty: (slug: string) => void;
  onOpenWhatsApp: (property: Property) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onViewProperty,
  onOpenWhatsApp,
}) => {
  const locations = db.getLocations();
  const featuredProperties = db.getProperties({ featuredOnly: true }).slice(0, 4);

  // Search form state
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('stays', {
      location: selectedLocation !== 'all' ? selectedLocation : '',
      checkIn,
      checkOut,
      guests,
    });
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[580px] lg:min-h-[620px] flex items-center justify-center bg-slate-900 overflow-hidden">
        {/* Background Image with Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_busia_villa_1791403460678.jpg"
            alt="Busia Stays Accommodation"
            className="w-full h-full object-cover object-center scale-105 filter brightness-75"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/60 to-slate-900/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          
          {/* Location trust mark */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Busia County · Border Town Accommodation Guide</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight text-balance leading-tight">
            Stay Better in Busia.
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-200 max-w-2xl mx-auto text-balance font-normal leading-relaxed">
            Discover apartments, Airbnbs, guesthouses and hotels across Busia — all in one place. Direct contact with verified local hosts.
          </p>

          {/* Large Search Interface */}
          <form
            onSubmit={handleSearch}
            className="mt-8 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-2xl border border-stone-200/80 text-left max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-center">
              
              {/* Where are you staying? */}
              <div className="p-2 sm:p-2.5 rounded-xl hover:bg-stone-50 border border-transparent hover:border-stone-200 transition-colors">
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Where in Busia?
                </label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-800 shrink-0" />
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full text-xs font-medium text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="all">Anywhere in Busia</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Check-in */}
              <div className="p-2 sm:p-2.5 rounded-xl hover:bg-stone-50 border border-transparent hover:border-stone-200 transition-colors">
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Check-in
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-800 shrink-0" />
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full text-xs font-medium text-slate-800 bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              {/* Check-out */}
              <div className="p-2 sm:p-2.5 rounded-xl hover:bg-stone-50 border border-transparent hover:border-stone-200 transition-colors">
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Check-out
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-800 shrink-0" />
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full text-xs font-medium text-slate-800 bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              {/* Guests + Submit Button */}
              <div className="flex items-center gap-2">
                <div className="flex-1 p-2 sm:p-2.5 rounded-xl hover:bg-stone-50 border border-transparent hover:border-stone-200 transition-colors">
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Guests
                  </label>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-800 shrink-0" />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full text-xs font-medium text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4+ Guests</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="h-12 px-5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Search Stays</span>
                </button>
              </div>

            </div>
          </form>

          {/* Quick Stats Strip */}
          <div className="mt-8 flex items-center justify-center gap-6 sm:gap-10 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
              <span>Direct WhatsApp to Host</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
              <span>Transparent KES Pricing</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
              <span>Verified Busia Locations</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. POPULAR IN BUSIA CATEGORIES (Intersection Observer Fade-in-up) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Popular in Busia
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Explore stays by your accommodation preference
              </p>
            </div>
            <button
              onClick={() => onNavigate('stays')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 group cursor-pointer"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            
            <button
              onClick={() => onNavigate('stays', { type: 'Apartment' })}
              className="p-4 rounded-xl bg-white border border-stone-200/80 hover:border-emerald-800/40 hover:shadow-md transition-all text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Building className="w-5 h-5" />
              </div>
              <div className="font-semibold text-sm text-slate-900 group-hover:text-emerald-800 transition-colors">
                Apartments
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Furnished & serviced
              </div>
            </button>

            <button
              onClick={() => onNavigate('stays', { type: 'Airbnb' })}
              className="p-4 rounded-xl bg-white border border-stone-200/80 hover:border-emerald-800/40 hover:shadow-md transition-all text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Home className="w-5 h-5" />
              </div>
              <div className="font-semibold text-sm text-slate-900 group-hover:text-emerald-800 transition-colors">
                Airbnbs
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Short-stay homes
              </div>
            </button>

            <button
              onClick={() => onNavigate('stays', { type: 'Hotel' })}
              className="p-4 rounded-xl bg-white border border-stone-200/80 hover:border-emerald-800/40 hover:shadow-md transition-all text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Hotel className="w-5 h-5" />
              </div>
              <div className="font-semibold text-sm text-slate-900 group-hover:text-emerald-800 transition-colors">
                Hotels
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Border transit inns
              </div>
            </button>

            <button
              onClick={() => onNavigate('stays', { type: 'Guesthouse' })}
              className="p-4 rounded-xl bg-white border border-stone-200/80 hover:border-emerald-800/40 hover:shadow-md transition-all text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <div className="font-semibold text-sm text-slate-900 group-hover:text-emerald-800 transition-colors">
                Guesthouses
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Cozy & tranquil
              </div>
            </button>

            <button
              onClick={() => onNavigate('stays', { maxPrice: '3000' })}
              className="p-4 rounded-xl bg-white border border-stone-200/80 hover:border-emerald-800/40 hover:shadow-md transition-all text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Tag className="w-5 h-5" />
              </div>
              <div className="font-semibold text-sm text-slate-900 group-hover:text-emerald-800 transition-colors">
                Budget Stays
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Under KES 3,000
              </div>
            </button>

            <button
              onClick={() => onNavigate('stays', { minPrice: '5000' })}
              className="p-4 rounded-xl bg-white border border-stone-200/80 hover:border-emerald-800/40 hover:shadow-md transition-all text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="font-semibold text-sm text-slate-900 group-hover:text-emerald-800 transition-colors">
                Luxury Stays
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Executive & villas
              </div>
            </button>

          </div>
        </ScrollReveal>
      </section>

      {/* 3. FEATURED STAYS (Intersection Observer Reveal for Section & Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Featured Stays
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Top-rated and host-verified properties in Busia
              </p>
            </div>
            <button
              onClick={() => onNavigate('stays')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 group cursor-pointer"
            >
              <span>See all {db.getProperties().length} properties</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </ScrollReveal>

        {/* Grid with cards animated individually via useIntersectionObserver */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProperties.map((property, idx) => (
            <PropertyCard
              key={property.id}
              property={property}
              index={idx}
              onViewDetails={onViewProperty}
              onOpenWhatsApp={onOpenWhatsApp}
            />
          ))}
        </div>
      </section>

      {/* 4. EXPLORE BUSIA (Neighborhoods with Staggered Scroll Reveal) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Explore Busia
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Choose the right neighborhood for your visit, meeting or border crossing
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {locations.slice(0, 6).map((loc, idx) => {
            const count = db.getProperties({ locationId: loc.id }).length;
            return (
              <ScrollReveal key={loc.id} delay={idx * 60} distance={20}>
                <div
                  onClick={() => onNavigate('stays', { location: loc.id })}
                  className="bg-white p-5 rounded-2xl border border-stone-200/80 hover:border-emerald-800/40 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group h-full"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-800 transition-colors">
                        {loc.name}
                      </h3>
                      <span className="text-[11px] font-medium text-slate-500">
                        {count} {count === 1 ? 'stay' : 'stays'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {loc.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="text-emerald-800 font-medium">
                      {loc.distanceToBorder}
                    </span>
                    <span className="group-hover:translate-x-0.5 transition-transform text-slate-400 group-hover:text-emerald-800 font-medium">
                      Browse →
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* 5. WHY BUSIA STAYS? (Intersection Observer Reveal) */}
      <section className="bg-stone-100/70 border-y border-stone-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Why Busia Stays?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                We replace chaotic WhatsApp status hopping and Facebook groups with one clean, trustworthy digital platform.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <ScrollReveal delay={0} distance={24}>
              <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-2 h-full hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-lg mb-4">
                  01
                </div>
                <h3 className="text-base font-semibold text-slate-900">
                  Local Busia Properties
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Hand-curated furnished apartments, cozy Airbnbs, and peaceful villas across Busia CBD, Matayos, Korinda, and Border Customs.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100} distance={24}>
              <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-2 h-full hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-lg mb-4">
                  02
                </div>
                <h3 className="text-base font-semibold text-slate-900">
                  Direct WhatsApp Contact
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  No middlemen or complicated booking bots. Tap one button to chat directly with property hosts on WhatsApp with dates pre-filled.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200} distance={24}>
              <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-2 h-full hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-lg mb-4">
                  03
                </div>
                <h3 className="text-base font-semibold text-slate-900">
                  Transparent Prices
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Clear prices in Kenyan Shillings (KES). What you see is what you pay the host. No hidden platform markups.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={300} distance={24}>
              <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-2 h-full hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-lg mb-4">
                  04
                </div>
                <h3 className="text-base font-semibold text-slate-900">
                  One Central Platform
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Compare photos, Wi-Fi speed, backup power generator status, and reviews in 30 seconds rather than calling scattered numbers.
                </p>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* 6. HOST CTA BANNER (Scroll Reveal) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal distance={28} duration={700}>
          <div className="relative rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white p-8 sm:p-12 overflow-hidden shadow-xl border border-emerald-900/50">
            
            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="text-amber-400 font-semibold text-xs tracking-wider uppercase">
                Host Growth in Western Kenya
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                Own a property in Busia?
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Get your property in front of business executives, border traders, and visitors looking for accommodation. Build your digital storefront today with zero launch commissions.
              </p>
              
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <button
                  onClick={() => onNavigate('list-property')}
                  className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  List Your Property via WhatsApp
                </button>
                
                <button
                  onClick={() => onNavigate('about')}
                  className="px-4 py-3 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Learn how Busia Stays works →
                </button>
              </div>
            </div>

            <div className="hidden lg:block absolute right-12 bottom-6 opacity-15 text-white font-black text-9xl pointer-events-none select-none">
              BUSIA
            </div>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
};
