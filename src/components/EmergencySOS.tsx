/**
 * KUMBH SARTHI - High-Visibility Emergency SOS System
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  MapPin,
  PhoneCall,
  User,
  Phone,
  CheckCircle2,
  AlertOctagon,
  Flame,
  Stethoscope,
  SearchX,
  Radio,
  Clock,
  Send,
} from 'lucide-react';
import { EmergencyReport, EmergencyType, UserRole } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface EmergencySOSProps {
  emergencies?: EmergencyReport[];
  userRole: UserRole;
  language: 'en' | 'hi' | 'mr';
  onAddEmergency: (emergency: Omit<EmergencyReport, 'id' | 'timestamp' | 'status'>) => void;
  onUpdateStatus: (id: string, status: EmergencyReport['status'], team?: string) => void;
}

export const EmergencySOS: React.FC<EmergencySOSProps> = ({
  emergencies = [],
  userRole,
  language,
  onAddEmergency,
  onUpdateStatus,
}) => {
  const t = TRANSLATIONS[language];

  const [emergencyType, setEmergencyType] = useState<EmergencyType>('MEDICAL');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('Ramkund Main Ghat');
  const [lat, setLat] = useState(20.0063);
  const [lng, setLng] = useState(73.7932);
  const [submitted, setSubmitted] = useState(false);
  const [locationShared, setLocationShared] = useState(false);

  const categories: { id: EmergencyType; label: string; icon: any; color: string }[] = [
    { id: 'MEDICAL', label: 'Medical Emergency 🚑', icon: Stethoscope, color: 'border-red-500 bg-red-950/40' },
    { id: 'POLICE', label: 'Police / Security 🚔', icon: ShieldAlert, color: 'border-blue-500 bg-blue-950/40' },
    { id: 'FIRE', label: 'Fire Outbreak 🚒', icon: Flame, color: 'border-amber-500 bg-amber-950/40' },
    { id: 'LOST_PERSON', label: 'Lost Child / Person 👧', icon: SearchX, color: 'border-purple-500 bg-purple-950/40' },
    { id: 'STAMPEDE_RISK', label: 'Stampede / Crush Risk ⚠️', icon: AlertOctagon, color: 'border-rose-600 bg-rose-950/60' },
    { id: 'OTHER', label: 'Control Room Other 📞', icon: Radio, color: 'border-slate-500 bg-slate-900' },
  ];

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
          setLocationShared(true);
        },
        (err) => {
          console.warn('Geolocation error:', err);
          setLocationShared(true); // fallback location set
        }
      );
    } else {
      setLocationShared(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEmergency({
      user_name: userName || 'Pilgrim',
      user_phone: userPhone || '+91 98000 00000',
      emergency_type: emergencyType,
      description: description || 'Immediate assistance requested.',
      latitude: lat,
      longitude: lng,
      location_name: locationName,
    });
    setSubmitted(true);
  };

  return (
    <div className="space-y-8">
      {/* High Visibility Header */}
      <div className="bg-gradient-to-r from-red-900 via-rose-900 to-red-950 border-2 border-red-500 p-6 sm:p-8 rounded-3xl shadow-2xl text-white text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-red-600/40 border border-red-400 px-4 py-1 rounded-full text-xs font-bold animate-pulse">
          <ShieldAlert className="w-4 h-4" />
          <span>KUMBH EMERGENCY CONTROL SYSTEM</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight">
          {t.sosAlertTitle}
        </h1>
        <p className="text-sm sm:text-base text-red-100 max-w-2xl mx-auto">
          {t.sosAlertSubtitle}
        </p>

        {/* Direct Phone Numbers Bar */}
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <a
            href="tel:112"
            className="flex items-center space-x-2 bg-slate-950/80 hover:bg-slate-950 px-4 py-2 rounded-xl border border-red-500/50 font-bold text-xs text-white"
          >
            <PhoneCall className="w-4 h-4 text-red-400" />
            <span>POLICE HELPLINE: 112</span>
          </a>
          <a
            href="tel:108"
            className="flex items-center space-x-2 bg-slate-950/80 hover:bg-slate-950 px-4 py-2 rounded-xl border border-red-500/50 font-bold text-xs text-white"
          >
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>AMBULANCE: 108</span>
          </a>
          <a
            href="tel:100"
            className="flex items-center space-x-2 bg-slate-950/80 hover:bg-slate-950 px-4 py-2 rounded-xl border border-red-500/50 font-bold text-xs text-white"
          >
            <PhoneCall className="w-4 h-4 text-amber-400" />
            <span>CONTROL ROOM: 100</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: SOS Trigger Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <ShieldAlert className="w-6 h-6 text-red-500" />
            <span>Broadcast Emergency Dispatch Signal</span>
          </h2>

          {submitted ? (
            <div className="bg-emerald-950/80 border-2 border-emerald-500 p-6 rounded-2xl space-y-3 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-xl font-extrabold text-white">
                EMERGENCY SIGNAL BROADCASTED!
              </h3>
              <p className="text-xs text-emerald-200">
                Your coordinates have been dispatched to Nashik Police & Medical Command Units at {locationName}. Team is responding.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs bg-slate-900 text-slate-200 font-bold px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800"
              >
                Submit Additional Report
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Emergency Category Selector Grid */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Select Emergency Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => {
                    const isSelected = emergencyType === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setEmergencyType(cat.id)}
                        className={`p-3 rounded-xl border text-left flex items-center space-x-2 transition ${
                          isSelected
                            ? `${cat.color} border-2 shadow-lg`
                            : 'bg-slate-800/80 border-slate-700 text-slate-300'
                        }`}
                      >
                        <span className="text-xs font-bold text-white">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Ramesh Patil"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98220 00000"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Location Select & GPS Share */}
              <div className="space-y-2 text-xs">
                <label className="block text-slate-300 font-semibold">Incident Location</label>
                <input
                  type="text"
                  required
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Ramkund Gate #2, Near Kalaram Temple"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-red-500"
                />

                <div className="pt-1 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    className="flex items-center space-x-1.5 text-xs text-orange-400 font-bold bg-orange-500/10 hover:bg-orange-500/20 px-3 py-1.5 rounded-lg border border-orange-500/30 transition"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{locationShared ? t.locationShared : t.shareLocation}</span>
                  </button>
                  <span className="text-[10px] text-slate-500 font-mono">
                    GPS: {lat.toFixed(4)}, {lng.toFixed(4)}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="text-xs">
                <label className="block text-slate-300 font-semibold mb-1">Brief Details / Condition</label>
                <textarea
                  rows={2}
                  placeholder="Describe the issue (e.g. elderly pilgrim collapsed, child missing in crowd)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Giant SOS Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-black py-4 rounded-2xl shadow-2xl shadow-red-600/40 text-base uppercase tracking-wider flex items-center justify-center space-x-2 transition transform hover:scale-[1.01]"
              >
                <ShieldAlert className="w-6 h-6 animate-pulse" />
                <span>BROADCAST EMERGENCY SOS NOW</span>
              </button>
            </form>
          )}
        </div>

        {/* Right: Active Emergency Dispatch Board */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Radio className="w-5 h-5 text-red-400" />
                <span>Active Emergency Dispatch Log</span>
              </h3>
              <p className="text-xs text-slate-400">
                Live monitoring for Police, Medical & Control Room responders
              </p>
            </div>
            <span className="bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-bold px-2.5 py-1 rounded-full">
              {emergencies.filter((e) => e.status !== 'RESOLVED').length} Active
            </span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {emergencies.map((emg) => (
              <div
                key={emg.id}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                      {emg.emergency_type}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1">{emg.location_name}</h4>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      emg.status === 'NEW'
                        ? 'bg-red-500 text-white animate-pulse'
                        : emg.status === 'IN_PROGRESS'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-emerald-500 text-slate-950 font-bold'
                    }`}
                  >
                    {emg.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300">{emg.description}</p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                  <span>Contact: {emg.user_name} ({emg.user_phone})</span>
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(emg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Responder Actions */}
                {(userRole === 'admin' || userRole === 'police' || userRole === 'medical') && (
                  <div className="flex items-center space-x-2 pt-2">
                    <button
                      onClick={() => onUpdateStatus(emg.id, 'IN_PROGRESS', 'Dispatch Team 1')}
                      className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-lg font-semibold hover:bg-amber-500/30"
                    >
                      Acknowledge & Dispatch
                    </button>
                    <button
                      onClick={() => onUpdateStatus(emg.id, 'RESOLVED')}
                      className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-lg font-semibold hover:bg-emerald-500/30"
                    >
                      Mark Resolved
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
