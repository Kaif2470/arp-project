import React from 'react';
import { DetectionRule, NetworkState, IdpsStatus } from '../types';
import { Cpu, CheckCircle2, XCircle, AlertCircle, Sparkles, Layers } from 'lucide-react';

interface DetectionEngineProps {
  rules: DetectionRule[];
  networkState: NetworkState;
  idpsStatus: IdpsStatus;
  confidence: number;
  onRunAnalysis?: () => void;
}

export const DetectionEngine: React.FC<DetectionEngineProps> = ({
  rules,
  networkState,
  idpsStatus,
  confidence,
  onRunAnalysis,
}) => {
  const isInspecting = idpsStatus !== 'OFF';
  const isDetected = networkState === 'THREAT_DETECTED' || networkState === 'CONTAINMENT' || networkState === 'PROTECTED';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-lg flex flex-col h-full">
      {/* Engine Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-2.5 mb-3 gap-2">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-mono font-bold uppercase text-white tracking-wider">
            IDPS Correlation Engine
          </h3>
          <span className="text-[10px] font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 px-2 py-0.5 rounded font-semibold">
            Heuristic Rule Matrix
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="text-slate-400">
            Method: <span className="text-cyan-300 font-semibold">Multi-Signal Correlation</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            <span className="text-slate-400">Confidence:</span>
            <span className={`font-bold ${confidence > 80 ? 'text-rose-400' : confidence > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {confidence}%
            </span>
          </div>
        </div>
      </div>

      {/* Rules Table */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-mono">
        {rules.map((rule, idx) => {
          let statusBadge = (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-3 h-3" />
              PASS
            </span>
          );

          if (!isInspecting && networkState === 'SPOOFING') {
            statusBadge = (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                <AlertCircle className="w-3 h-3 text-slate-500" />
                NOT INSPECTED
              </span>
            );
          } else if (rule.status === 'FAIL') {
            statusBadge = (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500 animate-pulse">
                <XCircle className="w-3 h-3 text-rose-400" />
                FAIL / DETECTED
              </span>
            );
          } else if (rule.status === 'NOT_INSPECTED') {
            statusBadge = (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                <AlertCircle className="w-3 h-3 text-slate-500" />
                NOT INSPECTED
              </span>
            );
          }

          return (
            <div
              key={rule.id}
              className={`p-2.5 rounded-lg border transition-all ${
                rule.status === 'FAIL'
                  ? 'bg-rose-950/20 border-rose-800/80 shadow-sm'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-bold w-4">
                    0{idx + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-200">
                    {rule.name}
                  </span>
                </div>
                {statusBadge}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 pl-6">
                {rule.description}
              </div>
              <div className={`text-[10px] mt-1 pl-6 ${rule.status === 'FAIL' ? 'text-rose-300 font-semibold' : 'text-slate-500'}`}>
                {rule.detail}
              </div>
            </div>
          );
        })}
      </div>

      {/* Engine Status Bottom note */}
      <div className="mt-3 pt-2 border-t border-slate-800/60 text-[10px] font-mono text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1 text-slate-500">
          <Layers className="w-3 h-3 text-cyan-500" />
          Cross-layer telemetry: Ethernet Frame + ARP Header + Layer 4 flow
        </span>
        <span className="text-slate-400">
          Engine latency: <strong className="text-cyan-400">1.2ms</strong>
        </span>
      </div>
    </div>
  );
};
