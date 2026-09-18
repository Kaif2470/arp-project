import React from 'react';
import { X, CheckCircle, ArrowRight, ShieldCheck, Play, Flame, Ban, RotateCcw } from 'lucide-react';
import { NetworkState, IdpsStatus } from '../types';

interface PresentationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  networkState: NetworkState;
  idpsStatus: IdpsStatus;
  onStartNormalTraffic: () => void;
  onStartSpoofing: () => void;
  onToggleIdps: () => void;
  onBlockAttacker: () => void;
  onResetLab: () => void;
}

const DEMO_STEPS = [
  { step: 1, title: 'Open application & verify environment', desc: 'Confirm DEMO MODE banner, zero real packets, and pristine SOC layout.' },
  { step: 2, title: 'Explain Victim, Switch & Gateway topology', desc: 'Identify Ubuntu Workstation (192.168.1.10), Core Switch, and Cisco Gateway (192.168.1.1).' },
  { step: 3, title: 'Show IDPS OFF status', desc: 'Highlight the IDPS toggle in OFF mode — explain that passive networks cannot detect spoofing without active sensors.' },
  { step: 4, title: 'Observe normal cyan baseline traffic', desc: 'Inspect live traffic table: Victim requests flow through Switch to Gateway with valid ARP mapping (RR:RR:RR:01).' },
  { step: 5, title: 'Click "Start ARP Spoofing"', desc: 'Attacker (192.168.1.50 / XX:XX:XX:50) begins injecting unsolicited Gratuitous ARP replies (GARP).' },
  { step: 6, title: 'Explain gateway impersonation', desc: 'Attacker broadcasts: "192.168.1.1 is-at XX:XX:XX:50" claiming the default gateway IP.' },
  { step: 7, title: 'Show poisoned ARP cache table', desc: 'Observe Victim ARP Cache table: Expected MAC RR:RR:RR:01 becomes poisoned to XX:XX:XX:50.' },
  { step: 8, title: 'Show red intercepted traffic', desc: 'Traffic flow is hijacked: Victim -> Attacker -> Gateway. Threat level rises to ~72%.' },
  { step: 9, title: 'CRITICAL: Emphasize that IDPS is STILL OFF', desc: 'Crucial educational point: Despite active interception, NO alert and NO blocking occurs because IDPS is OFF.' },
  { step: 10, title: 'Turn IDPS switch ON', desc: 'Switch sensor to ON. Watch the immediate automatic reaction.' },
  { step: 11, title: '⚡ AUTOMATIC DETECTION (No extra clicks)', desc: 'IDPS immediately scans the network state, detects the ARP poisoning, and correlates 7 indicators.' },
  { step: 12, title: 'Inspect Detection Engine rule matrix', desc: 'Detection rules automatically flip to DETECTED / FAIL with 96% confidence score.' },
  { step: 13, title: '🚨 Automatic High-Severity SOC Alert Popup', desc: 'A prominent red SOC alert automatically pops up with Rogue IP (192.168.1.50) and target specs.' },
  { step: 14, title: 'Explain automated source identification', desc: 'No manual logs searching required — IDPS identifies Rogue MAC XX:XX:XX:50 and Port 5 automatically.' },
  { step: 15, title: 'Click "BLOCK ATTACKER" in the popup', desc: 'Execute the containment directly from the alert dialog.' },
  { step: 16, title: 'Show "THREAT CONTAINED" status', desc: 'Modal updates to "🛡️ THREAT CONTAINED" showing Source Blocked, ARP Restored, and Network Protected.' },
  { step: 17, title: 'Verify ARP mapping restoration', desc: 'Anti-poison GARP restores Gateway binding in victim cache: 192.168.1.1 -> RR:RR:RR:01 (RESTORED).' },
  { step: 18, title: 'Witness suspicious traffic drop to zero', desc: 'Intercepted packets stop, error rate drops to 0/sec, threat level drops to 5%.' },
  { step: 19, title: 'Normal cyan traffic restored', desc: 'Traffic flow cleanly returns: Victim -> Switch -> Gateway directly.' },
  { step: 20, title: 'NETWORK PROTECTED', desc: 'Network status displays PROTECTED, IDPS sensor remains active on tap interface.' },
];

export const PresentationGuideModal: React.FC<PresentationGuideModalProps> = ({
  isOpen,
  onClose,
  networkState,
  idpsStatus,
  onStartNormalTraffic,
  onStartSpoofing,
  onToggleIdps,
  onBlockAttacker,
  onResetLab,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-mono">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-cyan-400 text-[10px] font-bold tracking-widest uppercase">
              Instructor & Student Walkthrough
            </span>
            <h3 className="text-base font-bold text-white">
              ARP Sentinel • Automated Demonstration Script (20 Steps)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Trigger Bar inside Guide */}
        <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-slate-400 text-[11px] font-bold">Quick Controls:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={onStartNormalTraffic}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] flex items-center gap-1 transition cursor-pointer"
            >
              <Play className="w-3 h-3 text-cyan-400" />
              <span>1. Normal</span>
            </button>
            <button
              onClick={onStartSpoofing}
              className="px-2.5 py-1 rounded bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 text-[11px] flex items-center gap-1 transition cursor-pointer"
            >
              <Flame className="w-3 h-3 text-rose-400" />
              <span>2. Spoof</span>
            </button>
            <button
              onClick={onToggleIdps}
              className="px-2.5 py-1 rounded bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60 text-[11px] flex items-center gap-1 transition cursor-pointer"
            >
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>3. IDPS Toggle</span>
            </button>
            <button
              onClick={onBlockAttacker}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] flex items-center gap-1 transition cursor-pointer"
            >
              <Ban className="w-3 h-3 text-rose-400" />
              <span>4. Block</span>
            </button>
            <button
              onClick={onResetLab}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
              title="Reset"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Steps List */}
        <div className="p-4 overflow-y-auto space-y-2 text-xs divide-y divide-slate-800/60">
          {DEMO_STEPS.map((s) => (
            <div key={s.step} className="pt-2.5 first:pt-0 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                {s.step}
              </span>
              <div className="flex-1">
                <h4 className="font-bold text-white text-xs flex items-center gap-2">
                  {s.title}
                </h4>
                <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-[11px] text-slate-500">
          Educational Simulation Script • MSc Cyber Security IDPS Evaluation
        </div>
      </div>
    </div>
  );
};
