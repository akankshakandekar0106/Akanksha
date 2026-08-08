/**
 * KUMBH SARTHI - Visual Crowd Analytics & Predictive Charts
 */

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BarChart3, TrendingUp, Users, ShieldAlert, PieChart as PieIcon } from 'lucide-react';
import { LocationRecord, ParkingFacility } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface CrowdAnalyticsProps {
  locations?: LocationRecord[];
  parking?: ParkingFacility[];
  language: 'en' | 'hi' | 'mr';
}

export const CrowdAnalytics: React.FC<CrowdAnalyticsProps> = ({
  locations = [],
  parking = [],
  language,
}) => {
  const t = TRANSLATIONS[language];

  // Hourly Crowd Trend Demo Data
  const hourlyData = [
    { time: '04:00 AM', pilgrims: 12000, capacity: 50000 },
    { time: '06:00 AM', pilgrims: 28000, capacity: 50000 },
    { time: '08:00 AM', pilgrims: 42000, capacity: 50000 },
    { time: '10:00 AM', pilgrims: 48500, capacity: 50000 },
    { time: '12:00 PM', pilgrims: 41000, capacity: 50000 },
    { time: '02:00 PM', pilgrims: 35000, capacity: 50000 },
    { time: '04:00 PM', pilgrims: 39000, capacity: 50000 },
    { time: '06:00 PM', pilgrims: 46000, capacity: 50000 },
    { time: '08:00 PM', pilgrims: 32000, capacity: 50000 },
    { time: '10:00 PM', pilgrims: 18000, capacity: 50000 },
  ];

  // Location Comparison Bar Data
  const locationBarData = locations.slice(0, 6).map((loc) => ({
    name: loc.location_name.split(' ')[0],
    people: loc.estimated_people,
    capacity: loc.capacity,
  }));

  // Parking Usage Pie Data
  const parkingPieData = parking.map((p) => ({
    name: p.name.split(' ')[0],
    value: p.occupied_spaces,
  }));

  const COLORS = ['#f97316', '#f59e0b', '#3b82f6', '#10b981', '#a855f7'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-orange-400" />
            <span>Kumbh Mela Smart Crowd Analytics & Predictions</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Statistical density trends, hourly peak time predictions & parking occupancy charts
          </p>
        </div>

        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
          DEMO / SIMULATED ANALYTICS
        </span>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Crowd Density Area Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">
                HOURLY TREND
              </span>
              <h3 className="text-base font-bold text-white">Ramkund Ghat Hourly Density</h3>
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData}>
                <defs>
                  <linearGradient id="colorPilgrims" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="pilgrims" stroke="#f97316" fillOpacity={1} fill="url(#colorPilgrims)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Location Comparison Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                LOCATION COMPARISON
              </span>
              <h3 className="text-base font-bold text-white">Active Crowd vs Total Capacity</h3>
            </div>
            <Users className="w-5 h-5 text-amber-400" />
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Bar dataKey="people" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
