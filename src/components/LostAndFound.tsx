/**
 * KUMBH SARTHI - Lost & Found Portal
 */

import React, { useState } from 'react';
import {
  SearchX,
  Plus,
  Search,
  CheckCircle2,
  Phone,
  Calendar,
  MapPin,
  Camera,
  X,
  User,
  Tag,
} from 'lucide-react';
import { LostFoundItem, LostFoundStatus, UserRole } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface LostAndFoundProps {
  items?: LostFoundItem[];
  userRole: UserRole;
  language: 'en' | 'hi' | 'mr';
  onAddItem: (item: Omit<LostFoundItem, 'id' | 'created_at'>) => void;
  onUpdateStatus: (id: string, status: LostFoundStatus) => void;
}

export const LostAndFound: React.FC<LostAndFoundProps> = ({
  items = [],
  userRole,
  language,
  onAddItem,
  onUpdateStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'LOST' | 'FOUND'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const t = TRANSLATIONS[language];

  // Form state
  const [type, setType] = useState<'LOST' | 'FOUND'>('LOST');
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<LostFoundItem['category']>('BELONGINGS');
  const [locationName, setLocationName] = useState('Panchavati Circle');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const filtered = items.filter((item) => {
    const matchesSearch =
      item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location_name.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeTab === 'ALL') return true;
    return item.type === activeTab;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddItem({
      type,
      item_name: itemName,
      description,
      category,
      location_name: locationName,
      date_time: new Date().toISOString().slice(0, 16).replace('T', ' '),
      contact_name: contactName || 'Pilgrim',
      contact_phone: contactPhone || '+91 98000 00000',
      status: type === 'LOST' ? 'LOST' : 'FOUND',
    });
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
            <SearchX className="w-5 h-5 text-orange-400" />
            <span>Kumbh Mela Lost & Found Assistance Desk</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Centralized portal for reporting lost pilgrims, children, documents, mobile phones & sacred belongings
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setType('LOST');
              setModalOpen(true);
            }}
            className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-lg transition"
          >
            + I Lost Something
          </button>
          <button
            onClick={() => {
              setType('FOUND');
              setModalOpen(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-lg transition"
          >
            + I Found Something
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-4 py-1.5 rounded-lg font-bold transition ${
              activeTab === 'ALL' ? 'bg-orange-500 text-slate-950' : 'text-slate-400'
            }`}
          >
            All Reports ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('LOST')}
            className={`px-4 py-1.5 rounded-lg font-bold transition ${
              activeTab === 'LOST' ? 'bg-red-500 text-white' : 'text-slate-400'
            }`}
          >
            Lost Items ({items.filter((i) => i.type === 'LOST').length})
          </button>
          <button
            onClick={() => setActiveTab('FOUND')}
            className={`px-4 py-1.5 rounded-lg font-bold transition ${
              activeTab === 'FOUND' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
            }`}
          >
            Found Items ({items.filter((i) => i.type === 'FOUND').length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search lost child, pouch, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Cards Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between space-y-4 shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      item.type === 'LOST'
                        ? 'bg-red-950 text-red-300 border border-red-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {item.type} • {item.category}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5">{item.item_name}</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {item.status}
                </span>
              </div>

              <p className="text-xs text-slate-300">{item.description}</p>

              <div className="space-y-1 text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>Location: {item.location_name}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>Reported: {item.date_time}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Contact: {item.contact_name} ({item.contact_phone})</span>
                </div>
              </div>
            </div>

            {/* Admin or Creator Actions */}
            {(userRole === 'admin' || userRole === 'police' || userRole === 'volunteer') && (
              <div className="pt-2 border-t border-slate-800 flex items-center justify-end space-x-2">
                <button
                  onClick={() => onUpdateStatus(item.id, 'MATCHED')}
                  className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2.5 py-1 rounded font-semibold"
                >
                  Mark Matched
                </button>
                <button
                  onClick={() => onUpdateStatus(item.id, 'RETURNED')}
                  className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded font-semibold"
                >
                  Mark Returned
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {type === 'LOST' ? 'Report Lost Item / Person' : 'Report Found Item / Person'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Item or Person Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Leather Wallet / 8yr Child Aarav"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="PERSON">PERSON / CHILD</option>
                    <option value="BELONGINGS">BELONGINGS / BAG</option>
                    <option value="DOCUMENT">DOCUMENTS / AADHAAR</option>
                    <option value="ELECTRONICS">MOBILE / PHONE</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description / Marks</label>
                <textarea
                  rows={2}
                  placeholder="Describe color, identifying marks, phone brand..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contact Name</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-500 text-slate-950 font-bold rounded-xl"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
