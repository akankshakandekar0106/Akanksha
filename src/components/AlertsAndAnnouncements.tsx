/**
 * KUMBH SARTHI - Alerts & Public Announcements Feed
 */

import React, { useState } from 'react';
import {
  AlertTriangle,
  Volume2,
  Plus,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Megaphone,
  X,
  Radio,
} from 'lucide-react';
import { AlertRecord, AlertSeverity, AlertCategory, UserRole } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface AlertsAndAnnouncementsProps {
  alerts?: AlertRecord[];
  userRole: UserRole;
  language: 'en' | 'hi' | 'mr';
  onAddAlert: (alert: Omit<AlertRecord, 'id' | 'created_at' | 'active'>) => void;
  onToggleAlertActive: (id: string) => void;
}

export const AlertsAndAnnouncements: React.FC<AlertsAndAnnouncementsProps> = ({
  alerts = [],
  userRole,
  language,
  onAddAlert,
  onToggleAlertActive,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [playingAlertId, setPlayingAlertId] = useState<string | null>(null);

  const t = TRANSLATIONS[language];

  // Form state
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [locationName, setLocationName] = useState('Ramkund Ghat');
  const [severity, setSeverity] = useState<AlertSeverity>('WARNING');
  const [category, setCategory] = useState<AlertCategory>('HIGH_CROWD');

  const handlePlayAudio = (alertItem: AlertRecord) => {
    setPlayingAlertId(alertItem.id);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${alertItem.title}. ${alertItem.message}`);
      utterance.rate = 0.9;
      utterance.onend = () => setPlayingAlertId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setPlayingAlertId(null), 3000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAlert({
      title,
      message,
      location_name: locationName,
      severity,
      category,
      created_by: 'Kumbh Police Command Center',
    });
    setModalOpen(false);
    setTitle('');
    setMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
            <Megaphone className="w-5 h-5 text-amber-400" />
            <span>Kumbh Mela Live Public Alerts & Bulletins</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Realtime official broadcasts from Police, Traffic Control & Disaster Response Authorities
          </p>
        </div>

        {(userRole === 'admin' || userRole === 'police') && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow-lg shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Post Live Alert</span>
          </button>
        )}
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.map((alert) => {
          let badgeBg = 'bg-blue-500/20 text-blue-300 border-blue-500/40';
          let borderGlow = 'border-slate-800';

          if (alert.severity === 'WARNING') {
            badgeBg = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
            borderGlow = 'border-amber-500/30';
          } else if (alert.severity === 'DANGER' || alert.severity === 'CRITICAL') {
            badgeBg = 'bg-red-500/20 text-red-300 border-red-500/40';
            borderGlow = 'border-red-500/50';
          }

          return (
            <div
              key={alert.id}
              className={`bg-slate-900 border ${borderGlow} rounded-2xl p-5 shadow-lg space-y-3 transition`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${badgeBg}`}
                    >
                      {alert.severity} • {alert.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Location: <strong className="text-slate-200">{alert.location_name}</strong>
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{alert.title}</h3>
                </div>

                <button
                  onClick={() => handlePlayAudio(alert)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                    playingAlertId === alert.id
                      ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                  title="Listen to audio bulletin"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{playingAlertId === alert.id ? 'Playing...' : 'Audio Broadcast'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{alert.message}</p>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center">
                  <Radio className="w-3 h-3 text-emerald-400 mr-1" />
                  Source: {alert.created_by}
                </span>
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Posted {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Post Alert Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Broadcast Public Alert</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Alert Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HIGH CROWD AT RAMKUND GHAT"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Severity</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="INFO">INFO</option>
                    <option value="WARNING">WARNING</option>
                    <option value="DANGER">DANGER</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="HIGH_CROWD">HIGH CROWD</option>
                    <option value="ROUTE_CLOSED">ROUTE CLOSED</option>
                    <option value="PARKING_FULL">PARKING FULL</option>
                    <option value="WEATHER_WARNING">WEATHER WARNING</option>
                    <option value="MEDICAL_ALERT">MEDICAL ALERT</option>
                    <option value="SECURITY_ALERT">SECURITY ALERT</option>
                    <option value="GENERAL">GENERAL</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Location Name</label>
                <input
                  type="text"
                  required
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Detailed Message</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide explicit instructions for pilgrims..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
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
                  className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl"
                >
                  Broadcast Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
