/**
 * KUMBH SARTHI - Google Maps Pre-Navigation & Safe Route Modal
 */

import React, { useState, useEffect } from 'react';
import {
  Navigation,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  X,
  Compass,
  Footprints,
  Car,
  Bike,
  Bus,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  LocateFixed,
  RefreshCw,
  Sparkles,
  Info,
} from 'lucide-react';
import { LocationRecord, CrowdLevel } from '../types';
import {
  buildGoogleMapsDirectionsUrl,
  launchGoogleMapsNavigation,
  calculateDistanceKm,
  estimateWalkingMinutes,
  TravelMode,
} from '../utils/googleMapsNav';

interface GoogleMapsNavModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: LocationRecord | null;
  fromLocation?: LocationRecord | null;
  allLocations?: LocationRecord[];
  onSelectAlternative?: (altLocation: LocationRecord) => void;
}

export const GoogleMapsNavModal: React.FC<GoogleMapsNavModalProps> = ({
  isOpen,
  onClose,
  destination,
  fromLocation,
  allLocations = [],
  onSelectAlternative,
}) => {
  if (!isOpen || !destination) return null;

  // Location state
  const [selectedFromId, setSelectedFromId] = useState<string>('GPS_LIVE');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [travelMode, setTravelMode] = useState<TravelMode>('walking');
  const [showAlternativeView, setShowAlternativeView] = useState<boolean>(false);

  // Request browser location permission & current coordinates
  const detectUserLocation = () => {
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      (error) => {
        console.warn('Geolocation permission error:', error);
        let errorMsg = 'Location permission denied or unavailable.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Location permission denied by user.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'GPS signal unavailable.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'Location request timed out.';
        }
        setLocationError(errorMsg);
        setIsLocating(false);
        // Fallback default Nashik center
        setUserCoords({ lat: 20.0055, lng: 73.7920 });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    if (isOpen) {
      if (fromLocation && fromLocation.location_id && fromLocation.location_id !== 'GPS_LIVE') {
        setSelectedFromId(fromLocation.location_id);
      } else {
        setSelectedFromId('GPS_LIVE');
      }
      detectUserLocation();
      setShowAlternativeView(false);
    }
  }, [isOpen, destination, fromLocation]);

  // Determine resolved FROM location object if manually selected
  const resolvedFromLoc =
    selectedFromId === 'GPS_LIVE'
      ? null
      : allLocations.find((l) => l.location_id === selectedFromId) ||
        (fromLocation && fromLocation.location_id === selectedFromId ? fromLocation : null);

  // Determine active origin coordinates for distance calculation
  const activeOriginCoords =
    selectedFromId !== 'GPS_LIVE' && resolvedFromLoc
      ? { lat: resolvedFromLoc.latitude, lng: resolvedFromLoc.longitude }
      : userCoords;

  // Compute Distance
  const distanceKm =
    activeOriginCoords && destination
      ? calculateDistanceKm(activeOriginCoords.lat, activeOriginCoords.lng, destination.latitude, destination.longitude)
      : 1.8;

  const estimatedMins = estimateWalkingMinutes(distanceKm);

  // Find Alternative Low Crowd Locations
  const alternativeLocations = allLocations.filter(
    (loc) =>
      loc.location_id !== destination.location_id &&
      (loc.crowd_level === 'LOW' || loc.crowd_level === 'MEDIUM') &&
      loc.status === 'OPEN'
  ).slice(0, 3);

  // Launch Google Maps navigation
  const handleStartGoogleMapsNavigation = (lat?: number, lng?: number, name?: string) => {
    const targetLat = lat ?? destination.latitude;
    const targetLng = lng ?? destination.longitude;
    const targetName = name ?? destination.location_name;

    let originLat: number | null | undefined = undefined;
    let originLng: number | null | undefined = undefined;

    if (selectedFromId === 'GPS_LIVE') {
      originLat = userCoords?.lat;
      originLng = userCoords?.lng;
    } else if (resolvedFromLoc) {
      originLat = resolvedFromLoc.latitude;
      originLng = resolvedFromLoc.longitude;
    }

    launchGoogleMapsNavigation(
      originLat,
      originLng,
      targetLat,
      targetLng,
      targetName,
      travelMode
    );

    // Save Return Banner Flag
    localStorage.setItem('kumbh_nav_return_active', 'true');
    localStorage.setItem('kumbh_last_destination', targetName);

    onClose();
  };

  // Crowd level badge rendering
  const renderCrowdBadge = (level: CrowdLevel) => {
    switch (level) {
      case 'LOW':
        return (
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs px-2.5 py-1 rounded-full font-bold flex items-center space-x-1">
            <span>🟢 Low Crowd ({destination.crowd_percentage || 25}%)</span>
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs px-2.5 py-1 rounded-full font-bold flex items-center space-x-1">
            <span>🟡 Moderate Crowd ({destination.crowd_percentage || 55}%)</span>
          </span>
        );
      case 'HIGH':
        return (
          <span className="bg-orange-500/20 text-orange-400 border border-orange-500/40 text-xs px-2.5 py-1 rounded-full font-bold flex items-center space-x-1">
            <span>🔴 High Crowd ({destination.crowd_percentage || 85}%)</span>
          </span>
        );
      case 'CRITICAL':
        return (
          <span className="bg-red-500/20 text-red-400 border border-red-500/40 text-xs px-2.5 py-1 rounded-full font-bold flex items-center space-x-1 animate-pulse">
            <span>🚨 Critical Crowd ({destination.crowd_percentage || 95}%)</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-950/90 via-slate-900 to-amber-950/90 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/40">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white font-serif">
                Navigate with Google Maps
              </h3>
              <p className="text-[11px] text-slate-400">
                Live Turn-by-Turn Guidance & Safe Routing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Destination Header Card */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                  Target Destination
                </span>
                <h4 className="text-lg font-black text-white mt-1 flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{destination.location_name}</span>
                </h4>
              </div>
              <div>{renderCrowdBadge(destination.crowd_level)}</div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {destination.description || 'Famous pilgrimage location in Nashik Kumbh area.'}
            </p>

            {/* Facilities Chips */}
            {destination.facilities && destination.facilities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {destination.facilities.map((fac, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded"
                  >
                    ✓ {fac}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Starting Location (FROM) Selection */}
          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] flex items-center space-x-1">
                <LocateFixed className="w-3.5 h-3.5 text-blue-400" />
                <span>Starting Location (FROM)</span>
              </span>

              {selectedFromId === 'GPS_LIVE' && (
                <button
                  onClick={detectUserLocation}
                  className="text-[11px] text-amber-300 hover:underline flex items-center space-x-1"
                >
                  <RefreshCw className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>Re-detect GPS</span>
                </button>
              )}
            </div>

            <select
              value={selectedFromId}
              onChange={(e) => setSelectedFromId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-lg p-2.5 font-medium focus:ring-1 focus:ring-orange-500 focus:outline-none"
            >
              <option value="GPS_LIVE">📍 My Current Location (GPS)</option>
              {allLocations.map((loc) => (
                <option key={loc.location_id} value={loc.location_id}>
                  {loc.location_name} ({loc.category})
                </option>
              ))}
            </select>

            {selectedFromId === 'GPS_LIVE' ? (
              isLocating ? (
                <div className="flex items-center space-x-2 text-amber-300 py-1">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                  <span>Requesting browser location permission...</span>
                </div>
              ) : locationError ? (
                <div className="bg-red-500/10 border border-red-500/30 p-2.5 rounded-lg text-red-200 space-y-1">
                  <p className="font-semibold flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>{locationError}</span>
                  </p>
                  <p className="text-[11px] text-slate-300">
                    You can still open Google Maps or select a manual starting point.
                  </p>
                </div>
              ) : userCoords ? (
                <div className="flex flex-wrap items-center justify-between text-slate-200 pt-0.5">
                  <span className="font-mono text-emerald-400 text-[11px]">
                    📍 {userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)} (GPS Detected)
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    Distance: <strong className="text-white">{distanceKm} km</strong> (~{estimatedMins} mins walk)
                  </span>
                </div>
              ) : null
            ) : resolvedFromLoc ? (
              <div className="flex flex-wrap items-center justify-between text-slate-200 pt-0.5">
                <span className="font-mono text-amber-400 text-[11px]">
                  📍 {resolvedFromLoc.latitude.toFixed(4)}, {resolvedFromLoc.longitude.toFixed(4)} ({resolvedFromLoc.location_name})
                </span>
                <span className="text-slate-400 font-mono text-[11px]">
                  Distance: <strong className="text-white">{distanceKm} km</strong> (~{estimatedMins} mins walk)
                </span>
              </div>
            ) : null}
          </div>

          {/* Crowd Safe Route Advisory */}
          {(destination.crowd_level === 'HIGH' || destination.crowd_level === 'CRITICAL') && (
            <div className="bg-gradient-to-r from-orange-950/80 to-slate-900 border-2 border-orange-500/60 p-4 rounded-xl space-y-3">
              <div className="flex items-center space-x-2 text-orange-400 font-extrabold text-xs">
                <ShieldAlert className="w-4 h-4 text-orange-400 shrink-0" />
                <span>SAFE ROUTE ADVISORY: High Crowd Warning</span>
              </div>

              <p className="text-xs text-orange-200 leading-relaxed">
                <strong>{destination.location_name}</strong> is currently at{' '}
                <strong className="text-white">{destination.crowd_percentage}% capacity</strong>. High crowd density detected by IoT sensors. Consider visiting a nearby low-crowd pilgrimage spot first.
              </p>

              {alternativeLocations.length > 0 && (
                <div className="pt-1">
                  <button
                    onClick={() => setShowAlternativeView(!showAlternativeView)}
                    className="text-xs bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/40 px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {showAlternativeView ? 'Hide Alternative Spots' : 'View Recommended Low-Crowd Alternatives'}
                    </span>
                  </button>
                </div>
              )}

              {showAlternativeView && alternativeLocations.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-orange-500/30 animate-fadeIn">
                  <p className="text-[11px] font-bold text-slate-300">
                    Recommended Low-Crowd Bypass Spots:
                  </p>
                  <div className="space-y-1.5">
                    {alternativeLocations.map((alt) => (
                      <div
                        key={alt.location_id}
                        className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-bold text-white">{alt.location_name}</p>
                          <p className="text-[10px] text-slate-400">{alt.category} • {alt.crowd_level} Crowd ({alt.crowd_percentage}%)</p>
                        </div>
                        <button
                          onClick={() => {
                            if (onSelectAlternative) onSelectAlternative(alt);
                            handleStartGoogleMapsNavigation(alt.latitude, alt.longitude, alt.location_name);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2.5 py-1 rounded text-[11px] flex items-center space-x-1 shadow"
                        >
                          <span>Navigate</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Travel Mode Selector */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Select Travel Mode for Google Maps:
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setTravelMode('walking')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 text-xs font-bold transition ${
                  travelMode === 'walking'
                    ? 'bg-orange-500 text-slate-950 border-orange-400 shadow-md'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <Footprints className="w-4 h-4" />
                <span>Walking</span>
              </button>

              <button
                onClick={() => setTravelMode('bicycling')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 text-xs font-bold transition ${
                  travelMode === 'bicycling'
                    ? 'bg-orange-500 text-slate-950 border-orange-400 shadow-md'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <Bike className="w-4 h-4" />
                <span>2-Wheeler</span>
              </button>

              <button
                onClick={() => setTravelMode('driving')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 text-xs font-bold transition ${
                  travelMode === 'driving'
                    ? 'bg-orange-500 text-slate-950 border-orange-400 shadow-md'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <Car className="w-4 h-4" />
                <span>Driving</span>
              </button>

              <button
                onClick={() => setTravelMode('transit')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 text-xs font-bold transition ${
                  travelMode === 'transit'
                    ? 'bg-orange-500 text-slate-950 border-orange-400 shadow-md'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <Bus className="w-4 h-4" />
                <span>Transit</span>
              </button>
            </div>
          </div>

          {/* Platform Explanatory Note */}
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-[11px] text-slate-400 flex items-start space-x-2">
            <Info className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <span>
              Clicking <strong>Open Google Maps</strong> will open the official Google Maps app on mobile or tab on desktop. Press <strong>Start</strong> in Google Maps for turn-by-turn voice navigation.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-950 border-t border-slate-800 p-4 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
          >
            Cancel
          </button>

          <button
            onClick={() => handleStartGoogleMapsNavigation()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 hover:from-orange-600 hover:to-emerald-600 text-slate-950 font-extrabold text-xs shadow-xl transition flex items-center justify-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>OPEN GOOGLE MAPS DIRECTLY</span>
          </button>
        </div>
      </div>
    </div>
  );
};
