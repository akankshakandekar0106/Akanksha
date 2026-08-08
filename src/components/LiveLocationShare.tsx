/**
 * KUMBH SARTHI - Live Location Sharing & Privacy Component
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  LocateFixed,
  Shield,
  ShieldCheck,
  Radio,
  Clock,
  Compass,
  Square,
  Play,
  AlertCircle,
  X,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { kumbhStore, supabase } from '../lib/store';

export const LiveLocationShare: React.FC = () => {
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [consentModalOpen, setConsentModalOpen] = useState<boolean>(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const watchIdRef = useRef<number | null>(null);

  // Request privacy consent & start live location watching
  const handleStartSharing = () => {
    setConsentModalOpen(false);
    setErrorMsg(null);

    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    setIsSharing(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const acc = Math.round(pos.coords.accuracy);
        const timestamp = new Date().toLocaleTimeString();

        setCoords({ lat, lng });
        setAccuracy(acc);
        setLastUpdated(timestamp);

        // Sync to Supabase user_locations if available
        syncLocationToSupabase(lat, lng, acc, true);
      },
      (err) => {
        console.warn('watchPosition error:', err);
        setErrorMsg('Location tracking permission denied or unavailable.');
        handleStopSharing();
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 15000,
      }
    );
  };

  // Stop live location watching
  const handleStopSharing = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsSharing(false);

    if (coords) {
      syncLocationToSupabase(coords.lat, coords.lng, accuracy || 0, false);
    }
  };

  // Sync to Supabase table user_locations
  const syncLocationToSupabase = async (
    lat: number,
    lng: number,
    acc: number,
    sharing: boolean
  ) => {
    if (!supabase) return;
    try {
      const userPhone = kumbhStore.userPhone || 'anon_pilgrim';
      await supabase.from('user_locations').upsert({
        user_id: userPhone,
        latitude: lat,
        longitude: lng,
        accuracy: acc,
        is_sharing: sharing,
        last_updated: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Supabase location sync warning:', e);
    }
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Live Location Widget Card */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className={`p-2.5 rounded-xl border ${
              isSharing
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              <LocateFixed className={`w-5 h-5 ${isSharing ? 'animate-pulse' : ''}`} />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-extrabold text-white font-serif">
                  Live Location Sharing
                </h3>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  isSharing
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {isSharing ? 'LIVE: ON 🟢' : 'OFF ⚪'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Continuous GPS updates for safe navigation & emergency assistance.
              </p>
            </div>
          </div>

          <div>
            {!isSharing ? (
              <button
                onClick={() => setConsentModalOpen(true)}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-extrabold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-lg transition"
              >
                <Radio className="w-4 h-4" />
                <span>Share My Live Location</span>
              </button>
            ) : (
              <button
                onClick={handleStopSharing}
                className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-lg transition"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Live Location</span>
              </button>
            )}
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-xs text-red-200 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Live Coordinates Panel when active */}
        {isSharing && coords && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs animate-fadeIn">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Latitude</p>
              <p className="text-sm font-black text-emerald-400 font-mono">{coords.lat.toFixed(5)}° N</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Longitude</p>
              <p className="text-sm font-black text-emerald-400 font-mono">{coords.lng.toFixed(5)}° E</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Accuracy</p>
              <p className="text-sm font-black text-blue-400 font-mono">±{accuracy} meters</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Last Updated</p>
              <p className="text-sm font-black text-amber-300 font-mono">{lastUpdated}</p>
            </div>
          </div>
        )}
      </div>

      {/* Privacy Consent Modal */}
      {consentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center space-x-3 text-orange-400">
              <div className="p-3 bg-orange-500/20 rounded-xl border border-orange-500/30">
                <Lock className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white font-serif">
                  Privacy & Geolocation Consent
                </h3>
                <p className="text-[11px] text-slate-400">Kumbh Sarthi Safety Network</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Your location is used solely to provide live navigation guidance, safe route crowd warnings, and emergency SOS assistance during Nashik Kumbh Mela.
            </p>

            <ul className="text-xs text-slate-300 space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>You can stop location sharing at any time.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Location is never collected in the background when feature is disabled.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Protected by Supabase Row-Level Security (RLS).</span>
              </li>
            </ul>

            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                onClick={() => setConsentModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
              >
                Cancel
              </button>

              <button
                onClick={handleStartSharing}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg transition flex items-center space-x-1.5"
              >
                <Radio className="w-4 h-4" />
                <span>ALLOW LOCATION & SHARE</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
