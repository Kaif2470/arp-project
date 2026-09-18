import React, { useState } from 'react';
import { SecurityAlertData } from '../types';
import { ShieldAlert, ShieldCheck, Ban, X, AlertTriangle, ChevronDown, ChevronUp, CheckCircle2, Lock } from 'lucide-react';

interface SecurityAlertModalProps {
  alert: SecurityAlertData | null;
  isVisible: boolean;
  onBlockAttacker: () => void;
  onDismiss: () => void;
  isContained?: boolean;
}

export const SecurityAlertModal: React.FC<SecurityAlertModalProps> = ({
  alert,
  isVisible,
  onBlockAttacker,
  onDismiss,
  isContained = false,
}) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);

  if (!isVisible || !alert) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* If threat is already contained, show the THREAT CONTAINED card */}
      {isContained ? (
        <div className="bg-slate-900 border-2 border-emerald-500 rounded-2xl max-w-lg w-full shadow-2xl shadow-emerald-950/80 overflow-hidden font-mono text-slate-200 animate-scaleUp">
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 px-6 py-5 border-b border-emerald-600/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-400">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <span className="bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-widest">
                  INCIDENT RESOLVED
                </span>
                <h3 className="text-base font-bold text-white tracking-wide mt-1 flex items-center gap-2">
                  🛡️ THREAT CONTAINED
                </h3>
              </div>
            </div>
            <button
              onClick={onDismiss}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition cursor-pointer"
              title="Close popup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="text-slate-400 font-medium uppercase text-[11px]">Attacker:</span>
                <span className="text-rose-400 font-bold font-mono text-sm">{alert.sourceIp} ({alert.sourceMac})</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="text-slate-400 font-medium uppercase text-[11px]">Action:</span>
                <span className="text-emerald-400 font-bold font-mono text-xs flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> SOURCE BLOCKED (Port Isolated)
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="text-slate-400 font-medium uppercase text-[11px]">ARP Mapping:</span>
                <span className="text-cyan-400 font-bold font-mono text-xs">RESTORED (192.168.1.1 → RR:RR:RR:01)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium uppercase text-[11px]">Network:</span>
                <span className="text-emerald-400 font-bold font-mono text-xs">PROTECTED</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-lg text-emerald-300 text-[11px] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Anti-poison GARP broadcast sent. All victim traffic restored to original default gateway.</span>
            </div>
          </div>

          <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={onDismiss}
              className="px-6 py-2 rounded-lg text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition cursor-pointer shadow-lg shadow-emerald-950"
            >
              [ CLOSE ]
            </button>
          </div>
        </div>
      ) : (
        /* High Severity Active Alert Modal */
        <div className="bg-slate-900 border-2 border-rose-500 rounded-2xl max-w-lg w-full shadow-2xl shadow-rose-950/90 overflow-hidden font-mono text-slate-200 animate-scaleUp">
          {/* Alert Header */}
          <div className="bg-gradient-to-r from-rose-950 via-red-950 to-rose-950 px-6 py-4 border-b border-rose-600/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-600/30 border border-rose-400 text-rose-300 animate-pulse">
                <ShieldAlert className="w-7 h-7 text-rose-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-rose-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-widest animate-pulse">
                    HIGH SEVERITY
                  </span>
                  <span className="text-rose-300/80 text-xs">
                    {alert.timestamp}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white tracking-wide mt-1">
                  🚨 HIGH SEVERITY THREAT DETECTED
                </h3>
              </div>
            </div>
            <button
              onClick={onDismiss}
              className="text-rose-300 hover:text-white p-1 rounded hover:bg-rose-900/50 transition cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Alert Body */}
          <div className="p-6 space-y-4 text-xs">
            <div className="text-center py-1">
              <span className="text-sm font-extrabold uppercase tracking-wider text-rose-400">
                ARP SPOOFING / ARP POISONING
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Simulated Man-In-The-Middle (MITM) session interception detected
              </p>
            </div>

            {/* Targeted Specs Box */}
            <div className="bg-slate-950 p-4 rounded-xl border border-rose-900/40 space-y-2.5 shadow-inner">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Attacker IP:</span>
                <span className="text-rose-400 font-extrabold font-mono text-sm">{alert.sourceIp}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Attacker MAC:</span>
                <span className="text-rose-300 font-bold font-mono">{alert.sourceMac}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Target:</span>
                <span className="text-cyan-300 font-bold font-mono">{alert.targetIp}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Impersonated:</span>
                <span className="text-indigo-300 font-bold font-mono">{alert.impersonatedIp}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Threat Confidence:</span>
                <span className="text-rose-400 font-extrabold font-mono text-sm">{alert.confidence}%</span>
              </div>
            </div>

            {/* View Details Accordion Toggle */}
            <div>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full py-2 px-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-between text-xs transition cursor-pointer"
              >
                <span>{showDetails ? 'Hide Correlation Indicators' : '[ View Details: 7 Correlated Signals ]'}</span>
                {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showDetails && (
                <div className="mt-2 bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5 animate-fadeIn text-[11px]">
                  <div className="font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1">
                    Telemetry Indicators:
                  </div>
                  {alert.indicators.map((ind, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span>{ind}</span>
                    </div>
                  ))}
                  <div className="pt-1.5 text-[10px] text-slate-500">
                    Rule Engine: DAI Enforce | IEEE 802.1X Port Isolation
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-4 py-2 rounded-lg text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition cursor-pointer"
            >
              [ View Details ]
            </button>

            <button
              onClick={onBlockAttacker}
              className="px-6 py-2.5 rounded-lg text-xs font-mono font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/40 flex items-center gap-2 transition cursor-pointer animate-pulse"
            >
              <Ban className="w-4 h-4" />
              <span>[ 🚫 BLOCK ATTACKER ]</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
