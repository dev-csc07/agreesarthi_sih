import React from 'react';
import { ASSETS } from '../data/mockData';
import { NavigationTab, TelemetryState } from '../types';

interface HeaderProps {
  currentTab: NavigationTab;
  telemetry: TelemetryState;
  isOnline: boolean;
  viewMode: 'desktop' | 'mobile';
  onToggleViewMode: () => void;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenAdvisor: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  telemetry,
  isOnline,
  viewMode,
  onToggleViewMode,
  onSelectTab,
  onOpenAdvisor,
}) => {
  const getTabTitle = () => {
    switch (currentTab) {
      case 'overview':
        return 'Overview';
      case 'rover':
        return 'Rover Cockpit';
      case 'map':
        return 'Field Radar Map';
      case 'sensors':
        return 'Subsurface Telemetry';
      case 'alerts':
        return 'Alerts & Incidents';
      case 'menu':
        return 'System & Settings';
    }
  };

  return (
    <header className="sticky top-0 w-full z-40 bg-[#090f15]/90 backdrop-blur-xl border-b border-white/[0.07] shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand & Active Screen Info */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => onSelectTab('overview')}
            className="flex items-center gap-2 text-left group focus:outline-none"
            title="AGREESARTHI Ground Station"
          >
            <div className="relative">
              <img
                src={ASSETS.logo}
                alt="AGREESARTHI Logo"
                className="h-9 w-auto object-contain shrink-0 rounded-md ring-1 ring-[#4edea3]/30 p-0.5 bg-[#161c22]"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#4edea3] ring-2 ring-[#090f15] animate-pulse" />
            </div>
            <div className="flex flex-col truncate">
              <div className="flex items-center gap-1.5">
                <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm tracking-wider text-[#4edea3] group-hover:text-[#6ffbbe] transition-colors">
                  AGREESARTHI
                </span>
                <span className="hidden md:inline-block px-1.5 py-0.2 text-[9px] font-['JetBrains_Mono'] font-semibold bg-[#4edea3]/10 text-[#4edea3] rounded">
                  v2.4-RTK
                </span>
              </div>
              <span className="font-['Inter'] text-[11px] text-[#bbcabf] truncate leading-none">
                AgriRover Smart Monitoring • <span className="text-white font-medium">{getTabTitle()}</span>
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Links (shown on md+ screens) */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#161c22]/80 p-1 rounded-xl border border-white/[0.06]">
          {[
            { id: 'overview', label: 'Overview', icon: 'grid_view' },
            { id: 'rover', label: 'Rover', icon: 'precision_manufacturing' },
            { id: 'map', label: 'Map', icon: 'radar' },
            { id: 'sensors', label: 'Sensors', icon: 'sensors' },
            { id: 'alerts', label: 'Alerts', icon: 'notifications', badge: 2 },
            { id: 'menu', label: 'Menu', icon: 'menu_open' },
          ].map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id as NavigationTab)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#4edea3] text-[#003824] shadow-[0_0_12px_rgba(78,222,163,0.3)] font-semibold'
                    : 'text-[#bbcabf] hover:text-white hover:bg-[#252b31]/60'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="w-4 h-4 rounded-full bg-[#ef4444] text-white text-[10px] font-bold flex items-center justify-center -mr-1">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Actions, Telemetry Badge & Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Ask AI Advisor Button */}
          <button
            onClick={onOpenAdvisor}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#03b5d3]/15 hover:bg-[#03b5d3]/25 text-[#4cd7f6] border border-[#4cd7f6]/30 transition-all active:scale-95 text-xs font-semibold shadow-sm"
            title="Ask AGREESARTHI AI Agronomist"
          >
            <span className="material-symbols-outlined text-[16px] animate-pulse">auto_awesome</span>
            <span className="hidden sm:inline">AI Advisor</span>
          </button>

          {/* View Mode Toggle (Mobile Frame vs Full Desktop) */}
          <button
            onClick={onToggleViewMode}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#1a2026] hover:bg-[#252b31] text-[#bbcabf] hover:text-white border border-white/[0.08] text-xs font-['JetBrains_Mono'] transition-all"
            title={`Switch to ${viewMode === 'desktop' ? 'Mobile View' : 'Desktop View'}`}
          >
            <span className="material-symbols-outlined text-[15px]">
              {viewMode === 'desktop' ? 'smartphone' : 'desktop_windows'}
            </span>
            <span className="text-[11px]">{viewMode === 'desktop' ? 'Mobile Frame' : 'Full Canvas'}</span>
          </button>

          {/* Live WebSocket Status */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#161c22] border border-white/[0.08]">
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-[#4edea3] animate-pulse' : 'bg-[#ef4444]'}`} />
            <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-[#4edea3]">
              {isOnline ? 'LIVE' : 'OFFLINE'}
            </span>
          </div>

          {/* Battery Status Capsule */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1a2026] border border-white/[0.08]">
            <span className="material-symbols-outlined text-[#4edea3] text-[16px]">battery_charging_80</span>
            <span className="font-['JetBrains_Mono'] text-[12px] font-semibold text-[#dde3eb]">
              {telemetry.batteryPercent}%
            </span>
          </div>

          {/* User Profile Avatar */}
          <div className="relative group">
            <img
              src={ASSETS.profile}
              alt="Farmer Profile"
              className="w-8 h-8 rounded-full object-cover ring-1 ring-[#4edea3]/40 cursor-pointer hover:ring-[#4edea3] transition-all"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#4edea3] ring-1 ring-[#090f15]" />
          </div>
        </div>
      </div>
    </header>
  );
};
