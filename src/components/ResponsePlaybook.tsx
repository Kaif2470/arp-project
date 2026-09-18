import React from 'react';
import { PlaybookStep } from '../types';
import { ListOrdered, CheckCircle2, Loader2, Clock } from 'lucide-react';

interface ResponsePlaybookProps {
  steps: PlaybookStep[];
}

export const ResponsePlaybook: React.FC<ResponsePlaybookProps> = ({ steps }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-lg flex flex-col h-full font-mono">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <ListOrdered className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase text-white tracking-wider">
            IDPS Response Playbook
          </h3>
          <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            NIST SP 800-61 Rev 2
          </span>
        </div>
        <span className="text-[10px] text-slate-400">
          Automated Remediation Flow
        </span>
      </div>

      {/* Steps List */}
      <div className="space-y-2 flex-1">
        {steps.map((step) => {
          let badge = (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-500 border border-slate-700">
              <Clock className="w-2.5 h-2.5" />
              WAITING
            </span>
          );

          if (step.status === 'ACTIVE') {
            badge = (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                <Loader2 className="w-2.5 h-2.5 animate-spin" />
                ACTIVE
              </span>
            );
          } else if (step.status === 'COMPLETED') {
            badge = (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                COMPLETED
              </span>
            );
          }

          return (
            <div
              key={step.id}
              className={`p-2 rounded-lg border transition-all flex items-center justify-between gap-2 ${
                step.status === 'ACTIVE'
                  ? 'bg-amber-950/20 border-amber-500/50'
                  : step.status === 'COMPLETED'
                  ? 'bg-emerald-950/15 border-emerald-800/50'
                  : 'bg-slate-950/50 border-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    step.status === 'COMPLETED'
                      ? 'bg-emerald-500 text-black'
                      : step.status === 'ACTIVE'
                      ? 'bg-amber-500 text-black animate-pulse'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {step.id}
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-200">{step.name}</div>
                  <div className="text-[10px] text-slate-400">{step.description}</div>
                </div>
              </div>
              <div className="shrink-0">{badge}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
