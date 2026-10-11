import React, { useState } from 'react';
import { db } from '../services/db';
import { PropertyType } from '../types';
import { 
  Building2, 
  MessageCircle, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles, 
  DollarSign, 
  ShieldCheck, 
  Users, 
  Upload, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';

interface ListPropertyViewProps {
  onPropertySubmitted?: () => void;
  onNavigate: (view: string) => void;
}

export const ListPropertyView: React.FC<ListPropertyViewProps> = ({
  onPropertySubmitted,
  onNavigate,
}) => {
  const locations = db.getLocations();
  const amenitiesList = db.getAmenities();

  // Earnings Calculator State
  const [calcRate, setCalcRate] = useState<number>(3500);
  const [calcOccupancy, setCalcOccupancy] = useState<number>(15);
  const estimatedMonthly = calcRate * calcOccupancy;

  // Onboarding Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('Apartment');
  const [locationId, setLocationId] = useState(locations[0]?.id || 'loc-cbd');
  const [address, setAddress] = useState('');
  const [rooms, setRooms] = useState(1);
  const [maxGuests, setMaxGuests] = useState(2);
  const [pricePerNight, setPricePerNight] = useState<number>(3500);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'wifi',
    'hot_shower',
    'security'
  ]);
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [preferredContact, setPreferredContact] = useState<'whatsapp' | 'phone' | 'email'>('whatsapp');
  
  // Submission Status
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const toggleAmenity = (id: string) => {
    setSelectedAmenities(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !propertyName || !pricePerNight) {
      setError('Please fill in all required fields.');
      return;
    }

    // 1. Create or ensure host in DB
    const host = db.createOrUpdateHost({
      name: fullName.trim(),
      phone: phone.trim(),
      whatsapp: whatsappNumber.trim() || phone.trim(),
      responseTime: 'Replies usually within 30 mins',
      isVerified: false,
      bio: `Host of ${propertyName} in Busia.`
    });

    const chosenLoc = locations.find(l => l.id === locationId) || locations[0];

    // 2. Insert property as 'pending'
    const defaultPhoto = photoUrl.trim() || '/src/assets/images/busia_executive_suite_1791403472206.jpg';

    db.createProperty({
      title: propertyName.trim(),
      propertyType,
      locationId: chosenLoc.id,
      locationName: chosenLoc.name,
      address: address.trim() || `${chosenLoc.name}, Busia County`,
      pricePerNight: Number(pricePerNight),
      maxGuests: Number(maxGuests),
      bedrooms: Number(rooms),
      beds: Number(rooms),
      bathrooms: 1,
      description: description.trim() || `Modern ${propertyType} located in ${chosenLoc.name}, Busia. Contact host directly for availability.`,
      amenityIds: selectedAmenities,
      houseRules: [
        'Check-in: From 12:00 PM',
        'Check-out: By 10:30 AM',
        'Valid ID required at check-in'
      ],
      sleepingArrangement: `${rooms} bedroom with comfortable bedding`,
      hostId: host.id,
      isFeatured: false,
      isVerified: false,
      status: 'pending',
      primaryImage: defaultPhoto,
      additionalImages: [
        '/src/assets/images/hero_busia_villa_1791403460678.jpg'
      ]
    });

    // 2. Open WhatsApp with pre-filled details
    const selectedLocationObj = locations.find(l => l.id === locationId);
    const locName = selectedLocationObj ? selectedLocationObj.name : 'Busia';
    const selectedAmenityNames = selectedAmenities
      .map(id => amenitiesList.find(a => a.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    const waMessage = `Hello Busia Stays, I would like to list my property on your platform.

*Host Name:* ${fullName.trim()}
*Phone:* ${phone.trim()}
*WhatsApp:* ${whatsappNumber.trim() || phone.trim()}
*Property Name:* ${propertyName.trim()}
*Property Type:* ${propertyType}
*Location:* ${locName}${address ? ` (${address})` : ''}
*Price per Night:* KES ${pricePerNight.toLocaleString()}
*Capacity:* ${rooms} Bedroom(s), Max ${maxGuests} Guest(s)
*Amenities:* ${selectedAmenityNames || 'Standard'}
*Description:* ${description.trim() || 'Ready for guests'}

Please review and guide me on how to publish my property.`;

    const encoded = encodeURIComponent(waMessage);
    const waUrl = `https://wa.me/254712345678?text=${encoded}`;

    setIsSubmitted(true);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    if (onPropertySubmitted) onPropertySubmitted();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Busia Stays Partner Network</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Turn your Busia property into a digital business.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Whether you run an Airbnb, furnished apartment, guesthouse or hotel, Busia Stays helps travelers discover your property and contact you directly.
          </p>

          <div className="pt-4 flex items-center justify-center gap-4">
            <a
              href="#onboarding-form"
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all"
            >
              List My Property Now
            </a>
          </div>
        </div>
      </section>

      {/* 2. BENEFITS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Why list on Busia Stays?
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Built specifically for the Western Kenya hospitality market
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl border border-stone-200/80 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base">Professional Property Page</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Showcase high-resolution photos, amenities, bedroom layouts and verified trust badges without spending KES 50,000 to build your own website.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-stone-200/80 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base">Direct WhatsApp Enquiries</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enquiries go straight to your personal WhatsApp number with dates and guest counts pre-formatted. Agree on terms directly.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-stone-200/80 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base">More Year-Round Visibility</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Reach business consultants, NGO project directors, border traders and returning families who search Google before visiting Busia.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-stone-200/80 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base">Zero Launch Commissions</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unlike international platforms charging 15-20% per booking, Busia Stays takes 0% commission during our early partner launch period.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-stone-200/80 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base">Local Busia Audience</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Direct traffic from travelers specifically searching for stays near Busia CBD, Customs Border Post, Matayos, and Nambale.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-stone-200/80 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base">Simple Host Management</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Update your nightly rates, phone number or photos whenever you wish through our verified host desk.
            </p>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE HOST EARNINGS CALCULATOR */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-10 border border-emerald-900 shadow-xl space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Estimate your monthly earnings in Busia
            </h3>
            <p className="text-xs text-emerald-300">
              See what your furnished apartment or Airbnb could generate
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-300">Nightly Price (KES)</span>
                <span className="font-bold text-amber-300 tabular-nums">KES {calcRate.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={2000}
                max={10000}
                step={250}
                value={calcRate}
                onChange={(e) => setCalcRate(Number(e.target.value))}
                className="w-full accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>KES 2,000</span>
                <span>KES 10,000</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-300">Booked Nights / Month</span>
                <span className="font-bold text-amber-300 tabular-nums">{calcOccupancy} nights</span>
              </div>
              <input
                type="range"
                min={5}
                max={28}
                step={1}
                value={calcOccupancy}
                onChange={(e) => setCalcOccupancy(Number(e.target.value))}
                className="w-full accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>5 nights (17%)</span>
                <span>28 nights (93%)</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-emerald-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 bg-emerald-900/40 p-4 rounded-xl">
            <div>
              <div className="text-xs text-slate-300">Estimated Monthly Revenue</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 tabular-nums">
                KES {estimatedMonthly.toLocaleString()}
              </div>
            </div>
            <div className="text-xs text-emerald-200 sm:text-right">
              Direct to your M-Pesa / Bank account.<br />No intermediary holds.
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOST ONBOARDING FORM */}
      <section id="onboarding-form" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-10 shadow-lg space-y-6">
          
          <div className="border-b border-stone-200 pb-4">
            <h2 className="text-2xl font-bold text-slate-900">
              Host Onboarding Form
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Submit your property details below. Our Busia verification team will review and approve your digital storefront.
            </p>
          </div>

          {isSubmitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Property Submitted Successfully!
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Thanks! Our team will review your property and contact you shortly on WhatsApp (<strong>{whatsappNumber || phone}</strong>) to verify your location and activate your public page.
              </p>
              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-4 py-2 border border-stone-300 text-xs font-semibold rounded-lg hover:bg-stone-50"
                >
                  Submit Another Property
                </button>
                <button
                  onClick={() => onNavigate('admin')}
                  className="px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-lg hover:bg-emerald-900"
                >
                  View in Admin Portal
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200">
                  {error}
                </div>
              )}

              {/* Host contact details */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  1. Host Information
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Grace Barasa"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-800 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0712 345 678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-800 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0712 345 678 or 254..."
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-800 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. grace@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-800 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Property details */}
              <div className="space-y-4 pt-4 border-t border-stone-200">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  2. Property Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Property Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Palms Executive 1-Bedroom"
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
                      Location in Busia *
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
                      Specific Address / Landmark *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Near Khetias Supermarket, Customs Road"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-800 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Number of Rooms
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={rooms}
                      onChange={(e) => setRooms(Number(e.target.value))}
                      className="w-full text-xs p-2 border border-stone-300 rounded-lg outline-none"
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
                      className="w-full text-xs p-2 border border-stone-300 rounded-lg outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Price / Night (KES) *
                    </label>
                    <input
                      type="number"
                      step={100}
                      required
                      placeholder="3500"
                      value={pricePerNight}
                      onChange={(e) => setPricePerNight(Number(e.target.value))}
                      className="w-full text-xs p-2 border border-stone-300 rounded-lg outline-none font-semibold text-slate-900"
                    />
                  </div>
                </div>

                {/* Amenities multiselect */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Available Amenities
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
                    Property Description & Highlights
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your property, power backup status, security features, bed types, nearby institutions..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full text-xs p-3 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-800 outline-none"
                  />
                </div>

                {/* Photo URL */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Primary Photo (Image URL or demo sample)
                  </label>
                  <input
                    type="text"
                    placeholder="Leave blank to use default Busia studio photography"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-lg outline-none"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Our team can also come take professional photos of your property in Busia during verification.
                  </span>
                </div>

                {/* Preferred contact method */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Preferred Contact Method
                  </label>
                  <div className="flex gap-4 text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="contact"
                        checked={preferredContact === 'whatsapp'}
                        onChange={() => setPreferredContact('whatsapp')}
                        className="text-emerald-800"
                      />
                      <span>WhatsApp (Fastest)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="contact"
                        checked={preferredContact === 'phone'}
                        onChange={() => setPreferredContact('phone')}
                        className="text-emerald-800"
                      />
                      <span>Phone Call</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="contact"
                        checked={preferredContact === 'email'}
                        onChange={() => setPreferredContact('email')}
                        className="text-emerald-800"
                      />
                      <span>Email</span>
                    </label>
                  </div>
                </div>

              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2.5 group"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-emerald-600 group-hover:scale-110 transition-transform" />
                  <span>Submit Listing via WhatsApp</span>
                </button>
                <p className="text-[11px] text-slate-500 text-center mt-2">
                  No credit card required. Free direct WhatsApp submission to Busia Stays Onboarding (+254 712 345 678).
                </p>
              </div>

            </form>
          )}

        </div>
      </section>

    </div>
  );
};
