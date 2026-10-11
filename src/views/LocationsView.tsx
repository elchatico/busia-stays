import React from 'react';
import { db } from '../services/db';
import { MapPin, Navigation, ArrowRight, Building, CheckCircle2 } from 'lucide-react';

interface LocationsViewProps {
  onNavigateToStays: (locationId: string) => void;
}

export const LocationsView: React.FC<LocationsViewProps> = ({ onNavigateToStays }) => {
  const locations = db.getLocations();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 pb-20">
      
      {/* Title */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold">
          <Navigation className="w-3.5 h-3.5" />
          <span>Busia County Neighborhood Guide</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Where to Stay in Busia
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          From quick border crossing transit lodging to peaceful green family villas in Matayos and executive apartments in the CBD, discover the neighborhood best suited for your stay.
        </p>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((loc) => {
          const stayCount = db.getProperties({ locationId: loc.id }).length;
          return (
            <div
              key={loc.id}
              className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-stone-100 text-slate-700 rounded-full">
                    {stayCount} {stayCount === 1 ? 'stay' : 'stays'} available
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900">{loc.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {loc.description}
                </p>

                <div className="space-y-1.5 pt-2 text-xs border-t border-stone-100">
                  <div className="text-slate-500">
                    <strong className="text-slate-700">Landmark:</strong> {loc.landmark}
                  </div>
                  <div className="text-slate-500">
                    <strong className="text-slate-700">Border Proximity:</strong> {loc.distanceToBorder}
                  </div>
                  <div className="text-emerald-800 font-medium">
                    <strong className="text-slate-700">Popular For:</strong> {loc.popularFor}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigateToStays(loc.id)}
                className="w-full py-2.5 px-4 bg-stone-100 hover:bg-emerald-800 hover:text-white text-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 group"
              >
                <span>Browse {loc.name} Stays</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Busia Border Traveler Note */}
      <div className="bg-stone-100/80 rounded-2xl p-6 sm:p-8 border border-stone-200 space-y-3">
        <h3 className="text-base font-bold text-slate-900">
          Crossing the Kenya-Uganda Border?
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
          The Busia One-Stop Border Post operates 24/7. If you arrive late from Nairobi, Kisumu, or Kampala, stays located in <strong>Busia CBD</strong> and <strong>Busia Border / Customs</strong> are 5 minutes away, eliminating nighttime transit delays and ensuring safe, gated parking.
        </p>
      </div>

    </div>
  );
};
