/**
 * KUMBH SARTHI - Smart Kumbh Mela Crowd Management & Pilgrim Assistance System
 * Main Application Shell & View Routing
 */

import React, { useState, useEffect } from 'react';
import { Bot, ShieldAlert, Sparkles } from 'lucide-react';
import { kumbhStore } from './lib/store';
import { UserRole } from './types';

// Component Imports
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { LiveCrowdMap } from './components/LiveCrowdMap';
import { LocationDirectory } from './components/LocationDirectory';
import { SmartSafeRoute } from './components/SmartSafeRoute';
import { EmergencySOS } from './components/EmergencySOS';
import { LostAndFound } from './components/LostAndFound';
import { FacilitiesHub } from './components/FacilitiesHub';
import { AlertsAndAnnouncements } from './components/AlertsAndAnnouncements';
import { EventSnanSchedule } from './components/EventSnanSchedule';
import { IoTSensorMonitoring } from './components/IoTSensorMonitoring';
import { CrowdAnalytics } from './components/CrowdAnalytics';
import { AdminDashboard } from './components/AdminDashboard';
import { AiSarthiAssistant } from './components/AiSarthiAssistant';
import { SqlSchemaModal } from './components/SqlSchemaModal';
import { GuidedTour } from './components/GuidedTour';
import { NavReturnBanner } from './components/NavReturnBanner';
import { LiveLocationShare } from './components/LiveLocationShare';
import { Footer } from './components/Footer';

export default function App() {
  const [storeState, setStoreState] = useState(kumbhStore.getState());
  const [activeTab, setActiveTab] = useState('home');
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [sqlModalOpen, setSqlModalOpen] = useState(false);
  const [guidedTourOpen, setGuidedTourOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('kumbh_theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    const unsubscribe = kumbhStore.subscribe((newState) => {
      setStoreState({ ...newState });
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Launch Guided Tour automatically on first visit
    const tourDone = localStorage.getItem('kumbh_tour_completed');
    if (!tourDone) {
      setGuidedTourOpen(true);
    }
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('kumbh_theme', nextTheme);
  };

  const handleSelectLocationFromMap = (locationId: string) => {
    setActiveTab('route');
  };

  return (
    <div className={`min-h-screen font-sans antialiased flex flex-col selection:bg-orange-500 selection:text-slate-950 transition-colors duration-200 ${
      theme === 'light' ? 'light-mode bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* Top Header Navbar */}
      <Navbar
        userRole={storeState.user_role}
        language={storeState.language}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onSwitchRole={(role) => kumbhStore.setUserRole(role)}
        onSwitchLanguage={(lang) => kumbhStore.setLanguage(lang)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onStartTour={() => setGuidedTourOpen(true)}
        onOpenAi={() => setAiAssistantOpen(true)}
        onOpenSqlModal={() => setSqlModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* Navigation Return Experience Banner */}
        <NavReturnBanner
          onOpenEmergency={() => setActiveTab('emergency')}
          onOpenFacilities={() => setActiveTab('facilities')}
        />

        {activeTab === 'home' && (
          <div className="space-y-10">
            <HeroSection
              locations={storeState.locations}
              events={storeState.events}
              alerts={storeState.alerts}
              language={storeState.language}
              onNavigateTab={setActiveTab}
              onOpenAi={() => setAiAssistantOpen(true)}
            />

            <LiveLocationShare />

            <LiveCrowdMap
              locations={storeState.locations}
              language={storeState.language}
              onSelectLocation={handleSelectLocationFromMap}
            />
          </div>
        )}

        {activeTab === 'map' && (
          <div className="space-y-6">
            <LiveLocationShare />
            <LiveCrowdMap
              locations={storeState.locations}
              language={storeState.language}
              onSelectLocation={handleSelectLocationFromMap}
            />
          </div>
        )}

        {activeTab === 'route' && (
          <div className="space-y-6">
            <LiveLocationShare />
            <SmartSafeRoute
              locations={storeState.locations}
              routes={storeState.routes}
              userRole={storeState.user_role}
              language={storeState.language}
            />
          </div>
        )}

        {activeTab === 'locations' && (
          <LocationDirectory
            locations={storeState.locations}
            userRole={storeState.user_role}
            language={storeState.language}
            onAddLocation={(loc) => kumbhStore.addLocation(loc)}
            onUpdateLocation={(id, updates) => kumbhStore.updateLocation(id, updates)}
            onDeleteLocation={(id) => kumbhStore.deleteLocation(id)}
          />
        )}

        {activeTab === 'sos' && (
          <EmergencySOS
            emergencies={storeState.emergencies}
            userRole={storeState.user_role}
            language={storeState.language}
            onAddEmergency={(emg) => kumbhStore.addEmergencyReport(emg)}
            onUpdateStatus={(id, status, team) => kumbhStore.updateEmergencyStatus(id, status, team)}
          />
        )}

        {activeTab === 'lostfound' && (
          <LostAndFound
            items={storeState.lost_found_items}
            userRole={storeState.user_role}
            language={storeState.language}
            onAddItem={(item) => kumbhStore.addLostFoundItem(item)}
            onUpdateStatus={(id, status) => kumbhStore.updateLostFoundStatus(id, status)}
          />
        )}

        {activeTab === 'facilities' && (
          <FacilitiesHub
            parking={storeState.parking}
            medical={storeState.medical}
            police={storeState.police}
            foodWater={storeState.food_water}
            toilets={storeState.toilets}
            accommodation={storeState.accommodation}
            transport={storeState.transport}
            userRole={storeState.user_role}
            onUpdateParkingOccupancy={(id, occupied) => kumbhStore.updateParkingOccupancy(id, occupied)}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertsAndAnnouncements
            alerts={storeState.alerts}
            userRole={storeState.user_role}
            language={storeState.language}
            onAddAlert={(alert) => kumbhStore.addAlert(alert)}
            onToggleAlertActive={(id) => kumbhStore.toggleAlertActive(id)}
          />
        )}

        {activeTab === 'events' && (
          <EventSnanSchedule
            events={storeState.events}
            userRole={storeState.user_role}
            language={storeState.language}
          />
        )}

        {activeTab === 'iot' && (
          <IoTSensorMonitoring
            sensors={storeState.iot_sensors}
            userRole={storeState.user_role}
            language={storeState.language}
            onSimulateTelemetry={(devId, val) => kumbhStore.simulateIotTelemetry(devId, val)}
          />
        )}

        {activeTab === 'analytics' && (
          <CrowdAnalytics
            locations={storeState.locations}
            parking={storeState.parking}
            language={storeState.language}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            locations={storeState.locations}
            emergencies={storeState.emergencies}
            alerts={storeState.alerts}
            sensors={storeState.iot_sensors}
            settings={storeState.settings}
            userRole={storeState.user_role}
            language={storeState.language}
            onUpdateThresholds={(low, med, high) => kumbhStore.updateThresholds(low, med, high)}
            onToggleDemoMode={(active) => kumbhStore.toggleDemoMode(active)}
            onResetSeedData={() => kumbhStore.resetToSeedData()}
            onOpenSqlModal={() => setSqlModalOpen(true)}
            onNavigateTab={setActiveTab}
          />
        )}
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3">
        {/* SOS Quick Button */}
        <button
          onClick={() => setActiveTab('sos')}
          className="w-13 h-13 sm:w-14 sm:h-14 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-red-600/50 border-2 border-red-400 transition transform hover:scale-110"
          title="Trigger Emergency SOS"
        >
          <ShieldAlert className="w-7 h-7 animate-pulse" />
        </button>

        {/* AI Sarthi Floating Assistant Button */}
        <button
          onClick={() => setAiAssistantOpen(true)}
          className="w-13 h-13 sm:w-14 sm:h-14 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/40 border-2 border-amber-300 transition transform hover:scale-110"
          title="Open AI Sarthi Assistant"
        >
          <Bot className="w-7 h-7" />
        </button>
      </div>

      {/* AI Assistant Modal */}
      <AiSarthiAssistant
        isOpen={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
        language={storeState.language}
      />

      {/* Supabase SQL DDL Modal */}
      <SqlSchemaModal
        isOpen={sqlModalOpen}
        onClose={() => setSqlModalOpen(false)}
      />

      {/* Guided Tour Modal */}
      <GuidedTour
        isOpen={guidedTourOpen}
        onClose={() => setGuidedTourOpen(false)}
        language={storeState.language}
        onNavigateTab={setActiveTab}
        onOpenAi={() => setAiAssistantOpen(true)}
      />

      {/* Footer */}
      <Footer
        language={storeState.language}
        onOpenAi={() => setAiAssistantOpen(true)}
        onOpenSql={() => setSqlModalOpen(true)}
        onNavigateTab={setActiveTab}
      />
    </div>
  );
}
