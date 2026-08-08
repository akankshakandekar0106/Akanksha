/**
 * KUMBH SARTHI - All Kumbh Locations Directory & CRUD Management
 */

import React, { useState } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  AlertCircle,
  X,
  Check,
  Navigation,
} from 'lucide-react';
import { LocationRecord, LocationCategory, UserRole } from '../types';
import { TRANSLATIONS } from '../lib/translations';
import { GoogleMapsNavModal } from './GoogleMapsNavModal';

interface LocationDirectoryProps {
  locations?: LocationRecord[];
  userRole: UserRole;
  language: 'en' | 'hi' | 'mr';
  onAddLocation: (location: Omit<LocationRecord, 'location_id'>) => void;
  onUpdateLocation: (id: string, updates: Partial<LocationRecord>) => void;
  onDeleteLocation: (id: string) => void;
}

export const LocationDirectory: React.FC<LocationDirectoryProps> = ({
  locations = [],
  userRole,
  language,
  onAddLocation,
  onUpdateLocation,
  onDeleteLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<LocationRecord | null>(null);
  const [navTarget, setNavTarget] = useState<LocationRecord | null>(null);

  const t = TRANSLATIONS[language];

  // Form state
  const [formData, setFormData] = useState({
    location_name: '',
    category: 'GHAT' as LocationCategory,
    latitude: 20.0063,
    longitude: 73.7932,
    description: '',
    crowd_percentage: 50,
    estimated_people: 5000,
    capacity: 10000,
    status: 'OPEN' as LocationRecord['status'],
    facilitiesStr: 'Drinking Water, CCTV, Helpdesk',
    opening_time: '05:00 AM',
    closing_time: '10:00 PM',
    emergency_contact: '+91 253 2570000',
  });

  const categoriesList: LocationCategory[] = [
    'GHAT',
    'TEMPLE',
    'PARKING',
    'POLICE',
    'HOSPITAL',
    'MEDICAL_CAMP',
    'FOOD',
    'WATER',
    'TOILET',
    'TRANSPORT',
    'RAILWAY',
    'BUS_STOP',
    'ACCOMMODATION',
    'INFORMATION_CENTER',
    'EMERGENCY_POINT',
  ];

  const filtered = locations.filter((loc) => {
    const matchesSearch =
      loc.location_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedCategory === 'ALL') return true;
    return loc.category === selectedCategory;
  });

  const handleOpenAddModal = () => {
    setEditingLocation(null);
    setFormData({
      location_name: '',
      category: 'GHAT',
      latitude: 20.0063,
      longitude: 73.7932,
      description: '',
      crowd_percentage: 40,
      estimated_people: 4000,
      capacity: 10000,
      status: 'OPEN',
      facilitiesStr: 'Drinking Water, CCTV, First Aid',
      opening_time: '05:00 AM',
      closing_time: '10:00 PM',
      emergency_contact: '+91 253 2570000',
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (loc: LocationRecord) => {
    setEditingLocation(loc);
    setFormData({
      location_name: loc.location_name,
      category: loc.category,
      latitude: loc.latitude,
      longitude: loc.longitude,
      description: loc.description,
      crowd_percentage: loc.crowd_percentage,
      estimated_people: loc.estimated_people,
      capacity: loc.capacity,
      status: loc.status,
      facilitiesStr: loc.facilities.join(', '),
      opening_time: loc.opening_time,
      closing_time: loc.closing_time,
      emergency_contact: loc.emergency_contact,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const facilities = formData.facilitiesStr.split(',').map((s) => s.trim()).filter(Boolean);

    let crowd_level: LocationRecord['crowd_level'] = 'LOW';
    if (formData.crowd_percentage > 100) crowd_level = 'CRITICAL';
    else if (formData.crowd_percentage > 70) crowd_level = 'HIGH';
    else if (formData.crowd_percentage > 40) crowd_level = 'MEDIUM';

    if (editingLocation) {
      onUpdateLocation(editingLocation.location_id, {
        ...formData,
        facilities,
        crowd_level,
      });
    } else {
      onAddLocation({
        ...formData,
        facilities,
        crowd_level,
      });
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-orange-400" />
            <span>Kumbh Mela Central Location Database</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Scalable repository of verified Nashik Ghats, Temples, Parking, Hospitals & Transit Hubs
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
            />
          </div>

          {(userRole === 'admin' || userRole === 'police') && (
            <button
              onClick={handleOpenAddModal}
              className="flex items-center space-x-1.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow-lg shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Location</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition ${
            selectedCategory === 'ALL'
              ? 'bg-orange-500 text-slate-950 font-bold border-orange-400'
              : 'bg-slate-900 text-slate-300 border-slate-800'
          }`}
        >
          All ({locations.length})
        </button>
        {categoriesList.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition ${
              selectedCategory === cat
                ? 'bg-orange-500 text-slate-950 font-bold border-orange-400'
                : 'bg-slate-900 text-slate-300 border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Location Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((loc) => (
          <div
            key={loc.location_id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between space-y-4 shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/30">
                    {loc.category}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">{loc.location_name}</h3>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    loc.status === 'OPEN'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-red-500/20 text-red-300 border-red-500/40'
                  }`}
                >
                  {loc.status}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{loc.description}</p>

              {/* Crowd Meter */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Crowd Density</span>
                  <span className="font-bold text-orange-400">
                    {loc.estimated_people.toLocaleString()} / {loc.capacity.toLocaleString()} ({loc.crowd_percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      loc.crowd_percentage > 70
                        ? 'bg-red-500'
                        : loc.crowd_percentage > 40
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, loc.crowd_percentage)}%` }}
                  />
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-1 text-xs text-slate-400 pt-1">
                <div className="flex items-center space-x-2">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Hours: {loc.opening_time} - {loc.closing_time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>Contact: {loc.emergency_contact}</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <button
                onClick={() => setNavTarget(loc)}
                className="w-full flex items-center justify-center space-x-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 hover:from-orange-600 hover:to-emerald-600 text-slate-950 font-extrabold py-2 rounded-xl text-xs shadow transition"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>NAVIGATE WITH GOOGLE MAPS</span>
              </button>

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>GPS: {loc.latitude.toFixed(3)}, {loc.longitude.toFixed(3)}</span>

                {(userRole === 'admin' || userRole === 'police') && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(loc)}
                      className="p-1 text-amber-400 hover:bg-amber-500/10 rounded transition"
                      title="Edit Location"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteLocation(loc.location_id)}
                      className="p-1 text-red-400 hover:bg-red-500/10 rounded transition"
                      title="Delete Location"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Location Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingLocation ? 'Edit Location' : 'Add New Kumbh Location'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Location Name</label>
                  <input
                    type="text"
                    required
                    value={formData.location_name}
                    onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as LocationCategory })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {categoriesList.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Estimated People</label>
                  <input
                    type="number"
                    value={formData.estimated_people}
                    onChange={(e) =>
                      setFormData({ ...formData, estimated_people: parseInt(e.target.value) || 0 })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Total Capacity</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: parseInt(e.target.value) || 1000 })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Crowd %</label>
                  <input
                    type="number"
                    value={formData.crowd_percentage}
                    onChange={(e) =>
                      setFormData({ ...formData, crowd_percentage: parseInt(e.target.value) || 0 })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Opening Time</label>
                  <input
                    type="text"
                    value={formData.opening_time}
                    onChange={(e) => setFormData({ ...formData, opening_time: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Closing Time</label>
                  <input
                    type="text"
                    value={formData.closing_time}
                    onChange={(e) => setFormData({ ...formData, closing_time: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Facilities (Comma Separated)</label>
                <input
                  type="text"
                  value={formData.facilitiesStr}
                  onChange={(e) => setFormData({ ...formData, facilitiesStr: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-500 text-slate-950 font-bold rounded-xl hover:bg-orange-400"
                >
                  Save Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Google Maps Pre-Navigation Modal */}
      <GoogleMapsNavModal
        isOpen={Boolean(navTarget)}
        onClose={() => setNavTarget(null)}
        destination={navTarget}
        allLocations={locations}
      />
    </div>
  );
};
