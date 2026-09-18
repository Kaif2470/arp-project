import { ArpEntry, DetectionRule, PlaybookStep, ConsoleEvent } from '../types';

export const INITIAL_ARP_ENTRIES: ArpEntry[] = [
  {
    ip: '192.168.1.1',
    expectedMac: 'RR:RR:RR:01',
    observedMac: 'RR:RR:RR:01',
    hostname: 'Gateway (Cisco 2901 Edge)',
    status: 'TRUSTED',
    lastUpdated: '0s ago',
  },
  {
    ip: '192.168.1.10',
    expectedMac: 'AA:AA:AA:10',
    observedMac: 'AA:AA:AA:10',
    hostname: 'Victim (Ubuntu Workstation)',
    status: 'TRUSTED',
    lastUpdated: '2s ago',
  },
  {
    ip: '192.168.1.25',
    expectedMac: 'BB:BB:BB:25',
    observedMac: 'BB:BB:BB:25',
    hostname: 'Database Server (Postgres-01)',
    status: 'TRUSTED',
    lastUpdated: '14s ago',
  },
  {
    ip: '192.168.1.100',
    expectedMac: 'DD:DD:DD:10',
    observedMac: 'DD:DD:DD:10',
    hostname: 'Domain Controller (DC-Primary)',
    status: 'TRUSTED',
    lastUpdated: '45s ago',
  },
];

export const INITIAL_DETECTION_RULES: DetectionRule[] = [
  {
    id: 'rule-1',
    name: 'IP-MAC Integrity',
    description: 'Inspect static and dynamic binding tables for binding alterations',
    status: 'PASS',
    detail: 'All known IP-to-MAC bindings match canonical network baseline.',
  },
  {
    id: 'rule-2',
    name: 'ARP Rate Anomaly',
    description: 'Threshold detection for sudden spikes in gratuitous or reply packets',
    status: 'PASS',
    detail: 'ARP request/reply rate within baseline threshold (3.2 pkts/sec).',
  },
  {
    id: 'rule-3',
    name: 'Unsolicited ARP',
    description: 'Detects replies generated without prior broadcast ARP request',
    status: 'PASS',
    detail: 'No unsolicited Gratuitous ARP (GARP) replies observed.',
  },
  {
    id: 'rule-4',
    name: 'Duplicate MAC Detection',
    description: 'Monitors if multiple distinct IP addresses claim the same physical NIC',
    status: 'PASS',
    detail: 'One-to-one mapping preserved across active switch port MAC table.',
  },
  {
    id: 'rule-5',
    name: 'Traffic Interception',
    description: 'Analyzes packet TTL and latency anomalies for active Man-In-The-Middle',
    status: 'PASS',
    detail: 'Direct L2 layer path verified through switch port 3.',
  },
  {
    id: 'rule-6',
    name: 'Source Identification',
    description: 'Tracks rogue nodes emitting ARP advertisements on non-trunk ports',
    status: 'PASS',
    detail: 'No rogue DHCP/ARP transmitters identified on untrusted ports.',
  },
  {
    id: 'rule-7',
    name: 'Behavior Correlation',
    description: 'Multi-signal machine heuristics combining L2/L3 protocol fingerprints',
    status: 'PASS',
    detail: 'Overall telemetry heuristic: Nominal network operations.',
  },
];

export const INITIAL_PLAYBOOK_STEPS: PlaybookStep[] = [
  { id: 1, name: 'Detect Anomaly', description: 'Monitor L2 ARP cache state & packet velocity', status: 'WAITING' },
  { id: 2, name: 'Correlate Signals', description: 'Correlate IP-MAC mismatches and spoofed replies', status: 'WAITING' },
  { id: 3, name: 'Identify Source', description: 'Pinpoint rogue IP 192.168.1.50 and MAC XX:XX:XX:50', status: 'WAITING' },
  { id: 4, name: 'Generate Alert', description: 'Trigger high severity SOC alert with IOCs', status: 'WAITING' },
  { id: 5, name: 'Block Source', description: 'Enforce 802.1X port isolation & ARP access-list quarantine', status: 'WAITING' },
  { id: 6, name: 'Restore ARP Mapping', description: 'Broadcast anti-poison GARP & inject authoritative MAC', status: 'WAITING' },
  { id: 7, name: 'Verify Recovery', description: 'Validate return to baseline traffic and 0% intercept', status: 'WAITING' },
];

export const INITIAL_CONSOLE_LOGS: ConsoleEvent[] = [
  {
    id: 'log-1',
    timestamp: '10:21:28',
    type: 'INFO',
    message: 'ARP Sentinel IDPS daemon v4.1 initialized in education simulation mode.',
  },
  {
    id: 'log-2',
    timestamp: '10:21:31',
    type: 'INFO',
    message: 'IDPS SENSOR OFF — Standing by for operator activation.',
  },
  {
    id: 'log-3',
    timestamp: '10:21:40',
    type: 'INFO',
    message: 'Normal network baseline observed on VLAN 10 (Victim -> Switch -> Gateway).',
  },
];

export function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function getNowTime(): string {
  const d = new Date();
  return d.toTimeString().split(' ')[0];
}
