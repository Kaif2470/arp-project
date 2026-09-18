import React from 'react';
import { NetworkState, IdpsStatus, AttackerStatus, SocMetrics } from '../types';
import { Network, Shield, AlertOctagon, Activity, Radio, UserX, Clock } from 'lucide-react';
import { formatTime } from '../utils/simulationData';

interface StatusCardsProps {
  networkState: NetworkState;
  idpsStatus: IdpsStatus;
  attackerStatus: AttackerStatus;
  metrics: SocMetrics;
}

export const StatusCards: React.FC<StatusCardsProps> = ({
  networkState,
  idpsStatus,
  attackerStatus,
  metrics,
}) => {
  // Network status colors and label
  const getNetworkBadge = () => {
    switch (networkState) {
      case 'NORMAL':
        return { label: 'NORMAL', bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400', glow: 'shadow-emerald-500/10' };
      case 'SPOOFING':
        return { label: 'SPOOFED', bg: 'bg-rose-500/20 border-rose-500/40 text-rose-400 animate-pulse', glow: 'shadow-rose-500/20' };
      case 'IDPS_ACTIVE':
        return { label: 'SPOOFED (INSPECTING)', bg: 'bg-amber-500/20 border-amber-500/40 text-amber-400', glow: 'shadow-amber-500/10' };
      case 'THREAT_DETECTED':
        return { label: 'THREAT DETECTED', bg: 'bg-rose-500/30 border-rose-500 text-rose-300 animate-pulse', glow: 'shadow-rose-500/30' };
      case 'CONTAINMENT':
        return { label: 'CONTAINING THREAT', bg: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300', glow: 'shadow-indigo-500/20' };
      case 'PROTECTED':
        return { label: 'PROTECTED', bg: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300', glow: 'shadow-emerald-500/20' };
      default:
        return { label: 'NORMAL', bg: 'bg-slate-800 border-slate-700 text-slate-300', glow: '' };
    }
  };

  const getIdpsBadge = () => {
    switch (idpsStatus) {
      case 'OFF':
        return { label: 'OFF', bg: 'bg-slate-800 text-slate-400 border-slate-700', iconColor: 'text-slate-500' };
      case 'ACTIVE':
        return { label: 'ACTIVE', bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', iconColor: 'text-emerald-400' };
      case 'THREAT_DETECTED':
        return { label: 'THREAT DETECTED', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse', iconColor: 'text-amber-400' };
      case 'CONTAINED':
        return { label: 'CONTAINED', bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40', iconColor: 'text-cyan-400' };
    }
  };

  const getAttackerDisplay = () => {
    switch (attackerStatus) {
      case 'NONE':
        return { text: 'NONE', sub: 'Baseline Clean', color: 'text-slate-400', badge: 'bg-slate-800 border-slate-700 text-slate-400' };
      case 'ACTIVE':
        return { text: '192.168.1.50', sub: 'MAC: XX:XX:XX:50', color: 'text-rose-400', badge: 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse' };
      case 'BLOCKED':
        return { text: 'BLOCKED', sub: '192.168.1.50 (Quarantined)', color: 'text-emerald-400', badge: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' };
    }
  };

  const netBadge = getNetworkBadge();
  const idpsBadge = getIdpsBadge();
  const attackerDisplay = getAttackerDisplay();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
      {/* 1. Network Status */}
      <div className={`bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-md flex flex-col justify-between ${netBadge.glow}`}>
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-mono font-medium uppercase tracking-wider">Network Status</span>
          <Network className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <div>
          <div className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-bold border ${netBadge.bg}`}>
            {netBadge.label}
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">VLAN 10 Subnet 192.168.1.0/24</p>
        </div>
      </div>

      {/* 2. IDPS Status */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-mono font-medium uppercase tracking-wider">IDPS Status</span>
          <Shield className={`w-3.5 h-3.5 ${idpsBadge.iconColor}`} />
        </div>
        <div>
          <div className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-bold border ${idpsBadge.bg}`}>
            {idpsBadge.label}
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">
            {idpsStatus === 'OFF' ? 'Sensor Dormant' : 'Active Packet Inspection'}
          </p>
        </div>
      </div>

      {/* 3. Threat Level */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-mono font-medium uppercase tracking-wider">Threat Level</span>
          <AlertOctagon className={`w-3.5 h-3.5 ${metrics.threatLevel > 50 ? 'text-rose-500' : metrics.threatLevel > 0 ? 'text-amber-400' : 'text-emerald-400'}`} />
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className={`text-xl font-bold font-mono ${metrics.threatLevel > 50 ? 'text-rose-400' : metrics.threatLevel > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {metrics.threatLevel}%
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-mono">
              {metrics.threatLevel >= 70 ? 'CRITICAL' : metrics.threatLevel > 10 ? 'ELEVATED' : 'NOMINAL'}
            </span>
          </div>
          {/* Visual Mini Progress Bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                metrics.threatLevel > 50
                  ? 'bg-rose-500'
                  : metrics.threatLevel > 0
                  ? 'bg-amber-400'
                  : 'bg-emerald-400'
              }`}
              style={{ width: `${Math.max(4, metrics.threatLevel)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4. ARP Frames */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-mono font-medium uppercase tracking-wider">ARP Frames</span>
          <Radio className="w-3.5 h-3.5 text-blue-400" />
        </div>
        <div>
          <span className="text-xl font-bold font-mono text-cyan-300">
            {metrics.totalArpFrames.toLocaleString()}
          </span>
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>Req: {metrics.arpRequestsPerSec}/s</span>
            <span>Rep: {metrics.arpRepliesPerSec}/s</span>
          </div>
        </div>
      </div>

      {/* 5. Suspicious Traffic */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-mono font-medium uppercase tracking-wider">Suspicious Traffic</span>
          <Activity className={`w-3.5 h-3.5 ${metrics.suspiciousPackets > 0 ? 'text-amber-400 animate-bounce' : 'text-slate-500'}`} />
        </div>
        <div>
          <span className={`text-xl font-bold font-mono ${metrics.suspiciousPackets > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
            {metrics.suspiciousPackets.toLocaleString()}
          </span>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">
            {metrics.blockedPackets > 0 ? `${metrics.blockedPackets} Blocked Pkts` : '0 Dropped / MITM'}
          </p>
        </div>
      </div>

      {/* 6. Attacker Status */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-mono font-medium uppercase tracking-wider">Attacker</span>
          <UserX className="w-3.5 h-3.5 text-rose-400" />
        </div>
        <div>
          <div className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-bold border ${attackerDisplay.badge}`}>
            {attackerDisplay.text}
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-mono truncate">
            {attackerDisplay.sub}
          </p>
        </div>
      </div>
    </div>
  );
};
