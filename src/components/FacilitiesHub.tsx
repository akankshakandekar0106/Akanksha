/**
 * KUMBH SARTHI - Facilities Hub
 * Parking, Medical, Police, Food & Water, Public Toilets, Accommodation, Transport
 */

import React, { useState } from 'react';
import {
  Car,
  ShieldCheck,
  Stethoscope,
  Utensils,
  Droplets,
  Building,
  Bus,
  Search,
  CheckCircle2,
  Clock,
  Phone,
  Layers,
  MapPin,
  AlertCircle,
} from 'lucide-react';

import {
  ParkingFacility,
  MedicalFacility,
  PoliceFacility,
  FoodWaterFacility,
  ToiletFacility,
  AccommodationFacility,
  TransportOption,
  UserRole,
} from '../types';

interface FacilitiesHubProps {
  parking?: ParkingFacility[];
  medical?: MedicalFacility[];
  police?: PoliceFacility[];
  foodWater?: FoodWaterFacility[];
  toilets?: ToiletFacility[];
  accommodation?: AccommodationFacility[];
  transport?: TransportOption[];
  userRole: UserRole;
  onUpdateParkingOccupancy: (id: string, occupied: number) => void;
}

export const FacilitiesHub: React.FC<FacilitiesHubProps> = ({
  parking = [],
  medical = [],
  police = [],
  foodWater = [],
  toilets = [],
  accommodation = [],
  transport = [],
  userRole,
  onUpdateParkingOccupancy,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'parking' | 'medical' | 'police' | 'foodwater' | 'toilets' | 'accommodation' | 'transport'
  >('parking');

  const [searchQuery, setSearchQuery] = useState('');

  const subTabs = [
    { id: 'parking', label: 'Parking 🅿️', count: parking.length },
    { id: 'medical', label: 'Medical 🚑', count: medical.length },
    { id: 'police', label: 'Police 🚔', count: police.length },
    { id: 'foodwater', label: 'Food & Water 🍛💧', count: foodWater.length },
    { id: 'toilets', label: 'Toilets 🚻', count: toilets.length },
    { id: 'accommodation', label: 'Accommodation 🛏️', count: accommodation.length },
    { id: 'transport', label: 'Transport 🚌', count: transport.length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-orange-400" />
            <span>Kumbh Smart Facilities Directory</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time status of Parking, Hospitals, Police Assistance, Free Food, Toilets, Dharamshalas & Shuttles
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search facilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Sub Tab Navigation */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
              activeSubTab === tab.id
                ? 'bg-orange-500 text-slate-950 border-orange-400 shadow-md'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Content Rendering Based on SubTab */}
      <div>
        {/* PARKING TAB */}
        {activeSubTab === 'parking' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {parking.map((pk) => {
              const fillPct = Math.round((pk.occupied_spaces / pk.capacity) * 100);
              return (
                <div
                  key={pk.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">
                        PARKING GROUND
                      </span>
                      <h3 className="text-base font-bold text-white mt-0.5">{pk.name}</h3>
                      <p className="text-xs text-slate-400">{pk.location_name}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        pk.status === 'AVAILABLE'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : pk.status === 'LIMITED'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-red-500/20 text-red-300 border border-red-500/40'
                      }`}
                    >
                      {pk.status}
                    </span>
                  </div>

                  {/* Meter */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Spaces Available</span>
                      <span className="font-bold text-emerald-400">
                        {pk.available_spaces.toLocaleString()} / {pk.capacity.toLocaleString()} ({100 - fillPct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${fillPct > 90 ? 'bg-red-500' : fillPct > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 space-y-1 pt-1">
                    <p>Fee: <span className="text-slate-200 font-semibold">{pk.fee}</span></p>
                    <p>Contact: <span className="text-slate-200 font-semibold">{pk.contact}</span></p>
                  </div>

                  {userRole === 'admin' && (
                    <div className="pt-2 border-t border-slate-800 flex items-center space-x-2">
                      <span className="text-[10px] text-slate-400">Admin Occupancy:</span>
                      <button
                        onClick={() => onUpdateParkingOccupancy(pk.id, pk.occupied_spaces + 100)}
                        className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-white"
                      >
                        +100 Cars
                      </button>
                      <button
                        onClick={() => onUpdateParkingOccupancy(pk.id, Math.max(0, pk.occupied_spaces - 100))}
                        className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-white"
                      >
                        -100 Cars
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* MEDICAL TAB */}
        {activeSubTab === 'medical' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {medical.map((med) => (
              <div
                key={med.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                      {med.type}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">{med.name}</h3>
                    <p className="text-xs text-slate-400">{med.location_name}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    24x7 Ready
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono">
                  <div>
                    <p className="text-[10px] text-slate-400">Available Beds</p>
                    <p className="text-emerald-400 font-bold">{med.available_beds} Beds</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Doctors On Duty</p>
                    <p className="text-white font-bold">{med.doctors_on_duty} Doctors</p>
                  </div>
                </div>

                <div className="text-xs text-slate-400 space-y-1">
                  <p className="flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Helpline: <strong className="text-white">{med.contact}</strong></span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* POLICE TAB */}
        {activeSubTab === 'police' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {police.map((pol) => (
              <div
                key={pol.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                      POLICE POST
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">{pol.station_name}</h3>
                    <p className="text-xs text-slate-400">{pol.location_name}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                    {pol.status}
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                  <p className="text-slate-400">
                    Incharge Officer: <strong className="text-white">{pol.incharge_officer}</strong>
                  </p>
                  <p className="text-slate-400">
                    Available Police Officers: <strong className="text-emerald-400 font-mono">{pol.available_officers} Officers</strong>
                  </p>
                </div>

                <div className="text-xs text-slate-400">
                  <p className="flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-red-400" />
                    <span>Police Control: <strong className="text-white">{pol.contact}</strong></span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FOOD & WATER TAB */}
        {activeSubTab === 'foodwater' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {foodWater.map((fw) => (
              <div
                key={fw.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      {fw.type === 'FOOD' ? 'ANNACHATRA (FOOD)' : 'WATER HUB'}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">{fw.name}</h3>
                    <p className="text-xs text-slate-400">{fw.location_name}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {fw.is_free ? '100% FREE' : 'SUBSIDIZED'}
                  </span>
                </div>

                <p className="text-xs text-slate-300">
                  Organizer: <strong className="text-amber-200">{fw.organizer}</strong>
                </p>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <span>Hours: {fw.opening_time} - {fw.closing_time}</span>
                  <span className="text-amber-400 font-bold">Rating: ★ {fw.cleanliness_rating}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TOILETS TAB */}
        {activeSubTab === 'toilets' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {toilets.map((t) => (
              <div
                key={t.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                      PUBLIC TOILET BLOCK
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">{t.location_name}</h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {t.cleanliness_status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono">
                  <div>
                    <p className="text-[10px] text-slate-400">Male Units</p>
                    <p className="text-white font-bold">{t.male_units} Cubicles</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Female Units</p>
                    <p className="text-white font-bold">{t.female_units} Cubicles</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Wheelchair Accessible: {t.accessible_facility ? 'Yes ✓' : 'No'}</span>
                  <span>Cleaned: {t.last_updated}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ACCOMMODATION TAB */}
        {activeSubTab === 'accommodation' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accommodation.map((acc) => (
              <div
                key={acc.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      {acc.type}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">{acc.name}</h3>
                    <p className="text-xs text-slate-400">{acc.location_name}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {acc.available_rooms} Vacant
                  </span>
                </div>

                <div className="text-xs text-slate-300 space-y-1">
                  <p>Tariff: <strong className="text-amber-300">{acc.price_range}</strong></p>
                  <p>Contact: <strong className="text-white">{acc.contact}</strong></p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TRANSPORT TAB */}
        {activeSubTab === 'transport' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {transport.map((tr) => (
              <div
                key={tr.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      {tr.type} SERVICE
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">{tr.name}</h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {tr.availability} AVAILABILITY
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-medium">{tr.route_or_station}</p>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <span>Hours: {tr.operating_hours}</span>
                  <span className="text-orange-400 font-bold">{tr.fare}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
