/**
 * KUMBH SARTHI - Auspicious Shahi Snan & Event Schedule
 */

import React from 'react';
import { Calendar, Clock, MapPin, Users, Sparkles, CheckCircle2 } from 'lucide-react';
import { EventSchedule, UserRole } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface EventSnanScheduleProps {
  events?: EventSchedule[];
  userRole: UserRole;
  language: 'en' | 'hi' | 'mr';
}

export const EventSnanSchedule: React.FC<EventSnanScheduleProps> = ({
  events = [],
  userRole,
  language,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 p-6 rounded-3xl border border-amber-500/40 text-white shadow-2xl space-y-2">
        <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>HOLY RITUAL CALENDAR</span>
        </div>
        <h2 className="text-2xl font-black font-serif text-white">
          Nashik Kumbh Mela Shahi Snan & Event Timetable
        </h2>
        <p className="text-xs text-amber-200/80 max-w-2xl">
          Official auspicious holy bath dates, Akhara processions, Godavari Aarti ceremonies and crowd advisory schedules.
        </p>
      </div>

      {/* Events Timeline */}
      <div className="space-y-4">
        {events.map((ev) => (
          <div
            key={ev.id}
            className={`bg-slate-900 border rounded-2xl p-6 shadow-xl space-y-4 transition ${
              ev.is_shahi_snan
                ? 'border-amber-500/50 bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900'
                : 'border-slate-800'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex flex-col items-center justify-center text-amber-400 font-bold shrink-0">
                  <span className="text-[10px] uppercase">SNAN</span>
                  <span className="text-xs">{ev.date.slice(8)}</span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    {ev.is_shahi_snan && (
                      <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase">
                        SHAHI SNAN RITUAL
                      </span>
                    )}
                    <span className="text-xs font-semibold text-slate-400">{ev.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">{ev.event_name}</h3>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <span className="bg-slate-800 text-slate-300 font-mono px-3 py-1 rounded-lg border border-slate-700">
                  {ev.start_time} - {ev.end_time}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{ev.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
              <div className="flex items-center space-x-2 text-slate-300">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Holy Dip Location: <strong className="text-white">{ev.location_name}</strong></span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Users className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Expected Pilgrim Density: <strong className="text-amber-300 font-mono">{(ev.expected_crowd / 100000).toFixed(1)} Lakh Pilgrims</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
