import React from 'react';
import { Shield, ShieldAlert, ShieldCheck, Play, Flame, Ban, RotateCcw, BookOpen, AlertTriangle } from 'lucide-react';
import { NetworkState, IdpsStatus } from '../types';

interface HeaderProps {
  networkState: NetworkState;
  idpsStatus: IdpsStatus;
  isIdpsOn: boolean;
  onToggleIdps: () => void;
  onStartNormalTraffic: () => void;
  onStartSpoofing: () => void;
  onBlockAttacker: () => void;
  onResetLab: () => void;
  onOpenGuide: () => void;
  errorMessage: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  networkState,
  idpsStatus,
  isIdpsOn,
  onToggleIdps,
  onStartNormalTraffic,
  onStartSpoofing,
  onBlockAttacker,
  onResetLab,
  onOpenGuide,
  errorMessage,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-md sticky top-0 z-40">
      {/* Top Demo Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 px-4 py-1.5 border-b border-cyan-900/40 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            DEMO MODE
          </span>
          <span className="text-slate-400 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            EDUCATIONAL SIMULATION — NO REAL PACKETS ARE TRANSMITTED
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <span className="hidden sm:inline-block font-mono text-[11px] text-slate-400">
            MSc Cyber Security • Lab Demonstration
          </span>
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition text-[11px] font-medium bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-700/40 px-2.5 py-0.5 rounded cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Presentation Guide
          </button>
        </div>
      </div>

      {/* Main Header & Controls */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/10 shrink-0">
            {networkState === 'SPOOFING' || networkState === 'THREAT_DETECTED' ? (
              <ShieldAlert className="w-6 h-6 text-rose-500 animate-pulse" />
            ) : networkState === 'PROTECTED' || networkState === 'CONTAINMENT' ? (
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            ) : (
              <Shield className="w-6 h-6 text-cyan-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
                ARP SENTINEL
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  IDPS v4.1
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Intrusion Detection & Prevention System • Automated Detection & Containment Engine
            </p>
          </div>
        </div>

        {/* Action Controls and IDPS Switch */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* IDPS ON/OFF Master Switch */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 shadow-inner">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
              🛡 IDPS:
            </span>
            <button
              id="idps-toggle-btn"
              onClick={onToggleIdps}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none cursor-pointer ${
                isIdpsOn
                  ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
              title={isIdpsOn ? 'Turn IDPS Sensor OFF' : 'Turn IDPS Sensor ON'}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-300 shadow-md ${
                  isIdpsOn ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                isIdpsOn
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {isIdpsOn ? 'ON' : 'OFF'}
            </span>
          </div>

          {/* Primary 4 Action Buttons as requested:
              ▶ Start Normal Traffic
              ⚔ Start ARP Spoofing
              🚫 Block Attacker
              ↻ Reset Lab
          */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={onStartNormalTraffic}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono flex items-center gap-1.5 transition cursor-pointer ${
                networkState === 'NORMAL'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
              title="Start Normal Traffic baseline"
            >
              <Play className="w-3.5 h-3.5 text-cyan-400" />
              <span>▶ Start Normal Traffic</span>
            </button>

            <button
              onClick={onStartSpoofing}
              disabled={networkState === 'SPOOFING' || networkState === 'THREAT_DETECTED'}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 transition cursor-pointer ${
                networkState === 'SPOOFING' || networkState === 'THREAT_DETECTED'
                  ? 'bg-rose-950/50 text-rose-300 border border-rose-800/60 ring-1 ring-rose-500/30'
                  : 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/40'
              } disabled:opacity-60 disabled:cursor-not-allowed`}
              title="Start simulated ARP Poisoning attack"
            >
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>⚔ Start ARP Spoofing</span>
            </button>

            <button
              onClick={onBlockAttacker}
              disabled={networkState === 'NORMAL' || networkState === 'PROTECTED'}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 transition cursor-pointer ${
                networkState === 'THREAT_DETECTED'
                  ? 'bg-rose-600 hover:bg-rose-500 text-white border border-rose-400 shadow-lg shadow-rose-600/30 animate-pulse'
                  : networkState === 'PROTECTED'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title="Block Attacker & Restore Gateway"
            >
              <Ban className="w-3.5 h-3.5 text-rose-400" />
              <span>🚫 Block Attacker</span>
            </button>

            <button
              onClick={onResetLab}
              className="p-2 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition cursor-pointer"
              title="↻ Reset Lab"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Error or Notice Toast */}
      {errorMessage && (
        <div className="bg-amber-950/80 border-t border-b border-amber-600/50 px-4 py-1.5 text-xs text-amber-200 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-mono font-medium">{errorMessage}</span>
          </div>
        </div>
      )}
    </header>
  );
};
