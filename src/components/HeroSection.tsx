/**
 * KUMBH SARTHI - Landing Hero Section
 */

import React from 'react';
import {
  MapPin,
  Route,
  ShieldAlert,
  Users,
  AlertTriangle,
  Car,
  Activity,
  Bot,
  Calendar,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { LocationRecord, EventSchedule, AlertRecord } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface HeroSectionProps {
  locations?: LocationRecord[];
  events?: EventSchedule[];
  alerts?: AlertRecord[];
  language: 'en' | 'hi' | 'mr';
  onNavigate?: (tab: string) => void;
  onNavigateTab?: (tab: string) => void;
  onOpenAi?: () => void;
  onOpenAiAssistant?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  locations = [],
  events = [],
  alerts = [],
  language,
  onNavigate,
  onNavigateTab,
  onOpenAi,
  onOpenAiAssistant,
}) => {
  const t = TRANSLATIONS[language];
  const handleNavigate = onNavigate || onNavigateTab || (() => {});
  const handleOpenAi = onOpenAiAssistant || onOpenAi || (() => {});

  // Calculate live statistics
  const totalVisitorsToday = (locations || []).reduce((sum, loc) => sum + (loc?.estimated_people || 0), 0);
  const highCrowdZonesCount = (locations || []).filter((loc) => loc?.crowd_level === 'HIGH' || loc?.crowd_level === 'CRITICAL').length;
  const activeAlertsCount = (alerts || []).filter((a) => a?.active).length;

  // Upcoming Shahi Snan
  const nextSnan = (events || []).find((e) => e?.is_shahi_snan && e?.status === 'UPCOMING') || (events || [])[0];

  return (
    <div className="space-y-8">
      {/* Hero Banner Box */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-orange-500/30 p-6 sm:p-10 shadow-2xl">
        {/* Background decorative grid & glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/20 via-slate-900/60 to-slate-950 pointer-events-none" />
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6 max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-orange-500/10 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-bold text-orange-400">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>KUMBH MELA 2026-2027 • NASHIK GODAVARI</span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-serif leading-tight">
              Kumbh Sarthi
            </h1>
            <p className="text-lg sm:text-2xl font-semibold bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
              {t.subTagline}
            </p>
          </div>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Real-time crowd monitoring, safe pedestrian route planning, emergency GPS dispatch, lost & found assistance, and AI-guided pilgrim support for Nashik Kumbh Mela.
          </p>

          {/* Core Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigate('map')}
              className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black px-6 py-3 rounded-xl shadow-xl shadow-orange-500/25 transition transform hover:-translate-y-0.5 text-sm"
            >
              <MapPin className="w-5 h-5" />
              <span>{t.btnLiveMap}</span>
            </button>

            <button
              onClick={() => handleNavigate('route')}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-3 rounded-xl border border-slate-700 hover:border-orange-500/50 shadow-lg transition text-sm"
            >
              <Route className="w-5 h-5 text-orange-400" />
              <span>{t.btnFindSafeRoute}</span>
            </button>

            <button
              onClick={() => handleNavigate('sos')}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl shadow-xl shadow-red-600/30 transition transform hover:-translate-y-0.5 text-sm animate-pulse"
            >
              <ShieldAlert className="w-5 h-5" />
              <span>{t.btnEmergencyHelp}</span>
            </button>

            <button
              onClick={handleOpenAi}
              className="flex items-center space-x-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold px-5 py-3 rounded-xl border border-amber-500/40 shadow-lg transition text-sm"
            >
              <Bot className="w-5 h-5 text-amber-400" />
              <span>{t.btnAskAi}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming Shahi Snan Alert Banner */}
      {nextSnan && (
        <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border border-amber-500/40 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start space-x-3">
            <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400 shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                  UPCOMING SHAHI SNAN RITUAL
                </span>
                <span className="bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full">
                  {nextSnan.date}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                {nextSnan.event_name}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Location: <span className="text-amber-200 font-semibold">{nextSnan.location_name}</span> • Expected Crowd: <span className="text-amber-200 font-semibold">{((nextSnan.expected_crowd || 0) / 100000).toFixed(1)} Lakh Pilgrims</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => handleNavigate('events')}
            className="self-start md:self-center flex items-center space-x-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl transition"
          >
            <span>View Full Snan Schedule</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Live Statistics Counters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-orange-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>{t.metricVisitors}</span>
            <Users className="w-4 h-4 text-orange-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-white mt-2 font-mono">
            {totalVisitorsToday.toLocaleString()}
          </p>
          <p className="text-[10px] text-emerald-400 mt-1 font-medium flex items-center">
            <CheckCircle2 className="w-3 h-3 mr-0.5" /> Live Sensor Feed
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-orange-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>{t.metricCurrentCrowd}</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-300 mt-2 font-mono">
            {Math.round(totalVisitorsToday * 0.72).toLocaleString()}
          </p>
          <p className="text-[10px] text-amber-400/80 mt-1 font-medium">Active On Ghats</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-red-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>{t.metricHighCrowdZones}</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-red-400 mt-2 font-mono">
            {highCrowdZonesCount} Zones
          </p>
          <p className="text-[10px] text-red-300 mt-1 font-medium">Bypass Recommended</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>{t.metricParkingAvail}</span>
            <Car className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-2 font-mono">
            4,250 Slots
          </p>
          <p className="text-[10px] text-emerald-300 mt-1 font-medium">Tapovan & Dindori</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-blue-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>{t.metricMedicalCenters}</span>
            <ShieldAlert className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-blue-400 mt-2 font-mono">
            18 Posts
          </p>
          <p className="text-[10px] text-blue-300 mt-1 font-medium">24x7 ICU Ready</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>{t.metricActiveAlerts}</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-400 mt-2 font-mono">
            {activeAlertsCount} Broadcasts
          </p>
          <p className="text-[10px] text-amber-300 mt-1 font-medium">Live Police Bulletins</p>
        </div>
      </div>

      {/* Live Crowd Cards Summary */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-orange-500 animate-ping"></span>
            <span>Nashik Live Crowd Status Cards</span>
          </h2>
          <button
            onClick={() => handleNavigate('locations')}
            className="text-xs font-semibold text-orange-400 hover:underline flex items-center space-x-1"
          >
            <span>View All Locations ({locations.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.slice(0, 6).map((loc) => {
            let badgeBg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
            let progressBg = 'bg-emerald-500';
            let label = t.crowdLow;

            if (loc.crowd_level === 'MEDIUM') {
              badgeBg = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
              progressBg = 'bg-amber-500';
              label = t.crowdMedium;
            } else if (loc.crowd_level === 'HIGH') {
              badgeBg = 'bg-red-500/20 text-red-300 border-red-500/40';
              progressBg = 'bg-red-500';
              label = t.crowdHigh;
            } else if (loc.crowd_level === 'CRITICAL') {
              badgeBg = 'bg-rose-950 text-rose-300 border-rose-600 animate-pulse';
              progressBg = 'bg-rose-600';
              label = t.crowdCritical;
            }

            return (
              <div
                key={loc.location_id}
                onClick={() => onNavigate('map')}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-orange-500/50 transition cursor-pointer shadow-lg hover:shadow-orange-500/10 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {loc.category}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-orange-300 transition">
                        {loc.location_name}
                      </h3>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${badgeBg}`}
                    >
                      {label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{loc.description}</p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Crowd Capacity</span>
                    <span className="font-bold text-slate-200">
                      {loc.estimated_people.toLocaleString()} / {loc.capacity.toLocaleString()} ({loc.crowd_percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${progressBg} transition-all duration-500`}
                      style={{ width: `${Math.min(100, loc.crowd_percentage)}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center text-slate-400">
                    <Clock className="w-3 h-3 mr-1" />
                    Updated 2m ago
                  </span>
                  <span className="text-orange-400 font-semibold hover:underline">
                    View On Map ➔
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
