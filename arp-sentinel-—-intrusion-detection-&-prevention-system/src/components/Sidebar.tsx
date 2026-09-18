import React from 'react';
import { 
  LayoutDashboard, 
  Network, 
  Database, 
  Cpu, 
  AlertTriangle, 
  ListOrdered, 
  Terminal, 
  Settings, 
  BookOpen, 
  Shield, 
  Radio
} from 'lucide-react';

export type ActiveTab = 
  | 'dashboard'
  | 'network'
  | 'arp'
  | 'engine'
  | 'alerts'
  | 'response'
  | 'logs'
  | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  activeAlertCount: number;
  isIdpsOn: boolean;
  onOpenGuide: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  activeAlertCount,
  isIdpsOn,
  onOpenGuide,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'SOC Dashboard', icon: LayoutDashboard },
    { id: 'network', label: 'Network Monitor', icon: Network },
    { id: 'arp', label: 'ARP Analysis', icon: Database },
    { id: 'engine', label: 'Detection Engine', icon: Cpu },
    { id: 'alerts', label: 'Threat Alerts', icon: AlertTriangle, badge: activeAlertCount > 0 ? activeAlertCount : undefined },
    { id: 'response', label: 'Playbook Response', icon: ListOrdered },
    { id: 'logs', label: 'Audit Logs', icon: Terminal },
    { id: 'settings', label: 'Sensor Config', icon: Settings },
  ];

  return (
    <aside className="w-full lg:w-60 bg-slate-900/95 border-r border-slate-800 flex flex-col shrink-0 font-mono">
      {/* Sensor Health Status block */}
      <div className="p-3 border-b border-slate-800 hidden lg:block">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-bold text-[11px] uppercase tracking-wider">Engine Node</span>
          <span className="flex items-center gap-1 text-[10px] text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            SYNCED
          </span>
        </div>
        <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-[10px] space-y-1">
          <div className="flex justify-between text-slate-400">
            <span>DAEMON:</span>
            <span className="text-cyan-400">arp_sentinel.service</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>TAP PROBE:</span>
            <span className="text-white">eth0:promisc</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>INSPECTOR:</span>
            <span className={isIdpsOn ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
              {isIdpsOn ? 'ACTIVE (FILTERING)' : 'DORMANT (OFF)'}
            </span>
          </div>
        </div>
      </div>

      {/* Nav list */}
      <nav className="p-2 space-y-1 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id as ActiveTab)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-600 text-white animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Presentation Helper button in Sidebar */}
      <div className="p-3 border-t border-slate-800 hidden lg:block">
        <button
          onClick={onOpenGuide}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 text-xs font-semibold transition cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span>Demo Guide (20 Steps)</span>
        </button>
      </div>
    </aside>
  );
};
