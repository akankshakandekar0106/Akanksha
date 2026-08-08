/**
 * KUMBH SARTHI - Google Maps Navigation Deep Link Utilities
 */

export type TravelMode = 'walking' | 'driving' | 'bicycling' | 'transit';

/**
 * Builds standard Google Maps Directions URL / Deep Link
 */
export function buildGoogleMapsDirectionsUrl(
  originLat?: number | null,
  originLng?: number | null,
  destLat?: number,
  destLng?: number,
  destName?: string,
  travelMode: TravelMode = 'walking'
): string {
  const baseUrl = 'https://www.google.com/maps/dir/?api=1';

  let destinationParam = '';
  if (destLat !== undefined && destLng !== undefined) {
    destinationParam = `${destLat},${destLng}`;
  } else if (destName) {
    destinationParam = encodeURIComponent(`${destName}, Nashik, Maharashtra`);
  } else {
    destinationParam = '20.0063,73.7932'; // Ramkund Ghat default
  }

  let originParam = '';
  if (originLat !== undefined && originLat !== null && originLng !== undefined && originLng !== null) {
    originParam = `${originLat},${originLng}`;
  }

  let modeParam = travelMode;
  if (travelMode === 'bicycling') modeParam = 'bicycling';

  let url = `${baseUrl}&destination=${destinationParam}&travelmode=${modeParam}`;
  if (originParam) {
    url += `&origin=${originParam}`;
  }

  return url;
}

/**
 * Opens Google Maps Navigation in Google Maps App (Mobile) or New Tab (Desktop)
 */
export function launchGoogleMapsNavigation(
  originLat?: number | null,
  originLng?: number | null,
  destLat?: number,
  destLng?: number,
  destName?: string,
  travelMode: TravelMode = 'walking'
): void {
  const url = buildGoogleMapsDirectionsUrl(
    originLat,
    originLng,
    destLat,
    destLng,
    destName,
    travelMode
  );

  // Open in new tab/window which triggers native app deep link on iOS/Android
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Haversine formula to compute distance in km
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
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
}

/**
 * Estimate walking duration in minutes at average 4.5 km/h
 */
export function estimateWalkingMinutes(distanceKm: number): number {
  if (distanceKm <= 0) return 1;
  return Math.max(1, Math.round((distanceKm / 4.5) * 60));
}
