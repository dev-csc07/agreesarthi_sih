import React, { useState } from 'react';
import { AlertLogItem } from '../types';

interface AlertsViewProps {
  alerts: AlertLogItem[];
  onAcknowledgeAlert: (id: string) => void;
  onAcknowledgeAll: () => void;
  onToast: (msg: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts = [],
  onAcknowledgeAlert,
  onAcknowledgeAll,
  onToast,
}) => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');

  const safeAlerts = alerts || [];
  const filteredAlerts = safeAlerts.filter((a) => {
    if (filter === 'all') return true;
    return a.severity === filter;
  });

  const unacknowledgedCount = safeAlerts.filter((a) => !a.acknowledged).length;

  const handleTriggerIrrigation = (zone: string) => {
    onToast(`💧 Automated drip irrigation solenoid valve opened for ${zone} (20 min cycle)`);
  };

  return (
    <div className="flex flex-col w-full space-y-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="font-['Plus_Jakarta_Sans'] text-xl sm:text-2xl font-bold text-[#dde3eb]">
            Alerts & Field Incidents
          </h2>
          <p className="font-['Inter'] text-xs text-[#bbcabf]">
            Telemetry Threshold Excursions & IoT Exception Center
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unacknowledgedCount > 0 && (
            <button
              onClick={onAcknowledgeAll}
              className="px-3 py-1.5 rounded-lg bg-[#252b31] hover:bg-[#343a40] text-xs font-['JetBrains_Mono'] text-[#4edea3] font-semibold border border-white/[0.08] transition-all active:scale-95"
            >
              Acknowledge All ({unacknowledgedCount})
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {(['all', 'critical', 'warning', 'info'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-lg text-xs font-['JetBrains_Mono'] font-semibold capitalize transition-all ${
              filter === f
                ? 'bg-[#4edea3] text-[#003824] shadow'
                : 'bg-[#1a2026] text-[#bbcabf] hover:text-white border border-white/[0.06]'
            }`}
          >
            {f === 'all' ? 'All Alerts' : f}
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      <div className="space-y-2.5">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center bg-[#1a2026] rounded-xl border border-white/[0.06] text-xs text-[#bbcabf]">
            No alerts found under this category filter. Farm telemetry is within nominal parameters.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                alert.severity === 'critical'
                  ? 'bg-[#93000a]/25 border-[#ef4444]/40 shadow-[0_0_12px_rgba(239,68,68,0.15)]'
                  : alert.severity === 'warning'
                  ? 'bg-[#1a2026] border-[#ffb95f]/30'
                  : 'bg-[#1a2026] border-white/[0.06]'
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`material-symbols-outlined text-[22px] shrink-0 mt-0.5 ${
                    alert.severity === 'critical'
                      ? 'text-[#ffb4ab]'
                      : alert.severity === 'warning'
                      ? 'text-[#ffb95f]'
                      : 'text-[#4cd7f6]'
                  }`}
                >
                  {alert.severity === 'critical'
                    ? 'warning'
                    : alert.severity === 'warning'
                    ? 'notification_important'
                    : 'info'}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-['Inter'] text-sm font-bold text-white">
                      {alert.title}
                    </span>
                    <span
                      className={`text-[10px] font-['JetBrains_Mono'] font-semibold px-2 py-0.2 rounded-full uppercase ${
                        alert.severity === 'critical'
                          ? 'bg-[#ef4444]/20 text-[#ffb4ab]'
                          : alert.severity === 'warning'
                          ? 'bg-[#ffb95f]/20 text-[#ffb95f]'
                          : 'bg-[#4cd7f6]/20 text-[#4cd7f6]'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-xs text-[#bbcabf] font-['JetBrains_Mono']">• {alert.zone}</span>
                  </div>
                  <p className="font-['Inter'] text-xs text-[#bbcabf] mt-1 leading-relaxed">
                    {alert.detail}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <span className="font-['JetBrains_Mono'] text-xs text-[#bbcabf] mr-1">
                  {alert.timestamp}
                </span>

                {alert.zone.includes('Zone') && (
                  <button
                    onClick={() => handleTriggerIrrigation(alert.zone)}
                    className="px-2.5 py-1 rounded bg-[#03b5d3]/20 hover:bg-[#03b5d3]/30 text-[#4cd7f6] text-xs font-['JetBrains_Mono'] font-semibold transition-all"
                  >
                    Water Zone
                  </button>
                )}

                {!alert.acknowledged ? (
                  <button
                    onClick={() => onAcknowledgeAlert(alert.id)}
                    className="px-3 py-1 rounded bg-[#4edea3] hover:bg-[#6ffbbe] text-[#003824] text-xs font-['JetBrains_Mono'] font-bold transition-all shadow"
                  >
                    Acknowledge
                  </button>
                ) : (
                  <span className="text-[11px] font-['JetBrains_Mono'] text-[#4edea3] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check</span>
                    ACKNOWLEDGED
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
