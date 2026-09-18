import React, { useState } from 'react';
import { Settings, Shield, Sliders, CheckCircle2, RefreshCw } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [sensitivity, setSensitivity] = useState<'STANDARD' | 'AGGRESSIVE' | 'PARANOID'>('AGGRESSIVE');
  const [arpThreshold, setArpThreshold] = useState<number>(15);
  const [portAction, setPortAction] = useState<'SHUTDOWN' | 'RESTRICT' | 'QUARANTINE_VLAN'>('SHUTDOWN');
  const [autoHeal, setAutoHeal] = useState<boolean>(true);
  const [saved, setSaved] = useState<boolean>(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg max-w-3xl mx-auto font-mono text-xs text-slate-300">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <Settings className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              IDPS Sensor & DAI Configuration
            </h3>
            <p className="text-[11px] text-slate-500">
              Tune simulation threshold parameters and mitigation triggers
            </p>
          </div>
        </div>
        <span className="text-[10px] bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-cyan-300">
          Profile: Enterprise-SOC-HighSec
        </span>
      </div>

      <div className="space-y-4">
        {/* Detection Sensitivity */}
        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
          <label className="text-xs font-bold text-white block mb-1">
            Correlation Sensitivity Engine
          </label>
          <p className="text-[11px] text-slate-400 mb-2">
            Determines how many anomalous indicators must correlate before a Critical Alert triggers.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {(['STANDARD', 'AGGRESSIVE', 'PARANOID'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setSensitivity(mode)}
                className={`py-2 px-3 rounded-lg border font-bold text-xs transition cursor-pointer ${
                  sensitivity === mode
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Rate Anomaly Threshold */}
        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-white">
              ARP Rate Burst Trigger: <span className="text-cyan-400">{arpThreshold} packets/sec</span>
            </label>
            <span className="text-[10px] text-slate-500">Baseline is 3-5/sec</span>
          </div>
          <p className="text-[11px] text-slate-400 mb-2">
            Flag hosts emitting Gratuitous or standard ARP requests exceeding this velocity limit.
          </p>
          <input
            type="range"
            min="5"
            max="50"
            value={arpThreshold}
            onChange={(e) => setArpThreshold(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>

        {/* Containment Mechanism */}
        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
          <label className="text-xs font-bold text-white block mb-1">
            Automated Containment Action
          </label>
          <p className="text-[11px] text-slate-400 mb-2">
            How the switch enforcement agent treats identified spoofing MAC addresses:
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'SHUTDOWN', label: '802.1X Port Shutdown' },
              { id: 'RESTRICT', label: 'MAC ACL Drop Only' },
              { id: 'QUARANTINE_VLAN', label: 'Isolate to VLAN 999' },
            ].map((act) => (
              <button
                key={act.id}
                onClick={() => setPortAction(act.id as any)}
                className={`py-2 px-2.5 rounded-lg border text-[11px] font-semibold transition cursor-pointer text-center ${
                  portAction === act.id
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {act.label}
              </button>
            ))}
          </div>
        </div>

        {/* Anti-Poison GARP Broadcast toggle */}
        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
          <div>
            <div className="font-bold text-white text-xs">Anti-Poison GARP Injection</div>
            <div className="text-[11px] text-slate-400">
              Automatically broadcast authoritative gateway ARP packets upon containment to heal victim caches.
            </div>
          </div>
          <button
            onClick={() => setAutoHeal(!autoHeal)}
            className={`w-12 h-6 rounded-full transition cursor-pointer relative p-0.5 ${
              autoHeal ? 'bg-cyan-500' : 'bg-slate-700'
            }`}
          >
            <span
              className={`block w-5 h-5 rounded-full bg-white transition transform ${
                autoHeal ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
        <span className="text-[10px] text-slate-500">Changes apply immediately to live simulation state.</span>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer"
        >
          {saved ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
          <span>{saved ? 'Configuration Saved' : 'Apply Configuration'}</span>
        </button>
      </div>
    </div>
  );
};
