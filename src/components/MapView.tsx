import React, { useState } from 'react';
import { TelemetryState } from '../types';

interface MapViewProps {
  telemetry: TelemetryState;
  onToast: (msg: string) => void;
}

export const MapView: React.FC<MapViewProps> = ({ telemetry, onToast }) => {
  const [activeLayer, setActiveLayer] = useState<'standard' | 'ndvi' | 'moisture'>('ndvi');
  const [selectedZone, setSelectedZone] = useState<string | null>('Zone A');
  const [waypoints, setWaypoints] = useState<{ id: number; x: number; y: number; label: string }[]>([
    { id: 1, x: 70, y: 55, label: 'WP-1' },
    { id: 2, x: 130, y: 75, label: 'WP-2' },
    { id: 3, x: 190, y: 65, label: 'WP-3' },
    { id: 4, x: 230, y: 110, label: 'WP-4' },
  ]);

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 300);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 200);

    const newId = waypoints.length + 1;
    setWaypoints((prev) => [...prev, { id: newId, x, y, label: `WP-${newId}` }]);
    onToast(`📍 Waypoint WP-${newId} placed at coordinates [X:${x}, Y:${y}]`);
  };

  const handleClearWaypoints = () => {
    setWaypoints([]);
    onToast('Cleared all mission survey waypoints');
  };

  return (
    <div className="flex flex-col w-full space-y-4 pb-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="font-['Plus_Jakarta_Sans'] text-xl sm:text-2xl font-bold text-[#dde3eb]">
            Field Radar & Spatial GIS
          </h2>
          <p className="font-['Inter'] text-xs text-[#bbcabf]">
            Sector North • 18.2 Total Survey Acres • Centimeter-Level RTK GNSS Lock
          </p>
        </div>

        {/* Map Layers Switcher */}
        <div className="flex items-center gap-1 bg-[#1a2026] p-1 rounded-xl border border-white/[0.08] self-start sm:self-auto">
          {[
            { id: 'standard', label: 'TACTICAL' },
            { id: 'ndvi', label: 'NDVI VIGOR' },
            { id: 'moisture', label: 'MOISTURE' },
          ].map((layer) => (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id as any)}
              className={`px-3 py-1 rounded-lg font-['JetBrains_Mono'] text-[11px] font-semibold transition-all ${
                activeLayer === layer.id
                  ? 'bg-[#4edea3] text-[#003824] shadow-sm'
                  : 'text-[#bbcabf] hover:text-white'
              }`}
            >
              {layer.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Map Canvas */}
      <div className="relative w-full h-[380px] sm:h-[480px] rounded-2xl overflow-hidden bg-[#090f15] border border-white/[0.08] shadow-2xl select-none">
        <svg
          onClick={handleMapClick}
          className="w-full h-full cursor-crosshair"
          viewBox="0 0 300 200"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="gridLarge" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.8" />
            </pattern>
            {/* NDVI Gradients */}
            <linearGradient id="ndviGradA" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.25" />
            </linearGradient>
            <linearGradient id="ndviGradB" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffb95f" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="ndviGradC" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Grid Background */}
          <rect width="100%" height="100%" fill="#0a0f14" />
          <rect width="100%" height="100%" fill="url(#gridLarge)" />

          {/* Agricultural Polygon Zones */}
          {/* Zone A: Wheat Block */}
          <polygon
            points="15,20 135,15 120,110 20,95"
            fill={activeLayer === 'moisture' ? 'rgba(76,215,246,0.35)' : 'url(#ndviGradA)'}
            stroke="#10b981"
            strokeWidth={selectedZone === 'Zone A' ? '2.5' : '1.5'}
            strokeDasharray="4,2"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedZone('Zone A');
            }}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          />
          <text x="35" y="55" fill="#4edea3" fontFamily="JetBrains Mono" fontSize="10" fontWeight="700">
            ZONE A [WHEAT • 92%]
          </text>

          {/* Zone B: Mustard Block */}
          <polygon
            points="145,25 285,30 270,115 130,120"
            fill={activeLayer === 'moisture' ? 'rgba(255,185,95,0.35)' : 'url(#ndviGradB)'}
            stroke="#ffb95f"
            strokeWidth={selectedZone === 'Zone B' ? '2.5' : '1.5'}
            strokeDasharray="4,2"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedZone('Zone B');
            }}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          />
          <text x="155" y="65" fill="#ffb95f" fontFamily="JetBrains Mono" fontSize="10" fontWeight="700">
            ZONE B [MUSTARD • 64%]
          </text>

          {/* Zone C: Fallow / Lower Moisture */}
          <polygon
            points="40,125 260,135 240,185 30,180"
            fill={activeLayer === 'moisture' ? 'rgba(239,68,68,0.35)' : 'url(#ndviGradC)'}
            stroke="#ffb4ab"
            strokeWidth={selectedZone === 'Zone C' ? '2.5' : '1.5'}
            strokeDasharray="4,2"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedZone('Zone C');
            }}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          />
          <text x="80" y="165" fill="#ffb4ab" fontFamily="JetBrains Mono" fontSize="10" fontWeight="700">
            ZONE C [CLAY SUBSTRATE • 18% VWC]
          </text>

          {/* Irrigation Main Pipeline */}
          <polyline
            points="10,10 135,15 140,80 130,190"
            fill="none"
            stroke="#4cd7f6"
            strokeWidth="1.5"
            strokeDasharray="2,2"
          />

          {/* Planned Mission Waypoint Polyline */}
          {waypoints.length > 1 && (
            <polyline
              points={waypoints.map((w) => `${w.x},${w.y}`).join(' ')}
              fill="none"
              stroke="#4edea3"
              strokeWidth="2"
              strokeDasharray="4,3"
            />
          )}

          {/* Waypoint Markers */}
          {waypoints.map((wp) => (
            <g key={wp.id} transform={`translate(${wp.x}, ${wp.y})`}>
              <circle r="6" fill="#4edea3" />
              <circle r="3" fill="#003824" />
              <text x="8" y="4" fill="#dde3eb" fontFamily="JetBrains Mono" fontSize="9" fontWeight="600">
                {wp.label}
              </text>
            </g>
          ))}

          {/* Rover Live Position Indicator */}
          <g transform="translate(85, 70)">
            <circle r="18" fill="rgba(78, 222, 163, 0.2)" className="animate-ping" />
            <circle r="8" fill="#4edea3" />
            <circle r="3.5" fill="#003824" />
            <line x1="0" y1="0" x2="14" y2="-10" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            <text x="12" y="18" fill="#4edea3" fontFamily="JetBrains Mono" fontSize="9" fontWeight="700">
              ROVER-001 (ACTIVE)
            </text>
          </g>
        </svg>

        {/* Tactical Top Bar Inset */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
          <div className="bg-[#1a2026]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/[0.08] shadow text-xs font-['JetBrains_Mono']">
            <span className="text-[#4cd7f6] font-semibold">
              LAT: {telemetry.gps.lat.toFixed(6)}° N • LNG: {telemetry.gps.lng.toFixed(6)}° E
            </span>
          </div>
          <div className="bg-[#1a2026]/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/[0.08] shadow text-xs font-['JetBrains_Mono'] text-[#dde3eb] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#4edea3] text-[15px]">satellite_alt</span>
            <span>{telemetry.gps.satellites} SATS • RTK FIX (±1.8cm)</span>
          </div>
        </div>

        {/* Map Legend Overlay */}
        <div className="absolute bottom-3 left-3 bg-[#1a2026]/90 backdrop-blur-md p-2.5 rounded-xl border border-white/[0.08] text-xs font-['JetBrains_Mono'] space-y-1">
          <div className="text-[10px] text-[#bbcabf] font-semibold">LAYER: {activeLayer.toUpperCase()}</div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#10b981]" />
            <span>Optimal (NDVI &gt; 0.8)</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#ffb95f]" />
            <span>Moderate Stress (0.5 - 0.7)</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#ef4444]" />
            <span>Severe Moisture Deficit</span>
          </div>
        </div>

        {/* Map Action Buttons */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <button
            onClick={handleClearWaypoints}
            className="bg-[#252b31]/90 hover:bg-[#343a40] text-[#dde3eb] px-3 py-1.5 rounded-lg font-['JetBrains_Mono'] text-xs font-semibold border border-white/[0.08] active:scale-95 transition-all"
          >
            Clear Waypoints
          </button>
          <button
            onClick={() => onToast('🚀 Autonomous survey mission sent to ROVER-001 autopilot!')}
            className="bg-[#4edea3] hover:bg-[#6ffbbe] text-[#003824] px-3 py-1.5 rounded-lg font-['JetBrains_Mono'] text-xs font-bold flex items-center gap-1.5 shadow active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">navigation</span>
            Dispatch Mission
          </button>
        </div>
      </div>

      {/* Zone Details & Mission Specs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-[#1a2026] border border-white/[0.07] rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-['JetBrains_Mono'] text-[#4edea3] font-semibold">ZONE A3 (Wheat)</span>
            <span className="text-xs bg-[#4edea3]/20 text-[#4edea3] px-2 py-0.5 rounded font-bold">OPTIMAL</span>
          </div>
          <p className="text-xs text-[#bbcabf]">
            Area: 6.8 Acres. Stomatal index high. Chlorophyll density measured at 92%. Subsurface irrigation nominal.
          </p>
        </div>

        <div className="bg-[#1a2026] border border-white/[0.07] rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-['JetBrains_Mono'] text-[#ffb95f] font-semibold">ZONE B3 (Mustard)</span>
            <span className="text-xs bg-[#ffb95f]/20 text-[#ffb95f] px-2 py-0.5 rounded font-bold">ATTENTION</span>
          </div>
          <p className="text-xs text-[#bbcabf]">
            Area: 5.2 Acres. Moisture deficit warning. VWC at 18%. Drip fertigation scheduled for 18:00 hrs.
          </p>
        </div>

        <div className="bg-[#1a2026] border border-white/[0.07] rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-['JetBrains_Mono'] text-[#4cd7f6] font-semibold">ZONE C2 (Barley)</span>
            <span className="text-xs bg-[#4cd7f6]/20 text-[#4cd7f6] px-2 py-0.5 rounded font-bold">HEALTHY</span>
          </div>
          <p className="text-xs text-[#bbcabf]">
            Area: 6.2 Acres. Canopy coverage 88%. Nitrogen concentration 42 mg/kg. Uniform emergence verified.
          </p>
        </div>
      </div>
    </div>
  );
};
