/**
 * KUMBH SARTHI - State Engine & Supabase Client Layer
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  LocationRecord,
  ParkingFacility,
  MedicalFacility,
  PoliceFacility,
  FoodWaterFacility,
  ToiletFacility,
  AccommodationFacility,
  TransportOption,
  EventSchedule,
  IoTSensor,
  AlertRecord,
  EmergencyReport,
  LostFoundItem,
  RouteRecord,
  SystemSettings,
  UserRole,
  CrowdLevel,
} from '../types';

import {
  INITIAL_SYSTEM_SETTINGS,
  INITIAL_LOCATIONS,
  INITIAL_PARKING,
  INITIAL_MEDICAL,
  INITIAL_POLICE,
  INITIAL_FOOD_WATER,
  INITIAL_TOILETS,
  INITIAL_ACCOMMODATION,
  INITIAL_TRANSPORT,
  INITIAL_EVENTS,
  INITIAL_IOT_SENSORS,
  INITIAL_ALERTS,
  INITIAL_ROUTES,
  INITIAL_EMERGENCIES,
  INITIAL_LOST_FOUND,
} from '../data/seedData';

// Check for Supabase credentials in environment
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

type Listener = () => void;

class KumbhSarthiStore {
  private listeners: Set<Listener> = new Set();

  public settings: SystemSettings;
  public userRole: UserRole = 'visitor';
  public userPhone: string = '';
  public userName: string = 'Pilgrim User';

  public locations: LocationRecord[];
  public parking: ParkingFacility[];
  public medical: MedicalFacility[];
  public police: PoliceFacility[];
  public foodWater: FoodWaterFacility[];
  public toilets: ToiletFacility[];
  public accommodation: AccommodationFacility[];
  public transport: TransportOption[];
  public events: EventSchedule[];
  public sensors: IoTSensor[];
  public alerts: AlertRecord[];
  public routes: RouteRecord[];
  public emergencies: EmergencyReport[];
  public lostFound: LostFoundItem[];

  constructor() {
    this.settings = this.loadLocal('ks_settings', INITIAL_SYSTEM_SETTINGS);
    this.locations = this.loadLocal('ks_locations', INITIAL_LOCATIONS);
    this.parking = this.loadLocal('ks_parking', INITIAL_PARKING);
    this.medical = this.loadLocal('ks_medical', INITIAL_MEDICAL);
    this.police = this.loadLocal('ks_police', INITIAL_POLICE);
    this.foodWater = this.loadLocal('ks_food_water', INITIAL_FOOD_WATER);
    this.toilets = this.loadLocal('ks_toilets', INITIAL_TOILETS);
    this.accommodation = this.loadLocal('ks_accommodation', INITIAL_ACCOMMODATION);
    this.transport = this.loadLocal('ks_transport', INITIAL_TRANSPORT);
    this.events = this.loadLocal('ks_events', INITIAL_EVENTS);
    this.sensors = this.loadLocal('ks_sensors', INITIAL_IOT_SENSORS);
    this.alerts = this.loadLocal('ks_alerts', INITIAL_ALERTS);
    this.routes = this.loadLocal('ks_routes', INITIAL_ROUTES);
    this.emergencies = this.loadLocal('ks_emergencies', INITIAL_EMERGENCIES);
    this.lostFound = this.loadLocal('ks_lost_found', INITIAL_LOST_FOUND);

    this.initRealtimeOrSimulation();
  }

  private loadLocal<T>(key: string, fallback: T): T {
    try {
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return fallback;
  }

  private saveLocal(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  public getState() {
    return {
      settings: this.settings,
      user_role: this.userRole,
      user_phone: this.userPhone,
      user_name: this.userName,
      locations: this.locations,
      parking: this.parking,
      medical: this.medical,
      police: this.police,
      food_water: this.foodWater,
      toilets: this.toilets,
      accommodation: this.accommodation,
      transport: this.transport,
      events: this.events,
      iot_sensors: this.sensors,
      alerts: this.alerts,
      routes: this.routes,
      emergencies: this.emergencies,
      lost_found_items: this.lostFound,
      language: this.settings.language,
    };
  }

  public subscribe(listener: (state: any) => void): () => void {
    const fn = () => listener(this.getState());
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public addEmergencyReport = (emg: Omit<EmergencyReport, 'id' | 'timestamp' | 'status'>) => this.addEmergency(emg);
  public simulateIotTelemetry = (devId: string, val: number) => this.processIoTSensorTelemetry(devId, val);
  public toggleDemoMode = (active: boolean) => this.setDemoMode(active);
  public resetToSeedData = () => this.resetAllToSeedData();

  // --- Actions ---

  public setLanguage(lang: 'en' | 'hi' | 'mr') {
    this.settings.language = lang;
    this.saveLocal('ks_settings', this.settings);
    this.notify();
  }

  public setUserRole(role: UserRole) {
    this.userRole = role;
    this.notify();
  }

  public setDemoMode(active: boolean) {
    this.settings.demo_mode = active;
    this.saveLocal('ks_settings', this.settings);
    this.notify();
  }

  public updateThresholds(low: number, med: number, high: number) {
    this.settings.low_threshold = low;
    this.settings.medium_threshold = med;
    this.settings.high_threshold = high;
    this.saveLocal('ks_settings', this.settings);
    this.recalculateAllCrowdLevels();
    this.notify();
  }

  public updateLocationCrowd(locationId: string, peopleCount: number) {
    const locIndex = this.locations.findIndex((l) => l.location_id === locationId);
    if (locIndex !== -1) {
      const loc = this.locations[locIndex];
      loc.estimated_people = peopleCount;
      const pct = Math.round((peopleCount / loc.capacity) * 100);
      loc.crowd_percentage = pct;
      loc.crowd_level = this.calculateCrowdLevel(pct);
      loc.updated_at = new Date().toISOString();

      this.locations[locIndex] = { ...loc };
      this.saveLocal('ks_locations', this.locations);

      // Auto alert if CRITICAL or exceeds threshold
      if (loc.crowd_percentage > this.settings.high_threshold && this.settings.auto_alert_trigger) {
        this.triggerAutoAlert(loc);
      }

      this.notify();
    }
  }

  public calculateCrowdLevel(pct: number): CrowdLevel {
    if (pct <= this.settings.low_threshold) return 'LOW';
    if (pct <= this.settings.medium_threshold) return 'MEDIUM';
    if (pct <= this.settings.high_threshold) return 'HIGH';
    return 'CRITICAL';
  }

  private recalculateAllCrowdLevels() {
    this.locations = this.locations.map((loc) => {
      const pct = Math.round((loc.estimated_people / loc.capacity) * 100);
      return {
        ...loc,
        crowd_percentage: pct,
        crowd_level: this.calculateCrowdLevel(pct),
      };
    });
    this.saveLocal('ks_locations', this.locations);
  }

  private triggerAutoAlert(loc: LocationRecord) {
    const existing = this.alerts.find(
      (a) => a.location_name === loc.location_name && a.active && a.severity === 'DANGER'
    );
    if (!existing) {
      const newAlert: AlertRecord = {
        id: 'alt_auto_' + Date.now(),
        title: `CRITICAL CROWD WARNING: ${loc.location_name}`,
        message: `${loc.location_name} crowd has reached ${loc.crowd_percentage}% capacity (${loc.estimated_people.toLocaleString()} pilgrims). Entry restricted.`,
        location_name: loc.location_name,
        severity: 'DANGER',
        category: 'HIGH_CROWD',
        created_by: 'IoT Auto Monitoring System',
        created_at: new Date().toISOString(),
        active: true,
      };
      this.alerts = [newAlert, ...this.alerts];
      this.saveLocal('ks_alerts', this.alerts);
    }
  }

  public addLocation(location: Omit<LocationRecord, 'location_id' | 'created_at' | 'updated_at'>) {
    const newLoc: LocationRecord = {
      ...location,
      location_id: 'loc_' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.locations = [newLoc, ...this.locations];
    this.saveLocal('ks_locations', this.locations);
    this.notify();
  }

  public updateLocation(locationId: string, updates: Partial<LocationRecord>) {
    this.locations = this.locations.map((l) =>
      l.location_id === locationId
        ? { ...l, ...updates, updated_at: new Date().toISOString() }
        : l
    );
    this.saveLocal('ks_locations', this.locations);
    this.notify();
  }

  public deleteLocation(locationId: string) {
    this.locations = this.locations.filter((l) => l.location_id !== locationId);
    this.saveLocal('ks_locations', this.locations);
    this.notify();
  }

  public addEmergency(emergency: Omit<EmergencyReport, 'id' | 'timestamp' | 'status'>) {
    const newEmg: EmergencyReport = {
      ...emergency,
      id: 'emg_' + Date.now(),
      timestamp: new Date().toISOString(),
      status: 'NEW',
    };
    this.emergencies = [newEmg, ...this.emergencies];
    this.saveLocal('ks_emergencies', this.emergencies);
    this.notify();
    return newEmg;
  }

  public updateEmergencyStatus(
    id: string,
    status: EmergencyReport['status'],
    assigned_team?: string,
    notes?: string
  ) {
    this.emergencies = this.emergencies.map((e) =>
      e.id === id
        ? {
            ...e,
            status,
            assigned_team: assigned_team || e.assigned_team,
            resolution_notes: notes || e.resolution_notes,
          }
        : e
    );
    this.saveLocal('ks_emergencies', this.emergencies);
    this.notify();
  }

  public addLostFoundItem(item: Omit<LostFoundItem, 'id' | 'created_at'>) {
    const newItem: LostFoundItem = {
      ...item,
      id: 'lf_' + Date.now(),
      created_at: new Date().toISOString(),
    };
    this.lostFound = [newItem, ...this.lostFound];
    this.saveLocal('ks_lost_found', this.lostFound);
    this.notify();
    return newItem;
  }

  public updateLostFoundStatus(id: string, status: LostFoundItem['status']) {
    this.lostFound = this.lostFound.map((i) =>
      i.id === id ? { ...i, status } : i
    );
    this.saveLocal('ks_lost_found', this.lostFound);
    this.notify();
  }

  public addAlert(alert: Omit<AlertRecord, 'id' | 'created_at' | 'active'>) {
    const newAlert: AlertRecord = {
      ...alert,
      id: 'alt_' + Date.now(),
      created_at: new Date().toISOString(),
      active: true,
    };
    this.alerts = [newAlert, ...this.alerts];
    this.saveLocal('ks_alerts', this.alerts);
    this.notify();
  }

  public toggleAlertActive(id: string) {
    this.alerts = this.alerts.map((a) =>
      a.id === id ? { ...a, active: !a.active } : a
    );
    this.saveLocal('ks_alerts', this.alerts);
    this.notify();
  }

  public updateParkingOccupancy(parkingId: string, occupied: number) {
    this.parking = this.parking.map((p) => {
      if (p.id === parkingId) {
        const occ = Math.min(p.capacity, Math.max(0, occupied));
        const avail = p.capacity - occ;
        let status: ParkingFacility['status'] = 'AVAILABLE';
        if (avail === 0) status = 'FULL';
        else if (avail < p.capacity * 0.2) status = 'LIMITED';
        return { ...p, occupied_spaces: occ, available_spaces: avail, status };
      }
      return p;
    });
    this.saveLocal('ks_parking', this.parking);
    this.notify();
  }

  public processIoTSensorTelemetry(deviceId: string, count: number, locationId?: string) {
    const sensorIndex = this.sensors.findIndex((s) => s.device_id === deviceId);
    if (sensorIndex !== -1) {
      const sensor = this.sensors[sensorIndex];
      sensor.last_value = count;
      sensor.last_seen = 'Just now';
      sensor.status = 'ONLINE';
      this.sensors[sensorIndex] = { ...sensor };
      this.saveLocal('ks_sensors', this.sensors);

      const targetLocId = locationId || sensor.location_id;
      this.updateLocationCrowd(targetLocId, count * 100); // Sensor multiplier for simulation
      this.notify();
    }
  }

  public resetAllToSeedData() {
    this.settings = { ...INITIAL_SYSTEM_SETTINGS };
    this.locations = [...INITIAL_LOCATIONS];
    this.parking = [...INITIAL_PARKING];
    this.medical = [...INITIAL_MEDICAL];
    this.police = [...INITIAL_POLICE];
    this.foodWater = [...INITIAL_FOOD_WATER];
    this.toilets = [...INITIAL_TOILETS];
    this.accommodation = [...INITIAL_ACCOMMODATION];
    this.transport = [...INITIAL_TRANSPORT];
    this.events = [...INITIAL_EVENTS];
    this.sensors = [...INITIAL_IOT_SENSORS];
    this.alerts = [...INITIAL_ALERTS];
    this.routes = [...INITIAL_ROUTES];
    this.emergencies = [...INITIAL_EMERGENCIES];
    this.lostFound = [...INITIAL_LOST_FOUND];

    localStorage.clear();
    this.notify();
  }

  private initRealtimeOrSimulation() {
    // Background simulation loop for live demo responsiveness
    setInterval(() => {
      if (!this.settings.demo_mode) return;

      // Randomly fluctuate a sensor reading
      if (this.sensors.length > 0) {
        const randomIndex = Math.floor(Math.random() * this.sensors.length);
        const sensor = this.sensors[randomIndex];
        const delta = Math.floor(Math.random() * 21) - 10;
        const newValue = Math.max(20, sensor.last_value + delta);

        sensor.last_value = newValue;
        sensor.last_seen = 'Just now';
        this.saveLocal('ks_sensors', this.sensors);

        // Update target location
        const targetLoc = this.locations.find((l) => l.location_id === sensor.location_id);
        if (targetLoc) {
          const newCrowdCount = Math.max(
            500,
            targetLoc.estimated_people + delta * 20
          );
          this.updateLocationCrowd(targetLoc.location_id, newCrowdCount);
        }
      }
    }, 12000);
  }
}

export const store = new KumbhSarthiStore();
export const kumbhStore = store;
