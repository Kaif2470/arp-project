import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  NetworkState, 
  IdpsStatus, 
  AttackerStatus, 
  Packet, 
  ArpEntry, 
  DetectionRule, 
  SecurityAlertData, 
  ConsoleEvent, 
  PlaybookStep, 
  SocMetrics 
} from './types';
import { 
  INITIAL_ARP_ENTRIES, 
  INITIAL_DETECTION_RULES, 
  INITIAL_PLAYBOOK_STEPS, 
  INITIAL_CONSOLE_LOGS, 
  getNowTime 
} from './utils/simulationData';
import { Header } from './components/Header';
import { StatusCards } from './components/StatusCards';
import { ActivityTimeline } from './components/ActivityTimeline';
import { NetworkTopology } from './components/NetworkTopology';
import { LiveTrafficInspector } from './components/LiveTrafficInspector';
import { ArpCacheMonitor } from './components/ArpCacheMonitor';
import { DetectionEngine } from './components/DetectionEngine';
import { SecurityAlertModal } from './components/SecurityAlertModal';
import { EventConsole } from './components/EventConsole';
import { ResponsePlaybook } from './components/ResponsePlaybook';
import { PresentationGuideModal } from './components/PresentationGuideModal';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { SettingsView } from './components/SettingsView';

export default function App() {
  // Primary Simulation States
  const [networkState, setNetworkState] = useState<NetworkState>('NORMAL');
  const [idpsStatus, setIdpsStatus] = useState<IdpsStatus>('OFF');
  const [isIdpsOn, setIsIdpsOn] = useState<boolean>(false);
  const [attackerStatus, setAttackerStatus] = useState<AttackerStatus>('NONE');

  // Operational Data
  const [arpEntries, setArpEntries] = useState<ArpEntry[]>(INITIAL_ARP_ENTRIES);
  const [detectionRules, setDetectionRules] = useState<DetectionRule[]>(INITIAL_DETECTION_RULES);
  const [playbookSteps, setPlaybookSteps] = useState<PlaybookStep[]>(INITIAL_PLAYBOOK_STEPS);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleEvent[]>(INITIAL_CONSOLE_LOGS);
  const [packets, setPackets] = useState<Packet[]>([]);
  const [isTrafficPaused, setIsTrafficPaused] = useState<boolean>(false);

  // Security Alert Modal State
  const [currentAlert, setCurrentAlert] = useState<SecurityAlertData | null>(null);
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);

  // Guide Modal & Navigation
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Timers & Metrics
  const [attackSeconds, setAttackSeconds] = useState<number>(0);
  const [metrics, setMetrics] = useState<SocMetrics>({
    arpRequestsPerSec: 3,
    arpRepliesPerSec: 2,
    packetsPerSec: 24,
    suspiciousPackets: 0,
    blockedPackets: 0,
    totalArpFrames: 142,
    threatLevel: 0,
    attackDuration: 0,
    activeAlertsCount: 0,
  });

  const packetIdRef = useRef<number>(100);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to show temporary notification messages
  const showErrorToast = (msg: string) => {
    setErrorMessage(msg);
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    errorTimeoutRef.current = setTimeout(() => {
      setErrorMessage(null);
    }, 4500);
  };

  // Append new console event
  const addConsoleLog = useCallback((type: ConsoleEvent['type'], message: string) => {
    const newLog: ConsoleEvent = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: getNowTime(),
      type,
      message,
    };
    setConsoleLogs((prev) => [...prev, newLog]);
  }, []);

  // Attack duration clock
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if ((networkState === 'SPOOFING' || networkState === 'THREAT_DETECTED' || networkState === 'IDPS_ACTIVE') && attackerStatus !== 'BLOCKED') {
      interval = setInterval(() => {
        setAttackSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [networkState, attackerStatus]);

  // Sync attack duration to metrics
  useEffect(() => {
    setMetrics((m) => ({ ...m, attackDuration: attackSeconds }));
  }, [attackSeconds]);

  // Continuous Simulated Traffic Engine
  useEffect(() => {
    if (isTrafficPaused) return;

    const interval = setInterval(() => {
      packetIdRef.current += 1;
      const pid = `PKT-${packetIdRef.current}`;
      const now = getNowTime();

      if (attackerStatus === 'BLOCKED' || networkState === 'PROTECTED') {
        // Normal traffic with IDPS active (Clean baseline)
        const normalPool: Omit<Packet, 'id' | 'time'>[] = [
          { source: '192.168.1.10', destination: '192.168.1.1', protocol: 'HTTPS', type: 'Web Request (TLS v1.3)', status: 'NORMAL' },
          { source: '192.168.1.1', destination: '192.168.1.10', protocol: 'HTTPS', type: 'Server Response (200 OK)', status: 'NORMAL' },
          { source: '192.168.1.10', destination: '8.8.8.8', protocol: 'DNS', type: 'DNS Query (A records)', status: 'NORMAL' },
          { source: '192.168.1.10', destination: '192.168.1.1', protocol: 'TCP', type: 'ACK / Keep-Alive', status: 'NORMAL' },
          { source: '192.168.1.10', destination: '192.168.1.1', protocol: 'ARP', type: 'ARP Request (Who has 192.168.1.1?)', status: 'NORMAL' },
          { source: '192.168.1.1', destination: '192.168.1.10', protocol: 'ARP', type: 'Authoritative ARP Reply', status: 'NORMAL' },
        ];
        const choice = normalPool[Math.floor(Math.random() * normalPool.length)];
        const newPkt: Packet = { id: pid, time: now, ...choice };

        setPackets((prev) => [newPkt, ...prev.slice(0, 75)]);
        setMetrics((m) => ({
          ...m,
          packetsPerSec: 18 + Math.floor(Math.random() * 8),
          totalArpFrames: choice.protocol === 'ARP' ? m.totalArpFrames + 1 : m.totalArpFrames,
          arpRequestsPerSec: 2 + Math.floor(Math.random() * 2),
          arpRepliesPerSec: 2,
        }));
      } else if (networkState === 'SPOOFING' || networkState === 'IDPS_ACTIVE' || networkState === 'THREAT_DETECTED') {
        // Under ARP Poisoning attack
        const attackPool: Omit<Packet, 'id' | 'time'>[] = [
          { source: '192.168.1.50', destination: '192.168.1.10', protocol: 'ARP', type: 'Forged Gratuitous ARP Reply', status: 'SUSPICIOUS', info: '192.168.1.1 is-at XX:XX:XX:50' },
          { source: '192.168.1.50', destination: '192.168.1.1', protocol: 'ARP', type: 'Forged Gratuitous ARP Reply', status: 'SUSPICIOUS', info: '192.168.1.10 is-at XX:XX:XX:50' },
          { source: '192.168.1.10', destination: '192.168.1.50', protocol: 'TCP', type: 'Session Traffic (MITM Relayed)', status: 'INTERCEPTED' },
          { source: '192.168.1.10', destination: '192.168.1.1', protocol: 'HTTPS', type: 'Web Request (TLS Handshake)', status: 'INTERCEPTED' },
          { source: '192.168.1.10', destination: '8.8.8.8', protocol: 'DNS', type: 'DNS Manipulation (Intercepted via Attacker)', status: 'SUSPICIOUS' },
          { source: '192.168.1.50', destination: '192.168.1.1', protocol: 'TCP', type: 'Relayed Spoofed Segment', status: 'INTERCEPTED' },
        ];
        const choice = attackPool[Math.floor(Math.random() * attackPool.length)];
        const newPkt: Packet = { id: pid, time: now, ...choice };

        setPackets((prev) => [newPkt, ...prev.slice(0, 75)]);
        setMetrics((m) => ({
          ...m,
          packetsPerSec: 42 + Math.floor(Math.random() * 16),
          totalArpFrames: choice.protocol === 'ARP' ? m.totalArpFrames + 2 : m.totalArpFrames,
          suspiciousPackets: m.suspiciousPackets + 1,
          arpRequestsPerSec: 12 + Math.floor(Math.random() * 6),
          arpRepliesPerSec: 24 + Math.floor(Math.random() * 8),
        }));
      } else {
        // Initial Normal state (IDPS OFF)
        const normalPool: Omit<Packet, 'id' | 'time'>[] = [
          { source: '192.168.1.10', destination: '192.168.1.1', protocol: 'ARP', type: 'ARP Request', status: 'NORMAL' },
          { source: '192.168.1.1', destination: '192.168.1.10', protocol: 'ARP', type: 'ARP Reply (is-at RR:RR:RR:01)', status: 'NORMAL' },
          { source: '192.168.1.10', destination: '192.168.1.1', protocol: 'HTTPS', type: 'Web Request (GET /api/v1)', status: 'NORMAL' },
          { source: '192.168.1.10', destination: '8.8.8.8', protocol: 'DNS', type: 'DNS Query (google.com)', status: 'NORMAL' },
          { source: '192.168.1.10', destination: '192.168.1.1', protocol: 'TCP', type: 'SYN / ACK Handshake', status: 'NORMAL' },
        ];
        const choice = normalPool[Math.floor(Math.random() * normalPool.length)];
        const newPkt: Packet = { id: pid, time: now, ...choice };

        setPackets((prev) => [newPkt, ...prev.slice(0, 75)]);
        setMetrics((m) => ({
          ...m,
          packetsPerSec: 20 + Math.floor(Math.random() * 6),
          totalArpFrames: choice.protocol === 'ARP' ? m.totalArpFrames + 1 : m.totalArpFrames,
          arpRequestsPerSec: 2,
          arpRepliesPerSec: 2,
        }));
      }
    }, 1100);

    return () => clearInterval(interval);
  }, [isTrafficPaused, networkState, attackerStatus]);

  // AUTOMATIC THREAT DETECTION & ALERT ENGINE
  // Correlates 7 indicators, generates high-severity alert, and opens the BLOCK ATTACKER popup automatically!
  const triggerAutoDetection = useCallback(() => {
    setNetworkState('THREAT_DETECTED');
    setIdpsStatus('THREAT_DETECTED');
    setAttackerStatus('ACTIVE');

    setMetrics((m) => ({
      ...m,
      threatLevel: 96,
      activeAlertsCount: 1,
    }));

    // Update rules to FAIL / DETECTED
    setDetectionRules((prev) =>
      prev.map((r) => ({
        ...r,
        status: 'FAIL',
        detail:
          r.id === 'rule-1'
            ? 'IP 192.168.1.1 claimed by unauthorized MAC XX:XX:XX:50.'
            : r.id === 'rule-2'
            ? 'ARP reply rate spike: 28 pkts/sec (Normal: <5/sec).'
            : r.id === 'rule-3'
            ? 'Unsolicited Gratuitous ARP (GARP) flood detected.'
            : r.id === 'rule-4'
            ? 'MAC XX:XX:XX:50 is claiming multiple IP addresses (192.168.1.1 & 192.168.1.50).'
            : r.id === 'rule-5'
            ? 'MITM packet forwarding loop detected between victim and gateway.'
            : r.id === 'rule-6'
            ? 'Rogue source port: Switch Port 5 (192.168.1.50).'
            : 'Multi-signal correlation confirmed high confidence ARP Poisoning attack.',
      }))
    );

    // Update Playbook steps
    setPlaybookSteps((prev) =>
      prev.map((s) => {
        if (s.id <= 4) return { ...s, status: 'COMPLETED' };
        if (s.id === 5) return { ...s, status: 'ACTIVE' };
        return s;
      })
    );

    // Structured High Severity Security Alert
    const alertData: SecurityAlertData = {
      severity: 'HIGH',
      title: '🚨 HIGH SEVERITY THREAT DETECTED',
      sourceIp: '192.168.1.50',
      sourceMac: 'XX:XX:XX:50',
      targetIp: '192.168.1.10',
      impersonatedIp: '192.168.1.1',
      attackType: 'ARP Cache Poisoning / Man-In-The-Middle (MITM)',
      confidence: 96,
      timestamp: getNowTime(),
      indicators: [
        'IP-MAC mismatch: Gateway 192.168.1.1 mapped to rogue MAC XX:XX:XX:50',
        'Gateway MAC address changed without administrative DHCP/static assignment',
        'Unsolicited ARP replies received without corresponding broadcast query',
        'Abnormal ARP reply burst velocity (> 24 frames/sec)',
        'Duplicate MAC mapping: XX:XX:XX:50 claims multiple IP addresses',
        'Traffic interception: Packet forwarding and TTL redirection detected via 192.168.1.50',
        'Suspicious source host: Rogue device identified on Switch Port 5',
      ],
      recommendedResponse: 'BLOCK SOURCE (Enforce 802.1X Port Isolation on Switch Port 5)',
    };

    setCurrentAlert(alertData);
    setShowAlertModal(true);

    // Console logs matching the prompt requirements
    addConsoleLog('INFO', 'IDPS SENSOR ACTIVATED');
    addConsoleLog('INFO', 'Scanning current network state');
    addConsoleLog('WARNING', 'IP-MAC mismatch detected: 192.168.1.1 -> XX:XX:XX:50');
    addConsoleLog('WARNING', 'Unsolicited ARP detected');
    addConsoleLog('WARNING', 'Traffic interception confirmed: Victim -> Attacker -> Gateway');
    addConsoleLog('ALERT', 'HIGH SEVERITY ALERT GENERATED');
    addConsoleLog('ALERT', 'Attacker identified: 192.168.1.50 (MAC: XX:XX:XX:50)');
    addConsoleLog('INFO', 'Waiting for analyst response: BLOCK ATTACKER');
  }, [addConsoleLog]);

  // STEP 1 — Start Normal Traffic
  const startNormalTraffic = () => {
    setErrorMessage(null);
    setNetworkState('NORMAL');
    setAttackerStatus('NONE');
    setAttackSeconds(0);
    setMetrics((m) => ({
      ...m,
      threatLevel: 0,
      suspiciousPackets: 0,
      activeAlertsCount: 0,
    }));
    setArpEntries((prev) =>
      prev.map((e) =>
        e.ip === '192.168.1.1'
          ? { ...e, observedMac: 'RR:RR:RR:01', status: 'TRUSTED', lastUpdated: 'Just now' }
          : e
      )
    );
    addConsoleLog('INFO', 'Normal traffic detected (Victim -> Switch -> Gateway).');
  };

  // STEP 2 — Start ARP Spoofing
  const startARPSpoofing = () => {
    setErrorMessage(null);
    setAttackSeconds(0);

    // Poison victim's ARP cache mapping to attacker's MAC
    setArpEntries((prev) =>
      prev.map((e) =>
        e.ip === '192.168.1.1'
          ? { ...e, observedMac: 'XX:XX:XX:50', status: 'POISONED', lastUpdated: 'Just now' }
          : e
      )
    );

    if (isIdpsOn) {
      // If IDPS is ALREADY ON, immediately auto-detect!
      addConsoleLog('WARNING', 'ARP spoofing simulation started: 192.168.1.50 claiming 192.168.1.1');
      triggerAutoDetection();
    } else {
      // CRITICAL: IDPS IS OFF!
      // No detection, no alert, no blocking happens.
      setNetworkState('SPOOFING');
      setAttackerStatus('ACTIVE');
      setMetrics((m) => ({
        ...m,
        threatLevel: 72,
      }));

      addConsoleLog('WARNING', 'ARP spoofing simulation started');
      addConsoleLog('WARNING', 'Gateway MAC mapping changed: 192.168.1.1 -> XX:XX:XX:50');
      addConsoleLog('WARNING', 'Suspicious traffic detected (Interception active. IDPS is currently OFF).');
    }
  };

  // STEP 3 — IDPS ON/OFF Toggle
  // THE MOST IMPORTANT FEATURE:
  // When switched ON while ARP Spoofing is already active,
  // it immediately auto-detects, correlates 7 signals, raises 96% alert,
  // and directly pops up the modal with the "BLOCK ATTACKER" option!
  const toggleIDPS = () => {
    setErrorMessage(null);
    if (!isIdpsOn) {
      // Turn IDPS ON
      setIsIdpsOn(true);

      if (networkState === 'SPOOFING') {
        // Attack is ALREADY active!
        // Immediately run auto detection and trigger alert modal!
        triggerAutoDetection();
      } else if (networkState === 'CONTAINMENT' || networkState === 'PROTECTED') {
        setIdpsStatus('ACTIVE');
        addConsoleLog('INFO', 'IDPS SENSOR ACTIVATED — Network Monitoring Active.');
      } else {
        // Clean baseline network
        setIdpsStatus('ACTIVE');
        addConsoleLog('INFO', 'IDPS SENSOR ACTIVATED');
        addConsoleLog('INFO', 'IDPS ACTIVE — Network Monitoring Started');
      }
    } else {
      // Turn IDPS OFF
      setIsIdpsOn(false);
      setIdpsStatus('OFF');
      if (networkState === 'IDPS_ACTIVE' || networkState === 'THREAT_DETECTED') {
        setNetworkState('SPOOFING');
        setShowAlertModal(false);
      }
      addConsoleLog('INFO', 'IDPS SENSOR OFF');
    }
  };

  // STEP 4 — Block Attacker
  // Enforces 802.1X port isolation, severs attack path, restores trusted ARP cache
  const blockAttacker = () => {
    if (networkState !== 'THREAT_DETECTED' && networkState !== 'SPOOFING') {
      showErrorToast('Attacker must be active or detected before containment.');
      return;
    }

    setNetworkState('CONTAINMENT');
    setAttackerStatus('BLOCKED');

    addConsoleLog('BLOCKED', 'BLOCK ATTACKER selected');
    addConsoleLog('BLOCKED', 'Source blocked: Switch Port 5 isolated');

    // Restore the trusted gateway ARP mapping
    setArpEntries((prev) =>
      prev.map((e) =>
        e.ip === '192.168.1.1'
          ? { ...e, observedMac: 'RR:RR:RR:01', status: 'RESTORED', lastUpdated: 'Just now' }
          : e
      )
    );

    setNetworkState('PROTECTED');
    setIdpsStatus('ACTIVE');

    // Update metrics
    setMetrics((m) => ({
      ...m,
      threatLevel: 5,
      suspiciousPackets: 0,
      blockedPackets: m.blockedPackets + 16,
      activeAlertsCount: 0,
    }));

    // Update playbook steps to completed
    setPlaybookSteps((prev) =>
      prev.map((s) => ({ ...s, status: 'COMPLETED' }))
    );

    // Rules return to PASS / RESTORED
    setDetectionRules((prev) =>
      prev.map((r) => ({
        ...r,
        status: 'PASS',
        detail: 'Threat contained. Canonical mapping enforced by DAI and port security.',
      }))
    );

    addConsoleLog('RECOVERY', 'Trusted ARP mapping restored: 192.168.1.1 -> RR:RR:RR:01');
    addConsoleLog('RECOVERY', 'Suspicious traffic stopped');
    addConsoleLog('RECOVERY', 'NETWORK PROTECTED');

    // Ensure the modal reflects THREAT CONTAINED
    setShowAlertModal(true);
  };

  // STEP 5 — Reset Lab
  const resetLab = () => {
    setErrorMessage(null);
    setNetworkState('NORMAL');
    setIdpsStatus('OFF');
    setIsIdpsOn(false);
    setAttackerStatus('NONE');
    setAttackSeconds(0);
    setArpEntries(INITIAL_ARP_ENTRIES);
    setDetectionRules(INITIAL_DETECTION_RULES);
    setPlaybookSteps(INITIAL_PLAYBOOK_STEPS);
    setConsoleLogs(INITIAL_CONSOLE_LOGS);
    setCurrentAlert(null);
    setShowAlertModal(false);
    setMetrics({
      arpRequestsPerSec: 3,
      arpRepliesPerSec: 2,
      packetsPerSec: 22,
      suspiciousPackets: 0,
      blockedPackets: 0,
      totalArpFrames: 142,
      threatLevel: 0,
      attackDuration: 0,
      activeAlertsCount: 0,
    });
    addConsoleLog('INFO', 'IDPS SENSOR OFF');
    addConsoleLog('INFO', 'Normal traffic detected (Lab reset to factory state).');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black font-sans">
      {/* Top Header with IDPS toggle & Action Controls */}
      <Header
        networkState={networkState}
        idpsStatus={idpsStatus}
        isIdpsOn={isIdpsOn}
        onToggleIdps={toggleIDPS}
        onStartNormalTraffic={startNormalTraffic}
        onStartSpoofing={startARPSpoofing}
        onBlockAttacker={blockAttacker}
        onResetLab={resetLab}
        onOpenGuide={() => setIsGuideOpen(true)}
        errorMessage={errorMessage}
      />

      {/* Main Container with Sidebar Navigation */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          activeAlertCount={metrics.activeAlertsCount}
          isIdpsOn={isIdpsOn}
          onOpenGuide={() => setIsGuideOpen(true)}
        />

        {/* Primary Content View Area */}
        <main className="flex-1 p-3 sm:p-4 overflow-y-auto">
          {/* Top Status Cards: 6 cards */}
          <StatusCards
            networkState={networkState}
            idpsStatus={idpsStatus}
            attackerStatus={attackerStatus}
            metrics={metrics}
          />

          {/* Activity Timeline */}
          <ActivityTimeline
            networkState={networkState}
            idpsStatus={idpsStatus}
            attackerStatus={attackerStatus}
          />

          {/* Render views based on activeTab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-4">
              {/* Row 1: Network Topology Diagram */}
              <NetworkTopology
                networkState={networkState}
                idpsStatus={idpsStatus}
                attackerStatus={attackerStatus}
                attackDuration={attackSeconds}
              />

              {/* Row 2: Live Traffic Inspector & ARP Cache Monitor */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-7">
                  <LiveTrafficInspector
                    packets={packets}
                    isPaused={isTrafficPaused}
                    onTogglePause={() => setIsTrafficPaused(!isTrafficPaused)}
                    onClearPackets={() => setPackets([])}
                  />
                </div>
                <div className="lg:col-span-5">
                  <ArpCacheMonitor
                    arpEntries={arpEntries}
                    onRefreshCache={() => addConsoleLog('INFO', 'Kernel ARP table queried: 4 bindings validated.')}
                  />
                </div>
              </div>

              {/* Row 3: Detection Engine & Response Playbook */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-7">
                  <DetectionEngine
                    rules={detectionRules}
                    networkState={networkState}
                    idpsStatus={idpsStatus}
                    confidence={metrics.threatLevel > 70 ? 96 : metrics.threatLevel > 0 ? 54 : 0}
                  />
                </div>
                <div className="lg:col-span-5">
                  <ResponsePlaybook steps={playbookSteps} />
                </div>
              </div>

              {/* Row 4: IDPS Event Console Terminal */}
              <EventConsole
                logs={consoleLogs}
                onClearLogs={() => setConsoleLogs([])}
              />
            </div>
          )}

          {activeTab === 'network' && (
            <div className="space-y-4">
              <NetworkTopology
                networkState={networkState}
                idpsStatus={idpsStatus}
                attackerStatus={attackerStatus}
                attackDuration={attackSeconds}
              />
              <LiveTrafficInspector
                packets={packets}
                isPaused={isTrafficPaused}
                onTogglePause={() => setIsTrafficPaused(!isTrafficPaused)}
                onClearPackets={() => setPackets([])}
              />
            </div>
          )}

          {activeTab === 'arp' && (
            <div className="space-y-4">
              <ArpCacheMonitor
                arpEntries={arpEntries}
                onRefreshCache={() => addConsoleLog('INFO', 'Kernel ARP table queried: 4 bindings validated.')}
              />
              <LiveTrafficInspector
                packets={packets.filter((p) => p.protocol === 'ARP')}
                isPaused={isTrafficPaused}
                onTogglePause={() => setIsTrafficPaused(!isTrafficPaused)}
                onClearPackets={() => setPackets([])}
              />
            </div>
          )}

          {activeTab === 'engine' && (
            <div className="space-y-4">
              <DetectionEngine
                rules={detectionRules}
                networkState={networkState}
                idpsStatus={idpsStatus}
                confidence={metrics.threatLevel > 70 ? 96 : metrics.threatLevel > 0 ? 54 : 0}
              />
              <EventConsole
                logs={consoleLogs}
                onClearLogs={() => setConsoleLogs([])}
              />
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-4">
              {currentAlert ? (
                <div className="bg-slate-900 border border-rose-500/60 rounded-xl p-5 font-mono shadow-lg">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                    <h3 className="text-rose-400 font-bold text-sm flex items-center gap-2">
                      {currentAlert.title}
                    </h3>
                    <span className="text-xs text-slate-400">{currentAlert.timestamp}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-xs">
                    <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">ATTACKER IP</span>
                      <span className="text-rose-400 font-bold">{currentAlert.sourceIp}</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">ATTACKER MAC</span>
                      <span className="text-rose-300 font-bold">{currentAlert.sourceMac}</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">TARGET IP</span>
                      <span className="text-cyan-400 font-bold">{currentAlert.targetIp}</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">IMPERSONATED GATEWAY</span>
                      <span className="text-indigo-400 font-bold">{currentAlert.impersonatedIp}</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="text-slate-400 text-xs font-bold block mb-1">Indicators of Compromise:</span>
                    <ul className="space-y-1 text-xs text-slate-300 bg-slate-950 p-3 rounded border border-slate-800">
                      {currentAlert.indicators.map((ind, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          <span>{ind}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {attackerStatus !== 'BLOCKED' && (
                    <button
                      onClick={blockAttacker}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs transition cursor-pointer"
                    >
                      [ 🚫 BLOCK ATTACKER ]
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center font-mono text-slate-400">
                  No active security alerts. Network is nominal.
                </div>
              )}
            </div>
          )}

          {activeTab === 'response' && (
            <div className="space-y-4">
              <ResponsePlaybook steps={playbookSteps} />
              <EventConsole
                logs={consoleLogs}
                onClearLogs={() => setConsoleLogs([])}
              />
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              <EventConsole
                logs={consoleLogs}
                onClearLogs={() => setConsoleLogs([])}
              />
            </div>
          )}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* High Severity Security Alert Modal with Direct BLOCK ATTACKER Action */}
      <SecurityAlertModal
        alert={currentAlert}
        isVisible={showAlertModal}
        onBlockAttacker={blockAttacker}
        onDismiss={() => setShowAlertModal(false)}
        isContained={attackerStatus === 'BLOCKED'}
      />

      {/* Classroom Demonstration Guide Modal */}
      <PresentationGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        networkState={networkState}
        idpsStatus={idpsStatus}
        onStartNormalTraffic={startNormalTraffic}
        onStartSpoofing={startARPSpoofing}
        onToggleIdps={toggleIDPS}
        onBlockAttacker={blockAttacker}
        onResetLab={resetLab}
      />

      {/* Bottom Educational Disclaimer as requested */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-3 px-4 text-center text-xs font-mono text-slate-400">
        <p>
          “Educational Simulation — No real network packets are transmitted and no real network attack is performed.”
        </p>
        <p className="text-[10px] text-slate-500 mt-1">
          ARP Sentinel — Intrusion Detection & Prevention System • MSc Cyber Security Simulation
        </p>
      </footer>
    </div>
  );
}
