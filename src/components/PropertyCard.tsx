import React, { useState } from 'react';
import { Property } from '../types';
import { db } from '../services/db';
import { motion } from 'motion/react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { Star, MessageCircle, MapPin, Users, Bed, Check, Heart } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onViewDetails: (slug: string) => void;
  onOpenWhatsApp: (property: Property) => void;
  index?: number;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onViewDetails,
  onOpenWhatsApp,
  index = 0,
}) => {
  const [imgError, setImgError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const host = db.getHostById(property.hostId);

  // Intersection Observer hook for scroll reveal
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px',
    freezeOnceVisible: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      whileHover={{ 
        scale: 1.025, 
        y: -6,
        transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] }
      }}
      whileTap={{ scale: 0.99 }}
      transition={{ 
        duration: 0.45, 
        delay: Math.min((index % 4) * 0.08, 0.25),
        ease: [0.16, 1, 0.3, 1] 
      }}
      className="group bg-white rounded-2xl border border-stone-200/80 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.06),0_1px_4px_-1px_rgba(6,78,59,0.04)] hover:shadow-[0_20px_35px_-8px_rgba(6,78,59,0.18),0_8px_16px_-4px_rgba(15,23,42,0.08),0_0_0_1px_rgba(6,78,59,0.18)] hover:border-emerald-600/40 transition-shadow duration-300 flex flex-col overflow-hidden will-change-transform cursor-pointer"
    >
      {/* Property Image Container */}
      <div
        className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden cursor-pointer"
        onClick={() => onViewDetails(property.slug)}
      >
        {!imgError ? (
          <motion.img
            src={property.primaryImage}
            alt={property.title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-stone-100 text-stone-500">
            <span className="font-semibold text-stone-700 text-sm">{property.title}</span>
            <span className="text-xs text-stone-400 mt-1">{property.locationName}</span>
          </div>
        )}

        {/* Gradient overlay for readability on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Featured Stay Badge */}
        {property.isFeatured && (
          <div className="absolute top-3 left-3 bg-slate-950/85 text-amber-300 text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-xs backdrop-blur-xs flex items-center gap-1">
            <span>Featured</span>
          </div>
        )}

        {/* Save / Heart micro-interaction button */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          onClick={(e) => {
            e.stopPropagation();
            setIsSaved(!isSaved);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
            isSaved 
              ? 'bg-rose-500/90 text-white shadow-sm' 
              : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500 shadow-xs'
          }`}
          aria-label={isSaved ? "Saved" : "Save stay"}
        >
          <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-white stroke-white' : ''}`} />
        </motion.button>

        {/* Curated Host badge */}
        {property.isVerified && (
          <div className="absolute bottom-3 left-3 bg-white/95 text-emerald-900 text-[10px] font-semibold px-2 py-0.5 rounded shadow-xs backdrop-blur-xs flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
            <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
            <span>Curated Host</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Metadata line with typographic separators */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1.5 flex-wrap">
            <span className="text-emerald-800 uppercase tracking-wider text-[11px] font-bold">
              {property.propertyType}
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="flex items-center gap-0.5">
              <MapPin className="w-3 h-3 text-slate-400 inline" />
              {property.locationName}
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>Up to {property.maxGuests} guests</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onViewDetails(property.slug)}
            className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-1 cursor-pointer"
            title={property.title}
          >
            {property.title}
          </h3>

          {/* Specs */}
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
            <span className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5 text-slate-400" />
              <span>{property.bedrooms} {property.bedrooms === 1 ? 'bed' : 'beds'}</span>
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{property.maxGuests} max</span>
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="flex items-center gap-1 text-slate-800 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{property.rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({property.reviewCount})</span>
            </span>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-3.5 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Nightly rate</div>
            <div className="text-base font-extrabold text-slate-900 tabular-nums">
              KES {property.pricePerNight.toLocaleString()}
              <span className="text-xs font-normal text-slate-500 ml-1">/ night</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* WhatsApp trigger button with micro-motion */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={(e) => {
                e.stopPropagation();
                onOpenWhatsApp(property);
              }}
              className="p-2.5 text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs flex items-center justify-center"
              title={`WhatsApp host ${host?.name || ''}`}
              aria-label="Enquire on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
            </motion.button>

            {/* View stay button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewDetails(property.slug)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors whitespace-nowrap"
            >
              View stay
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
