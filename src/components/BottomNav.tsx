import React from 'react';
import { NavigationTab } from '../types';

interface BottomNavProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  unacknowledgedAlertsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  unacknowledgedAlertsCount,
}) => {
  const navItems: { id: NavigationTab; label: string; icon: string; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: 'grid_view' },
    { id: 'rover', label: 'Rover', icon: 'precision_manufacturing' },
    { id: 'map', label: 'Map', icon: 'radar' },
    { id: 'sensors', label: 'Sensors', icon: 'sensors' },
    { id: 'alerts', label: 'Alerts', icon: 'notifications', badge: unacknowledgedAlertsCount },
    { id: 'menu', label: 'Menu', icon: 'menu_open' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full z-50 pb-safe bg-[#090f15]/90 backdrop-blur-2xl border-t border-white/[0.08] shadow-[0_-4px_20px_rgba(0,0,0,0.6)]">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1 min-w-[52px] h-13 transition-all relative ${
                isActive
                  ? 'text-[#4edea3] scale-105 font-semibold'
                  : 'text-[#bbcabf] hover:text-white active:scale-95'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[21px] transition-transform ${
                  isActive ? 'material-symbols-fill drop-shadow-[0_0_8px_rgba(78,222,163,0.5)]' : ''
                }`}
              >
                {item.icon}
              </span>
              <span className="font-['Inter'] text-[11px] leading-none tracking-tight">
                {item.label}
              </span>

              {item.badge && item.badge > 0 ? (
                <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-[#ef4444] ring-2 ring-[#090f15] animate-ping" />
              ) : null}
              {item.badge && item.badge > 0 ? (
                <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-[#ef4444] ring-2 ring-[#090f15]" />
              ) : null}

              {isActive && (
                <span className="absolute bottom-1 w-4 h-0.5 rounded-full bg-[#4edea3] shadow-[0_0_6px_#4edea3]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
