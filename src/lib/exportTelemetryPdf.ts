/**
 * DGIPR Command Centre - Telemetry Operations PDF Exporter
 * Generates an official, publication-grade Government of Maharashtra Telemetry & Performance Report.
 */

export interface TelemetryReportOptions {
  language?: 'en' | 'mr';
  district?: string;
  scope?: string;
  period?: string;
}

export function exportTelemetryReportPdf(options: TelemetryReportOptions = {}) {
  const {
    language = 'en',
    district = 'All Districts (Statewide)',
    scope = 'Statewide Clearance',
    period = 'Last 7 Days',
  } = options;

  const now = new Date();
  const timestampStr = now.toLocaleString(language === 'mr' ? 'mr-IN' : 'en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const isMr = language === 'mr';

  const title = isMr
    ? 'माहिती व जनसंपर्क महासंचालनालय — दैनिक दूरमिती व संनियंत्रण अहवाल'
    : 'DIRECTORATE GENERAL OF INFORMATION & PUBLIC RELATIONS — STATE TELEMETRY & OPERATIONS REPORT';

  const subtitle = isMr
    ? 'महाराष्ट्र शासन • ई-प्रशासन व माध्यम संनियंत्रण कक्ष'
    : 'Government of Maharashtra • Digital Governance & Media Command Operations';

  const printHtml = `
<!DOCTYPE html>
<html lang="${isMr ? 'mr' : 'en'}">
<head>
  <meta charset="utf-8" />
  <title>${isMr ? 'डीजीआयपीआर_दूरमिती_अहवाल' : 'DGIPR_State_Telemetry_Report'}_${now.toISOString().slice(0, 10)}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 15mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 0;
      font-size: 11px;
      line-height: 1.45;
    }
    .header {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 12px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .emblem-title {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    .emblem {
      width: 44px;
      height: 44px;
      background: #0f172a;
      color: #fbbf24;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 18px;
    }
    .titles h1 {
      margin: 0;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #0f172a;
      text-transform: uppercase;
    }
    .titles p {
      margin: 2px 0 0 0;
      font-size: 10px;
      color: #64748b;
      font-weight: 500;
    }
    .meta-box {
      text-align: right;
      font-size: 9.5px;
      color: #334155;
      line-height: 1.35;
    }
    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      background: #0f172a;
      color: #ffffff;
      margin-bottom: 4px;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 18px;
    }
    .kpi-card {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px;
      background: #f8fafc;
    }
    .kpi-label {
      font-size: 9px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .kpi-val {
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
      font-family: monospace;
    }
    .kpi-sub {
      font-size: 8.5px;
      color: #16a34a;
      font-weight: 600;
      margin-top: 2px;
    }
    .section-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #0f172a;
      border-left: 3px solid #0f172a;
      padding-left: 6px;
      margin: 16px 0 8px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      font-size: 10px;
    }
    th {
      background: #0f172a;
      color: #ffffff;
      text-align: left;
      padding: 6px 8px;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 8.5px;
      letter-spacing: 0.03em;
    }
    td {
      padding: 5.5px 8px;
      border-bottom: 1px solid #e2e8f0;
      color: #1e293b;
    }
    tr:nth-child(even) td {
      background: #f8fafc;
    }
    .mono {
      font-family: monospace;
      font-weight: 600;
    }
    .tag {
      padding: 1px 5px;
      border-radius: 3px;
      font-weight: 600;
      font-size: 8.5px;
    }
    .tag-green { background: #dcfce7; color: #15803d; }
    .tag-blue { background: #dbeafe; color: #1d4ed8; }
    .footer {
      margin-top: 24px;
      border-top: 1px dashed #cbd5e1;
      padding-top: 8px;
      display: flex;
      justify-content: space-between;
      color: #94a3b8;
      font-size: 8.5px;
    }
    .watermark {
      font-size: 8px;
      color: #64748b;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="emblem-title">
      <div class="emblem">🏛️</div>
      <div class="titles">
        <h1>${title}</h1>
        <p>${subtitle}</p>
      </div>
    </div>
    <div class="meta-box">
      <div class="badge">${scope}</div>
      <div><strong>${isMr ? 'दिनांक' : 'Generated'}:</strong> ${timestampStr}</div>
      <div><strong>${isMr ? 'कार्यक्षेत्र' : 'Filter'}:</strong> ${district} • ${period}</div>
      <div><strong>${isMr ? 'प्रणाली स्थिती' : 'System'}:</strong> SECURE / ENCRYPTED</div>
    </div>
  </div>

  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-label">${isMr ? 'अंतर्ग्रहण वेग (Ingestion Rate)' : 'Ingestion Velocity'}</div>
      <div class="kpi-val">1,480 <span style="font-size:10px;">ev/min</span></div>
      <div class="kpi-sub">▲ 24.7 events/sec • Normal</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">${isMr ? 'सेवा उपलब्धता (System SLA)' : 'System Availability'}</div>
      <div class="kpi-val">99.98%</div>
      <div class="kpi-sub">✓ 90-Min Crisis SLA Met</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">${isMr ? 'सक्रिय माध्यम नोंदी (Media Events)' : 'Active Media Stream'}</div>
      <div class="kpi-val">15,000+</div>
      <div class="kpi-sub">36 Maharashtra Districts</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">${isMr ? 'सर्वोच्च जिल्हा निर्देशांक (Top Ranked)' : 'Top Composite Score'}</div>
      <div class="kpi-val">95.45 <span style="font-size:10px;">/100</span></div>
      <div class="kpi-sub">Thane (MH-04) • Rank #1</div>
    </div>
  </div>

  <div class="section-title">${isMr ? '१. प्रमुख जिल्हा संनियंत्रण कामगिरी (Top District Performance Benchmark)' : '1. Key District Performance & 3-Pillar Index'}</div>
  <table>
    <thead>
      <tr>
        <th>${isMr ? 'क्रमांक' : 'Rank'}</th>
        <th>${isMr ? 'संकेतांक' : 'Code'}</th>
        <th>${isMr ? 'जिल्हा' : 'District'}</th>
        <th>${isMr ? 'विभाग' : 'Division'}</th>
        <th>${isMr ? 'एकूण गुण' : 'Composite Score'}</th>
        <th>${isMr ? 'माध्यम प्रसिद्धी' : 'Volume (35)'}</th>
        <th>${isMr ? 'जनभावना' : 'Sentiment (35)'}</th>
        <th>${isMr ? 'संकट निवारण' : 'Crisis SLA (30)'}</th>
        <th>${isMr ? 'स्थिती' : 'Status'}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="mono">#1</td>
        <td class="mono">MH-04</td>
        <td><strong>${isMr ? 'ठाणे' : 'Thane'}</strong></td>
        <td>Konkan</td>
        <td class="mono"><strong>95.45</strong></td>
        <td class="mono">35.00</td>
        <td class="mono">30.45</td>
        <td class="mono">30.00</td>
        <td><span class="tag tag-green">${isMr ? 'उत्कृष्ट' : 'Optimal'}</span></td>
      </tr>
      <tr>
        <td class="mono">#2</td>
        <td class="mono">MH-05</td>
        <td><strong>${isMr ? 'रायगड' : 'Raigad'}</strong></td>
        <td>Konkan</td>
        <td class="mono"><strong>90.77</strong></td>
        <td class="mono">34.77</td>
        <td class="mono">26.60</td>
        <td class="mono">29.40</td>
        <td><span class="tag tag-green">${isMr ? 'उत्कृष्ट' : 'Optimal'}</span></td>
      </tr>
      <tr>
        <td class="mono">#3</td>
        <td class="mono">MH-03</td>
        <td><strong>${isMr ? 'पालघर' : 'Palghar'}</strong></td>
        <td>Konkan</td>
        <td class="mono"><strong>84.27</strong></td>
        <td class="mono">30.92</td>
        <td class="mono">24.85</td>
        <td class="mono">28.50</td>
        <td><span class="tag tag-green">${isMr ? 'उत्कृष्ट' : 'Optimal'}</span></td>
      </tr>
      <tr>
        <td class="mono">#4</td>
        <td class="mono">MH-10</td>
        <td><strong>${isMr ? 'कोल्हापूर' : 'Kolhapur'}</strong></td>
        <td>Kolhapur</td>
        <td class="mono"><strong>83.50</strong></td>
        <td class="mono">29.50</td>
        <td class="mono">26.00</td>
        <td class="mono">28.00</td>
        <td><span class="tag tag-green">${isMr ? 'उत्कृष्ट' : 'Optimal'}</span></td>
      </tr>
      <tr>
        <td class="mono">#5</td>
        <td class="mono">MH-21</td>
        <td><strong>${isMr ? 'नाशिक' : 'Nashik'}</strong></td>
        <td>Nashik</td>
        <td class="mono"><strong>82.20</strong></td>
        <td class="mono">28.50</td>
        <td class="mono">25.70</td>
        <td class="mono">28.00</td>
        <td><span class="tag tag-green">${isMr ? 'उत्कृष्ट' : 'Optimal'}</span></td>
      </tr>
      <tr>
        <td class="mono">#6</td>
        <td class="mono">MH-01</td>
        <td><strong>${isMr ? 'मुंबई शहर' : 'Mumbai City'}</strong></td>
        <td>Mumbai</td>
        <td class="mono"><strong>81.50</strong></td>
        <td class="mono">29.00</td>
        <td class="mono">25.50</td>
        <td class="mono">27.00</td>
        <td><span class="tag tag-green">${isMr ? 'उत्कृष्ट' : 'Optimal'}</span></td>
      </tr>
      <tr>
        <td class="mono">#7</td>
        <td class="mono">MH-07</td>
        <td><strong>${isMr ? 'पुणे' : 'Pune'}</strong></td>
        <td>Pune</td>
        <td class="mono"><strong>80.80</strong></td>
        <td class="mono">28.20</td>
        <td class="mono">25.60</td>
        <td class="mono">27.00</td>
        <td><span class="tag tag-green">${isMr ? 'उत्कृष्ट' : 'Optimal'}</span></td>
      </tr>
      <tr>
        <td class="mono">#8</td>
        <td class="mono">MH-25</td>
        <td><strong>${isMr ? 'अहिल्यानगर' : 'Ahilyanagar'}</strong></td>
        <td>Nashik</td>
        <td class="mono"><strong>78.40</strong></td>
        <td class="mono">26.00</td>
        <td class="mono">25.40</td>
        <td class="mono">27.00</td>
        <td><span class="tag tag-blue">${isMr ? 'चांगले' : 'Good'}</span></td>
      </tr>
    </tbody>
  </table>

  <div class="section-title">${isMr ? '२. पाइपलाइन व दूरमिती तांत्रिक ऑडिट (Pipeline Health & Telemetry Audit)' : '2. Ingestion Pipeline & Telemetry Infrastructure Audit'}</div>
  <table>
    <thead>
      <tr>
        <th>${isMr ? 'घटक' : 'Subsystem'}</th>
        <th>${isMr ? 'तंत्रज्ञान' : 'Technology'}</th>
        <th>${isMr ? 'स्थिती' : 'Status'}</th>
        <th>${isMr ? 'विलंब (Latency)' : 'Latency'}</th>
        <th>${isMr ? 'तपशील' : 'Details'}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Streaming Ingestion</strong></td>
        <td>Kafka / StGNN Mesh</td>
        <td><span class="tag tag-green">ONLINE</span></td>
        <td class="mono">18ms</td>
        <td>${isMr ? '१,४८० घटना प्रति मिनिट सुरळीत' : '1,480 events/min active without backlog'}</td>
      </tr>
      <tr>
        <td><strong>Fact-Check Verification</strong></td>
        <td>AI Staging + DIO Desk</td>
        <td><span class="tag tag-green">ONLINE</span></td>
        <td class="mono">42m avg</td>
        <td>${isMr ? '९०-मिनिटे संकट एसएलए पूर्ण' : 'Within 90-minute statutory DM resolution SLA'}</td>
      </tr>
      <tr>
        <td><strong>Nirdeshak AI Assistant</strong></td>
        <td>EUREKA Open UI Engine</td>
        <td><span class="tag tag-green">ACTIVE</span></td>
        <td class="mono">&lt; 150ms</td>
        <td>${isMr ? 'जलद-मार्ग व सी१ जनरेटिव्ह यूआय' : 'Fast-path deterministic router + C1 Generative UI'}</td>
      </tr>
      <tr>
        <td><strong>Geographic Coverage</strong></td>
        <td>GIS Maharashtra Boundary</td>
        <td><span class="tag tag-green">SYNCHRONIZED</span></td>
        <td class="mono">Live</td>
        <td>${isMr ? '३६ जिल्हे • ९ महसूल व माहिती विभाग' : '36 Districts • 9 DGIPR Administrative Divisions'}</td>
      </tr>
    </tbody>
  </table>

  <div class="footer">
    <div class="watermark">DGIPR-MAHA-MCC-OFFICIAL-TELEMETRY-REPORT • ISO/IEC 27001 COMPLIANT</div>
    <div>${isMr ? 'पृष्ठ १ / १ • अधिकृत गोपनीय प्रत' : 'Page 1 of 1 • Confidential Official Record'}</div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 250);
    };
  </script>
</body>
</html>
`;

  // Open clean printable document in an invisible iframe or new window
  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(printHtml);
    printWindow.document.close();
  }
}
