import React, { useState } from 'react';
import { db } from '../services/db';
import { Property, Review } from '../types';
import { 
  MapPin, 
  Star, 
  Users, 
  Bed, 
  Bath, 
  ShieldCheck, 
  Check, 
  MessageCircle, 
  Send, 
  Phone, 
  Calendar, 
  Clock, 
  Info, 
  ChevronRight, 
  Share2, 
  Heart,
  ArrowLeft,
  Sparkles,
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

interface PropertyDetailViewProps {
  slug: string;
  onBack: () => void;
  onOpenWhatsApp: (property: Property, checkIn?: string, checkOut?: string, guests?: number) => void;
  onOpenEnquiry: (property: Property) => void;
  onViewProperty: (slug: string) => void;
}

export const PropertyDetailView: React.FC<PropertyDetailViewProps> = ({
  slug,
  onBack,
  onOpenWhatsApp,
  onOpenEnquiry,
  onViewProperty,
}) => {
  const property = db.getPropertyBySlug(slug);

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Property not found</h2>
        <p className="text-xs text-slate-500">
          The stay you are looking for may have been moved or unlisted.
        </p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-lg"
        >
          Back to Stays
        </button>
      </div>
    );
  }

  const host = db.getHostById(property.hostId);
  const location = db.getLocationById(property.locationId);
  const reviews = db.getReviewsForProperty(property.id);
  const allAmenities = db.getAmenities();

  // Gallery state
  const allImages = [property.primaryImage, ...(property.additionalImages || [])];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Booking calculator state
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestsCount, setGuestsCount] = useState(1);

  // Calculate nights & estimated total
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24));
    return diff > 0 ? diff : 1;
  };
  const nights = calculateNights();
  const totalPrice = property.pricePerNight * nights;

  // Review submission state
  const [reviewName, setReviewName] = useState('');
  const [reviewLocation, setReviewLocation] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    db.addReview({
      propertyId: property.id,
      guestName: reviewName,
      guestLocation: reviewLocation || 'Kenya',
      rating: reviewRating,
      comment: reviewComment,
      stayType: 'Verified Guest'
    });

    setReviewSuccess(true);
    setReviewComment('');
    setTimeout(() => {
      setReviewSuccess(false);
      setShowReviewForm(false);
    }, 2000);
  };

  // Helper icon renderer
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between gap-4 text-xs">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Stays</span>
        </button>

        <div className="flex items-center gap-2">
          {property.isVerified && (
            <span className="flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md font-semibold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Busia Stay</span>
            </span>
          )}
        </div>
      </div>

      {/* Header Info */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span className="text-emerald-800 font-semibold uppercase tracking-wider text-[11px]">
            {property.propertyType}
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {property.locationName}
          </span>
          <span aria-hidden="true">·</span>
          <span>{property.address}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
          {property.title}
        </h1>

        <div className="flex items-center gap-4 text-xs text-slate-600 pt-1">
          <div className="flex items-center gap-1 text-slate-800 font-semibold">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>{property.rating.toFixed(2)}</span>
            <span className="text-slate-400 font-normal">({reviews.length} reviews)</span>
          </div>
          <span aria-hidden="true">·</span>
          <span>Up to {property.maxGuests} guests</span>
          <span aria-hidden="true">·</span>
          <span>{property.bedrooms} bedroom(s)</span>
          <span aria-hidden="true">·</span>
          <span>{property.bathrooms} bath(s)</span>
        </div>
      </div>

      {/* 2. LARGE IMAGE GALLERY */}
      <div className="space-y-3">
        <div className="relative aspect-16/9 md:aspect-21/9 w-full bg-stone-900 rounded-2xl overflow-hidden shadow-sm">
          <img
            src={allImages[activeImageIndex]}
            alt={property.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-md">
            Photo {activeImageIndex + 1} of {allImages.length}
          </div>
        </div>

        {/* Thumbnail selector */}
        {allImages.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
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

      {/* 3. MAIN SPLIT CONTENT: Description/Amenities/Rules vs Contiguous Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Left 2 Cols: Details */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Host quick badge */}
          {host && (
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-emerald-800 text-amber-300 font-bold flex items-center justify-center text-base">
                  {host.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-900">
                    Hosted by {host.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {host.joinedDate} · {host.responseTime}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onOpenWhatsApp(property, checkIn, checkOut, guestsCount)}
                className="px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold rounded-lg flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                <span>Chat Host</span>
              </button>
            </div>
          )}

          {/* Description */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">About this stay</h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Sleeping arrangements */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <h2 className="text-lg font-bold text-slate-900">Sleeping Arrangements</h2>
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 flex items-start gap-3">
              <Bed className="w-5 h-5 text-emerald-800 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-xs text-slate-900">Bedrooms & Beds</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {property.sleepingArrangement}
                </p>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <h2 className="text-lg font-bold text-slate-900">What this place offers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {property.amenityIds.map((amenityId) => {
                const found = allAmenities.find(a => a.id === amenityId);
                if (!found) return null;
                return (
                  <div
                    key={amenityId}
                    className="flex items-center gap-3 p-2.5 rounded-lg border border-stone-100 bg-white"
                  >
                    {renderAmenityIcon(found.icon)}
                    <span className="text-xs font-medium text-slate-800">
                      {found.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* House Rules */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <h2 className="text-lg font-bold text-slate-900">House Rules</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {property.houseRules.map((rule, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location & Neighborhood guide */}
          {location && (
            <div className="space-y-3 pt-4 border-t border-stone-200">
              <h2 className="text-lg font-bold text-slate-900">Location & Proximity</h2>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 space-y-2 text-xs">
                <div className="font-semibold text-slate-900 text-sm">{location.name}</div>
                <p className="text-slate-600 leading-relaxed">{location.description}</p>
                <div className="pt-2 flex flex-col sm:flex-row gap-3 text-slate-500">
                  <div><strong>Key Landmark:</strong> {location.landmark}</div>
                  <span className="hidden sm:inline">·</span>
                  <div><strong>Border Distance:</strong> {location.distanceToBorder}</div>
                </div>
              </div>
            </div>
          )}

          {/* Guest Reviews Section */}
          <div className="space-y-6 pt-4 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span>Guest Reviews</span>
                  <span className="text-sm font-semibold text-slate-600">
                    ({reviews.length})
                  </span>
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span className="font-bold text-slate-800">{property.rating.toFixed(2)} overall</span>
                  <span>·</span>
                  <span>100% verified guest stays</span>
                </div>
              </div>

              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="text-xs font-semibold px-3 py-1.5 border border-stone-300 rounded-lg text-slate-800 hover:bg-stone-50 transition-colors"
              >
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </button>
            </div>

            {/* Review form modal/drawer */}
            {showReviewForm && (
              <form onSubmit={handleAddReview} className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3 text-xs">
                <h4 className="font-semibold text-slate-900">Leave a Review for this stay</h4>
                
                {reviewSuccess ? (
                  <div className="p-3 bg-emerald-100 text-emerald-800 rounded-lg">
                    Thank you! Your review has been recorded.
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-600 mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Samuel Otieno"
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          className="w-full p-2 border rounded-md bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1">Location</label>
                        <input
                          type="text"
                          placeholder="e.g. Nairobi, Kenya"
                          value={reviewLocation}
                          onChange={(e) => setReviewLocation(e.target.value)}
                          className="w-full p-2 border rounded-md bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-600 mb-1">Rating</label>
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="w-full p-2 border rounded-md bg-white"
                      >
                        <option value={5}>5 Stars - Outstanding</option>
                        <option value={4}>4 Stars - Very Good</option>
                        <option value={3}>3 Stars - Average</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 mb-1">Feedback</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Tell others about the host communication, Wi-Fi speed, backup power, security..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full p-2 border rounded-md bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-800 text-white font-semibold rounded-md"
                    >
                      Post Review
                    </button>
                  </>
                )}
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-white rounded-xl border border-stone-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-xs text-slate-900">{rev.guestName}</h4>
                      <p className="text-[11px] text-slate-400">
                        {rev.guestLocation} · {rev.stayType}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <div className="flex">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-500" />
                        ))}
                      </div>
                      <span className="text-[11px] text-slate-400 ml-1">{rev.date}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Right 1 Col: Contiguous Purchase / Enquiry Module (STICKY) */}
        <div className="lg:sticky lg:top-20 space-y-4">
          
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-lg space-y-5">
            
            {/* Price line */}
            <div className="flex items-baseline justify-between pb-4 border-b border-stone-100">
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

            {/* Date Pickers */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 border border-stone-300 rounded-lg">
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
                  Check-in
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full text-xs font-medium text-slate-800 bg-transparent focus:outline-none"
                />
              </div>

              <div className="p-2 border border-stone-300 rounded-lg">
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
                  Check-out
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full text-xs font-medium text-slate-800 bg-transparent focus:outline-none"
                />
              </div>
            </div>

            {/* Guests Selector */}
            <div className="p-2 border border-stone-300 rounded-lg text-xs">
              <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
                Guests
              </label>
              <select
                value={guestsCount}
                onChange={(e) => setGuestsCount(Number(e.target.value))}
                className="w-full font-medium text-slate-800 bg-transparent focus:outline-none"
              >
                {Array.from({ length: property.maxGuests }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'Guest' : 'Guests'} (Max {property.maxGuests})
                  </option>
                ))}
              </select>
            </div>

            {/* Estimated Total Calculation */}
            {checkIn && checkOut && (
              <div className="p-3 bg-stone-50 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>KES {property.pricePerNight.toLocaleString()} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
                  <span className="font-medium tabular-nums">KES {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Platform Service Fee</span>
                  <span className="text-emerald-700 font-semibold">KES 0 (Launch Promo)</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-slate-900 text-sm">
                  <span>Total Estimated</span>
                  <span className="tabular-nums">KES {totalPrice.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* PRIMARY CTA: Book via WhatsApp */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => onOpenWhatsApp(property, checkIn, checkOut, guestsCount)}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group"
              >
                <MessageCircle className="w-5 h-5 fill-white text-emerald-600 group-hover:scale-110 transition-transform" />
                <span>Book via WhatsApp</span>
              </button>

              {/* SECONDARY CTA: Send Direct Enquiry */}
              <button
                onClick={() => onOpenEnquiry(property)}
                className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Direct Enquiry</span>
              </button>
            </div>

            {/* Direct Call Host Option */}
            {host && (
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Call host directly:</span>
                </span>
                <a
                  href={`tel:${host.phone}`}
                  className="font-semibold text-slate-800 hover:text-emerald-800 underline"
                >
                  {host.phone}
                </a>
              </div>
            )}

            <div className="text-[11px] text-slate-400 text-center leading-relaxed">
              No booking fees. Direct agreement with the property host in Busia.
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
