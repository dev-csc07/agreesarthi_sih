import React, { useState, useEffect } from 'react';
import { ASSETS, SOIL_TRENDS_DATA, INITIAL_CROPS, INITIAL_MISSION_LOGS } from '../data/mockData';
import { TelemetryState, CropZoneItem, AlertLogItem, MissionLogItem, NavigationTab } from '../types';

interface OverviewViewProps {
  telemetry: TelemetryState;
  crops?: CropZoneItem[];
  alerts?: AlertLogItem[];
  missionLogs?: MissionLogItem[];
  onUpdateTelemetry?: (updater: (prev: TelemetryState) => TelemetryState) => void;
  onDriveCommand: (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'PAUSE') => void;
  onEmergencyStop: () => void;
  onReturnHome?: () => void;
  onAcknowledgeAlert?: (id: string) => void;
  onSelectTab?: (tab: NavigationTab) => void;
  onOpenAdvisor: (topic?: string) => void;
  onToast: (msg: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  telemetry,
  crops = INITIAL_CROPS,
  alerts = [],
  missionLogs = INITIAL_MISSION_LOGS,
  onUpdateTelemetry = (_updater: (prev: TelemetryState) => TelemetryState) => {},
  onDriveCommand,
  onEmergencyStop,
  onReturnHome = () => {},
  onAcknowledgeAlert = (_id: string) => {},
  onSelectTab = (_tab: NavigationTab) => {},
  onOpenAdvisor,
  onToast,
}) => {
  // Tab switcher for Field Radar vs Optical Cam
  const [monitorTab, setMonitorTab] = useState<'map' | 'cam'>('map');

  // Soil Trends Metric and Time Window
  const [trendMetric, setTrendMetric] = useState<'vwc' | 'temp' | 'ph'>('vwc');
  const [trendWindow, setTrendWindow] = useState<'1H' | '6H' | '24H' | '7D' | '30D'>('24H');
  const [activePointIndex, setActivePointIndex] = useState<number>(6); // Default 10:42 AM

  // Rover active key press feedback
  const [activeKey, setActiveKey] = useState<string | null>(null);

  // Optical cam state
  const [isCapturing, setIsCapturing] = useState(false);

  // Selected crop for quick inspection modal
  const [selectedCrop, setSelectedCrop] = useState<CropZoneItem | null>(null);

  const activePoint = SOIL_TRENDS_DATA[activePointIndex] || SOIL_TRENDS_DATA[6];

  const handleKeyPress = (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'PAUSE') => {
    setActiveKey(dir);
    onDriveCommand(dir);
    setTimeout(() => setActiveKey(null), 250);
  };

  const handleCaptureNDVI = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      onToast('📸 High-Resolution NDVI Spectral Snapshot saved to Mission Cache!');
    }, 600);
  };

  const handleStartSurvey = () => {
    onUpdateTelemetry((prev) => ({
      ...prev,
      driveMode: 'AUTO',
      status: 'BUSY',
    }));
    onToast('🛰️ Autonomous Waypoint Grid Survey dispatched to ROVER-001!');
  };

  // Metric visual configuration
  const getMetricDisplay = () => {
    switch (trendMetric) {
      case 'vwc':
        return {
          title: 'Moisture',
          value: `${activePoint.vwc.toFixed(1)}%`,
          status: '(Steady)',
          color: '#4edea3',
        };
      case 'temp':
        return {
          title: 'Temperature',
          value: `${activePoint.temp.toFixed(1)}°C`,
          status: '(Nominal)',
          color: '#ffb95f',
        };
      case 'ph':
        return {
          title: 'Soil pH',
          value: `${activePoint.ph.toFixed(1)}`,
          status: '(Optimal)',
          color: '#4cd7f6',
        };
    }
  };

  const metricInfo = getMetricDisplay();
  const safeAlerts = alerts || [];
  const safeCrops = crops || INITIAL_CROPS;
  const safeMissionLogs = missionLogs || INITIAL_MISSION_LOGS;
  const unacknowledgedAlerts = safeAlerts.filter((a) => !a.acknowledged);

  return (
    <div className="flex flex-col w-full space-y-4 pb-12">
      {/* 1. GREETING & CONTEXT HEADER */}
      <section className="flex flex-col space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-['Plus_Jakarta_Sans'] text-lg sm:text-xl font-bold text-[#dde3eb]">
                Good Morning, Farmer
              </span>
              <span className="inline-flex items-center justify-center text-[#ffb95f]">
                <span className="material-symbols-outlined text-[18px]">wb_sunny</span>
              </span>
            </div>
            <p className="font-['Inter'] text-xs text-[#bbcabf]">
              Here’s the current condition of your farm.
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-[#252b31] px-2.5 py-1 rounded-full border border-white/[0.08]">
            <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse" />
            <span className="font-['JetBrains_Mono'] text-[10px] font-semibold text-[#4edea3] tracking-wider">
              WS ONLINE
            </span>
          </div>
        </div>

        {/* Quick Context Telemetry Chips Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <div className="flex items-center gap-1.5 bg-[#161c22] border border-white/[0.06] px-2.5 py-1 rounded-full shrink-0">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[14px]">grid_goldenratio</span>
            <span className="font-['Inter'] text-xs text-[#dde3eb]">Farm A • Sector North</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#161c22] border border-white/[0.06] px-2.5 py-1 rounded-full shrink-0">
            <span className="material-symbols-outlined text-[#4edea3] text-[14px]">smart_toy</span>
            <span className="font-['JetBrains_Mono'] text-xs font-semibold text-[#dde3eb]">{telemetry.roverId}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#161c22] border border-white/[0.06] px-2.5 py-1 rounded-full shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]" />
            <span className="font-['Inter'] text-xs text-[#bbcabf]">ESP32-CAM (Ready)</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#161c22] border border-white/[0.06] px-2.5 py-1 rounded-full shrink-0">
            <span className="material-symbols-outlined text-[#ffb95f] text-[14px]">bolt</span>
            <span className="font-['JetBrains_Mono'] text-xs text-[#dde3eb]">
              {telemetry.batteryPercent}% • {telemetry.batteryVoltage}V
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#161c22] border border-white/[0.06] px-2.5 py-1 rounded-full shrink-0">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[14px]">satellite_alt</span>
            <span className="font-['JetBrains_Mono'] text-xs text-[#bbcabf]">RTK Fix (±1.8cm)</span>
          </div>
        </div>
      </section>

      {/* 2. TOP STATUS KPI SUMMARY (2x2 Grid) */}
      <section className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {/* Rover Status */}
        <div
          onClick={() => onSelectTab('rover')}
          className="bg-[#1a2026] hover:bg-[#20272e] cursor-pointer transition-all border border-white/[0.06] rounded-xl p-3 flex flex-col justify-between shadow-sm relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-[#bbcabf] tracking-wider">
              ROVER UNIT
            </span>
            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${telemetry.status === 'ESTOP' ? 'bg-[#ef4444]' : 'bg-[#4edea3]'} animate-ping`} />
              <span className={`w-2 h-2 rounded-full ${telemetry.status === 'ESTOP' ? 'bg-[#ef4444]' : 'bg-[#4edea3]'} -ml-3`} />
            </div>
          </div>
          <div className="my-2">
            <div className={`font-['Plus_Jakarta_Sans'] text-base sm:text-lg font-bold ${telemetry.status === 'ESTOP' ? 'text-[#ef4444]' : 'text-[#4edea3]'}`}>
              {telemetry.status === 'ESTOP' ? 'EMERGENCY HALT' : 'ROVER ONLINE'}
            </div>
            <div className="font-['JetBrains_Mono'] text-xs text-[#dde3eb]">
              {telemetry.roverId} • {telemetry.driveMode}
            </div>
          </div>
          <div className="flex items-center gap-1.5 font-['Inter'] text-[11px] text-[#bbcabf]">
            <span className="material-symbols-outlined text-[13px] text-[#4edea3]">sync</span>
            <span>Ping {telemetry.lastPingSec}s ago</span>
          </div>
        </div>

        {/* Soil Health */}
        <div
          onClick={() => onSelectTab('sensors')}
          className="bg-[#1a2026] hover:bg-[#20272e] cursor-pointer transition-all border border-white/[0.06] rounded-xl p-3 flex flex-col justify-between shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-[#bbcabf] tracking-wider">
              SOIL INDEX
            </span>
            <span className="bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/20 px-2 py-0.5 rounded-full font-['JetBrains_Mono'] text-[10px] font-semibold">
              GOOD
            </span>
          </div>
          <div className="my-2">
            <div className="font-['Plus_Jakarta_Sans'] text-base sm:text-lg font-bold text-[#dde3eb]">
              Optimal
            </div>
            <div className="font-['JetBrains_Mono'] text-[11px] text-[#4cd7f6] font-medium truncate">
              Moist: {telemetry.soilMoistureVwc.toFixed(0)}% • pH: {telemetry.soilPh.toFixed(1)}
            </div>
          </div>
          <div className="w-full bg-[#252b31] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#4edea3] h-full rounded-full transition-all duration-500 shadow-[0_0_8px_#4edea3]"
              style={{ width: `${Math.min(100, telemetry.soilMoistureVwc * 2)}%` }}
            />
          </div>
        </div>

        {/* Crop Health (Progress Ring) */}
        <div
          onClick={() => onOpenAdvisor('Crop Health & Vegetative Canopy Analysis')}
          className="bg-[#1a2026] hover:bg-[#20272e] cursor-pointer transition-all border border-white/[0.06] rounded-xl p-3 flex items-center justify-between shadow-sm"
        >
          <div className="flex flex-col">
            <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-[#bbcabf] tracking-wider">
              CROP HEALTH
            </span>
            <div className="font-['Plus_Jakarta_Sans'] text-lg sm:text-xl font-bold text-[#dde3eb] mt-1">
              {telemetry.cropHealthPercent}%
            </div>
            <span className="font-['Inter'] text-xs text-[#4edea3] font-medium">Vigorous</span>
          </div>
          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#2f353c]"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              />
              <path
                className="text-[#4edea3] transition-all duration-500"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray={`${telemetry.cropHealthPercent}, 100`}
                strokeLinecap="round"
                strokeWidth="3.5"
              />
            </svg>
            <span className="material-symbols-outlined absolute text-[#4edea3] text-[18px]">spa</span>
          </div>
        </div>

        {/* Field Coverage */}
        <div
          onClick={() => onSelectTab('map')}
          className="bg-[#1a2026] hover:bg-[#20272e] cursor-pointer transition-all border border-white/[0.06] rounded-xl p-3 flex flex-col justify-between shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-[#bbcabf] tracking-wider">
              SURVEY COVER
            </span>
            <span className="font-['JetBrains_Mono'] text-xs font-semibold text-[#dde3eb]">
              {Math.round((telemetry.surveyCoverAcres / telemetry.totalAcres) * 100)}%
            </span>
          </div>
          <div className="my-2">
            <div className="font-['Plus_Jakarta_Sans'] text-base sm:text-lg font-bold text-[#dde3eb]">
              {telemetry.surveyCoverAcres.toFixed(1)} Ac
            </div>
            <div className="font-['Inter'] text-xs text-[#bbcabf]">
              of {telemetry.totalAcres} acres total
            </div>
          </div>
          <div className="w-full bg-[#252b31] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#4cd7f6] h-full rounded-full transition-all duration-500 shadow-[0_0_8px_#4cd7f6]"
              style={{ width: `${(telemetry.surveyCoverAcres / telemetry.totalAcres) * 100}%` }}
            />
          </div>
        </div>
      </section>

      {/* 3. LIVE FIELD MONITORING & LIVE CAMERA TABS */}
      <section className="bg-[#1a2026] border border-white/[0.07] rounded-xl p-3 shadow-md flex flex-col space-y-2">
        {/* View Switcher */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-1 bg-[#090f15] p-1 rounded-lg border border-white/[0.06]">
            <button
              onClick={() => setMonitorTab('map')}
              className={`px-3 py-1 rounded-md font-['JetBrains_Mono'] text-[11px] font-semibold tracking-wider transition-all ${
                monitorTab === 'map'
                  ? 'bg-[#252b31] text-[#4edea3] shadow-sm'
                  : 'text-[#bbcabf] hover:text-white'
              }`}
            >
              FIELD RADAR
            </button>
            <button
              onClick={() => setMonitorTab('cam')}
              className={`px-3 py-1 rounded-md font-['JetBrains_Mono'] text-[11px] font-semibold tracking-wider transition-all ${
                monitorTab === 'cam'
                  ? 'bg-[#252b31] text-[#4edea3] shadow-sm'
                  : 'text-[#bbcabf] hover:text-white'
              }`}
            >
              OPTICAL CAM
            </button>
          </div>
          <div className="flex items-center gap-1.5 text-[#4edea3] font-['JetBrains_Mono'] text-[11px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse" />
            <span>STREAMING</span>
          </div>
        </div>

        {/* View Content: Radar / Tactical Map */}
        {monitorTab === 'map' ? (
          <div className="relative w-full h-64 sm:h-72 rounded-lg overflow-hidden bg-[#090f15] border border-white/[0.06] flex flex-col justify-between p-2.5 select-none">
            {/* Zone Overlay Grid (Tactical SVG Map) */}
            <svg className="absolute inset-0 w-full h-full opacity-70" preserveAspectRatio="none" viewBox="0 0 300 200">
              <defs>
                <pattern id="radarGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" />
                </pattern>
                <linearGradient id="zoneAGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.08" />
                </linearGradient>
                <linearGradient id="zoneBGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffb95f" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#ffb95f" stopOpacity="0.05" />
                </linearGradient>
                <linearGradient id="zoneCGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.08" />
                </linearGradient>
              </defs>

              <rect width="100%" height="100%" fill="url(#radarGrid)" />

              {/* Waypoint Path Lines */}
              <polyline
                points="30,40 85,70 140,80 200,60 250,90"
                fill="none"
                stroke="rgba(78, 222, 163, 0.4)"
                strokeDasharray="4,3"
                strokeWidth="1.5"
              />

              {/* Zone A: Healthy */}
              <polygon
                points="15,20 130,15 115,110 20,95"
                fill="url(#zoneAGrad)"
                stroke="#10b981"
                strokeWidth="1.2"
                strokeDasharray="3,2"
              />
              <text x="35" y="55" fill="#4edea3" fontFamily="JetBrains Mono" fontSize="10" fontWeight="600">
                ZONE A [HEALTHY]
              </text>

              {/* Zone B: Attention */}
              <polygon
                points="140,25 285,30 270,115 130,120"
                fill="url(#zoneBGrad)"
                stroke="#ffb95f"
                strokeWidth="1.2"
                strokeDasharray="3,2"
              />
              <text x="160" y="65" fill="#ffb95f" fontFamily="JetBrains Mono" fontSize="10" fontWeight="600">
                ZONE B [ATTENTION]
              </text>

              {/* Zone C: Red Low Moisture */}
              <polygon
                points="40,125 260,135 240,185 30,180"
                fill="url(#zoneCGrad)"
                stroke="#ffb4ab"
                strokeWidth="1.2"
                strokeDasharray="3,2"
              />
              <text x="80" y="165" fill="#ffb4ab" fontFamily="JetBrains Mono" fontSize="10" fontWeight="600">
                ZONE C [LOW MOISTURE]
              </text>

              {/* Rover Active Position Marker */}
              <g transform="translate(85, 70)">
                <circle r="16" fill="rgba(78, 222, 163, 0.2)" className="animate-ping" />
                <circle r="7" fill="#4edea3" />
                <circle r="3" fill="#003824" />
                {/* Heading indicator tick */}
                <line x1="0" y1="0" x2="10" y2="-8" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
              </g>
            </svg>

            {/* Tactical GPS Telemetry Header */}
            <div className="relative z-10 flex items-center justify-between gap-1">
              <div className="bg-[#1a2026]/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/[0.08] shadow-sm">
                <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-[#4cd7f6]">
                  GPS: {telemetry.gps.lat.toFixed(4)}° N, {telemetry.gps.lng.toFixed(4)}° E
                </span>
              </div>
              <div className="bg-[#1a2026]/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/[0.08] shadow-sm flex items-center gap-1 font-['JetBrains_Mono'] text-[10px] text-[#dde3eb]">
                <span className="material-symbols-outlined text-[#4edea3] text-[13px]">satellite_alt</span>
                <span>{telemetry.gps.satellites} SATS • ±{telemetry.gps.accuracyM}m</span>
              </div>
            </div>

            {/* Tactical Bottom Bar Overlay with Actions */}
            <div className="relative z-10 flex items-center justify-between gap-2">
              <div className="bg-[#252b31]/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/[0.08]">
                <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-[#4edea3]">
                  SPEED: {telemetry.speedMs.toFixed(1)} m/s
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onToast('🎯 Target lock: Camera tracking ROVER-001 active')}
                  className="bg-[#252b31]/90 hover:bg-[#343a40] text-[#dde3eb] px-2.5 py-1 rounded-md font-['JetBrains_Mono'] text-[11px] font-semibold flex items-center gap-1 shadow-sm border border-white/[0.08] active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[13px] text-[#4cd7f6]">my_location</span>
                  Follow
                </button>
                <button
                  onClick={handleStartSurvey}
                  className="bg-[#4edea3] hover:bg-[#6ffbbe] text-[#003824] px-2.5 py-1 rounded-md font-['JetBrains_Mono'] text-[11px] font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                  Survey
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Optical Cam View */
          <div className="relative w-full h-64 sm:h-72 rounded-lg overflow-hidden bg-[#090f15] border border-white/[0.06] flex flex-col justify-between p-2.5">
            <img
              src={ASSETS.opticalCam}
              alt="Autonomous agricultural rover live optical view"
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Vignette / tactical dark gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

            {/* Live Overlay Banner */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-1.5 bg-[#090f15]/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#ef4444]/40">
                <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse" />
                <span className="font-['JetBrains_Mono'] text-[10px] font-semibold text-[#ffb4ab]">
                  LIVE 640x480 • 30 FPS
                </span>
              </div>
              <div className="bg-[#090f15]/85 backdrop-blur-md px-2.5 py-1 rounded-full font-['JetBrains_Mono'] text-[10px] font-semibold text-[#4edea3] flex items-center gap-1 border border-white/[0.08]">
                <span className="material-symbols-outlined text-[13px]">wifi</span>
                <span>EXCELLENT (5.8 GHz)</span>
              </div>
            </div>

            {/* Crosshair Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-50">
              <div className="w-16 h-16 rounded-full border border-[#4edea3]/60 flex items-center justify-center">
                <div className="w-2 h-2 bg-[#4edea3] rounded-full shadow-[0_0_6px_#4edea3]" />
                <div className="absolute w-24 h-[1px] bg-[#4edea3]/30" />
                <div className="absolute h-24 w-[1px] bg-[#4edea3]/30" />
              </div>
            </div>

            {/* Cam Bottom Controls */}
            <div className="relative z-10 flex items-center justify-between bg-[#090f15]/85 backdrop-blur-md p-1.5 rounded-lg border border-white/[0.08]">
              <span className="font-['JetBrains_Mono'] text-[10px] font-semibold text-[#bbcabf] pl-1.5">
                CAM-01 (ESP32-CAM NDVI)
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCaptureNDVI}
                  disabled={isCapturing}
                  className="p-1.5 rounded bg-[#1a2026] text-[#dde3eb] hover:text-[#4edea3] active:scale-95 transition-all"
                  title="Capture High-Res Image"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isCapturing ? 'hourglass_top' : 'photo_camera'}
                  </span>
                </button>
                <button
                  onClick={() => onToast('🎥 Video recording stream synchronized to ground telemetry')}
                  className="p-1.5 rounded bg-[#1a2026] text-[#dde3eb] hover:text-[#4cd7f6] active:scale-95 transition-all"
                  title="Record Stream"
                >
                  <span className="material-symbols-outlined text-[18px]">videocam</span>
                </button>
                <button
                  onClick={() => onSelectTab('rover')}
                  className="p-1.5 rounded bg-[#1a2026] text-[#dde3eb] hover:text-[#4edea3] active:scale-95 transition-all"
                  title="Expand to Full Rover Cockpit"
                >
                  <span className="material-symbols-outlined text-[18px]">fullscreen</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 4. SUBSURFACE SENSOR TELEMETRY */}
      <section className="flex flex-col space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-['Plus_Jakarta_Sans'] text-base sm:text-lg font-bold text-[#dde3eb]">
            Subsurface Sensor Telemetry
          </span>
          <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-[#4cd7f6] tracking-wider">
            MODBUS-RTU
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          {/* Moisture */}
          <div
            onClick={() => {
              setTrendMetric('vwc');
              onToast('Selected Moisture (VWC%) graph feed');
            }}
            className="bg-[#1a2026] hover:bg-[#20272e] cursor-pointer transition-all border border-white/[0.06] rounded-xl p-3 flex flex-col justify-between shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-[#bbcabf] tracking-wider">
                MOISTURE
              </span>
              <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">water_drop</span>
            </div>
            <div className="my-1.5">
              <div className="font-['JetBrains_Mono'] text-2xl sm:text-3xl font-bold text-[#4cd7f6]">
                {telemetry.soilMoistureVwc.toFixed(0)}%
              </div>
              <div className="font-['Inter'] text-xs text-[#4edea3] font-medium">Optimal VWC</div>
            </div>
            <div className="w-full bg-[#252b31] rounded-full h-1 overflow-hidden">
              <div
                className="bg-[#4cd7f6] h-full transition-all duration-500 shadow-[0_0_6px_#4cd7f6]"
                style={{ width: `${telemetry.soilMoistureVwc}%` }}
              />
            </div>
          </div>

          {/* Temperature */}
          <div
            onClick={() => {
              setTrendMetric('temp');
              onToast('Selected Ground Temperature graph feed');
            }}
            className="bg-[#1a2026] hover:bg-[#20272e] cursor-pointer transition-all border border-white/[0.06] rounded-xl p-3 flex flex-col justify-between shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-[#bbcabf] tracking-wider">
                TEMP
              </span>
              <span className="material-symbols-outlined text-[#ffb95f] text-[18px]">thermostat</span>
            </div>
            <div className="my-1.5">
              <div className="font-['JetBrains_Mono'] text-2xl sm:text-3xl font-bold text-[#dde3eb]">
                {telemetry.soilTempC.toFixed(1)}°C
              </div>
              <div className="font-['Inter'] text-xs text-[#bbcabf]">Normal Ground</div>
            </div>
            <div className="w-full bg-[#252b31] rounded-full h-1 overflow-hidden">
              <div
                className="bg-[#ffb95f] h-full transition-all duration-500 shadow-[0_0_6px_#ffb95f]"
                style={{ width: `${(telemetry.soilTempC / 45) * 100}%` }}
              />
            </div>
          </div>

          {/* pH Level */}
          <div
            onClick={() => {
              setTrendMetric('ph');
              onToast('Selected Soil pH graph feed');
            }}
            className="bg-[#1a2026] hover:bg-[#20272e] cursor-pointer transition-all border border-white/[0.06] rounded-xl p-3 flex flex-col justify-between shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-[#bbcabf] tracking-wider">
                SOIL PH
              </span>
              <span className="material-symbols-outlined text-[#4edea3] text-[18px]">science</span>
            </div>
            <div className="my-1.5">
              <div className="font-['JetBrains_Mono'] text-2xl sm:text-3xl font-bold text-[#4edea3]">
                {telemetry.soilPh.toFixed(1)}
              </div>
              <div className="font-['Inter'] text-xs text-[#bbcabf]">Slightly Acidic</div>
            </div>
            <div className="w-full bg-[#252b31] rounded-full h-1 overflow-hidden">
              <div
                className="bg-[#4edea3] h-full transition-all duration-500 shadow-[0_0_6px_#4edea3]"
                style={{ width: `${(telemetry.soilPh / 10) * 100}%` }}
              />
            </div>
          </div>

          {/* EC Electrical Conductivity */}
          <div
            onClick={() => onToast('Electrical Conductivity: 1.2 mS/cm indicates nominal ionic fertility')}
            className="bg-[#1a2026] hover:bg-[#20272e] cursor-pointer transition-all border border-white/[0.06] rounded-xl p-3 flex flex-col justify-between shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-[#bbcabf] tracking-wider">
                COND. (EC)
              </span>
              <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">electric_meter</span>
            </div>
            <div className="my-1.5">
              <div className="font-['JetBrains_Mono'] text-2xl sm:text-3xl font-bold text-[#dde3eb]">
                {telemetry.soilEc.toFixed(1)} <span className="text-xs font-normal text-[#bbcabf]">mS/cm</span>
              </div>
              <div className="font-['Inter'] text-xs text-[#4edea3] font-medium">Fertility Nominal</div>
            </div>
            <div className="w-full bg-[#252b31] rounded-full h-1 overflow-hidden">
              <div
                className="bg-[#4cd7f6] h-full transition-all duration-500 shadow-[0_0_6px_#4cd7f6]"
                style={{ width: '48%' }}
              />
            </div>
          </div>
        </div>

        {/* NPK Sensor Modular Card (Full Width) */}
        <div className="bg-[#1a2026] border border-white/[0.06] rounded-xl p-3 shadow-sm flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#4edea3] text-[16px]">compost</span>
              <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-[#dde3eb] tracking-wider">
                NPK NUTRIENT PROFILE
              </span>
            </div>
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#bbcabf] tracking-wider">
              OPTICAL SPECTRA
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="bg-[#252b31] p-2 rounded-lg text-center flex flex-col justify-center border border-white/[0.04]">
              <span className="font-['JetBrains_Mono'] text-[10px] font-semibold text-[#4edea3] tracking-wider">
                NITROGEN (N)
              </span>
              <span className="font-['JetBrains_Mono'] text-base font-bold text-[#dde3eb] mt-0.5">
                {telemetry.npk.n} <span className="text-[10px] text-[#bbcabf] font-normal">mg/kg</span>
              </span>
            </div>
            <div className="bg-[#252b31] p-2 rounded-lg text-center flex flex-col justify-center border border-white/[0.04]">
              <span className="font-['JetBrains_Mono'] text-[10px] font-semibold text-[#4cd7f6] tracking-wider">
                PHOSPHORUS (P)
              </span>
              <span className="font-['JetBrains_Mono'] text-base font-bold text-[#dde3eb] mt-0.5">
                {telemetry.npk.p} <span className="text-[10px] text-[#bbcabf] font-normal">mg/kg</span>
              </span>
            </div>
            <div className="bg-[#252b31] p-2 rounded-lg text-center flex flex-col justify-center border border-white/[0.04]">
              <span className="font-['JetBrains_Mono'] text-[10px] font-semibold text-[#ffb95f] tracking-wider">
                POTASSIUM (K)
              </span>
              <span className="font-['JetBrains_Mono'] text-base font-bold text-[#dde3eb] mt-0.5">
                {telemetry.npk.k} <span className="text-[10px] text-[#bbcabf] font-normal">mg/kg</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SENSOR GRAPH (Soil Trends - 24 Hours) */}
      <section className="bg-[#1a2026] border border-white/[0.07] rounded-xl p-3 shadow-md flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-['Plus_Jakarta_Sans'] text-base sm:text-lg font-bold text-[#dde3eb]">
              Soil Trends
            </div>
            <div className="font-['Inter'] text-xs text-[#bbcabf]">
              Continuous diurnal variation
            </div>
          </div>
          {/* Metric Switcher Pills */}
          <div className="flex items-center gap-1 bg-[#090f15] p-0.5 rounded-lg border border-white/[0.06]">
            <button
              onClick={() => setTrendMetric('vwc')}
              className={`px-2.5 py-0.5 rounded font-['JetBrains_Mono'] text-[11px] font-semibold transition-all ${
                trendMetric === 'vwc'
                  ? 'bg-[#4edea3] text-[#003824] shadow-sm'
                  : 'text-[#bbcabf] hover:text-white'
              }`}
            >
              VWC%
            </button>
            <button
              onClick={() => setTrendMetric('temp')}
              className={`px-2.5 py-0.5 rounded font-['JetBrains_Mono'] text-[11px] font-semibold transition-all ${
                trendMetric === 'temp'
                  ? 'bg-[#ffb95f] text-[#472a00] shadow-sm'
                  : 'text-[#bbcabf] hover:text-white'
              }`}
            >
              TEMP
            </button>
            <button
              onClick={() => setTrendMetric('ph')}
              className={`px-2.5 py-0.5 rounded font-['JetBrains_Mono'] text-[11px] font-semibold transition-all ${
                trendMetric === 'ph'
                  ? 'bg-[#4cd7f6] text-[#003640] shadow-sm'
                  : 'text-[#bbcabf] hover:text-white'
              }`}
            >
              PH
            </button>
          </div>
        </div>

        {/* Active Tooltip Callout */}
        <div className="flex items-center justify-between bg-[#252b31]/80 px-2.5 py-1.5 rounded-md border border-white/[0.06]">
          <span className="font-['JetBrains_Mono'] text-xs text-[#bbcabf]">
            Point {activePoint.time} AM
          </span>
          <span
            className="font-['JetBrains_Mono'] text-xs font-semibold"
            style={{ color: metricInfo.color }}
          >
            {metricInfo.title}: {metricInfo.value} {metricInfo.status}
          </span>
        </div>

        {/* SVG Interactive Chart Visualizer */}
        <div className="w-full h-36 sm:h-44 relative pt-2 select-none">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 320 120">
            <defs>
              <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={metricInfo.color} stopOpacity="0.35" />
                <stop offset="100%" stopColor={metricInfo.color} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid Guides */}
            <line x1="0" y1="20" x2="320" y2="20" stroke="rgba(255,255,255,0.06)" strokeDasharray="2,2" />
            <line x1="0" y1="60" x2="320" y2="60" stroke="rgba(255,255,255,0.06)" strokeDasharray="2,2" />
            <line x1="0" y1="100" x2="320" y2="100" stroke="rgba(255,255,255,0.06)" strokeDasharray="2,2" />

            {/* Shaded Area */}
            <polygon
              fill="url(#trendGradient)"
              points="0,115 0,72 25,68 55,75 90,58 130,62 170,45 205,50 245,35 285,42 320,38 320,115"
            />

            {/* Spline Line */}
            <polyline
              fill="none"
              stroke={metricInfo.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points="0,72 25,68 55,75 90,58 130,62 170,45 205,50 245,35 285,42 320,38"
            />

            {/* Interactive Data Points along the curve */}
            {[
              { x: 0, y: 72, idx: 0 },
              { x: 25, y: 68, idx: 1 },
              { x: 55, y: 75, idx: 2 },
              { x: 90, y: 58, idx: 3 },
              { x: 130, y: 62, idx: 4 },
              { x: 170, y: 45, idx: 5 },
              { x: 205, y: 50, idx: 6 },
              { x: 245, y: 35, idx: 7 },
              { x: 285, y: 42, idx: 8 },
              { x: 320, y: 38, idx: 9 },
            ].map((pt) => {
              const isSelected = activePointIndex === pt.idx;
              return (
                <g
                  key={pt.idx}
                  className="cursor-pointer group"
                  onClick={() => setActivePointIndex(pt.idx)}
                >
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? 6 : 4}
                    fill={metricInfo.color}
                    className="transition-all"
                  />
                  {isSelected && (
                    <>
                      <circle cx={pt.x} cy={pt.y} r="2" fill="#003824" />
                      <line
                        x1={pt.x}
                        y1={pt.y}
                        x2={pt.x}
                        y2="115"
                        stroke={metricInfo.color}
                        strokeWidth="1"
                        strokeDasharray="2,2"
                      />
                    </>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Timeline Window Controls */}
        <div className="flex items-center justify-between pt-1 text-[#bbcabf] font-['JetBrains_Mono'] text-[11px] font-semibold">
          {(['1H', '6H', '24H', '7D', '30D'] as const).map((win) => (
            <button
              key={win}
              onClick={() => {
                setTrendWindow(win);
                onToast(`Sensor timeline shifted to ${win} inspection view`);
              }}
              className={`px-2.5 py-1 rounded transition-all ${
                trendWindow === win
                  ? 'bg-[#252b31] text-[#4edea3] shadow-sm'
                  : 'hover:text-white'
              }`}
            >
              {win}
            </button>
          ))}
        </div>
      </section>

      {/* 6. CROPS IN MISSION AREA & AI FIELD INSIGHTS */}
      <section className="flex flex-col space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-['Plus_Jakarta_Sans'] text-base sm:text-lg font-bold text-[#dde3eb]">
            Crops in Mission Area
          </span>
          <button
            onClick={() => onOpenAdvisor('Crops in Mission Area Health Inspection')}
            className="text-[#4edea3] hover:text-[#6ffbbe] flex items-center gap-1 text-xs font-['Inter']"
          >
            <span className="material-symbols-outlined text-[18px]">psychology</span>
            <span className="hidden sm:inline">AI Analysis</span>
          </button>
        </div>

        {/* Crop Cards Stack */}
        <div className="space-y-2">
          {safeCrops.map((crop) => (
            <div
              key={crop.id}
              onClick={() => setSelectedCrop(crop)}
              className="bg-[#1a2026] hover:bg-[#20272e] border border-white/[0.06] rounded-xl p-3 flex items-center justify-between shadow-sm cursor-pointer transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-white/[0.08] relative">
                  <img
                    src={crop.imageUrl}
                    alt={crop.cropName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-1 ring-[#090f15] ${
                      crop.status === 'HEALTHY' ? 'bg-[#4edea3]' : 'bg-[#ffb95f]'
                    }`}
                  />
                </div>
                <div className="truncate">
                  <div className="font-['Inter'] text-sm font-semibold text-[#dde3eb] truncate">
                    {crop.cropName} • {crop.zone}
                  </div>
                  <div
                    className={`font-['Inter'] text-xs truncate ${
                      crop.status === 'HEALTHY' ? 'text-[#bbcabf]' : 'text-[#ffb95f]'
                    }`}
                  >
                    {crop.description}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0 pl-2">
                <div
                  className={`font-['JetBrains_Mono'] text-base font-bold ${
                    crop.status === 'HEALTHY' ? 'text-[#4edea3]' : 'text-[#ffb95f]'
                  }`}
                >
                  {crop.healthPercent}%
                </div>
                <span
                  className={`font-['JetBrains_Mono'] text-[10px] font-semibold tracking-wider ${
                    crop.status === 'HEALTHY' ? 'text-[#4edea3]' : 'text-[#ffb95f]'
                  }`}
                >
                  {crop.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* AI Field Insights Box */}
        <div className="bg-[#252b31] border border-white/[0.08] rounded-xl p-3.5 shadow-md flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#4cd7f6]">
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              <span className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#dde3eb]">
                AI Field Insights
              </span>
            </div>
            <button
              onClick={() => onOpenAdvisor('Automated Agronomy Field Diagnostic')}
              className="px-2 py-0.5 rounded bg-[#4cd7f6]/20 hover:bg-[#4cd7f6]/30 text-[#4cd7f6] text-[10px] font-['JetBrains_Mono'] font-semibold transition-colors"
            >
              GENERATE NEW
            </button>
          </div>

          <p className="font-['Inter'] text-xs text-[#dde3eb] leading-relaxed">
            Vegetative vigor is nominal across Sector North. Lower subsurface moisture is trending in the eastern perimeter.
          </p>

          <div className="space-y-1.5 pt-0.5">
            <div className="flex items-start gap-2 font-['Inter'] text-xs">
              <span className="material-symbols-outlined text-[15px] shrink-0 text-[#4cd7f6] mt-0.5">
                water_drop
              </span>
              <span className="text-[#dde3eb]">
                Consider irrigation cycle in <strong className="text-[#4cd7f6]">Zone B3</strong> (Mustard block).
              </span>
            </div>
            <div className="flex items-start gap-2 font-['Inter'] text-xs">
              <span className="material-symbols-outlined text-[15px] shrink-0 text-[#4edea3] mt-0.5">
                search_insights
              </span>
              <span className="text-[#dde3eb]">
                Deploy rover optical zoom to inspect foliage in <strong className="text-[#4edea3]">Zone C2</strong>.
              </span>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between border-t border-white/[0.06]">
            <span className="font-['JetBrains_Mono'] text-[9px] text-[#bbcabf] tracking-wide">
              DISCLAIMER: RECOMMENDATIONS BASED ON IOT HEURISTICS & NDVI IMAGERY.
            </span>
          </div>
        </div>
      </section>

      {/* 7. REAL-TIME ROVER CONTROL & DRIVE COCKPIT */}
      <section className="bg-[#1a2026] border border-white/[0.07] rounded-xl p-3 shadow-md flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-['Plus_Jakarta_Sans'] text-base sm:text-lg font-bold text-[#dde3eb]">
              Rover Drive Cockpit
            </div>
            <div className="font-['Inter'] text-xs text-[#bbcabf]">
              Low-latency dual-differential drive
            </div>
          </div>
          {/* Mode Selection */}
          <div className="flex items-center gap-1 bg-[#090f15] p-0.5 rounded-lg border border-white/[0.06]">
            <button
              onClick={() => {
                onUpdateTelemetry((prev) => ({ ...prev, driveMode: 'MANUAL' }));
                onToast('Switched to MANUAL direct keypad control');
              }}
              className={`px-2.5 py-0.5 rounded font-['JetBrains_Mono'] text-[11px] font-semibold transition-all ${
                telemetry.driveMode === 'MANUAL'
                  ? 'bg-[#4edea3] text-[#003824] shadow-sm'
                  : 'text-[#bbcabf] hover:text-white'
              }`}
            >
              MANUAL
            </button>
            <button
              onClick={() => {
                onUpdateTelemetry((prev) => ({ ...prev, driveMode: 'AUTO' }));
                onToast('Switched to AUTONOMOUS survey waypoint navigation');
              }}
              className={`px-2.5 py-0.5 rounded font-['JetBrains_Mono'] text-[11px] font-semibold transition-all ${
                telemetry.driveMode === 'AUTO'
                  ? 'bg-[#4cd7f6] text-[#003640] shadow-sm'
                  : 'text-[#bbcabf] hover:text-white'
              }`}
            >
              AUTO
            </button>
          </div>
        </div>

        {/* Directional Gamepad & Throttle / E-Stop */}
        <div className="grid grid-cols-2 gap-3 items-center">
          {/* Cross Controller Keypad */}
          <div className="flex flex-col items-center justify-center space-y-1 select-none">
            {/* Up */}
            <button
              onClick={() => handleKeyPress('UP')}
              className={`w-11 h-11 rounded-lg bg-[#252b31] hover:bg-[#343a40] text-[#dde3eb] flex items-center justify-center shadow transition-all border border-white/[0.08] active:scale-90 ${
                activeKey === 'UP' ? 'bg-[#4edea3] text-[#003824] shadow-[0_0_12px_#4edea3]' : ''
              }`}
              title="Drive Forward (↑)"
            >
              <span className="material-symbols-outlined">arrow_upward</span>
            </button>

            <div className="flex items-center gap-1">
              {/* Left */}
              <button
                onClick={() => handleKeyPress('LEFT')}
                className={`w-11 h-11 rounded-lg bg-[#252b31] hover:bg-[#343a40] text-[#dde3eb] flex items-center justify-center shadow transition-all border border-white/[0.08] active:scale-90 ${
                  activeKey === 'LEFT' ? 'bg-[#4edea3] text-[#003824] shadow-[0_0_12px_#4edea3]' : ''
                }`}
                title="Pivot Left (←)"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>

              {/* Stop / Neutral */}
              <button
                onClick={() => handleKeyPress('PAUSE')}
                className={`w-11 h-11 rounded-lg bg-[#090f15] hover:bg-[#161c22] text-[#ffb95f] flex items-center justify-center shadow font-['JetBrains_Mono'] text-[10px] font-bold tracking-wider border border-white/[0.08] active:scale-95 ${
                  activeKey === 'PAUSE' ? 'ring-2 ring-[#ffb95f]' : ''
                }`}
                title="Pause / Brake (Space)"
              >
                PAUSE
              </button>

              {/* Right */}
              <button
                onClick={() => handleKeyPress('RIGHT')}
                className={`w-11 h-11 rounded-lg bg-[#252b31] hover:bg-[#343a40] text-[#dde3eb] flex items-center justify-center shadow transition-all border border-white/[0.08] active:scale-90 ${
                  activeKey === 'RIGHT' ? 'bg-[#4edea3] text-[#003824] shadow-[0_0_12px_#4edea3]' : ''
                }`}
                title="Pivot Right (→)"
              >
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>

            {/* Down */}
            <button
              onClick={() => handleKeyPress('DOWN')}
              className={`w-11 h-11 rounded-lg bg-[#252b31] hover:bg-[#343a40] text-[#dde3eb] flex items-center justify-center shadow transition-all border border-white/[0.08] active:scale-90 ${
                activeKey === 'DOWN' ? 'bg-[#4edea3] text-[#003824] shadow-[0_0_12px_#4edea3]' : ''
              }`}
              title="Reverse (↓)"
            >
              <span className="material-symbols-outlined">arrow_downward</span>
            </button>
          </div>

          {/* Throttle & Emergency Stop Column */}
          <div className="flex flex-col justify-between h-full space-y-2">
            <div>
              <div className="flex items-center justify-between font-['JetBrains_Mono'] text-[10px] text-[#bbcabf] font-semibold mb-1">
                <span>MOTOR POWER</span>
                <span className="text-[#4edea3] font-bold">{telemetry.motorPowerPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={telemetry.motorPowerPercent}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onUpdateTelemetry((prev) => ({
                    ...prev,
                    motorPowerPercent: val,
                    speedMs: Number((val * 0.012).toFixed(1)),
                  }));
                }}
                className="w-full accent-[#4edea3] h-1.5 bg-[#252b31] rounded-lg cursor-pointer"
              />
            </div>

            {/* Return Home (RTH) */}
            <button
              onClick={onReturnHome}
              className="w-full py-1.5 rounded-lg bg-[#252b31] hover:bg-[#343a40] text-[#dde3eb] font-['JetBrains_Mono'] text-[11px] font-semibold flex items-center justify-center gap-1 active:scale-95 border border-white/[0.08] transition-all"
            >
              <span className="material-symbols-outlined text-[15px] text-[#ffb95f]">home</span>
              Return Home (RTH)
            </button>

            {/* EMERGENCY STOP BUTTON */}
            <button
              onClick={onEmergencyStop}
              className={`w-full py-2.5 rounded-lg font-['Plus_Jakarta_Sans'] text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1 shadow-lg active:scale-95 transition-all ${
                telemetry.status === 'ESTOP'
                  ? 'bg-[#4edea3] text-[#003824] animate-pulse shadow-[0_0_16px_#4edea3]'
                  : 'bg-[#93000a]/80 hover:bg-[#ef4444] text-[#ffdad6] border border-[#ef4444]/50 shadow-[0_0_16px_rgba(239,68,68,0.35)]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {telemetry.status === 'ESTOP' ? 'restart_alt' : 'gpp_bad'}
              </span>
              {telemetry.status === 'ESTOP' ? 'RESET E-STOP' : 'EMERGENCY STOP'}
            </button>
          </div>
        </div>

        {/* Real-time Peripheral IMU Telemetry Bar */}
        <div className="grid grid-cols-3 gap-2 pt-1 bg-[#090f15] p-2 rounded-lg font-['JetBrains_Mono'] text-[11px] border border-white/[0.04]">
          <div className="flex flex-col">
            <span className="text-[9px] text-[#bbcabf] font-semibold">MPU6050 ACCEL</span>
            <span className="text-[#dde3eb] mt-0.5">X: {telemetry.imu.x} Y: {telemetry.imu.y}</span>
            <span className="text-[#bbcabf] text-[10px]">Z: {telemetry.imu.z} m/s²</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-[#bbcabf] font-semibold">SONAR FRONT</span>
            <span className="text-[#4edea3] mt-0.5 font-bold">{telemetry.sonarFrontCm} cm</span>
            <span className="text-[#4edea3] text-[10px]">Clear Path</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-[#bbcabf] font-semibold">WI-FI RSSI</span>
            <span className="text-[#4cd7f6] mt-0.5">{telemetry.signalStrengthDbm} dBm</span>
            <span className="text-[#4cd7f6] text-[10px]">Link Solid</span>
          </div>
        </div>
      </section>

      {/* 8. RECENT ALERTS & QUICK ACTION RUNNERS */}
      <section className="flex flex-col space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-['Plus_Jakarta_Sans'] text-base sm:text-lg font-bold text-[#dde3eb]">
            Recent Alerts & Logs
          </span>
          <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-[#ffb4ab] tracking-wider">
            {unacknowledgedAlerts.length} UNACKNOWLEDGED
          </span>
        </div>

        {/* Alert Items */}
        <div className="space-y-2">
          {safeAlerts.slice(0, 2).map((alert) => (
            <div
              key={alert.id}
              className={`p-2.5 rounded-lg flex items-start justify-between shadow-sm border transition-all ${
                alert.severity === 'critical'
                  ? 'bg-[#93000a]/25 border-[#ef4444]/40'
                  : 'bg-[#1a2026] border-white/[0.06]'
              }`}
            >
              <div className="flex items-start gap-2.5 min-w-0 pr-2">
                <span
                  className={`material-symbols-outlined text-[18px] shrink-0 mt-0.5 ${
                    alert.severity === 'critical' ? 'text-[#ffb4ab]' : 'text-[#ffb95f]'
                  }`}
                >
                  {alert.severity === 'critical' ? 'warning' : 'notification_important'}
                </span>
                <div className="truncate">
                  <div
                    className={`font-['Inter'] text-sm font-semibold truncate ${
                      alert.severity === 'critical' ? 'text-[#ffb4ab]' : 'text-[#dde3eb]'
                    }`}
                  >
                    {alert.title}
                  </div>
                  <div className="font-['Inter'] text-xs text-[#bbcabf] line-clamp-2">
                    {alert.detail}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#bbcabf]">
                  {alert.timestamp}
                </span>
                {!alert.acknowledged && (
                  <button
                    onClick={() => onAcknowledgeAlert(alert.id)}
                    className="px-2 py-0.5 rounded bg-white/[0.08] hover:bg-white/[0.15] text-[10px] font-['JetBrains_Mono'] text-[#4edea3] font-semibold transition-all"
                  >
                    ACK
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Action Launchpad Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={handleStartSurvey}
            className="bg-[#252b31] hover:bg-[#343a40] text-[#dde3eb] p-2.5 rounded-xl flex items-center gap-2.5 border border-white/[0.08] active:scale-95 transition-all group"
          >
            <div className="p-2 rounded-lg bg-[#4edea3]/15 text-[#4edea3] flex items-center justify-center group-hover:bg-[#4edea3] group-hover:text-[#003824] transition-all">
              <span className="material-symbols-outlined text-[20px]">explore</span>
            </div>
            <div className="text-left">
              <div className="font-['JetBrains_Mono'] text-xs font-bold text-[#dde3eb]">
                START SURVEY
              </div>
              <div className="font-['Inter'] text-[11px] text-[#bbcabf]">Waypoint grid</div>
            </div>
          </button>

          <button
            onClick={handleCaptureNDVI}
            className="bg-[#252b31] hover:bg-[#343a40] text-[#dde3eb] p-2.5 rounded-xl flex items-center gap-2.5 border border-white/[0.08] active:scale-95 transition-all group"
          >
            <div className="p-2 rounded-lg bg-[#4cd7f6]/15 text-[#4cd7f6] flex items-center justify-center group-hover:bg-[#4cd7f6] group-hover:text-[#003640] transition-all">
              <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
            </div>
            <div className="text-left">
              <div className="font-['JetBrains_Mono'] text-xs font-bold text-[#dde3eb]">
                CAPTURE CROP
              </div>
              <div className="font-['Inter'] text-[11px] text-[#bbcabf]">Save raw NDVI</div>
            </div>
          </button>
        </div>

        {/* Activity Timeline Session Log */}
        <div className="bg-[#1a2026] border border-white/[0.06] rounded-xl p-3 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-[#bbcabf] tracking-wider">
              SESSION TELEMETRY LOG
            </span>
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#4edea3]">LIVE SYNC</span>
          </div>

          <div className="space-y-2 relative pl-2 border-l border-white/[0.08] ml-1">
            {safeMissionLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between text-xs relative pl-2.5">
                <span
                  className={`absolute -left-[13px] w-2 h-2 rounded-full ring-2 ring-[#1a2026] ${
                    log.category === 'primary'
                      ? 'bg-[#4edea3]'
                      : log.category === 'secondary'
                      ? 'bg-[#4cd7f6]'
                      : 'bg-[#bbcabf]'
                  }`}
                />
                <span className="text-[#dde3eb] font-['Inter']">{log.message}</span>
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#bbcabf] shrink-0 ml-2">
                  {log.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Crop Inspection Modal */}
      {selectedCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="bg-[#1a2026] border border-white/[0.1] rounded-2xl max-w-md w-full p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4edea3]">eco</span>
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-base text-white">
                  {selectedCrop.cropName} Diagnostic • {selectedCrop.zone}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCrop(null)}
                className="p-1 text-[#bbcabf] hover:text-white rounded-lg bg-white/[0.05]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="w-full h-44 rounded-xl overflow-hidden relative border border-white/[0.08]">
              <img
                src={selectedCrop.imageUrl}
                alt={selectedCrop.cropName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-2 left-2 bg-[#090f15]/85 px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] text-[#4edea3]">
                NDVI Index: {selectedCrop.chlorophyllIndex}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#252b31] p-2 rounded-lg">
                <span className="text-[#bbcabf]">Status:</span>
                <div className="font-['JetBrains_Mono'] font-bold text-[#4edea3] mt-0.5">
                  {selectedCrop.status} ({selectedCrop.healthPercent}%)
                </div>
              </div>
              <div className="bg-[#252b31] p-2 rounded-lg">
                <span className="text-[#bbcabf]">Last Scanned:</span>
                <div className="font-['JetBrains_Mono'] font-bold text-white mt-0.5">
                  {selectedCrop.lastScanned}
                </div>
              </div>
            </div>

            <p className="text-xs text-[#bbcabf] leading-relaxed">
              {selectedCrop.description}. Multispectral canopy reflectivity shows normal nitrogen uptake and balanced stomatal conductance.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  setSelectedCrop(null);
                  onOpenAdvisor(`Agronomy recommendations for ${selectedCrop.cropName} in ${selectedCrop.zone}`);
                }}
                className="flex-1 py-2 rounded-lg bg-[#4edea3] hover:bg-[#6ffbbe] text-[#003824] font-['JetBrains_Mono'] text-xs font-bold transition-all shadow"
              >
                Consult AI Agronomist
              </button>
              <button
                onClick={() => {
                  setSelectedCrop(null);
                  onToast(`Rover navigation route plotted to ${selectedCrop.zone}`);
                  onSelectTab('rover');
                }}
                className="px-3 py-2 rounded-lg bg-[#252b31] hover:bg-[#343a40] text-white font-['JetBrains_Mono'] text-xs transition-all"
              >
                Navigate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
