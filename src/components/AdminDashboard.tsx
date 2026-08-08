/**
 * KUMBH SARTHI - Executive Admin Command Center
 */

import React, { useState } from 'react';
import {
  Settings,
  ShieldAlert,
  Users,
  MapPin,
  Radio,
  Sliders,
  Database,
  DatabaseZap,
  RotateCcw,
  Plus,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  LocationRecord,
  EmergencyReport,
  AlertRecord,
  IoTSensor,
  SystemSettings,
  UserRole,
} from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface AdminDashboardProps {
  locations?: LocationRecord[];
  emergencies?: EmergencyReport[];
  alerts?: AlertRecord[];
  sensors?: IoTSensor[];
  settings: SystemSettings;
  userRole: UserRole;
  language: 'en' | 'hi' | 'mr';
  onUpdateThresholds: (low: number, med: number, high: number) => void;
  onToggleDemoMode: (active: boolean) => void;
  onResetSeedData: () => void;
  onOpenSqlModal: () => void;
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  locations = [],
  emergencies = [],
  alerts = [],
  sensors = [],
  settings,
  userRole,
  language,
  onUpdateThresholds,
  onToggleDemoMode,
  onResetSeedData,
  onOpenSqlModal,
  onNavigateTab,
}) => {
  const [lowThresh, setLowThresh] = useState(settings.low_threshold);
  const [medThresh, setMedThresh] = useState(settings.medium_threshold);
  const [highThresh, setHighThresh] = useState(settings.high_threshold);

  const t = TRANSLATIONS[language];

  const handleSaveThresholds = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateThresholds(lowThresh, medThresh, highThresh);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 rounded-3xl border border-slate-700 text-white shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-orange-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase">
              ADMIN CONTROL ROOM
            </span>
            <span className="text-xs text-slate-400 font-mono">Role: {userRole.toUpperCase()}</span>
          </div>
          <h2 className="text-2xl font-black font-serif text-white mt-1">
            Kumbh Sarthi Master Executive Dashboard
          </h2>
          <p className="text-xs text-slate-400">
            Smart City Crowd Management, Configurable Sensor Thresholds, Emergency SOS Dispatch & Supabase PostgreSQL Administration
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenSqlModal}
            className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black px-4 py-2.5 rounded-xl shadow-lg transition text-xs"
          >
            <Database className="w-4 h-4" />
            <span>Supabase SQL Script</span>
          </button>
        </div>
      </div>

      {/* Threshold Configuration & Demo Mode Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dynamic Threshold Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-orange-400" />
              <span>Configurable Crowd Density Thresholds</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Stored in system_settings</span>
          </div>

          <form onSubmit={handleSaveThresholds} className="space-y-4 text-xs">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-emerald-400 font-bold mb-1">
                  LOW Max % (&le;)
                </label>
                <input
                  type="number"
                  value={lowThresh}
                  onChange={(e) => setLowThresh(parseInt(e.target.value) || 40)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-amber-400 font-bold mb-1">
                  MEDIUM Max % (&le;)
                </label>
                <input
                  type="number"
                  value={medThresh}
                  onChange={(e) => setMedThresh(parseInt(e.target.value) || 70)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-red-400 font-bold mb-1">
                  HIGH Max % (&le;)
                </label>
                <input
                  type="number"
                  value={highThresh}
                  onChange={(e) => setHighThresh(parseInt(e.target.value) || 100)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Formula: <code className="text-orange-300">crowd_percentage = (estimated_people / capacity) * 100</code>
            </p>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold py-2.5 rounded-xl transition shadow"
            >
              Recalculate All Locations & Apply Thresholds
            </button>
          </form>
        </div>

        {/* Demo Mode & System Controls */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Settings className="w-5 h-5 text-amber-400" />
              <span>System & Demo Mode Controls</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">College Demo Ready</span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div>
                <p className="font-bold text-white">Interactive Demo Sensor Fluctuation</p>
                <p className="text-slate-400 text-[11px]">Generates background IoT crowd readings every 12s</p>
              </div>

              <input
                type="checkbox"
                checked={settings.demo_mode}
                onChange={(e) => onToggleDemoMode(e.target.checked)}
                className="w-5 h-5 accent-orange-500 cursor-pointer"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={onResetSeedData}
                className="flex-1 flex items-center justify-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 px-4 rounded-xl border border-slate-700 transition"
              >
                <RotateCcw className="w-4 h-4 text-orange-400" />
                <span>Reset All to Nashik Seed Data</span>
              </button>

              <button
                onClick={() => onNavigateTab('locations')}
                className="flex-1 flex items-center justify-center space-x-1.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 font-bold py-2.5 px-4 rounded-xl border border-orange-500/40 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Manage Locations</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
