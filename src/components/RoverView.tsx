import React, { useState, useEffect } from 'react';
import { ASSETS } from '../data/mockData';
import { TelemetryState } from '../types';

interface RoverViewProps {
  telemetry: TelemetryState;
  onUpdateTelemetry: (updater: (prev: TelemetryState) => TelemetryState) => void;
  onDriveCommand: (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'PAUSE') => void;
  onEmergencyStop: () => void;
  onReturnHome: () => void;
  onToast: (msg: string) => void;
}

export const RoverView: React.FC<RoverViewProps> = ({
  telemetry,
  onUpdateTelemetry,
  onDriveCommand,
  onEmergencyStop,
  onReturnHome,
  onToast,
}) => {
  const [activeFeed, setActiveFeed] = useState<'optical' | 'lidar' | 'split'>('optical');
  const [gimbalPan, setGimbalPan] = useState(0); // -90 to +90
  const [gimbalTilt, setGimbalTilt] = useState(15); // -30 to +60
  const [sprayerActive, setSprayerActive] = useState(false);
  const [probeActive, setProbeActive] = useState(false);
  const [uvLampActive, setUvLampActive] = useState(false);
  const [lightsActive, setLightsActive] = useState(true);

  // Keyboard driving event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        onDriveCommand('UP');
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        onDriveCommand('DOWN');
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        onDriveCommand('LEFT');
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        onDriveCommand('RIGHT');
      } else if (e.code === 'Space') {
        e.preventDefault();
        onDriveCommand('PAUSE');
      } else if (e.code === 'Escape') {
        e.preventDefault();
        onEmergencyStop();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDriveCommand, onEmergencyStop]);

  const toggleSprayer = () => {
    setSprayerActive((prev) => {
      const next = !prev;
      onToast(next ? '💦 Precision Micro-Sprayer NOZZLES ACTIVATED' : '🛑 Sprayer NOZZLES OFF');
      return next;
    });
  };

  const toggleProbe = () => {
    setProbeActive((prev) => {
      const next = !prev;
      onToast(next ? '⛏️ Subsurface Modbus Soil Penetrometer DRILLING (30cm)' : '⬆️ Soil Penetrometer RETRACTED');
      return next;
    });
  };

  return (
    <div className="flex flex-col w-full space-y-4 pb-12">
      {/* Header Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-['Plus_Jakarta_Sans'] text-xl sm:text-2xl font-bold text-[#dde3eb]">
            Rover Drive Cockpit
          </h2>
          <p className="font-['Inter'] text-xs text-[#bbcabf]">
            ROVER-001 Dual-Differential Field Telemetry & Actuation Deck
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-[#161c22] px-3 py-1 rounded-full border border-white/[0.08]">
          <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse" />
          <span className="font-['JetBrains_Mono'] text-xs font-semibold text-[#4edea3]">
            {telemetry.status}
          </span>
        </div>
      </div>

      {/* Main Visual Stage (Optical Cam / LiDAR Stream) */}
      <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-[#090f15] border border-white/[0.08] shadow-2xl">
        {activeFeed === 'optical' ? (
          <img
            src={ASSETS.opticalCam}
            alt="Rover optical camera live stream"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          /* Simulated LiDAR / Depth Point Cloud */
          <div className="w-full h-full bg-[#05080c] flex items-center justify-center relative overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 400 300">
              <defs>
                <radialGradient id="lidarScanGrad" cx="50%" cy="80%" r="70%">
                  <stop offset="0%" stopColor="#4edea3" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#4cd7f6" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
                </radialGradient>
              </defs>
              <rect width="100%" height="100%" fill="#05080c" />
              {/* Distance Rings */}
              <circle cx="200" cy="240" r="60" fill="none" stroke="rgba(78,222,163,0.3)" strokeDasharray="3,3" />
              <circle cx="200" cy="240" r="120" fill="none" stroke="rgba(78,222,163,0.2)" strokeDasharray="4,4" />
              <circle cx="200" cy="240" r="180" fill="none" stroke="rgba(78,222,163,0.1)" />
              <path d="M 200 240 L 80 40 M 200 240 L 320 40" stroke="rgba(78,222,163,0.2)" strokeWidth="1" />
              <polygon points="200,240 80,40 320,40" fill="url(#lidarScanGrad)" />
              {/* Obstacle clusters */}
              <circle cx="240" cy="190" r="8" fill="#ffb95f" className="animate-pulse" />
              <text x="252" y="194" fill="#ffb95f" fontSize="10" fontFamily="JetBrains Mono">
                Obstacle 45cm
              </text>
              <circle cx="140" cy="110" r="5" fill="#4edea3" />
              <circle cx="280" cy="120" r="6" fill="#4edea3" />
              {/* Rover Center Node */}
              <circle cx="200" cy="240" r="8" fill="#4edea3" />
            </svg>
          </div>
        )}

        {/* HUD Inset Overlays */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <div className="bg-[#090f15]/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/[0.08] flex items-center gap-1.5 text-xs font-['JetBrains_Mono']">
            <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse" />
            <span className="text-[#ffdad6] font-semibold">REC • 1080p @ 30FPS</span>
          </div>
          <div className="bg-[#090f15]/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/[0.08] text-xs font-['JetBrains_Mono'] text-[#4cd7f6]">
            LATENCY: 42ms
          </div>
        </div>

        {/* Feed Switcher (Optical vs LiDAR) */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#090f15]/85 backdrop-blur-md p-1 rounded-lg border border-white/[0.08]">
          <button
            onClick={() => setActiveFeed('optical')}
            className={`px-2.5 py-0.5 rounded text-[11px] font-['JetBrains_Mono'] font-semibold transition-all ${
              activeFeed === 'optical'
                ? 'bg-[#4edea3] text-[#003824]'
                : 'text-[#bbcabf] hover:text-white'
            }`}
          >
            OPTICAL
          </button>
          <button
            onClick={() => setActiveFeed('lidar')}
            className={`px-2.5 py-0.5 rounded text-[11px] font-['JetBrains_Mono'] font-semibold transition-all ${
              activeFeed === 'lidar'
                ? 'bg-[#4edea3] text-[#003824]'
                : 'text-[#bbcabf] hover:text-white'
            }`}
          >
            LiDAR RADAR
          </button>
        </div>

        {/* Gimbal Position Tag */}
        <div className="absolute bottom-3 left-3 bg-[#090f15]/85 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/[0.08] text-xs font-['JetBrains_Mono'] text-[#bbcabf]">
          GIMBAL: Pan {gimbalPan}° • Tilt {gimbalTilt}°
        </div>

        {/* Quick Snapshot Action */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
          <button
            onClick={() => onToast('📸 Snapshot captured and saved to Farm Media Library')}
            className="bg-[#1a2026]/90 hover:bg-[#252b31] p-2 rounded-lg text-white border border-white/[0.1] active:scale-95 transition-all shadow"
            title="Take Photo"
          >
            <span className="material-symbols-outlined text-[18px]">photo_camera</span>
          </button>
          <button
            onClick={() => onToast('🔦 High-intensity LED headlights toggled')}
            className={`p-2 rounded-lg border border-white/[0.1] active:scale-95 transition-all shadow ${
              lightsActive ? 'bg-[#ffb95f] text-[#472a00]' : 'bg-[#1a2026]/90 text-white'
            }`}
            title="Toggle Headlights"
          >
            <span className="material-symbols-outlined text-[18px]">light_mode</span>
          </button>
        </div>
      </div>

      {/* Control Deck: Driving + Motor + Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Driving Pad & Keypad */}
        <div className="bg-[#1a2026] border border-white/[0.07] rounded-xl p-3.5 space-y-3 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#dde3eb]">
              Manual Directional Pad
            </span>
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#bbcabf]">
              Keyboard: WASD / Arrows
            </span>
          </div>

          <div className="flex flex-col items-center justify-center space-y-1.5 py-1">
            <button
              onClick={() => onDriveCommand('UP')}
              className="w-12 h-12 rounded-xl bg-[#252b31] hover:bg-[#343a40] active:bg-[#4edea3] active:text-[#003824] text-white flex items-center justify-center shadow transition-all border border-white/[0.08] active:scale-90"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_upward</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onDriveCommand('LEFT')}
                className="w-12 h-12 rounded-xl bg-[#252b31] hover:bg-[#343a40] active:bg-[#4edea3] active:text-[#003824] text-white flex items-center justify-center shadow transition-all border border-white/[0.08] active:scale-90"
              >
                <span className="material-symbols-outlined text-[24px]">arrow_back</span>
              </button>

              <button
                onClick={() => onDriveCommand('PAUSE')}
                className="w-12 h-12 rounded-xl bg-[#090f15] hover:bg-[#161c22] text-[#ffb95f] flex items-center justify-center shadow font-['JetBrains_Mono'] text-xs font-bold border border-white/[0.08] active:scale-95"
              >
                BRAKE
              </button>

              <button
                onClick={() => onDriveCommand('RIGHT')}
                className="w-12 h-12 rounded-xl bg-[#252b31] hover:bg-[#343a40] active:bg-[#4edea3] active:text-[#003824] text-white flex items-center justify-center shadow transition-all border border-white/[0.08] active:scale-90"
              >
                <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
              </button>
            </div>

            <button
              onClick={() => onDriveCommand('DOWN')}
              className="w-12 h-12 rounded-xl bg-[#252b31] hover:bg-[#343a40] active:bg-[#4edea3] active:text-[#003824] text-white flex items-center justify-center shadow transition-all border border-white/[0.08] active:scale-90"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_downward</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-[#bbcabf] pt-1 border-t border-white/[0.06]">
            <span>Drive Mode: <strong className="text-[#4edea3]">{telemetry.driveMode}</strong></span>
            <span>Speed: <strong className="text-white font-['JetBrains_Mono']">{telemetry.speedMs} m/s</strong></span>
          </div>
        </div>

        {/* Motor Throttle & Emergency Controls */}
        <div className="bg-[#1a2026] border border-white/[0.07] rounded-xl p-3.5 space-y-3 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#dde3eb]">
              Powertrain & Safety
            </span>
            <span className="font-['JetBrains_Mono'] text-xs font-bold text-[#4edea3]">
              {telemetry.motorPowerPercent}% Power
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#bbcabf]">
              <span>Motor Throttle</span>
              <span className="font-['JetBrains_Mono']">{Math.round(telemetry.motorPowerPercent * 2.8)} RPM</span>
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
              className="w-full accent-[#4edea3] h-2 bg-[#252b31] rounded-lg cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-[#252b31] p-2 rounded-lg">
              <span className="text-[#bbcabf]">Left Hub Motor:</span>
              <div className="font-['JetBrains_Mono'] font-bold text-[#dde3eb] mt-0.5">
                {Math.round(telemetry.motorPowerPercent * 2.8)} RPM • 34°C
              </div>
            </div>
            <div className="bg-[#252b31] p-2 rounded-lg">
              <span className="text-[#bbcabf]">Right Hub Motor:</span>
              <div className="font-['JetBrains_Mono'] font-bold text-[#dde3eb] mt-0.5">
                {Math.round(telemetry.motorPowerPercent * 2.8)} RPM • 35°C
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={onReturnHome}
              className="w-full py-2 rounded-lg bg-[#252b31] hover:bg-[#343a40] text-[#dde3eb] font-['JetBrains_Mono'] text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/[0.08] transition-all"
            >
              <span className="material-symbols-outlined text-[16px] text-[#ffb95f]">home</span>
              Engage Return Home (RTH)
            </button>

            <button
              onClick={onEmergencyStop}
              className={`w-full py-2.5 rounded-lg font-['Plus_Jakarta_Sans'] text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all shadow-lg ${
                telemetry.status === 'ESTOP'
                  ? 'bg-[#4edea3] text-[#003824] animate-pulse'
                  : 'bg-[#93000a] hover:bg-[#ef4444] text-[#ffdad6] border border-[#ef4444]/40'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {telemetry.status === 'ESTOP' ? 'restart_alt' : 'gpp_bad'}
              </span>
              {telemetry.status === 'ESTOP' ? 'RELEASE E-STOP INTERLOCK' : 'HARD EMERGENCY STOP'}
            </button>
          </div>
        </div>

        {/* Agricultural Actuation Payloads */}
        <div className="bg-[#1a2026] border border-white/[0.07] rounded-xl p-3.5 space-y-3 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#dde3eb]">
              Smart Field Payloads
            </span>
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#4cd7f6]">
              CAN-BUS v2.0
            </span>
          </div>

          <div className="space-y-2">
            {/* Sprayer */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#252b31] border border-white/[0.04]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">vaccines</span>
                <div>
                  <div className="text-xs font-semibold text-white">Target Sprayer</div>
                  <div className="text-[10px] text-[#bbcabf]">Liquid micronutrient nozzle</div>
                </div>
              </div>
              <button
                onClick={toggleSprayer}
                className={`px-3 py-1 rounded-md text-[11px] font-['JetBrains_Mono'] font-bold transition-all ${
                  sprayerActive ? 'bg-[#4cd7f6] text-[#003640]' : 'bg-[#1a2026] text-[#bbcabf]'
                }`}
              >
                {sprayerActive ? 'ACTIVE' : 'OFF'}
              </button>
            </div>

            {/* Soil Penetrometer */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#252b31] border border-white/[0.04]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ffb95f] text-[18px]">science</span>
                <div>
                  <div className="text-xs font-semibold text-white">Modbus Soil Probe</div>
                  <div className="text-[10px] text-[#bbcabf]">Depth automated linear servo</div>
                </div>
              </div>
              <button
                onClick={toggleProbe}
                className={`px-3 py-1 rounded-md text-[11px] font-['JetBrains_Mono'] font-bold transition-all ${
                  probeActive ? 'bg-[#ffb95f] text-[#472a00]' : 'bg-[#1a2026] text-[#bbcabf]'
                }`}
              >
                {probeActive ? 'DOWN' : 'UP'}
              </button>
            </div>

            {/* Gimbal Controls */}
            <div className="p-2 rounded-lg bg-[#252b31] border border-white/[0.04] space-y-1.5">
              <div className="flex items-center justify-between text-xs text-[#bbcabf]">
                <span>Gimbal Pan/Tilt:</span>
                <span className="font-['JetBrains_Mono'] text-white">P: {gimbalPan}° T: {gimbalTilt}°</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setGimbalPan((p) => Math.max(-90, p - 15))}
                  className="flex-1 py-1 rounded bg-[#1a2026] text-xs font-['JetBrains_Mono'] text-white hover:bg-[#343a40]"
                >
                  Pan Left
                </button>
                <button
                  onClick={() => {
                    setGimbalPan(0);
                    setGimbalTilt(15);
                  }}
                  className="px-2 py-1 rounded bg-[#1a2026] text-xs font-['JetBrains_Mono'] text-[#ffb95f] hover:bg-[#343a40]"
                >
                  Reset
                </button>
                <button
                  onClick={() => setGimbalPan((p) => Math.min(90, p + 15))}
                  className="flex-1 py-1 rounded bg-[#1a2026] text-xs font-['JetBrains_Mono'] text-white hover:bg-[#343a40]"
                >
                  Pan Right
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[#090f15] p-2 rounded-lg text-center font-['JetBrains_Mono'] text-xs text-[#4edea3]">
            Battery: {telemetry.batteryVoltage}V (Cell 1: 4.02V • Cell 2: 4.04V • Cell 3: 4.04V)
          </div>
        </div>
      </div>
    </div>
  );
};
