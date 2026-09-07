import React from 'react';
import { ASSETS } from '../data/mockData';
import { TelemetryState } from '../types';

interface MenuViewProps {
  telemetry: TelemetryState;
  onToast: (msg: string) => void;
  onOpenAdvisor: () => void;
}

export const MenuView: React.FC<MenuViewProps> = ({ telemetry, onToast, onOpenAdvisor }) => {
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(telemetry, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `agreesarthi_telemetry_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onToast('📥 Telemetry JSON exported successfully!');
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'roverId,status,batteryPercent,batteryVoltage,lat,lng,speedMs,soilMoistureVwc,soilTempC,soilPh,soilEc,nitrogen,phosphorus,potassium\n' +
      `${telemetry.roverId},${telemetry.status},${telemetry.batteryPercent},${telemetry.batteryVoltage},${telemetry.gps.lat},${telemetry.gps.lng},${telemetry.speedMs},${telemetry.soilMoistureVwc},${telemetry.soilTempC},${telemetry.soilPh},${telemetry.soilEc},${telemetry.npk.n},${telemetry.npk.p},${telemetry.npk.k}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `agreesarthi_soil_log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    onToast('📊 Telemetry CSV exported successfully!');
  };

  return (
    <div className="flex flex-col w-full space-y-4 pb-12">
      {/* Header */}
      <div>
        <h2 className="font-['Plus_Jakarta_Sans'] text-xl sm:text-2xl font-bold text-[#dde3eb]">
          System & Field Settings
        </h2>
        <p className="font-['Inter'] text-xs text-[#bbcabf]">
          AGREESARTHI AgriRover Operations & Hardware Config
        </p>
      </div>

      {/* Brand Card */}
      <div className="bg-[#1a2026] border border-white/[0.08] rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 shadow-md">
        <img
          src={ASSETS.logo}
          alt="AGREESARTHI"
          className="h-16 w-auto object-contain rounded-xl p-1 bg-[#161c22] border border-[#4edea3]/30"
          referrerPolicy="no-referrer"
        />
        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-white">AGREESARTHI</h3>
            <span className="px-2 py-0.5 rounded-full bg-[#4edea3]/10 text-[#4edea3] text-[10px] font-['JetBrains_Mono'] font-bold border border-[#4edea3]/20">
              STATION v2.4
            </span>
          </div>
          <p className="text-xs text-[#bbcabf] leading-relaxed">
            Autonomous agricultural ground robotics platform integrating multispectral optical computer vision, Modbus-RTU subsurface soil penetrometers, and RTK centimeter-grade path orchestration.
          </p>
        </div>
      </div>

      {/* Hardware Fleet Inventory */}
      <div className="bg-[#1a2026] border border-white/[0.07] rounded-xl p-4 space-y-3">
        <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#dde3eb]">
          Active Ground Station & Fleet Inventory
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-[#252b31] rounded-xl border border-white/[0.06] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">ROVER-001 (Field Unit)</span>
              <span className="text-[#4edea3] font-['JetBrains_Mono'] font-semibold">ONLINE</span>
            </div>
            <p className="text-[#bbcabf]">Dual differential chassis, 4-wheel drive, ESP32-CAM (OV2640), MPU6050 6-DOF IMU, HC-SR04 sonar array.</p>
          </div>

          <div className="p-3 bg-[#252b31] rounded-xl border border-white/[0.06] space-y-1 opacity-70">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">ROVER-002 (Depot Unit)</span>
              <span className="text-[#ffb95f] font-['JetBrains_Mono'] font-semibold">CHARGING</span>
            </div>
            <p className="text-[#bbcabf]">Auxiliary sprayer rover docked at Sector North ground base (Battery 96%).</p>
          </div>
        </div>
      </div>

      {/* Data Export & Backup Actions */}
      <div className="bg-[#1a2026] border border-white/[0.07] rounded-xl p-4 space-y-3">
        <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#dde3eb]">
          Telemetry Logging & Data Export
        </h3>
        <p className="text-xs text-[#bbcabf]">
          Download raw Modbus sensor logs, GPS breadcrumbs, and crop NDVI indices for research or agricultural compliance.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-lg bg-[#252b31] hover:bg-[#343a40] text-xs font-['JetBrains_Mono'] font-semibold text-white border border-white/[0.08] flex items-center gap-2 active:scale-95 transition-all shadow"
          >
            <span className="material-symbols-outlined text-[16px] text-[#4edea3]">table_chart</span>
            Export Sensor Log (.CSV)
          </button>
          <button
            onClick={handleExportJSON}
            className="px-4 py-2 rounded-lg bg-[#252b31] hover:bg-[#343a40] text-xs font-['JetBrains_Mono'] font-semibold text-white border border-white/[0.08] flex items-center gap-2 active:scale-95 transition-all shadow"
          >
            <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">data_object</span>
            Export Full Telemetry (.JSON)
          </button>
          <button
            onClick={onOpenAdvisor}
            className="px-4 py-2 rounded-lg bg-[#03b5d3]/20 hover:bg-[#03b5d3]/30 text-xs font-['JetBrains_Mono'] font-semibold text-[#4cd7f6] border border-[#4cd7f6]/30 flex items-center gap-2 active:scale-95 transition-all shadow"
          >
            <span className="material-symbols-outlined text-[16px]">psychology</span>
            Consult AI Agronomist
          </button>
        </div>
      </div>

      {/* Communication Protocol Specs */}
      <div className="bg-[#1a2026] border border-white/[0.07] rounded-xl p-4 space-y-2 font-['JetBrains_Mono'] text-xs">
        <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#dde3eb]">
          Communication & Sensor Protocols
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <div className="p-2 rounded bg-[#090f15] text-center border border-white/[0.04]">
            <span className="text-[10px] text-[#bbcabf] block">UPLINK</span>
            <span className="text-[#4edea3] font-bold">WebSocket 8080</span>
          </div>
          <div className="p-2 rounded bg-[#090f15] text-center border border-white/[0.04]">
            <span className="text-[10px] text-[#bbcabf] block">FIELD BUS</span>
            <span className="text-[#4cd7f6] font-bold">Modbus RS485</span>
          </div>
          <div className="p-2 rounded bg-[#090f15] text-center border border-white/[0.04]">
            <span className="text-[10px] text-[#bbcabf] block">GNSS</span>
            <span className="text-[#ffb95f] font-bold">RTK L1/L2</span>
          </div>
          <div className="p-2 rounded bg-[#090f15] text-center border border-white/[0.04]">
            <span className="text-[10px] text-[#bbcabf] block">CAMERA</span>
            <span className="text-white font-bold">RTSP / HTTP</span>
          </div>
        </div>
      </div>
    </div>
  );
};
