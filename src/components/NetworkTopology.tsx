import React from 'react';
import { NetworkState, IdpsStatus, AttackerStatus } from '../types';
import { Laptop, Server, Router, Skull, ShieldCheck, ShieldAlert, Wifi, ArrowRight, Zap, Ban, Eye, Lock } from 'lucide-react';
import { formatTime } from '../utils/simulationData';

interface NetworkTopologyProps {
  networkState: NetworkState;
  idpsStatus: IdpsStatus;
  attackerStatus: AttackerStatus;
  attackDuration: number;
}

export const NetworkTopology: React.FC<NetworkTopologyProps> = ({
  networkState,
  idpsStatus,
  attackerStatus,
  attackDuration,
}) => {
  const isSpoofing = networkState === 'SPOOFING' || networkState === 'THREAT_DETECTED' || networkState === 'IDPS_ACTIVE';
  const isBlocked = attackerStatus === 'BLOCKED' || networkState === 'CONTAINMENT' || networkState === 'PROTECTED';
  const isIdpsOn = idpsStatus !== 'OFF';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg relative overflow-hidden flex flex-col">
      {/* Topology Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
          <h2 className="text-sm font-mono font-bold tracking-wide text-white uppercase flex items-center gap-2">
            Interactive Network Topology & Flow
            <span className="text-[10px] font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              L2/L3 Broadcast Domain (VLAN 10)
            </span>
          </h2>
        </div>

        {/* Live Attack / Flow Badge & Duration */}
        <div className="flex items-center gap-3">
          {isSpoofing && !isBlocked && (
            <div className="flex items-center gap-2 bg-rose-950/70 border border-rose-600/60 px-2.5 py-1 rounded-md text-xs font-mono text-rose-300 animate-pulse">
              <Zap className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
              <span>ACTIVE MITM INTERCEPT</span>
              <span className="border-l border-rose-700/60 pl-2 text-white font-bold">
                {formatTime(attackDuration)}
              </span>
            </div>
          )}

          {isBlocked && (
            <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-600/50 px-2.5 py-1 rounded-md text-xs font-mono text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>PORT SECURITY: 802.1X RESTRICTED</span>
            </div>
          )}

          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <span className="text-slate-500">Flow:</span>
            {isSpoofing && !isBlocked ? (
              <span className="text-rose-400 font-bold flex items-center gap-1">
                Victim <ArrowRight className="w-3 h-3 text-rose-500 inline" /> Attacker <ArrowRight className="w-3 h-3 text-rose-500 inline" /> Gateway
              </span>
            ) : (
              <span className="text-cyan-400 font-bold flex items-center gap-1">
                Victim <ArrowRight className="w-3 h-3 text-cyan-500 inline" /> Switch <ArrowRight className="w-3 h-3 text-cyan-500 inline" /> Gateway
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Poisoned Warning Banner Overlay if Spoofing is Active */}
      {isSpoofing && !isBlocked && (
        <div className="mb-3 bg-gradient-to-r from-rose-950/90 via-red-900/80 to-rose-950/90 border border-rose-600/80 rounded-lg p-2.5 text-xs text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-lg shadow-rose-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-rose-900/80 border border-rose-500 text-rose-300">
              <ShieldAlert className="w-4 h-4 text-rose-300 animate-pulse" />
            </div>
            <div>
              <div className="font-mono font-bold text-white text-xs flex items-center gap-2">
                ARP CACHE POISONED
                <span className="text-[10px] px-1.5 py-0.2 bg-rose-500/30 text-rose-200 rounded border border-rose-500/40">
                  Target: 192.168.1.10
                </span>
              </div>
              <div className="font-mono text-[11px] text-rose-300 mt-0.5">
                Target IP: <span className="text-white font-semibold">192.168.1.1</span> | Expected MAC: <span className="text-emerald-300 font-semibold">RR:RR:RR:01</span> | Observed MAC: <span className="text-red-300 font-bold underline decoration-red-400">XX:XX:XX:50</span>
              </div>
            </div>
          </div>
          <div className="text-[11px] font-mono bg-rose-950/90 px-2 py-1 rounded border border-rose-800 text-rose-300">
            Gratuitous ARP Injected
          </div>
        </div>
      )}

      {/* Restored Banner if Blocked */}
      {isBlocked && (
        <div className="mb-3 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border border-emerald-600/50 rounded-lg p-2 text-xs text-emerald-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-mono">
              <strong className="text-emerald-300">ARP CACHE RESTORED:</strong> Gateway 192.168.1.1 rebound to authentic MAC <strong className="text-white">RR:RR:RR:01</strong>. Attacker MAC isolated at Switch Port 5.
            </span>
          </div>
          <span className="font-mono text-[11px] text-emerald-400 bg-emerald-900/40 border border-emerald-500/30 px-2 py-0.5 rounded">
            Threat Contained
          </span>
        </div>
      )}

      {/* Visual Canvas Area with Nodes and Packet Flow */}
      <div className="relative min-h-[300px] w-full bg-slate-950/90 rounded-xl border border-slate-800/80 p-4 flex flex-col justify-between overflow-hidden">
        {/* Subtle grid background */}
        <div 
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />

        {/* SVG Paths & Flow Particles */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <linearGradient id="normalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="attackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.9" />
            </linearGradient>
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Direct Path: Victim (Left 18%) -> Switch (Center 50%, Top 40%) -> Gateway (Right 82%) */}
          <path
            d="M 120 150 Q 280 80 440 90"
            fill="none"
            stroke={isSpoofing && !isBlocked ? '#334155' : '#0ea5e9'}
            strokeWidth={isSpoofing && !isBlocked ? '1.5' : '3'}
            strokeDasharray={isSpoofing && !isBlocked ? '4 4' : 'none'}
            className="transition-all duration-500"
          />
          <path
            d="M 440 90 Q 600 80 760 150"
            fill="none"
            stroke={isSpoofing && !isBlocked ? '#334155' : '#0ea5e9'}
            strokeWidth={isSpoofing && !isBlocked ? '1.5' : '3'}
            strokeDasharray={isSpoofing && !isBlocked ? '4 4' : 'none'}
            className="transition-all duration-500"
          />

          {/* TAP line to IDPS Sensor (Center Top 10% to Switch) */}
          <path
            d="M 440 35 L 440 90"
            fill="none"
            stroke={isIdpsOn ? '#10b981' : '#475569'}
            strokeWidth="2"
            strokeDasharray={isIdpsOn ? 'none' : '3 3'}
          />

          {/* MITM Attack Paths: Attacker sits in bottom-center */}
          {/* Path 1: Forged ARP Poisoning replies: Attacker (Center Bottom) -> Victim */}
          {isSpoofing && !isBlocked && (
            <>
              {/* Attacker to Victim spoof link */}
              <path
                d="M 440 235 Q 260 230 120 150"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                filter="url(#glow-red)"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="40"
                  to="0"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </path>

              {/* Intercepted Data Path: Victim -> Attacker -> Gateway */}
              <path
                d="M 120 150 Q 280 195 440 235"
                fill="none"
                stroke="#f97316"
                strokeWidth="2.5"
              />
              <path
                d="M 440 235 Q 600 195 760 150"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                filter="url(#glow-red)"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="40"
                  to="0"
                  dur="1.2s"
                  repeatCount="indefinite"
                />
              </path>
            </>
          )}

          {/* Blocked Isolation Slash over Attacker link */}
          {isBlocked && (
            <path
              d="M 440 180 L 440 220"
              fill="none"
              stroke="#64748b"
              strokeWidth="2"
              strokeDasharray="3 3"
            />
          )}
        </svg>

        {/* TOP ROW: IDPS Sensor Monitor & Switch */}
        <div className="relative z-10 flex items-start justify-between w-full">
          {/* IDPS TAP Sensor Box (Top Center Left) */}
          <div className="mx-auto flex flex-col items-center">
            <div
              className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 transition-all shadow-md ${
                isIdpsOn
                  ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300 shadow-emerald-500/20'
                  : 'bg-slate-900 border-slate-700 text-slate-500'
              }`}
            >
              <div className="relative">
                {isIdpsOn ? (
                  <Eye className="w-4 h-4 text-emerald-400 animate-pulse" />
                ) : (
                  <Eye className="w-4 h-4 text-slate-600" />
                )}
                {isIdpsOn && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                )}
              </div>
              <div className="text-left font-mono">
                <div className="text-xs font-bold flex items-center gap-1.5">
                  IDPS SENSOR DAEMON
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                    isIdpsOn ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {isIdpsOn ? 'ONLINE / INSPECTING' : 'OFFLINE'}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  SPAN TAP: Interface eth1 • Promiscuous Sniffer
                </div>
              </div>
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-1">
              {isIdpsOn ? 'Inspecting ARP Frames & IP-MAC Tuples' : 'Sensor Inactive'}
            </div>
          </div>
        </div>

        {/* MIDDLE ROW: Victim Host <-> Switch-Core <-> Gateway Router */}
        <div className="relative z-10 grid grid-cols-3 items-center gap-4 my-2">
          {/* Node 1: VICTIM HOST */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div
                className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 shadow-lg ${
                  isSpoofing && !isBlocked
                    ? 'bg-rose-950/60 border-rose-500 shadow-rose-500/30'
                    : 'bg-slate-900/95 border-cyan-500/50 shadow-cyan-500/10'
                }`}
              >
                <Laptop className={`w-8 h-8 ${isSpoofing && !isBlocked ? 'text-rose-400' : 'text-cyan-400'}`} />
                <span className="text-[10px] font-mono font-bold mt-1 text-slate-200">VICTIM</span>
              </div>
              {/* Ping bubble indicator */}
              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                <span className={`w-2 h-2 rounded-full ${isSpoofing && !isBlocked ? 'bg-rose-500 animate-ping' : 'bg-cyan-400'}`} />
              </div>
            </div>

            <div className="mt-2 text-center font-mono">
              <div className="text-xs font-bold text-white">Ubuntu Workstation</div>
              <div className="text-[11px] text-cyan-300">IP: 192.168.1.10</div>
              <div className="text-[10px] text-slate-400">MAC: AA:AA:AA:10</div>
              <div className="text-[10px] text-slate-500 mt-0.5">VLAN: 10 • Port: 3</div>
            </div>
          </div>

          {/* Center: SWITCH */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-16 rounded-xl bg-slate-900 border border-slate-700 p-2 flex flex-col justify-between shadow-md">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="font-bold text-slate-300">CORE-SWITCH</span>
                <span className="text-emerald-400">L2 ACTIVE</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 my-1">
                {[1, 2, 3, 4, 5].map((p) => (
                  <div
                    key={p}
                    className={`w-2.5 h-3 rounded-sm flex items-center justify-center text-[7px] font-mono font-bold ${
                      p === 3
                        ? 'bg-cyan-500 text-black'
                        : p === 5 && isSpoofing && !isBlocked
                        ? 'bg-rose-500 text-white animate-pulse'
                        : p === 5 && isBlocked
                        ? 'bg-slate-700 text-rose-400 line-through'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                    title={`Port ${p}`}
                  >
                    {p}
                  </div>
                ))}
              </div>
              <div className="text-[9px] font-mono text-center text-slate-500">
                MAC Learning Table
              </div>
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-1">
              Switch Fabric: 802.1Q Active
            </div>
          </div>

          {/* Node 3: GATEWAY / ROUTER */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-slate-900/95 border border-indigo-500/50 shadow-lg shadow-indigo-500/10 flex flex-col items-center justify-center">
                <Router className="w-8 h-8 text-indigo-400" />
                <span className="text-[10px] font-mono font-bold mt-1 text-slate-200">GATEWAY</span>
              </div>
              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
              </div>
            </div>

            <div className="mt-2 text-center font-mono">
              <div className="text-xs font-bold text-white">Cisco 2901 Edge</div>
              <div className="text-[11px] text-indigo-300">IP: 192.168.1.1</div>
              <div className="text-[10px] text-slate-400">MAC: RR:RR:RR:01</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Next-Hop: 0.0.0.0/0</div>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: ATTACKER HOST (Man-in-the-Middle) */}
        <div className="relative z-10 flex flex-col items-center mt-2 pt-2 border-t border-slate-800/60">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-2xl border transition-all duration-300 flex items-center gap-3 ${
                isBlocked
                  ? 'bg-slate-900/80 border-slate-800 opacity-60'
                  : isSpoofing
                  ? 'bg-rose-950/80 border-rose-500 shadow-xl shadow-rose-600/20 animate-pulse'
                  : 'bg-slate-900 border-slate-800 opacity-40'
              }`}
            >
              <div className="relative">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isBlocked
                    ? 'bg-slate-800 text-slate-400'
                    : isSpoofing
                    ? 'bg-rose-900/80 text-rose-300'
                    : 'bg-slate-800 text-slate-600'
                }`}>
                  {isBlocked ? (
                    <Ban className="w-6 h-6 text-rose-400" />
                  ) : (
                    <Skull className={`w-6 h-6 ${isSpoofing ? 'text-rose-400' : 'text-slate-500'}`} />
                  )}
                </div>
                {isBlocked && (
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white rounded-full p-0.5" title="Blocked">
                    <Lock className="w-3 h-3" />
                  </span>
                )}
              </div>

              <div className="font-mono text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">ATTACKER HOST (Kali Linux)</span>
                  {isBlocked ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      BLOCKED / ISOLATED
                    </span>
                  ) : isSpoofing ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-rose-500/30 text-rose-300 border border-rose-500 animate-pulse">
                      SPOOFING ACTIVE
                    </span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-500">
                      IDLE
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-rose-300 mt-0.5">
                  IP: <span className="font-semibold text-white">192.168.1.50</span> • MAC: <span className="font-semibold text-white">XX:XX:XX:50</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {isBlocked
                    ? 'State: 802.1X Port 5 Disabled • Ingress Traffic Dropped'
                    : isSpoofing
                    ? 'Forged ARP: "192.168.1.1 is-at XX:XX:XX:50" broadcasting every 500ms'
                    : 'Inactive on Switch Port 5'}
                </div>
              </div>
            </div>
          </div>

          {/* Packet Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-slate-400 mt-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block shadow-sm shadow-cyan-400" />
              <span>Normal Traffic (Blue/Cyan)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block shadow-sm shadow-amber-400" />
              <span>Suspicious/GARP (Yellow)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block shadow-sm shadow-rose-500" />
              <span>Forged / Intercepted MITM (Red)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600 inline-block" />
              <span>Quarantined / Dropped</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
