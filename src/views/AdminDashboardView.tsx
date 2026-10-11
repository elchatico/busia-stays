import React, { useState } from 'react';
import { db, DatabaseService } from '../services/db';
import { Property, Enquiry, Host, PropertyStatus } from '../types';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Star, 
  Trash2, 
  Plus, 
  RotateCcw, 
  MessageSquare, 
  Phone, 
  ExternalLink, 
  Check, 
  Eye, 
  Clock, 
  AlertCircle,
  Building,
  Users,
  Search
} from 'lucide-react';

interface AdminDashboardViewProps {
  onViewProperty: (slug: string) => void;
  onRefreshData?: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  onViewProperty,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<'submissions' | 'all-properties' | 'enquiries' | 'hosts'>('submissions');
  const [refreshKey, setRefreshKey] = useState(0);

  // Data fetching
  const stats = db.getPlatformStats();
  const allProperties = db.getProperties({ includePending: true });
  const pendingProperties = allProperties.filter(p => p.status === 'pending');
  const enquiries = db.getEnquiries();
  const hosts = db.getHosts();

  // New property modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('Apartment');
  const [newLocId, setNewLocId] = useState('loc-cbd');
  const [newPrice, setNewPrice] = useState(3500);
  const [newGuests, setNewGuests] = useState(2);
  const [newRooms, setNewRooms] = useState(1);
  const [newAddress, setNewAddress] = useState('Busia CBD, Customs Road');
  const [newDesc, setNewDesc] = useState('');

  const triggerUpdate = () => {
    setRefreshKey(prev => prev + 1);
    if (onRefreshData) onRefreshData();
  };

  const handleApprove = (id: string) => {
    db.updatePropertyStatus(id, 'active');
    triggerUpdate();
  };

  const handleReject = (id: string) => {
    db.updatePropertyStatus(id, 'rejected');
    triggerUpdate();
  };

  const handleToggleFeatured = (id: string) => {
    db.toggleFeatureProperty(id);
    triggerUpdate();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      db.deleteProperty(id);
      triggerUpdate();
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset all Busia Stays data back to initial seed data?')) {
      db.resetToDefault();
      triggerUpdate();
    }
  };

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const loc = db.getLocationById(newLocId);
    db.createProperty({
      title: newTitle,
      propertyType: newType as any,
      locationId: newLocId,
      locationName: loc?.name || 'Busia CBD',
      address: newAddress,
      pricePerNight: Number(newPrice),
      maxGuests: Number(newGuests),
      bedrooms: Number(newRooms),
      beds: Number(newRooms),
      bathrooms: 1,
      description: newDesc || `Executive ${newType} in ${loc?.name}, Busia.`,
      amenityIds: ['wifi', 'parking', 'hot_shower', 'security'],
      houseRules: ['Check-in 12:00 PM', 'Check-out 10:30 AM'],
      sleepingArrangement: '1 Queen Bed',
      hostId: 'host-1',
      isFeatured: false,
      isVerified: true,
      status: 'active',
      primaryImage: '/src/assets/images/busia_executive_suite_1791403472206.jpg',
      additionalImages: ['/src/assets/images/hero_busia_villa_1791403460678.jpg']
    });

    setShowAddModal(false);
    setNewTitle('');
    triggerUpdate();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" key={refreshKey}>
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-800 text-amber-300">
              <Shield className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Busia Stays Admin Operations
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Platform management, property curation, host verification & guest enquiries
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Property</span>
          </button>

          <button
            onClick={handleResetData}
            className="px-3 py-2 border border-stone-300 hover:bg-stone-50 text-slate-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
            title="Reset to default seed data"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* STATS TILES */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Total Properties</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {stats.totalProperties}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">In database</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs">
          <div className="text-xs text-emerald-700 font-medium">Active Public</div>
          <div className="text-2xl font-bold text-emerald-800 mt-1 tabular-nums">
            {stats.activeProperties}
          </div>
          <div className="text-[11px] text-emerald-600 mt-0.5">Live on Busia Stays</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs">
          <div className="text-xs text-amber-700 font-medium">Pending Approvals</div>
          <div className="text-2xl font-bold text-amber-800 mt-1 tabular-nums">
            {stats.pendingApprovals}
          </div>
          <div className="text-[11px] text-amber-600 mt-0.5">Awaiting host check</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Guest Enquiries</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {stats.totalEnquiries}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Direct & WhatsApp</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Featured Stays</div>
          <div className="text-2xl font-bold text-amber-600 mt-1 tabular-nums">
            {stats.featuredProperties}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Homepage highlights</div>
        </div>

      </div>

      {/* TABS NAVIGATION */}
      <div className="flex border-b border-stone-200 gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('submissions')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'submissions'
              ? 'text-emerald-900 border-b-2 border-emerald-900'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Pending Submissions ({pendingProperties.length})</span>
          {pendingProperties.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[10px] rounded-full">
              New
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('all-properties')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'all-properties'
              ? 'text-emerald-900 border-b-2 border-emerald-900'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          All Properties ({allProperties.length})
        </button>

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'enquiries'
              ? 'text-emerald-900 border-b-2 border-emerald-900'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Guest Enquiries ({enquiries.length})
        </button>

        <button
          onClick={() => setActiveTab('hosts')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'hosts'
              ? 'text-emerald-900 border-b-2 border-emerald-900'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Verified Hosts ({hosts.length})
        </button>
      </div>

      {/* TAB 1: PENDING SUBMISSIONS */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          {pendingProperties.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-stone-200 text-slate-500 space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-slate-900 text-sm">No Pending Submissions</h3>
              <p className="text-xs">All host property submissions have been reviewed and approved.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingProperties.map((prop) => {
                const host = db.getHostById(prop.hostId);
                return (
                  <div
                    key={prop.id}
                    className="p-5 bg-white rounded-xl border border-amber-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">
                          PENDING REVIEW
                        </span>
                        <span className="text-xs text-slate-400">
                          Submitted {new Date(prop.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-slate-900">{prop.title}</h3>
                      <div className="text-xs text-slate-600">
                        {prop.propertyType} · {prop.locationName} ({prop.address}) · KES {prop.pricePerNight.toLocaleString()}/night
                      </div>
                      {host && (
                        <div className="text-xs text-slate-500 flex items-center gap-3 pt-1">
                          <span>Host: <strong>{host.name}</strong></span>
                          <span>WhatsApp: {host.whatsapp}</span>
                          <span>Phone: {host.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(prop.id)}
                        className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve & Publish</span>
                      </button>

                      <button
                        onClick={() => handleReject(prop.id)}
                        className="px-3 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-medium rounded-lg flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => onViewProperty(prop.slug)}
                        className="px-3 py-2 border border-stone-200 text-slate-700 hover:bg-stone-50 text-xs font-medium rounded-lg"
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ALL PROPERTIES TABLE */}
      {activeTab === 'all-properties' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-slate-600 border-b border-stone-200">
                <tr>
                  <th className="p-3.5 font-semibold">Property</th>
                  <th className="p-3.5 font-semibold">Location</th>
                  <th className="p-3.5 font-semibold">Type</th>
                  <th className="p-3.5 font-semibold">Price / Night</th>
                  <th className="p-3.5 font-semibold">Status</th>
                  <th className="p-3.5 font-semibold">Featured</th>
                  <th className="p-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-slate-700">
                {allProperties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-900 line-clamp-1">{prop.title}</div>
                      <div className="text-[11px] text-slate-400">Slug: {prop.slug}</div>
                    </td>
                    <td className="p-3.5">{prop.locationName}</td>
                    <td className="p-3.5">{prop.propertyType}</td>
                    <td className="p-3.5 font-bold tabular-nums">KES {prop.pricePerNight.toLocaleString()}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        prop.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : prop.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {prop.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => handleToggleFeatured(prop.id)}
                        className={`p-1.5 rounded transition-colors ${
                          prop.isFeatured
                            ? 'text-amber-500 hover:text-amber-600'
                            : 'text-stone-300 hover:text-stone-400'
                        }`}
                        title={prop.isFeatured ? 'Unfeature' : 'Feature on homepage'}
                      >
                        <Star className={`w-4 h-4 ${prop.isFeatured ? 'fill-amber-400' : ''}`} />
                      </button>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => onViewProperty(prop.slug)}
                        className="text-emerald-800 hover:underline font-medium"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(prop.id)}
                        className="text-rose-600 hover:text-rose-800 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: GUEST ENQUIRIES */}
      {activeTab === 'enquiries' && (
        <div className="space-y-4">
          {enquiries.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-stone-200 text-slate-500">
              No enquiries recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {enquiries.map((enq) => (
                <div
                  key={enq.id}
                  className="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{enq.guestName}</span>
                      <span className="text-slate-400 ml-2">Phone: {enq.guestPhone}</span>
                    </div>
                    <span className="text-slate-400">
                      {new Date(enq.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="text-slate-600">
                    Stay: <strong>{enq.propertyTitle}</strong> · Dates: {enq.checkInDate} to {enq.checkOutDate} ({enq.guestsCount} guests)
                  </div>

                  <div className="p-3 bg-stone-50 rounded-lg text-slate-700 italic border border-stone-100">
                    "{enq.message}"
                  </div>

                  <div className="pt-2 flex items-center justify-between text-slate-500">
                    <span>Channel: {enq.whatsappSent ? 'WhatsApp Initiated' : 'Website Direct Form'}</span>
                    <a
                      href={`https://wa.me/${enq.guestPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(enq.guestName)}%2C%20regarding%20your%20Busia%20Stays%20enquiry.`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-md font-semibold hover:bg-emerald-100 transition-colors flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Follow Up on WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: HOSTS DIRECTORY */}
      {activeTab === 'hosts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hosts.map((host) => {
            const hostProps = allProperties.filter(p => p.hostId === host.id);
            return (
              <div key={host.id} className="p-5 bg-white rounded-xl border border-stone-200 space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-800 text-amber-300 font-bold flex items-center justify-center text-sm">
                    {host.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{host.name}</h3>
                    <p className="text-slate-400">{host.joinedDate}</p>
                  </div>
                </div>

                <div className="space-y-1 text-slate-600">
                  <div><strong>Phone:</strong> {host.phone}</div>
                  <div><strong>WhatsApp:</strong> {host.whatsapp}</div>
                  <div><strong>Response Time:</strong> {host.responseTime}</div>
                  <div><strong>Listings:</strong> {hostProps.length} property(s) in Busia</div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-emerald-700 font-medium">✓ Verified Partner</span>
                  <a
                    href={`https://wa.me/${host.whatsapp}?text=Hello%20${encodeURIComponent(host.name)}%2C%20from%20Busia%20Stays%20HQ.`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-600 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <span>Contact</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD NEW PROPERTY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-bold text-base text-slate-900">Add Property to Busia Catalog</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickAdd} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Property Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Korinda Sunset 1-Bedroom"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Property Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Airbnb">Airbnb</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Guesthouse">Guesthouse</option>
                    <option value="Villa">Villa</option>
                    <option value="Furnished">Furnished</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Location</label>
                  <select
                    value={newLocId}
                    onChange={(e) => setNewLocId(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    {db.getLocations().map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Price / Night</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full p-2 border rounded-md font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Guests</label>
                  <input
                    type="number"
                    value={newGuests}
                    onChange={(e) => setNewGuests(Number(e.target.value))}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={newRooms}
                    onChange={(e) => setNewRooms(Number(e.target.value))}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Address / Landmark</label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Key features, generator, Wi-Fi..."
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 border rounded-md text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 text-white font-semibold rounded-md"
                >
                  Create & Activate Stay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
