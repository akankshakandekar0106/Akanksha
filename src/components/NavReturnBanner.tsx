/**
 * KUMBH SARTHI - Navigation Return Banner Experience
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, Navigation, ShieldAlert, HeartPulse, MapPin, X } from 'lucide-react';

interface NavReturnBannerProps {
  onOpenEmergency: () => void;
  onOpenFacilities: () => void;
}

export const NavReturnBanner: React.FC<NavReturnBannerProps> = ({
  onOpenEmergency,
  onOpenFacilities,
}) => {
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [lastDest, setLastDest] = useState<string>('Ramkund Ghat');

  useEffect(() => {
    const isReturn = localStorage.getItem('kumbh_nav_return_active');
    const dest = localStorage.getItem('kumbh_last_destination');
    if (isReturn === 'true') {
      setShowBanner(true);
      if (dest) setLastDest(dest);
    }
  }, []);

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.removeItem('kumbh_nav_return_active');
  };

  if (!showBanner) return null;

  return (
    <div className="bg-gradient-to-r from-orange-950 via-slate-900 to-emerald-950 border-2 border-amber-500/60 p-4 sm:p-5 rounded-2xl shadow-2xl mb-6 relative animate-fadeIn">
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/80 transition"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex flex-wrap items-center justify-between gap-4 pr-8">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-amber-500/40 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Welcome Back to Kumbh Sarthi</span>
            </span>
          </div>
          <h3 className="text-base font-extrabold text-white font-serif flex items-center space-x-2">
            <Navigation className="w-5 h-5 text-orange-400" />
            <span>Returned from Google Maps Navigation</span>
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            You navigated towards <strong className="text-amber-300">{lastDest}</strong>. Kumbh Sarthi is actively keeping track of nearby medical camps, police booths, and live crowd safety alerts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              handleDismiss();
              onOpenFacilities();
            }}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow"
          >
            <MapPin className="w-3.5 h-3.5 text-orange-400" />
            <span>View Nearby Facilities</span>
          </button>

          <button
            onClick={() => {
              handleDismiss();
              onOpenEmergency();
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center space-x-1.5 shadow-lg animate-pulse"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>FIND NEARBY HELP / SOS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
