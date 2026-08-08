/**
 * KUMBH SARTHI - Interactive Live Crowd Map for Nashik
 */

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Search,
  Filter,
  ShieldAlert,
  Car,
  Utensils,
  Droplets,
  Layers,
  Bus,
  Clock,
  Phone,
  Route,
  Info,
  X,
  CheckCircle2,
  AlertTriangle,
  LocateFixed,
  Compass,
  Navigation,
  Globe,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { LocationRecord, LocationCategory, CrowdLevel } from '../types';
import { TRANSLATIONS } from '../lib/translations';
import { APIProvider, Map as GoogleMap, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { GoogleMapsNavModal } from './GoogleMapsNavModal';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

interface LiveCrowdMapProps {
  locations?: LocationRecord[];
  language: 'en' | 'hi' | 'mr';
  onSelectRouteTarget?: (fromId: string, toId: string) => void;
  onSelectLocation?: (locId: string) => void;
}

export const LiveCrowdMap: React.FC<LiveCrowdMapProps> = ({
  locations = [],
  language,
  onSelectRouteTarget,
  onSelectLocation,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<LocationRecord | null>((locations && locations[0]) || null);
  const [mapMode, setMapMode] = useState<'smart' | 'google'>('google');
  const [navModalOpen, setNavModalOpen] = useState<boolean>(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>({
    lat: 20.0055,
    lng: 73.792,
  });

  const t = TRANSLATIONS[language];

  // Request Live Device GPS
  const handleGetLiveGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => {
          console.warn('GPS position error:', err);
          setUserCoords({ lat: 20.0055, lng: 73.792 });
        },
        { enableHighAccuracy: true }
      );
    }
  };

  // Haversine distance calculation in km
  const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
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

  const categoriesList = [
    { id: 'ALL', label: 'All Markers' },
    { id: 'GHAT', label: 'Holy Ghats 🌊' },
    { id: 'TEMPLE', label: 'Temples 🛕' },
    { id: 'PARKING', label: 'Parking 🅿️' },
    { id: 'POLICE', label: 'Police 🚔' },
    { id: 'HOSPITAL', label: 'Medical 🚑' },
    { id: 'FOOD', label: 'Food 🍛' },
    { id: 'WATER', label: 'Water 💧' },
    { id: 'TOILET', label: 'Toilets 🚻' },
    { id: 'TRANSPORT', label: 'Transit 🚌' },
    { id: 'HIGH_CROWD', label: '🔴 High Crowd Only' },
  ];

  // Filter locations
  const filteredLocations = (locations || []).filter((loc) => {
    const matchesSearch =
      loc.location_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'HIGH_CROWD') return loc.crowd_level === 'HIGH' || loc.crowd_level === 'CRITICAL';
    return loc.category === selectedCategory;
  });

  // Calculate SVG map node positions scaled for Nashik relative coords
  // Lat range ~19.95 to 20.02, Lng range ~73.77 to 73.84
  const getMapCoordinates = (lat: number, lng: number) => {
    const minLat = 19.94;
    const maxLat = 20.02;
    const minLng = 73.77;
    const maxLng = 73.84;

    const x = ((lng - minLng) / (maxLng - minLng)) * 800 + 50;
    const y = 500 - ((lat - minLat) / (maxLat - minLat)) * 400; // inverted Y

    return { x, y };
  };

  const getMarkerColor = (level: CrowdLevel) => {
    switch (level) {
      case 'LOW':
        return '#10b981'; // green
      case 'MEDIUM':
        return '#f59e0b'; // amber
      case 'HIGH':
        return '#ef4444'; // red
      case 'CRITICAL':
        return '#e11d48'; // rose
      default:
        return '#3b82f6';
    }
  };

  const getCategoryEmoji = (cat: LocationCategory) => {
    switch (cat) {
      case 'GHAT':
        return '🌊';
      case 'TEMPLE':
        return '🛕';
      case 'PARKING':
        return '🅿️';
      case 'POLICE':
        return '🚔';
      case 'HOSPITAL':
      case 'MEDICAL_CAMP':
        return '🚑';
      case 'FOOD':
        return '🍛';
      case 'WATER':
        return '💧';
      case 'TOILET':
        return '🚻';
      case 'TRANSPORT':
      case 'BUS_STOP':
        return '🚌';
      case 'RAILWAY':
        return '🚆';
      default:
        return '📍';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-orange-400" />
            <span>Interactive Nashik Live Crowd Map</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Color-coded crowd heat map: 🟢 Low (0-40%) • 🟡 Medium (41-70%) • 🔴 High (71-100%)
          </p>
        </div>

        {/* Search & Quick Spots */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
            {['Panchavati', 'Kalaram', 'Kapaleshwar', 'Ramkund', 'Tapovan', 'Muktidham'].map((spot) => (
              <button
                key={spot}
                onClick={() => setSearchQuery(spot)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition whitespace-nowrap font-medium ${
                  searchQuery.toLowerCase() === spot.toLowerCase()
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                }`}
              >
                {spot}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search Panchavati, Kalaram, Kapaleshwar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Filter Pills & Map View Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none py-1">
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                selectedCategory === cat.id
                  ? 'bg-orange-500 text-slate-950 border-orange-400 font-bold shadow-md'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Map Mode Switcher & GPS Button */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleGetLiveGps}
            className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-amber-300 px-3 py-1.5 rounded-xl border border-slate-700 transition text-xs font-bold shadow"
            title="Get Current Live GPS Location"
          >
            <LocateFixed className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">My Live GPS</span>
          </button>

          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setMapMode('google')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-lg font-bold transition ${
                mapMode === 'google'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Google Map</span>
            </button>
            <button
              onClick={() => setMapMode('smart')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-lg font-bold transition ${
                mapMode === 'smart'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Smart Canvas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Map + Side Drawer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Interactive Map Section */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-4 relative shadow-2xl overflow-hidden min-h-[500px]">
          {mapMode === 'google' && hasValidKey ? (
            <div className="w-full h-[520px] rounded-xl overflow-hidden">
              <APIProvider apiKey={API_KEY} version="weekly">
                <GoogleMap
                  defaultCenter={{
                    lat: selectedLocation?.latitude || 20.0063,
                    lng: selectedLocation?.longitude || 73.7932,
                  }}
                  defaultZoom={15}
                  mapId="DEMO_MAP_ID"
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                  style={{ width: '100%', height: '100%' }}
                >
                  {/* Render Markers for Locations */}
                  {filteredLocations.map((loc) => (
                    <AdvancedMarker
                      key={loc.location_id}
                      position={{ lat: loc.latitude, lng: loc.longitude }}
                      title={loc.location_name}
                      onClick={() => setSelectedLocation(loc)}
                    >
                      <Pin
                        background={getMarkerColor(loc.crowd_level)}
                        glyphColor="#000000"
                      />
                    </AdvancedMarker>
                  ))}

                  {/* User GPS Pin */}
                  {userCoords && (
                    <AdvancedMarker position={userCoords} title="My Current Live Location">
                      <Pin background="#3b82f6" glyphColor="#ffffff" />
                    </AdvancedMarker>
                  )}
                </GoogleMap>
              </APIProvider>
            </div>
          ) : (
            /* Interactive SVG Smart Canvas Map */
            <div className="w-full h-full relative">
              <svg
                viewBox="0 0 900 550"
                className="w-full h-auto min-h-[480px] bg-slate-950 rounded-xl select-none"
              >
              {/* Background Map Grid */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                </pattern>
                {/* Glow Filter */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              <rect width="900" height="550" fill="url(#grid)" />

              {/* Godavari River Curved Water Path */}
              <path
                d="M 50 480 Q 250 420 380 280 T 580 180 T 850 120"
                fill="none"
                stroke="#0284c7"
                strokeWidth="28"
                strokeLinecap="round"
                opacity="0.3"
              />
              <path
                d="M 50 480 Q 250 420 380 280 T 580 180 T 850 120"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="12"
                strokeLinecap="round"
                opacity="0.6"
              />

              {/* Godavari River Text Label */}
              <text x="220" y="420" fill="#38bdf8" fontSize="13" fontWeight="bold" opacity="0.7">
                ~ Holy Godavari River ~
              </text>

              {/* Major Roads / Ring Road overlay lines */}
              <path
                d="M 120 500 L 380 280 L 650 100"
                fill="none"
                stroke="#334155"
                strokeWidth="4"
                strokeDasharray="6,6"
              />
              <path
                d="M 280 280 L 750 350"
                fill="none"
                stroke="#334155"
                strokeWidth="4"
                strokeDasharray="6,6"
              />

              {/* Render Location Markers */}
              {filteredLocations.map((loc) => {
                const { x, y } = getMapCoordinates(loc.latitude, loc.longitude);
                const isSelected = selectedLocation?.location_id === loc.location_id;
                const markerColor = getMarkerColor(loc.crowd_level);

                return (
                  <g
                    key={loc.location_id}
                    transform={`translate(${x}, ${y})`}
                    onClick={() => setSelectedLocation(loc)}
                    className="cursor-pointer group"
                  >
                    {/* Crowd Heat Pulse Circle */}
                    <circle
                      r={loc.crowd_percentage > 70 ? 24 : 18}
                      fill={markerColor}
                      opacity={isSelected ? 0.4 : 0.25}
                      className={loc.crowd_level === 'HIGH' || loc.crowd_level === 'CRITICAL' ? 'animate-ping' : ''}
                    />

                    {/* Outer Marker Border */}
                    <circle
                      r={isSelected ? 16 : 13}
                      fill="#0f172a"
                      stroke={isSelected ? '#f97316' : markerColor}
                      strokeWidth={isSelected ? 3 : 2}
                      filter="url(#glow)"
                    />

                    {/* Emoji / Icon */}
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fontSize={isSelected ? '12' : '10'}
                    >
                      {getCategoryEmoji(loc.category)}
                    </text>

                    {/* Location Name Label */}
                    <text
                      x="0"
                      y="26"
                      textAnchor="middle"
                      fill={isSelected ? '#fdba74' : '#e2e8f0'}
                      fontSize="10"
                      fontWeight={isSelected ? 'bold' : '500'}
                      className="pointer-events-none drop-shadow"
                    >
                      {loc.location_name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Map Legend Floating Box */}
            <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur border border-slate-800 p-3 rounded-xl text-[11px] text-slate-300 space-y-1.5 shadow-xl">
              <div className="font-bold text-white mb-1">Map Legend</div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                <span>Low Crowd (&le;40%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                <span>Medium Crowd (41-70%)</span>
              </div>
            </div>
          </div>
        )}
        </div>

        {/* Selected Marker Detail Card / Drawer */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5">
          {selectedLocation ? (
            <>
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/30">
                    {selectedLocation.category}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    {selectedLocation.location_name}
                  </h3>
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ backgroundColor: `${getMarkerColor(selectedLocation.crowd_level)}20` }}
                >
                  {getCategoryEmoji(selectedLocation.category)}
                </div>
              </div>

              {/* Crowd Density Stats */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Current Crowd Status</span>
                  <span
                    className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                    style={{
                      color: getMarkerColor(selectedLocation.crowd_level),
                      backgroundColor: `${getMarkerColor(selectedLocation.crowd_level)}20`,
                      border: `1px solid ${getMarkerColor(selectedLocation.crowd_level)}50`,
                    }}
                  >
                    {selectedLocation.crowd_level} CROWD ({selectedLocation.crowd_percentage}%)
                  </span>
                </div>

                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, selectedLocation.crowd_percentage)}%`,
                      backgroundColor: getMarkerColor(selectedLocation.crowd_level),
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <p className="text-slate-400 text-[10px]">Estimated People</p>
                    <p className="text-white font-bold font-mono">
                      {selectedLocation.estimated_people.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px]">Total Capacity</p>
                    <p className="text-slate-300 font-bold font-mono">
                      {selectedLocation.capacity.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Live Distance Remaining Widget */}
              {userCoords && (
                <div className="bg-gradient-to-r from-orange-950/60 to-slate-900 border border-orange-500/30 p-3.5 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-orange-400 font-bold flex items-center space-x-1">
                      <LocateFixed className="w-3.5 h-3.5" />
                      <span>Live Distance Remaining:</span>
                    </span>
                    <span className="text-white font-black font-mono text-sm">
                      {getDistanceKm(
                        userCoords.lat,
                        userCoords.lng,
                        selectedLocation.latitude,
                        selectedLocation.longitude
                      )}{' '}
                      km
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Est. Walking Time:{' '}
                    <strong className="text-amber-300">
                      {Math.max(
                        2,
                        Math.round(
                          (getDistanceKm(
                            userCoords.lat,
                            userCoords.lng,
                            selectedLocation.latitude,
                            selectedLocation.longitude
                          ) /
                            4.5) *
                            60
                        )
                      )}{' '}
                      mins
                    </strong>
                  </p>
                </div>
              )}

              {/* Description & Operating Info */}
              <div className="space-y-2 text-xs">
                <p className="text-slate-300 leading-relaxed">{selectedLocation.description}</p>

                <div className="pt-2 space-y-1.5 text-slate-400">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <span>Hours: {selectedLocation.opening_time} - {selectedLocation.closing_time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Helpline: {selectedLocation.emergency_contact}</span>
                  </div>
                </div>
              </div>

              {/* Facilities Tag Cloud */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Nearby Facilities
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedLocation.facilities || []).map((fac, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700"
                    >
                      ✓ {fac}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => setNavModalOpen(true)}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 hover:from-orange-600 hover:to-emerald-600 text-slate-950 font-extrabold py-3 rounded-xl transition text-xs shadow-xl"
                >
                  <Navigation className="w-4 h-4" />
                  <span>📍 NAVIGATE WITH GOOGLE MAPS</span>
                </button>

                <button
                  onClick={() => {
                    if (onSelectRouteTarget) onSelectRouteTarget('GPS_LIVE', selectedLocation.location_id);
                    else if (onSelectLocation) onSelectLocation(selectedLocation.location_id);
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 rounded-xl border border-slate-700 transition text-xs shadow"
                >
                  <Compass className="w-4 h-4 text-orange-400" />
                  <span>View Live Route Engine in Kumbh Sarthi</span>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Info className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs">Click any marker on the map to view detailed crowd statistics.</p>
            </div>
          )}
        </div>
      </div>

      {/* Google Maps Pre-Navigation Modal */}
      <GoogleMapsNavModal
        isOpen={navModalOpen}
        onClose={() => setNavModalOpen(false)}
        destination={selectedLocation}
        allLocations={locations}
        onSelectAlternative={(alt) => setSelectedLocation(alt)}
      />
    </div>
  );
};
