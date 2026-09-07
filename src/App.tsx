import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { OverviewView } from './components/OverviewView';
import { RoverView } from './components/RoverView';
import { MapView } from './components/MapView';
import { SensorsView } from './components/SensorsView';
import { AlertsView } from './components/AlertsView';
import { MenuView } from './components/MenuView';
import { AIAdvisorModal } from './components/AIAdvisorModal';
import { INITIAL_TELEMETRY, INITIAL_ALERTS, INITIAL_CROPS, INITIAL_MISSION_LOGS } from './data/mockData';
import { NavigationTab, TelemetryState, AlertLogItem, CropZoneItem, MissionLogItem } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('overview');
  const [telemetry, setTelemetry] = useState<TelemetryState>(INITIAL_TELEMETRY);
  const [alerts, setAlerts] = useState<AlertLogItem[]>(INITIAL_ALERTS);
  const [crops, setCrops] = useState<CropZoneItem[]>(INITIAL_CROPS);
  const [missionLogs, setMissionLogs] = useState<MissionLogItem[]>(INITIAL_MISSION_LOGS);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Toast auto-clear
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Subtle live telemetry fluctuation to emulate continuous field uplink
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => {
        // If ESTOP or IDLE, don't jitter coordinates
        if (prev.status === 'ESTOP') return prev;

        const jitterLat = (Math.random() - 0.5) * 0.000008;
        const jitterLng = (Math.random() - 0.5) * 0.000008;
        const jitterHeading = (prev.gps.heading + (Math.random() - 0.5) * 2 + 360) % 360;
        const jitterMoisture = Math.max(10, Math.min(80, prev.soilMoistureVwc + (Math.random() - 0.5) * 0.2));

        return {
          ...prev,
          soilMoistureVwc: Number(jitterMoisture.toFixed(1)),
          gps: {
            ...prev.gps,
            lat: prev.gps.lat + jitterLat,
            lng: prev.gps.lng + jitterLng,
            heading: Math.round(jitterHeading),
          },
        };
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Driving manual control handler
  const handleDriveCommand = (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'PAUSE') => {
    setTelemetry((prev) => {
      if (prev.status === 'ESTOP') {
        showToast('⚠️ Cannot drive: HARD EMERGENCY STOP is currently engaged.');
        return prev;
      }

      if (direction === 'PAUSE') {
        showToast('⏸️ Brake engaged. Rover stopped.');
        return { ...prev, speedMs: 0.0, driveMode: 'MANUAL_TELEOP' };
      }

      const speedMap = { UP: 0.5, DOWN: -0.3, LEFT: 0.2, RIGHT: 0.2 };
      const newHeading =
        direction === 'LEFT'
          ? (prev.gps.heading - 15 + 360) % 360
          : direction === 'RIGHT'
          ? (prev.gps.heading + 15) % 360
          : prev.gps.heading;

      const directionName = { UP: 'Forward', DOWN: 'Reverse', LEFT: 'Pivot Left', RIGHT: 'Pivot Right' }[direction];
      showToast(`🕹️ Drive Command: ${directionName} (${speedMap[direction]} m/s)`);

      return {
        ...prev,
        status: 'ACTIVE',
        driveMode: 'MANUAL_TELEOP',
        speedMs: speedMap[direction],
        gps: {
          ...prev.gps,
          heading: newHeading,
        },
      };
    });
  };

  // Emergency stop
  const handleEmergencyStop = () => {
    setTelemetry((prev) => {
      const isEstop = prev.status === 'ESTOP';
      if (isEstop) {
        showToast('🟢 E-STOP released. System returned to STANDBY.');
        return {
          ...prev,
          status: 'STANDBY',
          speedMs: 0.0,
          motorPowerPercent: 0,
        };
      } else {
        showToast('🛑 HARD EMERGENCY STOP ACTIVATED: All motors killed instantly!');
        return {
          ...prev,
          status: 'ESTOP',
          speedMs: 0.0,
          motorPowerPercent: 0,
        };
      }
    });
  };

  // Return to Home (RTH)
  const handleReturnHome = () => {
    setTelemetry((prev) => ({
      ...prev,
      status: 'AUTONOMOUS',
      driveMode: 'RTH_AUTOPILOT',
      speedMs: 0.6,
    }));
    showToast('🏠 Return-To-Home (RTH) waypoint route engaged! Navigating to Sector Base Dock.');
  };

  // Alert management
  const handleAcknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
    showToast('Alert acknowledged and logged to incident history.');
  };

  const handleAcknowledgeAllAlerts = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, acknowledged: true })));
    showToast('All active alerts acknowledged.');
  };

  return (
    <div className="min-h-screen bg-[#090f15] text-[#dde3eb] flex flex-col font-['Inter'] selection:bg-[#4edea3] selection:text-[#003824]">
      {/* Top Header Bar */}
      <Header
        activeTab={currentTab}
        onTabChange={setCurrentTab}
        telemetry={telemetry}
        onOpenAdvisor={() => setIsAdvisorOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6">
        {currentTab === 'overview' && (
          <OverviewView
            telemetry={telemetry}
            crops={crops}
            alerts={alerts}
            missionLogs={missionLogs}
            onUpdateTelemetry={setTelemetry}
            onDriveCommand={handleDriveCommand}
            onEmergencyStop={handleEmergencyStop}
            onReturnHome={handleReturnHome}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onSelectTab={setCurrentTab}
            onOpenAdvisor={(_topic) => setIsAdvisorOpen(true)}
            onToast={showToast}
          />
        )}

        {currentTab === 'rover' && (
          <RoverView
            telemetry={telemetry}
            onUpdateTelemetry={setTelemetry}
            onDriveCommand={handleDriveCommand}
            onEmergencyStop={handleEmergencyStop}
            onReturnHome={handleReturnHome}
            onToast={showToast}
          />
        )}

        {currentTab === 'map' && (
          <MapView telemetry={telemetry} onToast={showToast} />
        )}

        {currentTab === 'sensors' && (
          <SensorsView telemetry={telemetry} onToast={showToast} />
        )}

        {currentTab === 'alerts' && (
          <AlertsView
            alerts={alerts}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onAcknowledgeAll={handleAcknowledgeAllAlerts}
            onToast={showToast}
          />
        )}

        {currentTab === 'menu' && (
          <MenuView
            telemetry={telemetry}
            onToast={showToast}
            onOpenAdvisor={() => setIsAdvisorOpen(true)}
          />
        )}
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-18 sm:bottom-6 right-4 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="bg-[#1a2026] text-white text-xs sm:text-sm font-['JetBrains_Mono'] px-4 py-2.5 rounded-xl border border-[#4edea3]/40 shadow-2xl flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-ping shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* AI Advisor Modal */}
      <AIAdvisorModal
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
        telemetry={telemetry}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={currentTab}
        onTabChange={setCurrentTab}
        unreadAlertsCount={alerts.filter((a) => !a.acknowledged).length}
      />
    </div>
  );
}
