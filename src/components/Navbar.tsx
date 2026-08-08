/**
 * KUMBH SARTHI - Navigation Header
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  Compass,
  MapPin,
  AlertTriangle,
  Route,
  Search,
  SearchX,
  UserCheck,
  Radio,
  BarChart3,
  Settings,
  Bot,
  Calendar,
  Layers,
  Menu,
  X,
  Database,
  Volume2,
  Sun,
  Moon,
  HelpCircle,
} from 'lucide-react';
import { UserRole } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface NavbarProps {
  activeTab: string;
  setActiveTab?: (tab: string) => void;
  onSelectTab?: (tab: string) => void;
  userRole: UserRole;
  setUserRole?: (role: UserRole) => void;
  onSwitchRole?: (role: UserRole) => void;
  language: 'en' | 'hi' | 'mr';
  setLanguage?: (lang: 'en' | 'hi' | 'mr') => void;
  onSwitchLanguage?: (lang: 'en' | 'hi' | 'mr') => void;
  demoMode?: boolean;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onStartTour?: () => void;
  onOpenSqlModal?: () => void;
  onOpenAiAssistant?: () => void;
  onOpenAi?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onSelectTab,
  userRole,
  setUserRole,
  onSwitchRole,
  language,
  setLanguage,
  onSwitchLanguage,
  demoMode = false,
  theme = 'dark',
  onToggleTheme,
  onStartTour,
  onOpenSqlModal,
  onOpenAiAssistant,
  onOpenAi,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[language];

  const handleTabChange = (tab: string) => {
    if (setActiveTab) setActiveTab(tab);
    if (onSelectTab) onSelectTab(tab);
  };

  const handleRoleChange = (role: UserRole) => {
    if (setUserRole) setUserRole(role);
    if (onSwitchRole) onSwitchRole(role);
  };

  const handleLangChange = (lang: 'en' | 'hi' | 'mr') => {
    if (setLanguage) setLanguage(lang);
    if (onSwitchLanguage) onSwitchLanguage(lang);
  };

  const handleOpenAiModal = () => {
    if (onOpenAiAssistant) onOpenAiAssistant();
    if (onOpenAi) onOpenAi();
  };

  const mainNavItems = [
    { id: 'home', label: t.navHome, icon: Compass },
    { id: 'map', label: t.navLiveMap, icon: MapPin },
    { id: 'locations', label: t.navLocations, icon: Search },
    { id: 'route', label: t.navSafeRoute, icon: Route },
    { id: 'facilities', label: t.navFacilities, icon: Layers },
    { id: 'emergency', label: t.navEmergency, icon: ShieldAlert, highlight: true },
    { id: 'lostfound', label: t.navLostFound, icon: SearchX },
    { id: 'alerts', label: t.navAlerts, icon: AlertTriangle },
    { id: 'events', label: t.navEvents, icon: Calendar },
    { id: 'iot', label: t.navIot, icon: Radio },
    { id: 'analytics', label: t.navAnalytics, icon: BarChart3 },
    { id: 'admin', label: t.navAdmin, icon: Settings },
  ];

  const rolesList: { id: UserRole; name: string }[] = [
    { id: 'visitor', name: t.roleVisitor },
    { id: 'admin', name: t.roleAdmin },
    { id: 'police', name: t.rolePolice },
    { id: 'medical', name: t.roleMedical },
    { id: 'volunteer', name: t.roleVolunteer },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-orange-500/30 text-white shadow-xl">
      {/* Top Banner Ticker */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 px-4 py-1 text-xs font-semibold flex items-center justify-between text-white shadow-inner">
        <div className="flex items-center space-x-2 truncate">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold uppercase tracking-wider">KUMBH 2026 NASHIK:</span>
          <span className="truncate">Ramkund Ghat Live Crowd Status Updated • Emergency Helpline: 112 / 108</span>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          {onStartTour && (
            <button
              onClick={onStartTour}
              className="flex items-center space-x-1 text-[11px] bg-slate-950/80 hover:bg-slate-950 text-amber-200 px-2 py-0.5 rounded border border-amber-400/40 font-bold transition shadow-sm"
              title="Start Interactive Guided Tour"
            >
              <HelpCircle className="w-3 h-3 text-amber-400" />
              <span>Guided Tour</span>
            </button>
          )}

          {demoMode && (
            <span className="bg-slate-900/60 text-amber-300 text-[10px] px-2 py-0.5 rounded border border-amber-400/40 font-mono hidden sm:inline">
              {t.demoModeActive}
            </span>
          )}
          <button
            onClick={onOpenSqlModal}
            className="flex items-center space-x-1 text-[11px] bg-slate-950/70 hover:bg-slate-950 text-orange-200 px-2 py-0.5 rounded border border-orange-400/30 transition"
            title="View Supabase PostgreSQL Schema"
          >
            <Database className="w-3 h-3 text-orange-400" />
            <span className="hidden md:inline">Supabase DDL</span>
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div
          id="tour-welcome"
          onClick={() => handleTabChange('home')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent font-serif">
              {t.appTitle}
            </h1>
            <p className="text-[11px] text-orange-200/80 tracking-widest font-medium uppercase -mt-0.5">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Desktop Quick Tools: Language, Role Switcher, Theme Toggle, AI Assistant */}
        <div className="hidden lg:flex items-center space-x-3">
          {/* AI Assistant Button */}
          <button
            id="tour-ai-assistant"
            onClick={handleOpenAiModal}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg shadow-md transition text-xs"
          >
            <Bot className="w-4 h-4" />
            <span>{t.navAiAssistant}</span>
          </button>

          {/* Theme Toggle Button */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 px-3 py-1.5 rounded-lg border border-slate-700 transition text-xs font-semibold shadow"
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span>Dark</span>
                </>
              )}
            </button>
          )}

          {/* Language Switcher */}
          <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
            {(['en', 'hi', 'mr'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => handleLangChange(lang)}
                className={`px-2.5 py-1 rounded font-medium transition ${
                  language === lang
                    ? 'bg-orange-500 text-white shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिन्दी' : 'मराठी'}
              </button>
            ))}
          </div>

          {/* Role Switcher */}
          <div
            id="tour-roles-theme"
            className="flex items-center space-x-1.5 bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-700 text-xs"
          >
            <UserCheck className="w-3.5 h-3.5 text-orange-400" />
            <select
              value={userRole}
              onChange={(e) => handleRoleChange(e.target.value as UserRole)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              {rolesList.map((r) => (
                <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* SOS Highlight Button */}
          <button
            id="tour-sos-button"
            onClick={() => handleTabChange('emergency')}
            className="flex items-center space-x-1.5 bg-red-600 hover:bg-red-500 text-white font-bold px-3.5 py-1.5 rounded-lg shadow-lg shadow-red-600/30 transition text-xs animate-pulse"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>SOS EMERGENCY</span>
          </button>
        </div>

        {/* Mobile Menu Button & Quick Actions */}
        <div className="lg:hidden flex items-center space-x-2">
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="p-2 bg-slate-800 text-amber-400 rounded-lg text-xs font-bold border border-slate-700"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={handleOpenAiModal}
            className="p-2 bg-amber-500 text-slate-950 rounded-lg text-xs font-bold flex items-center space-x-1"
          >
            <Bot className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <nav className="hidden lg:block bg-slate-950/80 border-t border-slate-800/80 px-4">
        <div className="max-w-7xl mx-auto flex items-center space-x-1 overflow-x-auto py-1 scrollbar-none">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={item.id === 'map' ? 'tour-live-map' : undefined}
                onClick={() => handleTabChange(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap transition ${
                  isActive
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 font-semibold'
                    : item.highlight
                    ? 'text-red-400 hover:bg-red-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-orange-400' : ''}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-3">
          {/* Controls Bar */}
          <div className="flex items-center justify-between pt-2 pb-2 border-b border-slate-800">
            {/* Language */}
            <div className="flex bg-slate-800 p-1 rounded text-xs">
              {(['en', 'hi', 'mr'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLangChange(lang)}
                  className={`px-2 py-0.5 rounded transition ${
                    language === lang ? 'bg-orange-500 text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Tour Button for Mobile */}
            {onStartTour && (
              <button
                onClick={() => {
                  onStartTour();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center space-x-1 text-xs bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded border border-amber-500/30 font-bold"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Take Tour</span>
              </button>
            )}

            {/* Role */}
            <select
              value={userRole}
              onChange={(e) => handleRoleChange(e.target.value as UserRole)}
              className="bg-slate-800 text-slate-200 text-xs px-2 py-1 rounded border border-slate-700"
            >
              {rolesList.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-2">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    handleTabChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-left transition ${
                    isActive
                      ? 'bg-orange-500 text-white font-bold'
                      : item.highlight
                      ? 'bg-red-950/60 border border-red-500/40 text-red-300'
                      : 'bg-slate-800/80 text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
