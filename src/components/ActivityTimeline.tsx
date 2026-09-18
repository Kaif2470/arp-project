import React from 'react';
import { NetworkState, IdpsStatus, AttackerStatus } from '../types';
import { Check, Circle, Loader2 } from 'lucide-react';

interface ActivityTimelineProps {
  networkState: NetworkState;
  idpsStatus: IdpsStatus;
  attackerStatus: AttackerStatus;
}

interface TimelineItem {
  id: string;
  label: string;
  isDone: boolean;
  isActive: boolean;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  networkState,
  idpsStatus,
  attackerStatus,
}) => {
  const isSpoofed = networkState !== 'NORMAL';
  const isIdpsOn = idpsStatus !== 'OFF';
  const isThreatDetected = networkState === 'THREAT_DETECTED' || networkState === 'CONTAINMENT' || networkState === 'PROTECTED';
  const isBlocked = attackerStatus === 'BLOCKED' || networkState === 'CONTAINMENT' || networkState === 'PROTECTED';
  const isRecovered = networkState === 'PROTECTED';

  const items: TimelineItem[] = [
    {
      id: 'step-1',
      label: 'NORMAL TRAFFIC',
      isDone: isSpoofed || isRecovered,
      isActive: networkState === 'NORMAL',
    },
    {
      id: 'step-2',
      label: 'ARP SPOOFING',
      isDone: isThreatDetected || isBlocked || isRecovered,
      isActive: networkState === 'SPOOFING',
    },
    {
      id: 'step-3',
      label: 'IDPS ACTIVATION',
      isDone: isThreatDetected || isBlocked || isRecovered,
      isActive: isIdpsOn && networkState === 'IDPS_ACTIVE',
    },
    {
      id: 'step-4',
      label: 'AUTOMATIC DETECTION',
      isDone: isBlocked || isRecovered,
      isActive: networkState === 'THREAT_DETECTED',
    },
    {
      id: 'step-5',
      label: 'SECURITY ALERT POPUP',
      isDone: isBlocked || isRecovered,
      isActive: networkState === 'THREAT_DETECTED',
    },
    {
      id: 'step-6',
      label: 'BLOCK ATTACKER',
      isDone: isBlocked || isRecovered,
      isActive: networkState === 'CONTAINMENT',
    },
    {
      id: 'step-7',
      label: 'NETWORK PROTECTED',
      isDone: isRecovered,
      isActive: networkState === 'PROTECTED',
    },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-md font-mono mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Simulation Lifecycle Pipeline
        </span>
        <span className="text-[10px] text-slate-500">
          Automated Detection & Containment Sequence
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {items.map((item, index) => {
          return (
            <div
              key={item.id}
              className={`p-2 rounded-lg border text-center transition-all flex flex-col items-center justify-between min-h-[58px] ${
                item.isDone
                  ? 'bg-emerald-950/20 border-emerald-600/40 text-emerald-300'
                  : item.isActive
                  ? 'bg-rose-950/30 border-rose-500/60 text-rose-200 ring-1 ring-rose-500/40'
                  : 'bg-slate-950/40 border-slate-800 text-slate-500'
              }`}
            >
              <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Step 0{index + 1}
              </div>
              <div className="text-[11px] font-semibold tracking-tight truncate w-full">
                {item.label}
              </div>
              <div className="mt-1 flex items-center justify-center">
                {item.isDone ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : item.isActive ? (
                  <Loader2 className="w-3.5 h-3.5 text-rose-400 animate-spin" />
                ) : (
                  <Circle className="w-2.5 h-2.5 text-slate-600" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
