export type NetworkState = 'NORMAL' | 'SPOOFING' | 'IDPS_ACTIVE' | 'THREAT_DETECTED' | 'CONTAINMENT' | 'PROTECTED';

export type IdpsStatus = 'OFF' | 'ACTIVE' | 'THREAT_DETECTED' | 'CONTAINED';

export type AttackerStatus = 'NONE' | 'ACTIVE' | 'BLOCKED';

export interface Packet {
  id: string;
  time: string;
  source: string;
  destination: string;
  protocol: 'ARP' | 'TCP' | 'HTTPS' | 'DNS' | 'ICMP';
  type: string;
  status: 'NORMAL' | 'SUSPICIOUS' | 'INTERCEPTED' | 'BLOCKED';
  info?: string;
}

export interface ArpEntry {
  ip: string;
  expectedMac: string;
  observedMac: string;
  hostname: string;
  status: 'TRUSTED' | 'POISONED' | 'RESTORED';
  lastUpdated: string;
}

export interface DetectionRule {
  id: string;
  name: string;
  description: string;
  status: 'PASS' | 'FAIL' | 'NOT_INSPECTED';
  detail: string;
}

export interface SecurityAlertData {
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  sourceIp: string;
  sourceMac: string;
  targetIp: string;
  impersonatedIp: string;
  attackType: string;
  confidence: number;
  timestamp: string;
  indicators: string[];
  recommendedResponse: string;
}

export interface ConsoleEvent {
  id: string;
  timestamp: string;
  type: 'INFO' | 'WARNING' | 'ALERT' | 'BLOCKED' | 'RECOVERY';
  message: string;
}

export interface PlaybookStep {
  id: number;
  name: string;
  description: string;
  status: 'WAITING' | 'ACTIVE' | 'COMPLETED';
}

export interface SocMetrics {
  arpRequestsPerSec: number;
  arpRepliesPerSec: number;
  packetsPerSec: number;
  suspiciousPackets: number;
  blockedPackets: number;
  totalArpFrames: number;
  threatLevel: number;
  attackDuration: number; // in seconds
  activeAlertsCount: number;
}
