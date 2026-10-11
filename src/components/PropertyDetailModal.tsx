import React, { useState } from 'react';
import { db } from '../services/db';
import { Property } from '../types';
import { 
  X, 
  MapPin, 
  Star, 
  Bed, 
  Users, 
  ShieldCheck, 
  Check, 
  MessageCircle, 
  Phone, 
  Clock, 
  Send,
  Wifi,
  Car,
  Utensils,
  Zap,
  ShowerHead,
  Tv,
  Wind,
  Briefcase,
  Sun,
  Droplets,
  Trees
} from 'lucide-react';

interface PropertyDetailModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenWhatsApp: (property: Property, checkIn?: string, checkOut?: string, guests?: number) => void;
  onOpenEnquiry: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  isOpen,
  onClose,
  onOpenWhatsApp,
  onOpenEnquiry,
}) => {
  if (!isOpen || !property) return null;

  const host = db.getHostById(property.hostId);
  const location = db.getLocationById(property.locationId);
  const reviews = db.getReviewsForProperty(property.id);
  const allAmenities = db.getAmenities();

  const allImages = [property.primaryImage, ...(property.additionalImages || [])];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Booking calculator state
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestsCount, setGuestsCount] = useState(1);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24));
    return diff > 0 ? diff : 1;
  };
  const nights = calculateNights();
  const totalPrice = property.pricePerNight * nights;

  const renderAmenityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wifi': return <Wifi className="w-4 h-4 text-emerald-800" />;
      case 'Car': return <Car className="w-4 h-4 text-emerald-800" />;
      case 'Utensils': return <Utensils className="w-4 h-4 text-emerald-800" />;
      case 'Zap': return <Zap className="w-4 h-4 text-amber-600" />;
      case 'ShowerHead': return <ShowerHead className="w-4 h-4 text-emerald-800" />;
      case 'Tv': return <Tv className="w-4 h-4 text-emerald-800" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4 text-emerald-800" />;
      case 'Wind': return <Wind className="w-4 h-4 text-emerald-800" />;
      case 'Briefcase': return <Briefcase className="w-4 h-4 text-emerald-800" />;
      case 'Sun': return <Sun className="w-4 h-4 text-amber-500" />;
      case 'Droplets': return <Droplets className="w-4 h-4 text-sky-600" />;
      case 'Trees': return <Trees className="w-4 h-4 text-emerald-800" />;
      default: return <Check className="w-4 h-4 text-emerald-800" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      
      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 text-left my-auto">
        
        {/* Sticky Header with Close button */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-emerald-800 font-semibold uppercase tracking-wider text-[11px]">
              {property.propertyType}
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500 font-medium">{property.locationName}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-stone-100 transition-colors"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Title & Basic Specs */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {property.title}
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
              <span className="flex items-center gap-1 text-slate-800 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>{property.rating.toFixed(2)}</span>
                <span className="text-slate-400 font-normal">({reviews.length} reviews)</span>
              </span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>{property.address}</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>Up to {property.maxGuests} guests</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>{property.bedrooms} bed(s)</span>
            </div>
          </div>

          {/* Photo Gallery */}
          <div className="space-y-2.5">
            <div className="relative aspect-16/9 w-full bg-stone-900 rounded-xl overflow-hidden shadow-xs">
              <img
                src={allImages[activeImageIndex]}
                alt={property.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded">
                Photo {activeImageIndex + 1} of {allImages.length}
              </div>
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-emerald-800 shadow-xs ring-1 ring-emerald-800'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Split Content: Details vs WhatsApp Booking Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            
            {/* Left 2 Cols: Details */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Host note */}
              {host && (
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-800 text-amber-300 font-bold flex items-center justify-center text-sm">
                      {host.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs text-slate-900">Hosted by {host.name}</h4>
                      <p className="text-[11px] text-slate-500">{host.responseTime}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onOpenWhatsApp(property, checkIn, checkOut, guestsCount)}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="font-bold text-sm text-slate-900 mb-2">About this stay</h3>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Sleeping setup */}
              <div className="pt-4 border-t border-stone-100 space-y-2">
                <h3 className="font-bold text-sm text-slate-900">Sleeping Arrangements</h3>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 flex items-start gap-2.5 text-xs text-slate-700">
                  <Bed className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                  <span>{property.sleepingArrangement}</span>
                </div>
              </div>

              {/* Amenities */}
              <div className="pt-4 border-t border-stone-100 space-y-2">
                <h3 className="font-bold text-sm text-slate-900">Amenities</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {property.amenityIds.map((aId) => {
                    const amenity = allAmenities.find(a => a.id === aId);
                    if (!amenity) return null;
                    return (
                      <div key={aId} className="flex items-center gap-2 p-2 rounded-lg bg-stone-50 border border-stone-100 text-slate-700">
                        {renderAmenityIcon(amenity.icon)}
                        <span>{amenity.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* House rules */}
              <div className="pt-4 border-t border-stone-100 space-y-2">
                <h3 className="font-bold text-sm text-slate-900">House Rules</h3>
                <div className="space-y-1.5 text-xs text-slate-600">
                  {property.houseRules.map((rule, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location info */}
              {location && (
                <div className="pt-4 border-t border-stone-100 space-y-2">
                  <h3 className="font-bold text-sm text-slate-900">Location in Busia</h3>
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-100 text-xs space-y-1 text-slate-600">
                    <div><strong>Landmark:</strong> {location.landmark}</div>
                    <div><strong>Border Proximity:</strong> {location.distanceToBorder}</div>
                    <div className="text-emerald-800 font-medium"><strong>Popular for:</strong> {location.popularFor}</div>
                  </div>
                </div>
              )}

              {/* Reviews */}
              {reviews.length > 0 && (
                <div className="pt-4 border-t border-stone-100 space-y-3">
                  <h3 className="font-bold text-sm text-slate-900">Guest Feedback</h3>
                  <div className="space-y-2.5">
                    {reviews.slice(0, 3).map((r) => (
                      <div key={r.id} className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800">{r.guestName}</span>
                          <span className="text-[11px] text-slate-400">{r.guestLocation}</span>
                        </div>
                        <p className="text-slate-600 italic">"{r.comment}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right 1 Col: Contiguous Booking Card */}
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200/90 space-y-4">
              
              <div className="flex items-baseline justify-between pb-3 border-b border-stone-200">
                <div>
                  <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
                    KES {property.pricePerNight.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 ml-1">/ night</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{property.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Date pickers */}
              <div className="space-y-2 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Check-in</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Check-out</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Guests</label>
                  <select
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full p-2 border border-stone-300 rounded-lg bg-white"
                  >
                    {Array.from({ length: property.maxGuests }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Guest' : 'Guests'} (Max {property.maxGuests})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Calculation */}
              {checkIn && checkOut && (
                <div className="p-2.5 bg-white rounded-lg border border-stone-200 text-xs space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>KES {property.pricePerNight.toLocaleString()} × {nights} night(s)</span>
                    <span className="font-semibold tabular-nums">KES {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Platform Fee</span>
                    <span>KES 0</span>
                  </div>
                </div>
              )}

              {/* Booking CTAs */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => onOpenWhatsApp(property, checkIn, checkOut, guestsCount)}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 group"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-emerald-600 group-hover:scale-110 transition-transform" />
                  <span>Book via WhatsApp</span>
                </button>

                <button
                  onClick={() => onOpenEnquiry(property)}
                  className="w-full py-2.5 px-4 bg-white hover:bg-stone-100 text-slate-800 font-semibold text-xs rounded-xl border border-stone-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Direct Enquiry</span>
                </button>
              </div>

              {/* Direct host phone */}
              {host && (
                <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs text-slate-500">
                  <span>Call host:</span>
                  <a href={`tel:${host.phone}`} className="font-semibold text-slate-800 hover:text-emerald-800 underline">
                    {host.phone}
                  </a>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
