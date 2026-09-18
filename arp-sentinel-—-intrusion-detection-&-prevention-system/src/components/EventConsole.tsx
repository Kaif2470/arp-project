import React, { useRef, useEffect } from 'react';
import { ConsoleEvent } from '../types';
import { Terminal, Copy, Trash2, Check, Download } from 'lucide-react';

interface EventConsoleProps {
  logs: ConsoleEvent[];
  onClearLogs: () => void;
}

export const EventConsole: React.FC<EventConsoleProps> = ({ logs, onClearLogs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCopyLogs = () => {
    const text = logs.map((l) => `[${l.timestamp}] [${l.type}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getBadgeStyle = (type: ConsoleEvent['type']) => {
    switch (type) {
      case 'INFO':
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60';
      case 'WARNING':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/60';
      case 'ALERT':
        return 'text-rose-400 bg-rose-950/60 border-rose-800/60 animate-pulse font-bold';
      case 'BLOCKED':
        return 'text-purple-400 bg-purple-950/60 border-purple-800/60 font-bold';
      case 'RECOVERY':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60 font-bold';
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl shadow-lg flex flex-col h-[320px] overflow-hidden font-mono">
      {/* Console Header */}
      <div className="p-2.5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            IDPS / SOC Security Audit Console
          </span>
          <span className="text-[10px] text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
            /var/log/arp-sentinel/audit.log
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLogs}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-1 transition cursor-pointer"
            title="Copy audit log"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="text-[10px]">{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={onClearLogs}
            className="text-xs text-slate-400 hover:text-rose-300 p-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 transition cursor-pointer"
            title="Clear terminal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="flex-1 bg-black/95 p-3 overflow-y-auto text-xs space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800 selection:bg-cyan-500 selection:text-black">
        {logs.length === 0 ? (
          <div className="text-slate-600 text-xs italic">Terminal cleared. Awaiting new telemetry events...</div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 leading-relaxed">
              <span className="text-slate-500 shrink-0 text-[11px]">[{log.timestamp}]</span>
              <span
                className={`text-[9px] uppercase px-1.5 py-0.2 rounded border shrink-0 ${getBadgeStyle(
                  log.type
                )}`}
              >
                {log.type}
              </span>
              <span
                className={`text-[11px] ${
                  log.type === 'ALERT'
                    ? 'text-rose-300 font-semibold'
                    : log.type === 'RECOVERY'
                    ? 'text-emerald-300 font-semibold'
                    : log.type === 'BLOCKED'
                    ? 'text-purple-300'
                    : log.type === 'WARNING'
                    ? 'text-amber-300'
                    : 'text-slate-300'
                }`}
              >
                {log.message}
              </span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Terminal Footer */}
      <div className="bg-slate-950 px-3 py-1.5 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Daemon Syslog Stream • UTF-8 • Syslog RFC 5424
        </span>
        <span>Lines buffered: {logs.length}</span>
      </div>
    </div>
  );
};
