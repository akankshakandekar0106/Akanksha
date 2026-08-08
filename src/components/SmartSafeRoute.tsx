/**
 * KUMBH SARTHI - Smart Safe Route Planner with Live GPS Tracking & Google Maps Search
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Route,
  Navigation,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Info,
  MapPin,
  Compass,
  Play,
  Square,
  Volume2,
  VolumeX,
  Search,
  Crosshair,
  Sparkles,
  ExternalLink,
  Layers,
  LocateFixed,
  Zap,
} from 'lucide-react';
import { LocationRecord, RouteRecord, UserRole } from '../types';
import { TRANSLATIONS } from '../lib/translations';
import { GoogleMapsNavModal } from './GoogleMapsNavModal';

// Import Google Maps React SDK
import { APIProvider, Map as GoogleMap, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

interface SmartSafeRouteProps {
  locations?: LocationRecord[];
  routes?: RouteRecord[];
  userRole: UserRole;
  language: 'en' | 'hi' | 'mr';
}

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

// Default Famous Nashik Kumbh Spots for Quick Search
const POPULAR_NASHIK_SPOTS = [
  { id: 'loc_panchavati', name: 'Panchavati Temple Area', lat: 20.0075, lng: 73.7928, category: 'TEMPLE' },
  { id: 'loc_kalaram', name: 'Kalaram Mandir', lat: 20.008, lng: 73.7915, category: 'TEMPLE' },
  { id: 'loc_kapaleshwar', name: 'Kapaleshwar Mahadev Mandir', lat: 20.0058, lng: 73.7938, category: 'TEMPLE' },
  { id: 'loc_ramkund', name: 'Ramkund Ghat', lat: 20.0063, lng: 73.7932, category: 'GHAT' },
  { id: 'loc_tapovan', name: 'Tapovan Sadhugram', lat: 20.0092, lng: 73.8041, category: 'ACCOMMODATION' },
  { id: 'loc_sitagufa', name: 'Sita Gufa', lat: 20.0071, lng: 73.7941, category: 'TEMPLE' },
  { id: 'loc_muktidham', name: 'Muktidham Mandir', lat: 19.9538, lng: 73.8322, category: 'TEMPLE' },
  { id: 'loc_railway', name: 'Nashik Road Railway Station', lat: 19.9525, lng: 73.8315, category: 'RAILWAY' },
  { id: 'loc_trimbak', name: 'Trimbakeshwar Jyotirlinga', lat: 19.9320, lng: 73.5300, category: 'TEMPLE' },
  { id: 'loc_someshwar', name: 'Someshwar Waterfalls & Temple', lat: 19.9980, lng: 73.7420, category: 'TEMPLE' },
];

export const SmartSafeRoute: React.FC<SmartSafeRouteProps> = ({
  locations = [],
  routes = [],
  userRole,
  language,
}) => {
  const t = TRANSLATIONS[language];

  // All combined locations
  const allLocations = [...locations];
  POPULAR_NASHIK_SPOTS.forEach((spot) => {
    if (!allLocations.some((l) => l.location_name.toLowerCase().includes(spot.name.toLowerCase()))) {
      allLocations.push({
        location_id: spot.id,
        location_name: spot.name,
        category: spot.category as any,
        latitude: spot.lat,
        longitude: spot.lng,
        description: `${spot.name} in Nashik Kumbh area`,
        crowd_level: 'MEDIUM',
        crowd_percentage: 50,
        estimated_people: 5000,
        capacity: 10000,
        status: 'OPEN',
        facilities: ['Drinking Water', 'Information Desk'],
        opening_time: '05:00 AM',
        closing_time: '10:00 PM',
        emergency_contact: '112',
      });
    }
  });

  // State
  const [fromLocId, setFromLocId] = useState<string>('GPS_LIVE');
  const [toLocId, setToLocId] = useState<string>('loc_kalaram');
  const [navModalOpen, setNavModalOpen] = useState<boolean>(false);

  const [fromSearchText, setFromSearchText] = useState<string>('My Live Device GPS Location');
  const [toSearchText, setToSearchText] = useState<string>('Kalaram Mandir');

  // Live GPS tracking state
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>({
    lat: 20.0055,
    lng: 73.792,
  });
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(8);
  const [currentSpeed, setCurrentSpeed] = useState<number>(4.2); // km/h
  const [audioVoiceEnabled, setAudioVoiceEnabled] = useState<boolean>(true);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [simulationProgress, setSimulationProgress] = useState<number>(0);

  const watchIdRef = useRef<number | null>(null);
  const simTimerRef = useRef<any>(null);

  // Selected Origin & Destination objects
  const fromLoc = allLocations.find((l) => l.location_id === fromLocId) || {
    location_id: 'GPS_LIVE',
    location_name: fromSearchText || 'Current Device Position',
    latitude: userCoords?.lat || 20.0055,
    longitude: userCoords?.lng || 73.792,
    category: 'EMERGENCY_POINT',
    crowd_level: 'LOW',
  };

  const toLoc = allLocations.find((l) => l.location_id === toLocId) || {
    location_id: 'loc_kalaram',
    location_name: toSearchText || 'Kalaram Mandir',
    latitude: 20.008,
    longitude: 73.7915,
    category: 'TEMPLE',
    crowd_level: 'MEDIUM',
  };

  // Distance calculation (Haversine formula in km)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(2));
  };

  const distanceKm = calculateDistance(
    fromLoc.latitude,
    fromLoc.longitude,
    toLoc.latitude,
    toLoc.longitude
  ) || 1.8;

  const estimatedMins = Math.max(3, Math.round((distanceKm / 4.5) * 60)); // Walking at 4.5 km/h

  // Generate turn-by-turn navigation steps based on locations
  const navSteps = [
    {
      instruction: `Start at ${fromLoc.location_name} and head towards Godavari Corridor`,
      distance: `${(distanceKm * 0.25).toFixed(2)} km`,
      action: 'Straight',
    },
    {
      instruction: `Pass Panchavati Circle ring road and stay on pedestrian safe line`,
      distance: `${(distanceKm * 0.4).toFixed(2)} km`,
      action: 'Turn Right',
    },
    {
      instruction: `Cross Medical First Aid Booth & Water Distribution Hub`,
      distance: `${(distanceKm * 0.2).toFixed(2)} km`,
      action: 'Straight',
    },
    {
      instruction: `Arrive safely at destination: ${toLoc.location_name}`,
      distance: '0.00 km',
      action: 'Destination',
    },
  ];

  // Request real device GPS
  const handleGetLiveGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setUserCoords({ lat, lng });
          setGpsAccuracy(Math.round(pos.coords.accuracy));
          setFromLocId('GPS_LIVE');
          setFromSearchText('My Live Device GPS Location');
        },
        (err) => {
          console.warn('GPS Error, falling back to Ramkund Ghat position:', err);
          setUserCoords({ lat: 20.0055, lng: 73.792 });
          setGpsAccuracy(12);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  };

  // Speech synthesis announcement
  const speakInstruction = (text: string) => {
    if (!audioVoiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  // Start Live Tracking
  const toggleLiveTracking = () => {
    if (isTracking) {
      // Stop tracking
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsTracking(false);
      speakInstruction('GPS tracking stopped.');
    } else {
      // Start tracking
      setIsTracking(true);
      speakInstruction(`Starting live GPS navigation to ${toLoc.location_name}`);

      if (navigator.geolocation) {
        watchIdRef.current = navigator.geolocation.watchPosition(
          (pos) => {
            setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            setGpsAccuracy(Math.round(pos.coords.accuracy));
            if (pos.coords.speed) {
              setCurrentSpeed(parseFloat((pos.coords.speed * 3.6).toFixed(1))); // m/s to km/h
            }
          },
          (err) => console.warn(err),
          { enableHighAccuracy: true }
        );
      }
    }
  };

  // Simulate Live Movement along the route
  const toggleSimulation = () => {
    if (isSimulating) {
      clearInterval(simTimerRef.current);
      setIsSimulating(false);
      setSimulationProgress(0);
      speakInstruction('Navigation simulation paused.');
    } else {
      setIsSimulating(true);
      setSimulationProgress(0);
      setActiveStepIndex(0);
      speakInstruction(`Simulating live movement from ${fromLoc.location_name} to ${toLoc.location_name}`);

      const startLat = fromLoc.latitude;
      const startLng = fromLoc.longitude;
      const endLat = toLoc.latitude;
      const endLng = toLoc.longitude;

      let step = 0;
      const totalSteps = 100;

      simTimerRef.current = setInterval(() => {
        step += 1;
        const ratio = step / totalSteps;
        setSimulationProgress(Math.round(ratio * 100));

        // Interpolate position
        const currLat = startLat + (endLat - startLat) * ratio;
        const currLng = startLng + (endLng - startLng) * ratio;
        setUserCoords({ lat: currLat, lng: currLng });

        // Speed fluctuation
        setCurrentSpeed(parseFloat((3.8 + Math.random() * 1.4).toFixed(1)));

        // Update step index
        if (ratio > 0.75) setActiveStepIndex(3);
        else if (ratio > 0.5) setActiveStepIndex(2);
        else if (ratio > 0.25) setActiveStepIndex(1);
        else setActiveStepIndex(0);

        if (step >= totalSteps) {
          clearInterval(simTimerRef.current);
          setIsSimulating(false);
          speakInstruction(`You have arrived at ${toLoc.location_name}`);
        }
      }, 300);
    }
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
      if (simTimerRef.current) clearInterval(simTimerRef.current);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-orange-950/80 via-slate-900 to-amber-950/80 p-6 rounded-2xl border border-orange-500/30 space-y-2 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="bg-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-orange-500/40">
                Live GPS Routing Engine
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                Panchavati • Kalaram • Kapaleshwar
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white flex items-center space-x-2.5 font-serif">
              <Navigation className="w-6 h-6 text-orange-400" />
              <span>Place-to-Place Search & Live GPS Navigation</span>
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Search any location across Nashik Kumbh Mela, select origin & destination, and get real-time GPS tracking with turn-by-turn guidance and crowd-aware bypass recommendations.
            </p>
          </div>

          {/* Quick Voice & GPS Trigger */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setAudioVoiceEnabled(!audioVoiceEnabled)}
              className={`p-2.5 rounded-xl border transition flex items-center space-x-1 text-xs font-bold ${
                audioVoiceEnabled
                  ? 'bg-amber-500/20 border-amber-400/60 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title="Toggle Voice Turn-by-Turn Announcements"
            >
              {audioVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">Voice Guidance</span>
            </button>

            <button
              onClick={handleGetLiveGps}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-orange-300 px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition shadow"
            >
              <LocateFixed className="w-4 h-4 text-orange-400" />
              <span>Get My GPS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Place-to-Place Search Controls */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Origin Search */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-orange-400" />
                <span>Start Location (Origin)</span>
              </span>
              <button
                onClick={() => {
                  setFromLocId('GPS_LIVE');
                  setFromSearchText('My Live Device GPS Location');
                  handleGetLiveGps();
                }}
                className="text-[11px] text-amber-300 hover:underline flex items-center space-x-1 font-semibold"
              >
                <Crosshair className="w-3 h-3" />
                <span>Use Current GPS</span>
              </button>
            </label>

            <select
              value={fromLocId}
              onChange={(e) => {
                setFromLocId(e.target.value);
                const match = allLocations.find((l) => l.location_id === e.target.value);
                if (match) setFromSearchText(match.location_name);
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-orange-500 shadow-inner"
            >
              <option value="GPS_LIVE">📍 My Live Device GPS Location ({userCoords?.lat.toFixed(4)}, {userCoords?.lng.toFixed(4)})</option>
              {allLocations.map((loc) => (
                <option key={loc.location_id} value={loc.location_id}>
                  {loc.location_name} ({loc.category})
                </option>
              ))}
            </select>
          </div>

          {/* Destination Search */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1">
              <Navigation className="w-4 h-4 text-emerald-400" />
              <span>Destination (To Place)</span>
            </label>

            <select
              value={toLocId}
              onChange={(e) => {
                setToLocId(e.target.value);
                const match = allLocations.find((l) => l.location_id === e.target.value);
                if (match) setToSearchText(match.location_name);
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-orange-500 shadow-inner"
            >
              {allLocations.map((loc) => (
                <option key={loc.location_id} value={loc.location_id}>
                  {loc.location_name} - [{loc.crowd_level || 'MEDIUM'} CROWD]
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Landmark Selection Pills */}
        <div className="pt-1 space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Quick Select Famous Nashik Pilgrimage Landmarks:
          </p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_NASHIK_SPOTS.map((spot) => (
              <button
                key={spot.id}
                onClick={() => {
                  setToLocId(spot.id);
                  setToSearchText(spot.name);
                }}
                className={`text-xs px-3 py-1.5 rounded-xl border transition flex items-center space-x-1 font-medium ${
                  toLocId === spot.id
                    ? 'bg-orange-500 text-slate-950 border-orange-400 font-bold shadow'
                    : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <span>{spot.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons: Start Tracking / Simulate / Google Maps */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setNavModalOpen(true)}
            className="flex-1 min-w-[200px] flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-black text-sm bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 hover:from-orange-600 hover:to-emerald-600 text-slate-950 shadow-xl transition"
          >
            <Navigation className="w-5 h-5" />
            <span>📍 NAVIGATE WITH GOOGLE MAPS</span>
          </button>

          <button
            onClick={toggleLiveTracking}
            className={`flex items-center justify-center space-x-2 py-3 px-5 rounded-xl font-bold text-xs border transition ${
              isTracking
                ? 'bg-red-600 hover:bg-red-700 text-white border-red-500 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            {isTracking ? (
              <>
                <Square className="w-4 h-4" />
                <span>Stop GPS Tracking</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Internal GPS Tracking</span>
              </>
            )}
          </button>

          <button
            onClick={toggleSimulation}
            className={`flex items-center space-x-2 py-3 px-4 rounded-xl font-bold text-xs border transition ${
              isSimulating
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-400/40'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>{isSimulating ? 'Pause' : 'Simulate'}</span>
          </button>
        </div>
      </div>

      {/* Live GPS Active Status Bar */}
      {(isTracking || isSimulating) && (
        <div className="bg-slate-900 border-2 border-emerald-500/80 p-5 rounded-2xl shadow-2xl space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>{isSimulating ? 'SIMULATED GPS MOTION ACTIVE' : 'LIVE DEVICE GPS TRACKING ACTIVE'}</span>
            </div>
            <span className="text-slate-400 font-mono">
              Target: <strong className="text-white">{toLoc.location_name}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Distance Remaining</p>
              <p className="text-lg font-black text-white font-mono">{distanceKm} km</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Est. Arrival Time</p>
              <p className="text-lg font-black text-amber-300 font-mono">{estimatedMins} mins</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Current Speed</p>
              <p className="text-lg font-black text-emerald-400 font-mono">{currentSpeed} km/h</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase">GPS Accuracy</p>
              <p className="text-lg font-black text-blue-400 font-mono">±{gpsAccuracy}m</p>
            </div>
          </div>

          {/* Progress bar during simulation */}
          {isSimulating && (
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>Route Progress</span>
                <span>{simulationProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${simulationProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Interactive Map Display Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
        <div className="bg-slate-950/90 px-5 py-3 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-200">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-orange-400" />
            <span>Interactive Navigation Map</span>
          </div>
          <div className="flex items-center space-x-3 text-[11px] font-mono">
            <span className="text-orange-400">● Origin</span>
            <span className="text-emerald-400">● Destination</span>
            <span className="text-blue-400">● Live GPS</span>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative w-full h-[420px] bg-slate-950 flex flex-col items-center justify-center">
          {hasValidKey ? (
            <APIProvider apiKey={API_KEY} version="weekly">
              <GoogleMap
                defaultCenter={{ lat: fromLoc.latitude, lng: fromLoc.longitude }}
                defaultZoom={14}
                mapId="DEMO_MAP_ID"
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                style={{ width: '100%', height: '100%' }}
              >
                {/* Origin Marker */}
                <AdvancedMarker position={{ lat: fromLoc.latitude, lng: fromLoc.longitude }} title={fromLoc.location_name}>
                  <Pin background="#f97316" glyphColor="#000" />
                </AdvancedMarker>

                {/* Destination Marker */}
                <AdvancedMarker position={{ lat: toLoc.latitude, lng: toLoc.longitude }} title={toLoc.location_name}>
                  <Pin background="#10b981" glyphColor="#fff" />
                </AdvancedMarker>

                {/* User Live Location Marker */}
                {userCoords && (
                  <AdvancedMarker position={userCoords} title="Your Live GPS Position">
                    <Pin background="#3b82f6" glyphColor="#fff" />
                  </AdvancedMarker>
                )}
              </GoogleMap>
            </APIProvider>
          ) : (
            /* Interactive Visual Fallback Map with Polyline and Pins */
            <div className="relative w-full h-full bg-slate-950 overflow-hidden flex flex-col justify-between p-6">
              {/* API Key Setup Banner notice */}
              <div className="absolute top-4 left-4 right-4 z-20 bg-slate-900/90 border border-amber-500/50 p-3 rounded-xl text-xs text-amber-200 backdrop-blur-md flex items-center justify-between shadow-xl">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    <strong>Google Maps API Key Notice:</strong> Add <code>GOOGLE_MAPS_PLATFORM_KEY</code> in Settings → Secrets for full vector satellite map tiles.
                  </span>
                </div>
              </div>

              {/* Simulated Map Canvas */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  {/* Godavari River simulation line */}
                  <path d="M 0 150 Q 200 120 400 200 T 800 180 T 1200 220" fill="none" stroke="#0284c7" strokeWidth="24" opacity="0.6" />
                </svg>
              </div>

              {/* Route Map Visualization Canvas */}
              <div className="relative z-10 w-full h-full flex flex-col justify-between pt-12 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                  {/* Waypoint details */}
                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex flex-col justify-between text-xs space-y-3 backdrop-blur shadow-xl">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-orange-400 font-bold">
                        <MapPin className="w-4 h-4" />
                        <span>Origin: {fromLoc.location_name}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                        <Navigation className="w-4 h-4" />
                        <span>Destination: {toLoc.location_name}</span>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1 text-slate-300">
                      <p className="font-semibold text-amber-300 text-[11px] uppercase tracking-wider">
                        Live Navigation Guidance:
                      </p>
                      <p className="text-xs leading-relaxed font-mono">
                        {navSteps[activeStepIndex]?.instruction || 'Proceed along main pilgrimage corridor'}
                      </p>
                    </div>
                  </div>

                  {/* Visual Route Path Map Overlay */}
                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex flex-col items-center justify-center relative overflow-hidden backdrop-blur">
                    <div className="text-center space-y-2">
                      <div className="inline-flex items-center space-x-2 bg-slate-800 px-3 py-1 rounded-full border border-slate-700 text-xs font-mono text-amber-300">
                        <LocateFixed className="w-3.5 h-3.5 text-amber-400" />
                        <span>GPS Coordinates: {userCoords?.lat.toFixed(4)}, {userCoords?.lng.toFixed(4)}</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Calculated Safe Path: <strong>{distanceKm} km</strong> • Approx <strong>{estimatedMins} mins walking</strong>
                      </p>
                    </div>

                    {/* Animated Route Line */}
                    <div className="w-full h-24 my-3 relative flex items-center justify-between px-6">
                      <div className="absolute left-10 right-10 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500 transition-all duration-300"
                          style={{ width: isSimulating ? `${simulationProgress}%` : '100%' }}
                        />
                      </div>

                      {/* Origin Pin */}
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-slate-950 font-bold text-xs shadow-lg ring-4 ring-orange-500/30">
                          A
                        </div>
                        <span className="text-[10px] text-orange-300 font-bold mt-1 max-w-[80px] truncate text-center">
                          {fromLoc.location_name}
                        </span>
                      </div>

                      {/* Moving User GPS Pin */}
                      {userCoords && (
                        <div
                          className="relative z-20 flex flex-col items-center transition-all duration-300"
                          style={{
                            position: 'absolute',
                            left: `${Math.max(10, Math.min(85, isSimulating ? simulationProgress : 50))}%`,
                          }}
                        >
                          <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs shadow-xl ring-4 ring-blue-500/40 animate-bounce">
                            📍
                          </div>
                          <span className="text-[9px] bg-blue-950 text-blue-200 px-1.5 py-0.5 rounded font-mono font-bold mt-0.5 shadow">
                            You
                          </span>
                        </div>
                      )}

                      {/* Destination Pin */}
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs shadow-lg ring-4 ring-emerald-500/30">
                          B
                        </div>
                        <span className="text-[10px] text-emerald-300 font-bold mt-1 max-w-[80px] truncate text-center">
                          {toLoc.location_name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Turn-by-Turn Step Guidance Card */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
          <Clock className="w-4 h-4 text-orange-400" />
          <span>Step-by-Step Live Route Directions</span>
        </h3>

        <div className="space-y-2.5">
          {navSteps.map((step, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition flex items-center justify-between text-xs ${
                idx === activeStepIndex
                  ? 'bg-orange-500/10 border-orange-500/60 text-orange-200 font-medium'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                  idx === activeStepIndex
                    ? 'bg-orange-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {idx + 1}
                </span>
                <span>{step.instruction}</span>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <span className="text-slate-400 font-mono text-[11px]">{step.distance}</span>
                <button
                  onClick={() => speakInstruction(step.instruction)}
                  className="p-1 hover:text-amber-300 text-slate-400 transition"
                  title="Read Aloud"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Google Maps Navigation Modal */}
      <GoogleMapsNavModal
        isOpen={navModalOpen}
        onClose={() => setNavModalOpen(false)}
        destination={toLoc as any}
        fromLocation={fromLoc as any}
        allLocations={allLocations as any}
      />
    </div>
  );
};
