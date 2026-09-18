import React from 'react';
import { ArpEntry } from '../types';
import { Database, AlertTriangle, CheckCircle, RefreshCw, ShieldCheck } from 'lucide-react';

interface ArpCacheMonitorProps {
  arpEntries: ArpEntry[];
  onRefreshCache?: () => void;
}

export const ArpCacheMonitor: React.FC<ArpCacheMonitorProps> = ({
  arpEntries,
  onRefreshCache,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-lg flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-mono font-bold uppercase text-white tracking-wider">
            Victim Host ARP Cache Monitor
          </h3>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            arp -a /proc/net/arp
          </span>
        </div>
        {onRefreshCache && (
          <button
            onClick={onRefreshCache}
            className="text-[11px] font-mono text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition"
            title="Poll kernel ARP table"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Query Cache</span>
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <th className="py-2 px-2.5">IP Address</th>
              <th className="py-2 px-2.5">Expected MAC</th>
              <th className="py-2 px-2.5">Observed MAC</th>
              <th className="py-2 px-2.5">Device Hostname</th>
              <th className="py-2 px-2.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {arpEntries.map((entry) => {
              const isMismatch = entry.expectedMac !== entry.observedMac;
              return (
                <tr
                  key={entry.ip}
                  className={`transition-colors ${
                    entry.status === 'POISONED' || isMismatch
                      ? 'bg-rose-950/30 text-rose-200 border-l-2 border-rose-500'
                      : entry.status === 'RESTORED'
                      ? 'bg-emerald-950/20 text-emerald-200'
                      : 'hover:bg-slate-800/40 text-slate-300'
                  }`}
                >
                  <td className="py-2 px-2.5 font-semibold text-slate-200 whitespace-nowrap">
                    {entry.ip}
                  </td>
                  <td className="py-2 px-2.5 text-slate-400 whitespace-nowrap">
                    <span className="bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700 text-[11px]">
                      {entry.expectedMac}
                    </span>
                  </td>
                  <td className="py-2 px-2.5 whitespace-nowrap">
                    {isMismatch ? (
                      <span className="bg-rose-900/60 text-rose-300 border border-rose-500 font-bold px-1.5 py-0.5 rounded text-[11px] flex items-center gap-1 w-fit animate-pulse">
                        <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                        {entry.observedMac}
                      </span>
                    ) : (
                      <span className="bg-slate-800/80 text-emerald-400 px-1.5 py-0.5 rounded border border-slate-700 text-[11px]">
                        {entry.observedMac}
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-2.5 text-slate-400 text-[11px] truncate max-w-[150px]">
                    {entry.hostname}
                  </td>
                  <td className="py-2 px-2.5 text-right whitespace-nowrap">
                    {entry.status === 'POISONED' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        POISONED
                      </span>
                    ) : entry.status === 'RESTORED' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        RESTORED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle className="w-2.5 h-2.5" />
                        TRUSTED
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="mt-3 pt-2 border-t border-slate-800/60 text-[10px] font-mono text-slate-500 flex items-center justify-between">
        <span>Static Verification: DAI (Dynamic ARP Inspection) Ready</span>
        <span>Resolution TTL: 120s</span>
      </div>
    </div>
  );
};
