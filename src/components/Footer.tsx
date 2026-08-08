/**
 * KUMBH SARTHI - Professional Footer
 */

import React from 'react';
import { ShieldCheck, PhoneCall, Radio, Heart, Cpu, Sparkles } from 'lucide-react';
import { TRANSLATIONS } from '../lib/translations';

interface FooterProps {
  language: 'en' | 'hi' | 'mr';
  onOpenAi: () => void;
  onOpenSql: () => void;
  onNavigateTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onOpenAi,
  onOpenSql,
  onNavigateTab,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Purpose */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-orange-500 text-slate-950 font-black flex items-center justify-center">
                KS
              </div>
              <span className="text-base font-extrabold text-white tracking-wider">
                KUMBH SARTHI
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Smart Kumbh Mela Crowd Management & Pilgrim Assistance Platform. Engineered with ESP32 IoT sensors, Supabase Realtime & AI Guidance.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button onClick={() => onNavigateTab('map')} className="hover:text-orange-400 transition">
                  Live Crowd Heatmap
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('route')} className="hover:text-orange-400 transition">
                  Smart Safe Route
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('locations')} className="hover:text-orange-400 transition">
                  Location Database
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('facilities')} className="hover:text-orange-400 transition">
                  Parking & Facilities
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency & Helpline */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Emergency Direct Dial
            </h4>
            <div className="space-y-1.5 font-mono text-slate-300">
              <p className="flex items-center space-x-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-red-400" />
                <span>Police: <a href="tel:112" className="text-white font-bold hover:underline">112</a></span>
              </p>
              <p className="flex items-center space-x-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ambulance: <a href="tel:108" className="text-white font-bold hover:underline">108</a></span>
              </p>
              <p className="flex items-center space-x-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                <span>Control Room: <a href="tel:100" className="text-white font-bold hover:underline">100</a></span>
              </p>
            </div>
          </div>

          {/* Technical Architecture */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Project Architecture
            </h4>
            <div className="space-y-2">
              <button
                onClick={onOpenSql}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-amber-300 font-mono text-[11px] transition"
              >
                <span>Supabase SQL Script</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onOpenAi}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20 text-orange-300 font-bold text-[11px] transition"
              >
                <span>Open AI Sarthi Assistant</span>
                <Cpu className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 Kumbh Sarthi Smart City Platform. Nashik Kumbh Mela Authority & E&TC IoT Project.</p>
          <div className="flex items-center space-x-4 font-mono">
            <span>ESP32 Grid: ACTIVE</span>
            <span>•</span>
            <span>Supabase RLS: SECURED</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
