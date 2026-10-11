import React, { useState } from 'react';
import { Property, Host } from '../types';
import { db, DatabaseService } from '../services/db';
import { MessageCircle, Check, Copy, ExternalLink, X, Calendar, Users, Phone } from 'lucide-react';

interface WhatsAppModalProps {
  property: Property | null;
  host: Host | null;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  property,
  host,
  initialCheckIn = '',
  initialCheckOut = '',
  initialGuests = 1,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !property) return null;

  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState(initialGuests);
  const [copied, setCopied] = useState(false);

  // Host number from DB
  const hostPhone = host?.whatsapp || host?.phone || '254712345678';
  const { url, message } = DatabaseService.generateWhatsAppUrl(
    hostPhone,
    property.title,
    checkIn || undefined,
    checkOut || undefined,
    guests
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    // Also record this as a direct enquiry in DB
    db.createEnquiry({
      propertyId: property.id,
      propertyTitle: property.title,
      guestName: 'WhatsApp Inquirer',
      guestPhone: 'Direct WhatsApp',
      checkInDate: checkIn || new Date().toISOString().split('T')[0],
      checkOutDate: checkOut || new Date().toISOString().split('T')[0],
      guestsCount: guests,
      message,
      whatsappSent: true
    });

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
        
        {/* Header */}
        <div className="bg-emerald-900 text-white p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-700/80 flex items-center justify-center text-amber-300">
              <MessageCircle className="w-6 h-6 fill-emerald-500 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white">Direct WhatsApp Enquiry</h3>
              <p className="text-xs text-emerald-200">
                Connect directly with host {host?.name || 'in Busia'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-300 hover:text-white p-1 rounded-md transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200 text-xs space-y-1">
            <div className="font-semibold text-slate-800 text-sm">{property.title}</div>
            <div className="text-slate-500">
              {property.locationName} · KES {property.pricePerNight.toLocaleString()} / night
            </div>
            {host && (
              <div className="text-emerald-800 font-medium pt-1 flex items-center gap-1.5">
                <span>Host: {host.name}</span>
                <span aria-hidden="true">·</span>
                <span>{host.responseTime}</span>
              </div>
            )}
          </div>

          {/* Optional enquiry params */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Check-in</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full px-2 py-1.5 border border-stone-300 rounded-md text-xs focus:ring-1 focus:ring-emerald-800"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Check-out</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full px-2 py-1.5 border border-stone-300 rounded-md text-xs focus:ring-1 focus:ring-emerald-800"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Guests</label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full px-2 py-1.5 border border-stone-300 rounded-md text-xs focus:ring-1 focus:ring-emerald-800"
              >
                {Array.from({ length: property.maxGuests }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Generated Message Preview */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Pre-filled WhatsApp Message
            </label>
            <div className="bg-[#E7F3EC] border border-emerald-200 text-slate-800 rounded-xl p-3 text-xs leading-relaxed font-sans relative">
              <p className="whitespace-pre-wrap">{message}</p>
              <span className="block text-[10px] text-emerald-700 text-right mt-1">
                Formatted for WhatsApp (Kenya +254)
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleOpenWhatsApp}
              className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
              <span>Open in WhatsApp</span>
              <ExternalLink className="w-4 h-4 opacity-80" />
            </button>

            <button
              onClick={handleCopy}
              className="py-3 px-4 border border-stone-300 hover:bg-stone-50 text-slate-700 font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copy Message</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] text-slate-500 text-center">
            Zero booking commissions. You will chat directly with the verified property host in Busia.
          </p>
        </div>
      </div>
    </div>
  );
};
