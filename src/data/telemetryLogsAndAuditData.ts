export interface LogItem {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  module: 'Telemetry' | 'Pipeline' | 'OCR-Worker' | 'NLP-BERT' | 'TimescaleDB' | 'WebSocket' | 'Auth' | 'Filtration';
  thread: string;
  message: string;
}

export interface AuditItem {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  module: string;
  ip: string;
  clearance: string;
  status: 'Verified' | 'Approved' | 'Executed';
}

const MODULES: LogItem['module'][] = [
  'Telemetry',
  'Pipeline',
  'OCR-Worker',
  'NLP-BERT',
  'TimescaleDB',
  'WebSocket',
  'Auth',
  'Filtration',
];

const LOG_TEMPLATES: { module: LogItem['module']; level: LogItem['level']; msg: string }[] = [
  { module: 'Telemetry', level: 'INFO', msg: 'Ingestion heartbeat packet acknowledged from Thane Gateway Node [THN-01]. Latency 12ms.' },
  { module: 'Telemetry', level: 'INFO', msg: 'Raigad coastal relay connection nominal. Signal SNR: 48 dBm. 280 events/min.' },
  { module: 'Telemetry', level: 'WARN', msg: 'Palghar tribal node packet jitter 42ms exceeds warning watermark (30ms). Packet buffered.' },
  { module: 'Telemetry', level: 'INFO', msg: 'Ratnagiri maritime fiber gateway sync verified. Zero CRC checksum errors across 500K packets.' },
  { module: 'Telemetry', level: 'INFO', msg: 'Sindhudurg south relay heartbeat received. Bandwidth consumption 4.2 MB/s.' },
  { module: 'Pipeline', level: 'INFO', msg: 'Execution Stage 2 (Kafka Buffer) partition #3 balanced. Offset committed at seq #894210.' },
  { module: 'Pipeline', level: 'INFO', msg: 'Stage 3 OCR batch #412 processed in 14.2ms. 24 Devanagari frames vectorized.' },
  { module: 'Pipeline', level: 'WARN', msg: 'Stage 2 buffer utilization surged to 42% during news flash ingestion. Auto-scaling workers.' },
  { module: 'Pipeline', level: 'INFO', msg: 'Stage 4 Indic-BERT sentiment scoring completed. 18 items emitted to verification desk.' },
  { module: 'Pipeline', level: 'INFO', msg: 'Stage 6 dual persistence write dispatched to TimescaleDB and Redis pub/sub channels.' },
  { module: 'OCR-Worker', level: 'INFO', msg: 'Tesseract OCR v5.2 Devanagari dictionary loaded. Confidence 96.4% on Loksatta clipping.' },
  { module: 'OCR-Worker', level: 'WARN', msg: 'Sub-optimal contrast on Palghar rural weekly paper scan. Morphological filter applied.' },
  { module: 'OCR-Worker', level: 'INFO', msg: 'Unicode normalization completed: 1,420 Marathi characters normalized to NFC standard.' },
  { module: 'OCR-Worker', level: 'ERROR', msg: 'Corrupted image header in feed frame #9012. Dropped to dead-letter queue [DLQ-04].' },
  { module: 'NLP-BERT', level: 'INFO', msg: 'Inference batch completed on GPU TensorRT worker #2. Latency 18.2ms for 32 tokens.' },
  { module: 'NLP-BERT', level: 'INFO', msg: 'Urgency scoring matrix calculated: Thane Water Pipeline Repair assigned impact 88/100.' },
  { module: 'NLP-BERT', level: 'WARN', msg: 'Misinformation keyword heuristic trigger: Earthquake Rumor detected in Dahanu feed.' },
  { module: 'NLP-BERT', level: 'INFO', msg: 'Sentiment polarity distribution: 68% Positive, 22% Neutral, 10% Negative for active districts.' },
  { module: 'TimescaleDB', level: 'INFO', msg: 'Timescale chunk partition table telemetry_2026_10_15 created. 0 deadlocks.' },
  { module: 'TimescaleDB', level: 'INFO', msg: 'Continuous aggregate refresh completed for view hourly_district_cpi. Latency 38ms.' },
  { module: 'TimescaleDB', level: 'INFO', msg: 'Connection pool metrics: 42 active connections, 18 idle, max 60. Headroom 30%.' },
  { module: 'TimescaleDB', level: 'WARN', msg: 'Query execution time on unindexed column news_hash took 112ms. Suggested index added.' },
  { module: 'WebSocket', level: 'INFO', msg: 'Broadcast payload fanout to 18 connected DGIPR Command Center dashboard clients.' },
  { module: 'WebSocket', level: 'INFO', msg: 'Client socket #client-dg-841 ping/pong latency measured: 4.8ms.' },
  { module: 'WebSocket', level: 'WARN', msg: 'Slow subscriber detected on mobile connection. Dropping non-critical intermediate frames.' },
  { module: 'Auth', level: 'INFO', msg: 'Session token refreshed for user Rudresh Kumar Sawant (director_konkan). Validity 8 hours.' },
  { module: 'Auth', level: 'INFO', msg: 'Maha-Gov Single Sign-On (SSO) certificate verified via NIC Maharashtra CA.' },
  { module: 'Filtration', level: 'INFO', msg: 'Rule #102 GIS Boundary Validator matched 42 incoming coordinates to Maharashtra State Grid.' },
  { module: 'Filtration', level: 'INFO', msg: 'Rule #103 Broadcast Deduplicator suppressed 4 redundant syndicated articles.' },
  { module: 'Filtration', level: 'WARN', msg: 'Rule #104 Low Credibility Warning: Feed from unaccredited social portal quarantined.' },
];

export function generate100Logs(): LogItem[] {
  const logs: LogItem[] = [];
  const baseTime = new Date('2026-10-15T17:15:00.000Z');

  for (let i = 100; i >= 1; i--) {
    const itemTime = new Date(baseTime.getTime() - i * 2800);
    const tmpl = LOG_TEMPLATES[i % LOG_TEMPLATES.length];
    const ms = String(itemTime.getMilliseconds()).padStart(3, '0');
    const timeStr = `${String(itemTime.getHours()).padStart(2, '0')}:${String(
      itemTime.getMinutes()
    ).padStart(2, '0')}:${String(itemTime.getSeconds()).padStart(2, '0')}.${ms}`;

    logs.push({
      id: `LOG-${8900 + (101 - i)}`,
      timestamp: timeStr,
      level: tmpl.level,
      module: tmpl.module,
      thread: `worker-0${(i % 8) + 1}`,
      message: tmpl.msg,
    });
  }

  return logs;
}

let lastLogIndex = -1;

export function generateNextLiveLog(counter: number): LogItem {
  const now = new Date();
  let nextIdx = Math.floor(Math.random() * LOG_TEMPLATES.length);
  if (nextIdx === lastLogIndex) {
    nextIdx = (nextIdx + 1) % LOG_TEMPLATES.length;
  }
  lastLogIndex = nextIdx;
  const tmpl = LOG_TEMPLATES[nextIdx];
  const ms = String(now.getMilliseconds()).padStart(3, '0');
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
    2,
    '0'
  )}:${String(now.getSeconds()).padStart(2, '0')}.${ms}`;

  return {
    id: `LOG-${9000 + counter}`,
    timestamp: timeStr,
    level: tmpl.level,
    module: tmpl.module,
    thread: `worker-0${Math.floor(Math.random() * 8) + 1}`,
    message: tmpl.msg,
  };
}

const ACTORS = [
  { name: 'Dr. Arvind M. Gokhale', role: 'State DG, DGIPR Maharashtra', clearance: 'Level 1 - State DG', ip: '10.24.1.4' },
  { name: 'Rudresh Kumar Sawant', role: 'Divisional Deputy Director', clearance: 'Level 2 - Divisional Director', ip: '10.24.8.12' },
  { name: 'Vikram S. Mahajan, IAS', role: 'District Collector, Palghar', clearance: 'Level 3 - District Collector', ip: '10.24.12.88' },
  { name: 'Nilesh R. Kelkar, IAS', role: 'District Collector, Thane', clearance: 'Level 3 - District Collector', ip: '10.24.10.14' },
  { name: 'Tanmay V. Bapat, IAS', role: 'District Collector, Raigad', clearance: 'Level 3 - District Collector', ip: '10.24.14.22' },
  { name: 'Suhas R. Bhalerao, IAS', role: 'District Collector, Ratnagiri', clearance: 'Level 3 - District Collector', ip: '10.24.16.35' },
  { name: 'Digambar R. Tawde, IAS', role: 'District Collector, Sindhudurg', clearance: 'Level 3 - District Collector', ip: '10.24.18.49' },
  { name: 'Mandar S. Nerurkar', role: 'DIO Desk Operator', clearance: 'Level 4 - Desk Operator', ip: '10.24.18.5' },
  { name: 'System Auto-Daemon', role: 'Automated Infrastructure Service', clearance: 'System Service Account', ip: '127.0.0.1 (Internal)' },
  { name: 'Maha-CERT Security Auditor', role: 'State Cyber Security Auditor', clearance: 'Cyber Audit Clearance', ip: '10.24.0.99' },
];

const AUDIT_ACTIONS = [
  { action: 'Officer Security Clearance Login Authenticated via PIN', module: 'Auth', status: 'Verified' as const },
  { action: 'Emergency Rebuttal SLA Authorization Approved for Coastal Rumor', module: 'Crisis Desk', status: 'Approved' as const },
  { action: 'Jal Jeevan Mission Press Release Clearance & Public Broadcast', module: 'Press Releases', status: 'Approved' as const },
  { action: 'Ingestion Feed Filter Rule #104 Updated (Credibility Threshold)', module: 'Filtration', status: 'Executed' as const },
  { action: 'Geographic GIS Boundary Calibration Committed for Raigad MIDC', module: 'Filtration', status: 'Executed' as const },
  { action: 'Daily Archive Rotation & Checksum Verification Executed', module: 'Database', status: 'Verified' as const },
  { action: 'Worker Pool Concurrency Scaled to 8 Parallel Processing Threads', module: 'Pipelining', status: 'Executed' as const },
  { action: 'Telemetry Rate Alert Dismissed after Self-Healing Handshake', module: 'Monitoring', status: 'Verified' as const },
  { action: 'Collectorate Feeder Verified for Sindhudurg Chipi Airport Updates', module: 'Telemetry', status: 'Verified' as const },
  { action: 'TLS 1.3 Ingestion Certificate Key Rotation Validated', module: 'Security', status: 'Verified' as const },
  { action: 'Quarantine Review: Misinformation Ticket Approved for Fact-Check Bulletin', module: 'Crisis Desk', status: 'Approved' as const },
  { action: 'District Leaderboard 100-Point Index Final Recalculation Signed Off', module: 'Reports', status: 'Approved' as const },
];

export function generate100Audits(): AuditItem[] {
  const audits: AuditItem[] = [];
  const baseTime = new Date('2026-10-15T17:15:00.000Z');

  for (let i = 100; i >= 1; i--) {
    const itemTime = new Date(baseTime.getTime() - i * 4200);
    const act = AUDIT_ACTIONS[i % AUDIT_ACTIONS.length];
    
    // Strict RBAC clearance: Emergency Rebuttal SLA approval requires Level 1-3 officer
    let actor = ACTORS[i % ACTORS.length];
    if (act.action.includes('Emergency Rebuttal') || act.action.includes('SLA Authorization')) {
      const authorizedOfficers = ACTORS.filter(
        (a) => a.clearance.startsWith('Level 1') || a.clearance.startsWith('Level 2') || a.clearance.startsWith('Level 3')
      );
      actor = authorizedOfficers[i % authorizedOfficers.length];
    }
    const timeStr = `${String(itemTime.getHours()).padStart(2, '0')}:${String(
      itemTime.getMinutes()
    ).padStart(2, '0')}:${String(itemTime.getSeconds()).padStart(2, '0')}`;

    audits.push({
      id: `AUD-${800 + (101 - i)}`,
      timestamp: timeStr,
      actor: actor.name,
      role: actor.role,
      action: act.action,
      module: act.module,
      ip: actor.ip,
      clearance: actor.clearance,
      status: act.status,
    });
  }

  return audits;
}

export function generateNextLiveAudit(counter: number): AuditItem {
  const now = new Date();
  const act = AUDIT_ACTIONS[Math.floor(Math.random() * AUDIT_ACTIONS.length)];
  let actor = ACTORS[Math.floor(Math.random() * ACTORS.length)];
  if (act.action.includes('Emergency Rebuttal') || act.action.includes('SLA Authorization')) {
    const authorizedOfficers = ACTORS.filter(
      (a) => a.clearance.startsWith('Level 1') || a.clearance.startsWith('Level 2') || a.clearance.startsWith('Level 3')
    );
    actor = authorizedOfficers[Math.floor(Math.random() * authorizedOfficers.length)];
  }
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
    2,
    '0'
  )}:${String(now.getSeconds()).padStart(2, '0')}`;

  return {
    id: `AUD-${900 + counter}`,
    timestamp: timeStr,
    actor: actor.name,
    role: actor.role,
    action: act.action,
    module: act.module,
    ip: actor.ip,
    clearance: actor.clearance,
    status: act.status,
  };
}
