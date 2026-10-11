import React, { useState } from 'react';
import { Property, Host } from '../types';
import { db } from '../services/db';
import { Send, CheckCircle2, X } from 'lucide-react';

interface EnquiryModalProps {
  property: Property | null;
  host: Host | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccessEnquiry?: () => void;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  property,
  host,
  isOpen,
  onClose,
  onSuccessEnquiry
}) => {
  if (!isOpen || !property) return null;

  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestsCount, setGuestsCount] = useState(1);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestPhone.trim()) {
      setError('Please provide your name and phone number.');
      return;
    }

    db.createEnquiry({
      propertyId: property.id,
      propertyTitle: property.title,
      guestName: guestName.trim(),
      guestPhone: guestPhone.trim(),
      guestEmail: guestEmail.trim() || undefined,
      checkInDate: checkIn || new Date().toISOString().split('T')[0],
      checkOutDate: checkOut || new Date().toISOString().split('T')[0],
      guestsCount,
      message: message.trim() || `Inquiry regarding stay at ${property.title}`,
      whatsappSent: false
    });

    setSubmitted(true);
    if (onSuccessEnquiry) onSuccessEnquiry();
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg text-white">Direct Host Enquiry</h3>
            <p className="text-xs text-slate-300">
              Send an enquiry to {host?.name || 'the host'} for {property.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Enquiry Sent to Host!</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              We have forwarded your booking request to <strong>{host?.name || 'the host'}</strong>. The host will review and reach out directly via SMS or WhatsApp at <strong>{guestPhone}</strong>.
            </p>
            <button
              onClick={handleReset}
              className="mt-4 px-6 py-2.5 bg-emerald-800 text-white text-xs font-semibold rounded-lg hover:bg-emerald-900 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-md border border-red-200">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Omondi"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Phone / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0712 345 678"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-800 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email (Optional)</label>
              <input
                type="email"
                placeholder="e.g. john@example.com"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-800 outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Check-in</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-stone-300 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Check-out</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-stone-300 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Guests</label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="w-full px-2 py-1.5 text-xs border border-stone-300 rounded-lg outline-none"
                >
                  {Array.from({ length: property.maxGuests }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Message or Special Requests</label>
              <textarea
                rows={3}
                placeholder="Ask about late check-in, parking, cooking amenities, or project team stay..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-800 outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Direct Enquiry</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
