import React, { useState } from 'react';
import { db } from '../services/db';
import { PropertyType } from '../types';
import { 
  MessageCircle, 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  Building2, 
  Phone, 
  MapPin, 
  Tag, 
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

const ONBOARDING_WHATSAPP_NUMBER = '254712345678'; // Busia Stays Partner Concierge

export const HostWhatsAppListingSection: React.FC = () => {
  const locations = db.getLocations();
  const amenitiesList = db.getAmenities();

  // Form State
  const [hostName, setHostName] = useState('');
  const [hostPhone, setHostPhone] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('Apartment');
  const [locationId, setLocationId] = useState(locations[0]?.id || 'loc-cbd');
  const [address, setAddress] = useState('');
  const [pricePerNight, setPricePerNight] = useState<number>(3500);
  const [bedrooms, setBedrooms] = useState<number>(1);
  const [maxGuests, setMaxGuests] = useState<number>(2);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'wifi',
    'hot_shower',
    'security'
  ]);
  const [description, setDescription] = useState('');

  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleAmenity = (id: string) => {
    setSelectedAmenities(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  // Selected location name
  const selectedLocationObj = locations.find(l => l.id === locationId);
  const locationName = selectedLocationObj ? selectedLocationObj.name : 'Busia';

  // Selected amenity names
  const selectedAmenityNames = selectedAmenities
    .map(id => amenitiesList.find(a => a.id === id)?.name)
    .filter(Boolean)
    .join(', ');

  // Compile message for WhatsApp
  const generateMessage = () => {
    return `Hello Busia Stays, I would like to list my property on your platform.

*Host Name:* ${hostName || '[My Name]'}
*Phone:* ${hostPhone || '[My Phone]'}
*Property Name:* ${propertyName || '[Property Name]'}
*Property Type:* ${propertyType}
*Location:* ${locationName}${address ? ` (${address})` : ''}
*Price per Night:* KES ${pricePerNight.toLocaleString()}
*Capacity:* ${bedrooms} Bedroom(s), Max ${maxGuests} Guest(s)
*Amenities:* ${selectedAmenityNames || 'Standard'}
*Description:* ${description || 'Ready for guests'}

Please review and guide me on the next steps to publish my stay.`;
  };

  const currentMessage = generateMessage();

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(currentMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    if (!hostName.trim() || !hostPhone.trim() || !propertyName.trim()) {
      alert('Please fill in your name, phone number, and property name.');
      return;
    }

    // Also register in local DB so it is recorded
    const host = db.createOrUpdateHost({
      name: hostName.trim(),
      phone: hostPhone.trim(),
      whatsapp: hostPhone.trim(),
      responseTime: 'Replies within 30 mins',
      isVerified: false,
      bio: `Host of ${propertyName.trim()} in Busia`
    });

    db.createProperty({
      title: propertyName.trim(),
      propertyType,
      locationId: locationId,
      locationName: locationName,
      address: address.trim() || `${locationName}, Busia`,
      pricePerNight: Number(pricePerNight),
      maxGuests: Number(maxGuests),
      bedrooms: Number(bedrooms),
      beds: Number(bedrooms),
      bathrooms: 1,
      description: description.trim() || `Modern ${propertyType} in ${locationName}, Busia.`,
      amenityIds: selectedAmenities,
      houseRules: ['Check-in 12:00 PM', 'Check-out 10:30 AM'],
      sleepingArrangement: `${bedrooms} Bedroom with quality bedding`,
      hostId: host.id,
      isFeatured: false,
      isVerified: false,
      status: 'active', // Active immediately so the user can see their submission right on the page!
      primaryImage: '/src/assets/images/busia_executive_suite_1791403472206.jpg',
      additionalImages: ['/src/assets/images/hero_busia_villa_1791403460678.jpg']
    });

    setSubmitted(true);

    // Open WhatsApp
    const encoded = encodeURIComponent(currentMessage);
    const waUrl = `https://wa.me/${ONBOARDING_WHATSAPP_NUMBER}?text=${encoded}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="list-property" className="relative scroll-mt-20">
      
      {/* Background container */}
      <div className="bg-gradient-to-b from-stone-100/80 to-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 lg:p-12 shadow-sm">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>For Property Owners in Busia</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
            List Your Property via WhatsApp
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-balance">
            Own a furnished apartment, Airbnb, guesthouse, or hotel in Busia? No complex registration or accounts required. Fill in the details below and tap <strong>Submit via WhatsApp</strong> to message our Busia listing desk directly.
          </p>
        </div>

        {/* Success Confirmation state */}
        {submitted && (
          <div className="mb-8 max-w-xl mx-auto p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 space-y-1">
              <strong className="text-emerald-900 font-semibold block">Listing Request Prepared & WhatsApp Opened!</strong>
              <p>
                Your property <strong>{propertyName}</strong> has been prepared. If WhatsApp did not open automatically, tap the button below or copy the pre-filled message.
              </p>
            </div>
          </div>
        )}

        {/* Main Grid: Form + Live WhatsApp Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Side (7 cols) */}
          <form onSubmit={handleSubmitWhatsApp} className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs space-y-5">
            
            <div className="border-b border-stone-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                1. Your Contact Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Host Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grace Barasa"
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Phone / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0712 345 678"
                  value={hostPhone}
                  onChange={(e) => setHostPhone(e.target.value)}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-800 outline-none"
                />
              </div>
            </div>

            <div className="border-b border-stone-100 pb-3 pt-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                2. Property Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Property Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Border View Executive Flat"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Property Type *
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-lg bg-stone-50 outline-none"
                >
                  <option value="Apartment">Furnished Apartment</option>
                  <option value="Airbnb">Airbnb</option>
                  <option value="Villa">Villa / Private Compound</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Guesthouse">Guesthouse</option>
                  <option value="Furnished">Serviced Suite</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Neighborhood in Busia *
                </label>
                <select
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-lg bg-stone-50 outline-none"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Specific Area / Landmark
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near Posta, Off Customs Road"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-800 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Price / Night (KES) *
                </label>
                <input
                  type="number"
                  step={100}
                  required
                  value={pricePerNight}
                  onChange={(e) => setPricePerNight(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-lg font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Bedrooms
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Max Guests
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={maxGuests}
                  onChange={(e) => setMaxGuests(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-lg outline-none"
                />
              </div>
            </div>

            {/* Amenities Checklist */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Key Amenities
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {amenitiesList.map((a) => (
                  <label key={a.id} className="flex items-center gap-2 text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(a.id)}
                      onChange={() => toggleAmenity(a.id)}
                      className="rounded border-stone-300 text-emerald-800 focus:ring-emerald-800"
                    />
                    <span>{a.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Brief Description / Special Features
              </label>
              <textarea
                rows={3}
                placeholder="Mention Wi-Fi speed, backup generator, quiet surroundings, or proximity to the border..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-800 outline-none"
              />
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2.5 group"
              >
                <MessageCircle className="w-5 h-5 fill-white text-emerald-600 group-hover:scale-110 transition-transform" />
                <span>Submit Listing via WhatsApp</span>
                <ExternalLink className="w-4 h-4 opacity-80" />
              </button>
              <p className="text-[11px] text-slate-400 text-center mt-2">
                Direct WhatsApp submission to Busia Stays Onboarding Desk (+254 712 345 678). Zero platform commissions.
              </p>
            </div>

          </form>

          {/* WhatsApp Preview Side (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-emerald-950 text-white p-6 rounded-2xl border border-emerald-900 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                  Live Message Preview
                </span>
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1 font-medium"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>

              {/* Chat bubble */}
              <div className="bg-[#0b141a] p-4 rounded-xl text-xs font-mono text-emerald-100/90 whitespace-pre-wrap leading-relaxed border border-emerald-900/60 max-h-96 overflow-y-auto">
                {currentMessage}
              </div>

              <div className="text-[11px] text-emerald-300/80 space-y-1.5 pt-2 border-t border-emerald-900/60">
                <div className="font-semibold text-white">How it works:</div>
                <div>1. Fill in your property specs on the left.</div>
                <div>2. Tap <strong>Submit Listing via WhatsApp</strong>.</div>
                <div>3. Our Busia coordinator reviews your stay, helps with photos, and activates your property for guests.</div>
              </div>
            </div>

            {/* Quick Host Benefits */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 text-xs text-slate-600 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Why Busia Hosts Choose Us</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Zero commissions:</strong> Keep 100% of guest payments during the launch period.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Direct WhatsApp guests:</strong> Travelers message your WhatsApp directly with dates pre-filled.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Professional storefront:</strong> Showcase your stay to visitors from Nairobi, Kisumu, and Uganda.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
