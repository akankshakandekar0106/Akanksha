/**
 * KUMBH SARTHI - IoT ESP32 Sensor Monitoring & Simulation System
 */

import React, { useState } from 'react';
import {
  Radio,
  Cpu,
  Zap,
  Activity,
  Battery,
  Clock,
  RefreshCw,
  Code,
  Copy,
  Check,
  AlertTriangle,
  Play,
  CheckCircle2,
} from 'lucide-react';
import { IoTSensor, UserRole } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface IoTSensorMonitoringProps {
  sensors?: IoTSensor[];
  userRole: UserRole;
  language: 'en' | 'hi' | 'mr';
  onSimulateTelemetry: (deviceId: string, count: number) => void;
}

export const IoTSensorMonitoring: React.FC<IoTSensorMonitoringProps> = ({
  sensors = [],
  userRole,
  language,
  onSimulateTelemetry,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState<IoTSensor | undefined>(sensors[0]);
  const [simCount, setSimCount] = useState<number>(450);

  const t = TRANSLATIONS[language];

  // Sample ESP32 Arduino C++ Code Snippet
  const esp32CodeSnippet = `/*
  ==============================================================
  KUMBH SARTHI - ESP32 IoT Crowd Estimation Firmware
  Target Board: ESP32 DevKit V1
  Sensors: IR Obstacle Sensor / Ultrasonic HC-SR04
  ==============================================================
*/

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "KUMBH_WIFI_MESH";
const char* password = "KumbhSarthiSecure2026";

// Kumbh Sarthi Backend Ingress Endpoint
const char* serverUrl = "https://your-kumbh-sarthi-app.cloudrun.app/api/iot/telemetry";

#define IR_SENSOR_PIN 34
#define DEVICE_ID "ESP32_DEV_01"
#define LOCATION_ID "loc_ramkund"

int peopleCount = 0;
bool lastSensorState = HIGH;

void setup() {
  Serial.begin(115200);
  pinMode(IR_SENSOR_PIN, INPUT);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\nWiFi Connected to Kumbh Mesh Network!");
}

void loop() {
  bool currentSensorState = digitalRead(IR_SENSOR_PIN);
  
  // Detect entry pulse
  if (lastSensorState == HIGH && currentSensorState == LOW) {
    peopleCount++;
    Serial.print("Pilgrim Entered! Count: ");
    Serial.println(peopleCount);
    sendTelemetryToServer();
  }
  lastSensorState = currentSensorState;
  delay(50);
}

void sendTelemetryToServer() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<200> doc;
    doc["device_id"] = DEVICE_ID;
    doc["location_id"] = LOCATION_ID;
    doc["sensor_type"] = "IR";
    doc["people_count"] = peopleCount;
    doc["battery_level"] = 92;

    String jsonPayload;
    serializeJson(doc, jsonPayload);

    int httpResponseCode = http.POST(jsonPayload);
    Serial.print("HTTP Response Code: ");
    Serial.println(httpResponseCode);
    http.end();
  }
}
`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(esp32CodeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleTriggerSim = (deviceId: string) => {
    onSimulateTelemetry(deviceId, simCount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
            <Radio className="w-5 h-5 text-amber-400" />
            <span>ESP32 IoT Sensor Grid & Telemetry Control</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Realtime IR, Ultrasonic & AI Camera counter hardware monitoring for college E&TC / IoT Demonstration
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-mono text-emerald-400 font-bold">4 ESP32 NODES ACTIVE</span>
        </div>
      </div>

      {/* Sensor Nodes Status Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sensors.map((sensor) => (
          <div
            key={sensor.sensor_id}
            onClick={() => setSelectedSensor(sensor)}
            className={`bg-slate-900 border rounded-2xl p-5 space-y-4 cursor-pointer transition shadow-lg ${
              selectedSensor?.sensor_id === sensor.sensor_id
                ? 'border-amber-500 bg-amber-950/20'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider font-mono">
                  {sensor.sensor_type} • {sensor.device_id}
                </span>
                <h3 className="text-sm font-bold text-white mt-1">{sensor.location_name}</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {sensor.status}
              </span>
            </div>

            {/* Live Count Display */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between font-mono">
              <span className="text-xs text-slate-400">IR Pulse Count</span>
              <span className="text-lg font-black text-amber-300">
                {sensor.last_value.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
              <span className="flex items-center">
                <Battery className="w-3.5 h-3.5 text-emerald-400 mr-1" />
                {sensor.battery_level}%
              </span>
              <span>{sensor.last_seen}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Hardware Interactive Simulator & Firmware Code Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hardware Telemetry Testing Simulator */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-orange-400" />
              <span>ESP32 Hardware Test Simulator</span>
            </h3>
            <p className="text-xs text-slate-400">
              Inject mock IR/Ultrasonic pulse spikes into Supabase & Kumbh Sarthi engine to test automatic threshold alert triggers without hardware.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Target ESP32 Node</label>
              <select
                value={selectedSensor?.sensor_id || ''}
                onChange={(e) => {
                  const found = (sensors || []).find((s) => s.sensor_id === e.target.value);
                  if (found) setSelectedSensor(found);
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
              >
                {(sensors || []).map((s) => (
                  <option key={s.sensor_id} value={s.sensor_id}>
                    {s.device_id} ({s.location_name}) - {s.last_value} count
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 font-bold mb-1">
                <span>Simulate Sensor Pulse Count</span>
                <span className="text-amber-400 font-mono">{simCount} People</span>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="25"
                value={simCount}
                onChange={(e) => setSimCount(parseInt(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
            </div>

            <button
              onClick={() => handleTriggerSim(selectedSensor.device_id)}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black py-3 rounded-xl shadow-lg transition flex items-center justify-center space-x-2 text-xs"
            >
              <Zap className="w-4 h-4" />
              <span>TRANSMIT TELEMETRY PULSE TO BACKEND</span>
            </button>
          </div>
        </div>

        {/* ESP32 Arduino Code Generator */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Code className="w-5 h-5 text-emerald-400" />
              <span>ESP32 Arduino C++ Sample Firmware</span>
            </h3>

            <button
              onClick={handleCopyCode}
              className="flex items-center space-x-1 text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold px-3 py-1.5 rounded-lg border border-slate-700"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <pre className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-[300px] leading-relaxed">
            <code>{esp32CodeSnippet}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
