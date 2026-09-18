import React, { useState } from 'react';
import { Packet } from '../types';
import { Activity, Pause, Play, Trash2, Filter, ArrowRight } from 'lucide-react';

interface LiveTrafficInspectorProps {
  packets: Packet[];
  isPaused: boolean;
  onTogglePause: () => void;
  onClearPackets: () => void;
}

export const LiveTrafficInspector: React.FC<LiveTrafficInspectorProps> = ({
  packets,
  isPaused,
  onTogglePause,
  onClearPackets,
}) => {
  const [filterProtocol, setFilterProtocol] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredPackets = packets.filter((pkt) => {
    if (filterProtocol !== 'ALL' && pkt.protocol !== filterProtocol) return false;
    if (filterStatus !== 'ALL' && pkt.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        pkt.source.toLowerCase().includes(q) ||
        pkt.destination.toLowerCase().includes(q) ||
        pkt.type.toLowerCase().includes(q) ||
        pkt.protocol.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: Packet['status']) => {
    switch (status) {
      case 'NORMAL':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            NORMAL
          </span>
        );
      case 'SUSPICIOUS':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
            SUSPICIOUS
          </span>
        );
      case 'INTERCEPTED':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/50 animate-pulse">
            INTERCEPTED
          </span>
        );
      case 'BLOCKED':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-rose-400 border border-slate-700 line-through">
            BLOCKED
          </span>
        );
    }
  };

  const getProtocolBadge = (protocol: Packet['protocol']) => {
    switch (protocol) {
      case 'ARP':
        return <span className="text-cyan-300 font-bold bg-cyan-950/60 border border-cyan-700/50 px-1.5 py-0.5 rounded text-[10px]">ARP</span>;
      case 'HTTPS':
        return <span className="text-emerald-300 font-bold bg-emerald-950/60 border border-emerald-700/50 px-1.5 py-0.5 rounded text-[10px]">HTTPS</span>;
      case 'TCP':
        return <span className="text-blue-300 font-bold bg-blue-950/60 border border-blue-700/50 px-1.5 py-0.5 rounded text-[10px]">TCP</span>;
      case 'DNS':
        return <span className="text-purple-300 font-bold bg-purple-950/60 border border-purple-700/50 px-1.5 py-0.5 rounded text-[10px]">DNS</span>;
      default:
        return <span className="text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">{protocol}</span>;
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl shadow-lg flex flex-col h-[380px] overflow-hidden">
      {/* Header & Controls */}
      <div className="p-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 bg-slate-900">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-mono font-bold uppercase text-white tracking-wider">
            Live Traffic Inspector
          </h3>
          <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-400 border border-slate-700">
            {filteredPackets.length} Packets Buffered
          </span>
          {isPaused && (
            <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded font-bold animate-pulse">
              STREAM PAUSED
            </span>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          {/* Protocol Filter */}
          <select
            value={filterProtocol}
            onChange={(e) => setFilterProtocol(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 rounded px-2 py-1 outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Protocols</option>
            <option value="ARP">ARP</option>
            <option value="TCP">TCP</option>
            <option value="HTTPS">HTTPS</option>
            <option value="DNS">DNS</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 rounded px-2 py-1 outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="NORMAL">Normal</option>
            <option value="SUSPICIOUS">Suspicious</option>
            <option value="INTERCEPTED">Intercepted</option>
            <option value="BLOCKED">Blocked</option>
          </select>

          {/* Pause / Resume Button */}
          <button
            onClick={onTogglePause}
            className={`p-1.5 rounded text-xs font-mono flex items-center gap-1 border transition cursor-pointer ${
              isPaused
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title={isPaused ? 'Resume live capture' : 'Freeze packet feed'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          {/* Clear Button */}
          <button
            onClick={onClearPackets}
            className="p-1.5 rounded text-xs bg-slate-800 text-slate-400 hover:text-rose-300 border border-slate-700 hover:bg-slate-700 transition cursor-pointer"
            title="Clear buffer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-y-auto font-mono text-xs scrollbar-thin scrollbar-thumb-slate-700">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-950/80 sticky top-0 text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800 select-none z-10">
            <tr>
              <th className="py-2 px-3">Time</th>
              <th className="py-2 px-3">Source</th>
              <th className="py-2 px-3"></th>
              <th className="py-2 px-3">Destination</th>
              <th className="py-2 px-3">Protocol</th>
              <th className="py-2 px-3">Type</th>
              <th className="py-2 px-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredPackets.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500 font-mono">
                  No packets match criteria or traffic paused.
                </td>
              </tr>
            ) : (
              filteredPackets.map((pkt) => (
                <tr
                  key={pkt.id}
                  className={`hover:bg-slate-800/50 transition-colors ${
                    pkt.status === 'INTERCEPTED'
                      ? 'bg-rose-950/20 text-rose-200'
                      : pkt.status === 'SUSPICIOUS'
                      ? 'bg-amber-950/15 text-amber-200'
                      : pkt.status === 'BLOCKED'
                      ? 'bg-slate-900/40 text-slate-500'
                      : 'text-slate-300'
                  }`}
                >
                  <td className="py-1.5 px-3 text-slate-500 whitespace-nowrap text-[11px]">
                    {pkt.time}
                  </td>
                  <td className="py-1.5 px-3 font-semibold whitespace-nowrap text-[11px]">
                    <span className={pkt.source === '192.168.1.50' ? 'text-rose-400' : 'text-slate-200'}>
                      {pkt.source}
                    </span>
                  </td>
                  <td className="py-1.5 px-1 text-slate-600 text-center">
                    <ArrowRight className="w-3 h-3 inline text-slate-500" />
                  </td>
                  <td className="py-1.5 px-3 font-semibold whitespace-nowrap text-[11px]">
                    <span className={pkt.destination === '192.168.1.50' ? 'text-rose-400' : 'text-slate-200'}>
                      {pkt.destination}
                    </span>
                  </td>
                  <td className="py-1.5 px-3 whitespace-nowrap">
                    {getProtocolBadge(pkt.protocol)}
                  </td>
                  <td className="py-1.5 px-3 whitespace-nowrap text-slate-400 text-[11px]">
                    {pkt.type}
                    {pkt.info && (
                      <span className="text-[10px] text-slate-500 ml-1.5 italic">({pkt.info})</span>
                    )}
                  </td>
                  <td className="py-1.5 px-3 text-right whitespace-nowrap">
                    {getStatusBadge(pkt.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
