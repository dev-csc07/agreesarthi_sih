import React, { useState } from 'react';
import { SOIL_TRENDS_DATA } from '../data/mockData';
import { TelemetryState } from '../types';

interface SensorsViewProps {
  telemetry: TelemetryState;
  onToast: (msg: string) => void;
}

export const SensorsView: React.FC<SensorsViewProps> = ({ telemetry, onToast }) => {
  const [selectedDepth, setSelectedDepth] = useState<'10cm' | '30cm' | '60cm'>('30cm');
  const [activeTab, setActiveTab] = useState<'trends' | 'layers' | 'calibration'>('trends');

  const depthData = {
    '10cm': { label: 'Surface Root Layer', vwc: 38.4, temp: 28.6, ec: 1.08, status: 'Rapid Evaporation Zone' },
    '30cm': { label: 'Active Taproot Horizon', vwc: telemetry.soilMoistureVwc, temp: telemetry.soilTempC, ec: telemetry.soilEc, status: 'Optimal Uptake Zone' },
    '60cm': { label: 'Deep Subsoil Moisture Buffer', vwc: 46.2, temp: 23.8, ec: 1.28, status: 'Hydraulic Reserve Reservoir' },
  };

  const handleCalibrate = () => {
    onToast('⚙️ Modbus RTU RS-485 Soil Spectrometer auto-calibrated successfully!');
  };

  return (
    <div className="flex flex-col w-full space-y-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="font-['Plus_Jakarta_Sans'] text-xl sm:text-2xl font-bold text-[#dde3eb]">
            Subsurface Sensor Telemetry
          </h2>
          <p className="font-['Inter'] text-xs text-[#bbcabf]">
            Modbus-RTU Multi-Depth Penetrometer & Optical NPK Spectrometer
          </p>
        </div>
        <button
          onClick={handleCalibrate}
          className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-[#252b31] hover:bg-[#343a40] text-xs font-['JetBrains_Mono'] text-[#4edea3] font-semibold border border-white/[0.08] flex items-center gap-1.5 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[16px]">tune</span>
          Auto-Calibrate Bus
        </button>
      </div>

      {/* Primary Telemetry Metrics (4 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#1a2026] border border-white/[0.07] rounded-xl p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-['JetBrains_Mono'] text-[11px] text-[#bbcabf] font-semibold">SOIL MOISTURE</span>
            <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">water_drop</span>
          </div>
          <div className="my-2">
            <div className="font-['JetBrains_Mono'] text-3xl font-bold text-[#4cd7f6]">
              {telemetry.soilMoistureVwc.toFixed(1)}%
            </div>
            <div className="text-xs text-[#4edea3] font-medium">Volumetric Water Content</div>
          </div>
          <div className="w-full bg-[#252b31] rounded-full h-1.5">
            <div className="bg-[#4cd7f6] h-full rounded-full" style={{ width: `${telemetry.soilMoistureVwc}%` }} />
          </div>
        </div>

        <div className="bg-[#1a2026] border border-white/[0.07] rounded-xl p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-['JetBrains_Mono'] text-[11px] text-[#bbcabf] font-semibold">SOIL TEMP</span>
            <span className="material-symbols-outlined text-[#ffb95f] text-[18px]">thermostat</span>
          </div>
          <div className="my-2">
            <div className="font-['JetBrains_Mono'] text-3xl font-bold text-[#dde3eb]">
              {telemetry.soilTempC.toFixed(1)}°C
            </div>
            <div className="text-xs text-[#bbcabf]">Subsurface Temperature</div>
          </div>
          <div className="w-full bg-[#252b31] rounded-full h-1.5">
            <div className="bg-[#ffb95f] h-full rounded-full" style={{ width: `${(telemetry.soilTempC / 45) * 100}%` }} />
          </div>
        </div>

        <div className="bg-[#1a2026] border border-white/[0.07] rounded-xl p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-['JetBrains_Mono'] text-[11px] text-[#bbcabf] font-semibold">SOIL PH</span>
            <span className="material-symbols-outlined text-[#4edea3] text-[18px]">science</span>
          </div>
          <div className="my-2">
            <div className="font-['JetBrains_Mono'] text-3xl font-bold text-[#4edea3]">
              {telemetry.soilPh.toFixed(1)}
            </div>
            <div className="text-xs text-[#bbcabf]">Slightly Acidic (Target 6.5)</div>
          </div>
          <div className="w-full bg-[#252b31] rounded-full h-1.5">
            <div className="bg-[#4edea3] h-full rounded-full" style={{ width: `${(telemetry.soilPh / 10) * 100}%` }} />
          </div>
        </div>

        <div className="bg-[#1a2026] border border-white/[0.07] rounded-xl p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-['JetBrains_Mono'] text-[11px] text-[#bbcabf] font-semibold">EC CONDUCTIVITY</span>
            <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">electric_meter</span>
          </div>
          <div className="my-2">
            <div className="font-['JetBrains_Mono'] text-3xl font-bold text-[#dde3eb]">
              {telemetry.soilEc.toFixed(1)} <span className="text-xs font-normal text-[#bbcabf]">mS/cm</span>
            </div>
            <div className="text-xs text-[#4edea3]">Fertility Salinity Nominal</div>
          </div>
          <div className="w-full bg-[#252b31] rounded-full h-1.5">
            <div className="bg-[#4cd7f6] h-full rounded-full" style={{ width: '48%' }} />
          </div>
        </div>
      </div>

      {/* Multi-Depth Layer Horizon Analysis */}
      <div className="bg-[#1a2026] border border-white/[0.07] rounded-xl p-4 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-base text-[#dde3eb]">
              Multi-Depth Stratification Profile
            </h3>
            <p className="text-xs text-[#bbcabf]">
              Modbus digital probe depth readings across soil horizon
            </p>
          </div>
          <div className="flex items-center gap-1 bg-[#090f15] p-1 rounded-lg border border-white/[0.06]">
            {(['10cm', '30cm', '60cm'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDepth(d)}
                className={`px-3 py-1 rounded-md text-xs font-['JetBrains_Mono'] font-semibold transition-all ${
                  selectedDepth === d
                    ? 'bg-[#4edea3] text-[#003824]'
                    : 'text-[#bbcabf] hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 bg-[#252b31] rounded-xl border border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#4edea3]/15 text-[#4edea3] flex items-center justify-center font-['JetBrains_Mono'] font-bold text-base border border-[#4edea3]/30">
              {selectedDepth}
            </div>
            <div>
              <div className="font-['Inter'] font-semibold text-sm text-[#dde3eb]">
                {depthData[selectedDepth].label}
              </div>
              <div className="text-xs text-[#4edea3]">
                {depthData[selectedDepth].status}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-['JetBrains_Mono']">
            <div>
              <span className="text-[#bbcabf] block">Moisture:</span>
              <span className="text-[#4cd7f6] font-bold text-base">{depthData[selectedDepth].vwc.toFixed(1)}% VWC</span>
            </div>
            <div>
              <span className="text-[#bbcabf] block">Temp:</span>
              <span className="text-[#ffb95f] font-bold text-base">{depthData[selectedDepth].temp.toFixed(1)}°C</span>
            </div>
            <div>
              <span className="text-[#bbcabf] block">EC:</span>
              <span className="text-white font-bold text-base">{depthData[selectedDepth].ec.toFixed(2)} mS/cm</span>
            </div>
          </div>
        </div>
      </div>

      {/* NPK Detailed Optical Spectrometry */}
      <div className="bg-[#1a2026] border border-white/[0.07] rounded-xl p-4 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4edea3]">compost</span>
            <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-base text-[#dde3eb]">
              NPK Macro-Nutrient Optical Spectra (mg/kg)
            </h3>
          </div>
          <span className="text-xs font-['JetBrains_Mono'] text-[#4cd7f6]">ISO-11263 ACCURACY</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-[#252b31] p-3 rounded-xl border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-['JetBrains_Mono'] text-xs font-bold text-[#4edea3]">NITROGEN (N)</span>
              <span className="text-xs text-[#4edea3] font-semibold">OPTIMAL</span>
            </div>
            <div className="font-['JetBrains_Mono'] text-2xl font-bold text-white">
              {telemetry.npk.n} <span className="text-xs font-normal text-[#bbcabf]">mg/kg</span>
            </div>
            <p className="text-[11px] text-[#bbcabf]">Target: 35-50 mg/kg. Essential for vegetative shoot expansion.</p>
          </div>

          <div className="bg-[#252b31] p-3 rounded-xl border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-['JetBrains_Mono'] text-xs font-bold text-[#4cd7f6]">PHOSPHORUS (P)</span>
              <span className="text-xs text-[#4cd7f6] font-semibold">NOMINAL</span>
            </div>
            <div className="font-['JetBrains_Mono'] text-2xl font-bold text-white">
              {telemetry.npk.p} <span className="text-xs font-normal text-[#bbcabf]">mg/kg</span>
            </div>
            <p className="text-[11px] text-[#bbcabf]">Target: 25-35 mg/kg. Crucial for root development and seed set.</p>
          </div>

          <div className="bg-[#252b31] p-3 rounded-xl border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-['JetBrains_Mono'] text-xs font-bold text-[#ffb95f]">POTASSIUM (K)</span>
              <span className="text-xs text-[#ffb95f] font-semibold">ABUNDANT</span>
            </div>
            <div className="font-['JetBrains_Mono'] text-2xl font-bold text-white">
              {telemetry.npk.k} <span className="text-xs font-normal text-[#bbcabf]">mg/kg</span>
            </div>
            <p className="text-[11px] text-[#bbcabf]">Target: 40-60 mg/kg. Regulates cell turgor and drought tolerance.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
