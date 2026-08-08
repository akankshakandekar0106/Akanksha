/**
 * KUMBH SARTHI - System Types
 * Smart Kumbh Mela Crowd Management & Pilgrim Assistance System
 */

export type UserRole = 'visitor' | 'admin' | 'police' | 'medical' | 'volunteer';

export type CrowdLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type LocationCategory = 
  | 'GHAT'
  | 'TEMPLE'
  | 'PARKING'
  | 'POLICE'
  | 'HOSPITAL'
  | 'MEDICAL_CAMP'
  | 'FOOD'
  | 'WATER'
  | 'TOILET'
  | 'TRANSPORT'
  | 'RAILWAY'
  | 'BUS_STOP'
  | 'ACCOMMODATION'
  | 'INFORMATION_CENTER'
  | 'EMERGENCY_POINT';

export interface LocationRecord {
  location_id: string;
  location_name: string;
  category: LocationCategory;
  latitude: number;
  longitude: number;
  description: string;
  crowd_level: CrowdLevel;
  crowd_percentage: number;
  estimated_people: number;
  capacity: number;
  status: 'OPEN' | 'CLOSED' | 'RESTRICTED' | 'EMERGENCY_ONLY';
  facilities: string[];
  opening_time: string;
  closing_time: string;
  emergency_contact: string;
  created_at?: string;
  updated_at?: string;
}

export interface RouteRecord {
  route_id: string;
  from_location_id: string;
  from_location_name: string;
  to_location_id: string;
  to_location_name: string;
  distance_km: number;
  estimated_minutes: number;
  crowd_level: CrowdLevel;
  status: 'OPEN' | 'CLOSED' | 'RESTRICTED' | 'EMERGENCY_ONLY';
  via_points: string[];
  alternative_route_id?: string;
  safety_score: number; // 1 to 10
  notes: string;
}

export type EmergencyType = 'POLICE' | 'MEDICAL' | 'FIRE' | 'CONTROL_ROOM' | 'LOST_PERSON' | 'STAMPEDE_RISK' | 'OTHER';
export type EmergencyStatus = 'NEW' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED';

export interface EmergencyReport {
  id: string;
  user_id?: string;
  user_name: string;
  user_phone: string;
  emergency_type: EmergencyType;
  description: string;
  latitude: number;
  longitude: number;
  location_name: string;
  timestamp: string;
  status: EmergencyStatus;
  assigned_team?: string;
  resolution_notes?: string;
}

export type LostFoundStatus = 'LOST' | 'FOUND' | 'MATCHED' | 'RETURNED' | 'CLOSED';

export interface LostFoundItem {
  id: string;
  type: 'LOST' | 'FOUND';
  item_name: string;
  description: string;
  category: 'PERSON' | 'BELONGINGS' | 'DOCUMENT' | 'ELECTRONICS' | 'CHILD' | 'OTHER';
  location_name: string;
  date_time: string;
  photo_url?: string;
  contact_name: string;
  contact_phone: string;
  status: LostFoundStatus;
  created_at: string;
}

export interface UserLocationShareRecord {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  is_sharing: boolean;
  last_updated: string;
  created_at?: string;
}

export type AlertSeverity = 'INFO' | 'WARNING' | 'DANGER' | 'CRITICAL';
export type AlertCategory = 'HIGH_CROWD' | 'ROUTE_CLOSED' | 'PARKING_FULL' | 'WEATHER_WARNING' | 'MEDICAL_ALERT' | 'SECURITY_ALERT' | 'GENERAL';

export interface AlertRecord {
  id: string;
  title: string;
  message: string;
  location_name: string;
  severity: AlertSeverity;
  category: AlertCategory;
  created_by: string;
  created_at: string;
  expires_at?: string;
  active: boolean;
}

export interface ParkingFacility {
  id: string;
  name: string;
  location_name: string;
  capacity: number;
  occupied_spaces: number;
  available_spaces: number;
  latitude: number;
  longitude: number;
  status: 'AVAILABLE' | 'LIMITED' | 'FULL';
  vehicle_types: ('TWO_WHEELER' | 'FOUR_WHEELER' | 'BUS')[];
  fee: string;
  contact: string;
}

export interface MedicalFacility {
  id: string;
  name: string;
  type: 'Hospital' | 'Medical Camp' | 'First Aid Center' | 'Ambulance Point';
  location_name: string;
  latitude: number;
  longitude: number;
  available_beds: number;
  emergency_available: boolean;
  contact: string;
  opening_hours: string;
  doctors_on_duty: number;
}

export interface PoliceFacility {
  id: string;
  station_name: string;
  location_name: string;
  latitude: number;
  longitude: number;
  contact: string;
  available_officers: number;
  status: 'ACTIVE' | 'HIGH_ALERT' | 'STANDBY';
  incharge_officer: string;
}

export interface FoodWaterFacility {
  id: string;
  name: string;
  type: 'FOOD' | 'WATER' | 'BOTH';
  location_name: string;
  latitude: number;
  longitude: number;
  opening_time: string;
  closing_time: string;
  status: 'OPERATIONAL' | 'LIMITED' | 'CLOSED';
  organizer: string;
  is_free: boolean;
  cleanliness_rating: number;
}

export interface ToiletFacility {
  id: string;
  location_name: string;
  latitude: number;
  longitude: number;
  male_units: number;
  female_units: number;
  accessible_facility: boolean;
  cleanliness_status: 'EXCELLENT' | 'GOOD' | 'NEEDS_CLEANING';
  last_updated: string;
}

export interface AccommodationFacility {
  id: string;
  name: string;
  type: 'Dharamshala' | 'Ashram' | 'Hotel' | 'Temporary Camp';
  location_name: string;
  latitude: number;
  longitude: number;
  available_rooms: number;
  capacity: number;
  price_range: string;
  contact: string;
}

export interface TransportOption {
  id: string;
  name: string;
  type: 'Bus' | 'Taxi' | 'Auto' | 'Railway' | 'Shuttle';
  route_or_station: string;
  location_name: string;
  availability: 'HIGH' | 'MEDIUM' | 'LOW' | 'FULL';
  operating_hours: string;
  crowd_level: CrowdLevel;
  fare: string;
}

export interface EventSchedule {
  id: string;
  event_name: string;
  date: string;
  start_time: string;
  end_time: string;
  location_name: string;
  expected_crowd: number;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
  description: string;
  is_shahi_snan: boolean;
}

export interface IoTSensor {
  sensor_id: string;
  device_id: string;
  location_id: string;
  location_name: string;
  sensor_type: 'IR' | 'ULTRASONIC' | 'CAMERA_COUNTER' | 'OTHER';
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
  last_value: number;
  battery_level: number;
  last_seen: string;
  created_at: string;
}

export interface CrowdReading {
  reading_id: string;
  sensor_id: string;
  location_id: string;
  people_count: number;
  timestamp: string;
}

export interface SystemSettings {
  low_threshold: number; // e.g. 40%
  medium_threshold: number; // e.g. 70%
  high_threshold: number; // e.g. 100%
  demo_mode: boolean;
  language: 'en' | 'hi' | 'mr';
  auto_alert_trigger: boolean;
  kumbh_year: string;
  city_name: string;
}
