/**
 * Route-Aware AI Assistant Prompt Pool & Local Knowledge Base
 * Directorate General of Information and Public Relations (DGIPR), Government of Maharashtra
 */

export interface RoutePrompt {
  label: string;
  query: string;
  localAnswer?: string;
}

export interface LocalKnowledgeItem {
  keywords: string[];
  intent: string;
  answer: string;
}

/**
 * 6-8 Contextual prompts per route + default fallback pool
 */
export const ROUTE_PROMPT_POOL: Record<string, RoutePrompt[]> = {
  '/dashboard': [
    {
      label: 'CPI Formula',
      query: 'What is the Communication Performance Index (CPI) formula?',
      localAnswer: 'The Communication Performance Index (CPI) is calculated out of 100 points:\nCPI = Volume Score (25) + TAT Dispatch Score (25) + Sentiment Score (25) + Crisis SLA Score (25). It benchmarks public relations efficiency across all 36 Maharashtra districts.'
    },
    {
      label: 'Rank #1 District',
      query: 'Which district currently holds the Rank #1 benchmark?',
      localAnswer: 'Thane District (Konkan Division) currently ranks #1 in the benchmark with a composite CPI score of 92.4, driven by a 28-minute turnaround time (TAT) and 98% crisis SLA compliance.'
    },
    {
      label: '4 CPI Pillars',
      query: 'Explain the 4 pillars evaluated in district scores.',
      localAnswer: 'The 4 pillars evaluated equally at 25 points each are:\n1. Volume (clippings & briefings processed)\n2. TAT Dispatch (speed to press issuance, target <= 45m)\n3. Sentiment (% favorable coverage across print, TV & digital)\n4. Crisis SLA (% viral rumors refuted within 90 minutes).'
    },
    {
      label: 'Live AV Relays',
      query: 'How do I switch the live audio-visual broadcast channel?',
      localAnswer: 'In the Live Streaming card, use the 2x2 channel selector buttons to toggle between DD Sahyadri, CMO Live Room, State Cabinet Hall, and Press Conference Room relays with zero playback interruption.'
    },
    {
      label: 'Breaking News Wire',
      query: 'What does the red breaking news wire banner show?',
      localAnswer: 'The red breaking news wire banner at the top of the Center Column broadcasts urgent statewide advisories, cabinet decisions, and weather emergency declarations in high contrast with auto-cycling tickers.'
    },
    {
      label: 'Statewide Average TAT',
      query: 'What is the current statewide average Turnaround Time (TAT)?',
      localAnswer: 'The statewide average Turnaround Time (TAT) is currently 42 minutes, well within the state target of 45 minutes, reflecting rapid dispatch across all 6 administrative divisions.'
    },
    {
      label: 'Sentiment Scoring',
      query: 'How is media sentiment index calculated?',
      localAnswer: 'Media sentiment is calculated using an automated multi-factor engine parsing print newspaper OCR clippings, TV broadcast tone, and social listening mentions to generate a composite positive/neutral/negative index.'
    },
    {
      label: 'Responsive Layout',
      query: 'How does the executive dashboard adapt to different screen sizes?',
      localAnswer: 'The dashboard implements progressive 3-stage responsive grid scaling: single-column stack on Mobile (<768px), balanced 2-column split on Tablet (768-1279px), and full 3-column executive command deck on Wide Desktop (>=1280px).'
    }
  ],
  '/': [
    {
      label: 'CPI Formula',
      query: 'What is the Communication Performance Index (CPI) formula?',
      localAnswer: 'The Communication Performance Index (CPI) is calculated out of 100 points:\nCPI = Volume Score (25) + TAT Dispatch Score (25) + Sentiment Score (25) + Crisis SLA Score (25). It benchmarks public relations efficiency across all 36 Maharashtra districts.'
    },
    {
      label: 'Rank #1 District',
      query: 'Which district currently holds the Rank #1 benchmark?',
      localAnswer: 'Thane District (Konkan Division) currently ranks #1 in the benchmark with a composite CPI score of 92.4, driven by a 28-minute turnaround time (TAT) and 98% crisis SLA compliance.'
    },
    {
      label: '4 CPI Pillars',
      query: 'Explain the 4 pillars evaluated in district scores.',
      localAnswer: 'The 4 pillars evaluated equally at 25 points each are:\n1. Volume (clippings & briefings processed)\n2. TAT Dispatch (speed to press issuance, target <= 45m)\n3. Sentiment (% favorable coverage across print, TV & digital)\n4. Crisis SLA (% viral rumors refuted within 90 minutes).'
    },
    {
      label: 'Live AV Relays',
      query: 'How do I switch the live audio-visual broadcast channel?',
      localAnswer: 'In the Live Streaming card, use the 2x2 channel selector buttons to toggle between DD Sahyadri, CMO Live Room, State Cabinet Hall, and Press Conference Room relays with zero playback interruption.'
    },
    {
      label: 'Breaking News Wire',
      query: 'What does the red breaking news wire banner show?',
      localAnswer: 'The red breaking news wire banner at the top of the Center Column broadcasts urgent statewide advisories, cabinet decisions, and weather emergency declarations in high contrast with auto-cycling tickers.'
    },
    {
      label: 'Statewide Average TAT',
      query: 'What is the current statewide average Turnaround Time (TAT)?',
      localAnswer: 'The statewide average Turnaround Time (TAT) is currently 42 minutes, well within the state target of 45 minutes, reflecting rapid dispatch across all 6 administrative divisions.'
    },
    {
      label: 'Sentiment Scoring',
      query: 'How is media sentiment index calculated?',
      localAnswer: 'Media sentiment is calculated using an automated multi-factor engine parsing print newspaper OCR clippings, TV broadcast tone, and social listening mentions to generate a composite positive/neutral/negative index.'
    },
    {
      label: 'Responsive Layout',
      query: 'How does the executive dashboard adapt to different screen sizes?',
      localAnswer: 'The dashboard implements progressive 3-stage responsive grid scaling: single-column stack on Mobile (<768px), balanced 2-column split on Tablet (768-1279px), and full 3-column executive command deck on Wide Desktop (>=1280px).'
    }
  ],
  '/districts': [
    {
      label: 'Konkan Districts',
      query: 'Which districts belong to the Konkan Division?',
      localAnswer: 'Konkan Division comprises 5 key districts: Palghar, Thane, Raigad, Ratnagiri, and Sindhudurg (along with Mumbai City and Mumbai Suburban under Greater Mumbai operational desks).'
    },
    {
      label: 'Export CPI Rankings',
      query: 'How do I export the statewide district CPI rankings?',
      localAnswer: 'Use the Export dropdown in the DashboardToolbar to download statewide district rankings and sub-score metrics as formatted CSV or print-ready executive PDF dossier.'
    },
    {
      label: 'TAT Dispatch Meaning',
      query: 'What does TAT Dispatch Score measure?',
      localAnswer: 'TAT Dispatch Score measures the elapsed time from incident occurrence or press notification to official government release. Dispatches under 30 minutes receive the full 25 points, scaling down to 0 points at >90 minutes.'
    },
    {
      label: 'Bottom 5 Districts',
      query: 'How are bottom performing districts identified?',
      localAnswer: 'Districts are ranked by composite CPI. The Top vs. Lower Matrix highlights the bottom 5 districts by performance variance, providing actionable insights for divisional coordinators to deploy field PR assistance.'
    },
    {
      label: 'Division Filter',
      query: 'How do I filter districts by revenue division?',
      localAnswer: 'Click the Division tabs at the top of the District Registry to filter between All 36 Districts, Konkan, Pune, Nashik, Chhatrapati Sambhajinagar, Amravati, and Nagpur divisions.'
    },
    {
      label: 'Palghar Benchmark',
      query: 'Where is Palghar District positioned?',
      localAnswer: 'Palghar District is ranked #4 in the Konkan Division with an overall CPI score of 84.1, excelling in regional tribal welfare outreach and disaster management communications.'
    },
    {
      label: 'Ranking Refresh',
      query: 'How frequently are district metrics updated?',
      localAnswer: 'District CPI scores update in real-time as press releases are issued, OCR clippings are verified by DIOs, and crisis rebuttals are logged.'
    }
  ],
  '/konkan-index': [
    {
      label: 'Konkan 100-Point Index',
      query: 'What is the Konkan Division 100-Point Performance Index?',
      localAnswer: 'The Konkan 100-Point Quality Index evaluates the 5 Konkan districts (Thane, Raigad, Palghar, Ratnagiri, Sindhudurg) across 4 balanced 25-point pillars: Volume, TAT Dispatch, Media Sentiment, and Crisis SLA compliance.'
    },
    {
      label: 'Sindhudurg Volume Loss',
      query: 'Why did Sindhudurg lose points in the volume pillar?',
      localAnswer: 'Sindhudurg registered a -9.08 point volume deficit due to issuing 185 press releases against the 250 threshold, achieving 15.92 / 25 on the volume pillar.'
    },
    {
      label: 'Thane Sentiment Index',
      query: 'How is Thane District sentiment calculated?',
      localAnswer: 'Thane District achieves 21.75 / 25 on the sentiment pillar, mathematically matching an 87% favorable public sentiment rating across print, broadcast, and digital listening channels.'
    },
    {
      label: 'Konkan Containment',
      query: 'What is the current Konkan crisis containment rate?',
      localAnswer: 'Konkan Division maintains an overall 93.2% crisis containment rate, with Thane and Sindhudurg at 100% SLA and Palghar countering unverified tribal health rumors within 17m 57s.'
    },
    {
      label: 'Live OCR Feed',
      query: 'How does the live newspaper OCR feed work?',
      localAnswer: 'The live OCR stream continuously ingests scanned regional Marathi dailies (Loksatta, Sakal, Pudhari, Lokmat), extracting headlines and assigning confidence scores in real time.'
    },
    {
      label: 'Rank #1 Konkan District',
      query: 'Which district leads the Konkan Division leaderboard?',
      localAnswer: 'Thane District leads the Konkan Division leaderboard at Rank #1 with a composite score of 96.75 CPI, driven by 38m average TAT and 100% crisis SLA adherence.'
    }
  ],
  '/crisis': [
    {
      label: '90-Min SLA Policy',
      query: 'What is the mandatory 90-minute crisis SLA rule?',
      localAnswer: 'State communications protocol mandates that viral misinformation or unverified crisis alerts must be investigated, verified, and officially countered with a Collector-authorized rebuttal within 90 minutes of detection.'
    },
    {
      label: 'Sign-Off Authority',
      query: 'Who holds rebuttal sign-off authority?',
      localAnswer: 'Only Tier 1 (Director General, DGIPR) and Tier 2 (District Magistrates & Collectors for their respective districts) hold rebuttal sign-off authority. Tier 3 operators can draft refutations but cannot authorize broadcast.'
    },
    {
      label: 'Dispatch Rebuttal',
      query: 'How do I dispatch an official crisis rebuttal?',
      localAnswer: 'Open the active incident card in the Crisis War Room, review the ground evidence provided by the field DIO, draft or modify the refutation statement, and click "Authorize & Broadcast Rebuttal".'
    },
    {
      label: 'SLA Expiration',
      query: 'What occurs if a crisis SLA timer reaches 00:00?',
      localAnswer: 'If the 90-minute countdown expires without a rebuttal, an automated red-level escalation alert is dispatched to the Director General and Divisional Commissioner, and the district penalty reduces its CPI score.'
    },
    {
      label: 'Evidence Ledger',
      query: 'What evidence is reviewed before refuting rumors?',
      localAnswer: 'The evidence ledger presents a side-by-side comparison between the viral claim (source URL, social velocity, reached impressions) and field DIO verified facts, geo-tagged photographs, and department reports.'
    },
    {
      label: 'Dismiss False Alarms',
      query: 'Can authorized officers dismiss false crisis alarms?',
      localAnswer: 'Yes, authorized Collectors or the DG can mark an alert as "Dismiss as Non-Critical / False Alarm" with mandatory justification notes, archiving the incident without triggering an SLA penalty.'
    }
  ],
  '/command-center': [
    {
      label: 'Latency Benchmark',
      query: 'What is the network latency and throughput standard?',
      localAnswer: 'The telemetry architecture maintains an average API latency under 120ms and Redis queue throughput of ~1,400 messages/sec across all statewide ingestion endpoints.'
    },
    {
      label: '3-Column Deck',
      query: 'What are the 3 columns of the Command Center?',
      localAnswer: 'The Command Center is organized into:\n- Left: Multi-Channel Media Ingestion (Newspaper, TV, Social)\n- Center: Interactive Maharashtra GIS Topology & DIO Telemetry Drawer\n- Right: Verified Leadership Directives & Audio-Visual Relay'
    },
    {
      label: 'DIO Telemetry Drawer',
      query: 'How do I inspect District Information Officer details?',
      localAnswer: 'Click on any of the 36 districts on the interactive map or select from the district selector to open the slide-out DIO Drawer showing contact details, active duty status, and daily transmission counts.'
    },
    {
      label: 'Animated Telemetry Mesh',
      query: 'What does the animated telemetry mesh represent?',
      localAnswer: 'The animated mesh visualizes live network telemetry packets moving across nodal server hubs across Mumbai, Pune, and regional data centers in an institutional light government theme.'
    },
    {
      label: 'Sub-Navigation Tabs',
      query: 'How do I navigate Command Center sub-modules?',
      localAnswer: 'Use the sub-navigation header bar to seamlessly switch between the 3-Column Command Deck (/command-center), Raw Ingestion Stream (/command-center/raw-ingestion), and Pipeline Flow (/command-center/pipeline-flow).'
    },
    {
      label: 'Queue Status',
      query: 'How are ingestion bottlenecks handled?',
      localAnswer: 'If ingestion queues exceed 5,000 pending items, automated worker scaling triggers in Redis and notification badges turn amber to alert command operations engineers.'
    }
  ],
  '/command-center/raw-ingestion': [
    {
      label: 'Ingestion Sources',
      query: 'Which media channels are ingested into the platform?',
      localAnswer: 'The platform ingests 18 regional daily newspapers via high-resolution OCR, 4 broadcast TV news channels, official CMO/Cabinet press feeds, and social listening streams (X/Twitter, Facebook, Instagram, YouTube).'
    },
    {
      label: 'OCR Clipping Schedule',
      query: 'When does regional print newspaper OCR scanning occur?',
      localAnswer: 'Morning print scanning runs from 06:00 AM to 08:30 AM daily, converting scanned e-papers and physical clippings into searchable, bilingual Marathi and English text.'
    },
    {
      label: 'Filter by Division',
      query: 'How do I filter raw ingestion items by region?',
      localAnswer: 'Use the division pills (Konkan, Pune, Nashik, etc.) at the top of the Raw Ingestion ledger to isolate regional press mentions and localized TV coverage.'
    },
    {
      label: 'Sentiment Distribution',
      query: 'How are clippings sentiment-classified?',
      localAnswer: 'Each clipping receives automated NLP sentiment tagging (Positive, Neutral, Negative) which is verified by field DIOs before contributing to the district CPI aggregate.'
    },
    {
      label: 'Search Transcripts',
      query: 'Can I search raw newspaper OCR transcripts?',
      localAnswer: 'Yes, type keywords into the search filter to query through Marathi and English headline transcripts with matching keyword highlighting.'
    },
    {
      label: 'Real-time Streaming',
      query: 'How often does the raw ingestion stream update?',
      localAnswer: 'New items arrive every 10-30 seconds during operational hours via simulated WebSocket streaming and live API polling.'
    }
  ],
  '/system-monitoring/raw-ingestion': [
    {
      label: 'Ingestion Sources',
      query: 'Which media channels are ingested into the platform?',
      localAnswer: 'The platform ingests 18 regional daily newspapers via high-resolution OCR, 4 broadcast TV news channels, official CMO/Cabinet press feeds, and social listening streams (X/Twitter, Facebook, Instagram, YouTube).'
    },
    {
      label: 'OCR Clipping Schedule',
      query: 'When does regional print newspaper OCR scanning occur?',
      localAnswer: 'Morning print scanning runs from 06:00 AM to 08:30 AM daily, converting scanned e-papers and physical clippings into searchable, bilingual Marathi and English text.'
    },
    {
      label: 'Filter by Division',
      query: 'How do I filter raw ingestion items by region?',
      localAnswer: 'Use the division pills (Konkan, Pune, Nashik, etc.) at the top of the Raw Ingestion ledger to isolate regional press mentions and localized TV coverage.'
    },
    {
      label: 'Sentiment Distribution',
      query: 'How are clippings sentiment-classified?',
      localAnswer: 'Each clipping receives automated NLP sentiment tagging (Positive, Neutral, Negative) which is verified by field DIOs before contributing to the district CPI aggregate.'
    },
    {
      label: 'Search Transcripts',
      query: 'Can I search raw newspaper OCR transcripts?',
      localAnswer: 'Yes, type keywords into the search filter to query through Marathi and English headline transcripts with matching keyword highlighting.'
    },
    {
      label: 'Real-time Streaming',
      query: 'How often does the raw ingestion stream update?',
      localAnswer: 'New items arrive every 10-30 seconds during operational hours via simulated WebSocket streaming and live API polling.'
    }
  ],
  '/command-center/pipeline-flow': [
    {
      label: '6 Pipeline Stages',
      query: 'What are the 6 stages of the data processing pipeline?',
      localAnswer: 'The 6 stages are:\n1. Multi-Channel Ingestion\n2. Sanitization & Normalization\n3. NLP Sentiment & Entity Extraction\n4. Redis Message Queue Broker\n5. Postgres & Vector DB Storage\n6. Real-time Dashboard Dissemination.'
    },
    {
      label: 'Data Packet Pulses',
      query: 'What do the animated packet pulses indicate?',
      localAnswer: 'Animated green and blue packet conduits visualize throughput health. Steady flow indicates healthy queues, while pulsing amber lines signal heavy ingestion loads.'
    },
    {
      label: 'Queue Latency',
      query: 'Where does pipeline latency bottleneck typically occur?',
      localAnswer: 'Stage 3 (NLP sentiment & OCR tokenization) is computationally heaviest, optimized via parallel worker thread pools to maintain under 250ms processing per item.'
    },
    {
      label: 'Fallback Protocols',
      query: 'What happens if a pipeline node encounters an error?',
      localAnswer: 'Failed payloads are automatically redirected to a Dead Letter Queue (DLQ) with exponential backoff retries, ensuring zero loss of critical government advisories.'
    },
    {
      label: 'Database Sync',
      query: 'How frequently does pipeline persist to database?',
      localAnswer: 'Transactions are batched and flushed to Postgres storage every 500ms, ensuring immediate historical availability for dossier reports.'
    },
    {
      label: 'GIGW Compliance',
      query: 'Is the pipeline diagram accessible in light theme?',
      localAnswer: 'Yes, the animated pipeline conforms to institutional GIGW 3.0 / UX4G light government standards with high-contrast conduits and accessible typography.'
    }
  ],
  '/system-monitoring/pipeline-flow': [
    {
      label: '6 Pipeline Stages',
      query: 'What are the 6 stages of the data processing pipeline?',
      localAnswer: 'The 6 stages are:\n1. Multi-Channel Ingestion\n2. Sanitization & Normalization\n3. NLP Sentiment & Entity Extraction\n4. Redis Message Queue Broker\n5. Postgres & Vector DB Storage\n6. Real-time Dashboard Dissemination.'
    },
    {
      label: 'Data Packet Pulses',
      query: 'What do the animated packet pulses indicate?',
      localAnswer: 'Animated green and blue packet conduits visualize throughput health. Steady flow indicates healthy queues, while pulsing amber lines signal heavy ingestion loads.'
    },
    {
      label: 'Queue Latency',
      query: 'Where does pipeline latency bottleneck typically occur?',
      localAnswer: 'Stage 3 (NLP sentiment & OCR tokenization) is computationally heaviest, optimized via parallel worker thread pools to maintain under 250ms processing per item.'
    },
    {
      label: 'Fallback Protocols',
      query: 'What happens if a pipeline node encounters an error?',
      localAnswer: 'Failed payloads are automatically redirected to a Dead Letter Queue (DLQ) with exponential backoff retries, ensuring zero loss of critical government advisories.'
    },
    {
      label: 'Database Sync',
      query: 'How frequently does pipeline persist to database?',
      localAnswer: 'Transactions are batched and flushed to Postgres storage every 500ms, ensuring immediate historical availability for dossier reports.'
    },
    {
      label: 'GIGW Compliance',
      query: 'Is the pipeline diagram accessible in light theme?',
      localAnswer: 'Yes, the animated pipeline conforms to institutional GIGW 3.0 / UX4G light government standards with high-contrast conduits and accessible typography.'
    }
  ],
  '/system-monitoring': [
    {
      label: 'System Health',
      query: 'What is the current server CPU and memory load?',
      localAnswer: 'Core infrastructure is operating normally with CPU load at 24%, Memory utilization at 41%, and zero active service degradation.'
    },
    {
      label: '12-Hour Session TTL',
      query: 'What is the government authentication session duration?',
      localAnswer: 'All officer sessions are enforced with a strict 12-hour Time-to-Live (TTL) signed via HMAC-SHA256 JWT in HTTP-only cookies, automatically expiring at end-of-shift.'
    },
    {
      label: 'Audit Trail',
      query: 'How are operational actions audited?',
      localAnswer: 'Every rebuttal dispatch, press release approval, and login event is immutably logged with officer ID, timestamp, clearance tier, and IP address.'
    },
    {
      label: 'API Throughput',
      query: 'What is the platform API throughput?',
      localAnswer: 'The platform serves an average of 1,420 requests/sec with a 99.98% uptime SLA across all state government intranets and field desks.'
    },
    {
      label: 'Redirection Guards',
      query: 'How do session redirection guards work?',
      localAnswer: 'Next.js Edge Middleware intercepts unauthorized requests to internal routes and automatically redirects active sessions away from /login back to the command deck.'
    },
    {
      label: 'Error Rates',
      query: 'What is the current platform error rate?',
      localAnswer: 'Global HTTP 5xx error rate is 0.012%, well below the institutional threshold of 0.1%.'
    }
  ],
  '/press-releases': [
    {
      label: 'Drafting Workflow',
      query: 'How do I draft and publish a bilingual press release?',
      localAnswer: 'Click "New Press Release" to open the bilingual drafting suite. Enter the English and Marathi copies, select target departments and districts, attach official media, and submit for editorial clearance.'
    },
    {
      label: 'Editorial Clearance',
      query: 'What is the DGIPR editorial approval chain?',
      localAnswer: 'Releases progress from Drafted (DIO Desk) -> Verified (Section Officer) -> Approved (Deputy Director) -> Dispatched (Director General sign-off).'
    },
    {
      label: 'Export PDF Release',
      query: 'How do I download an official press release as PDF?',
      localAnswer: 'Click the "Download PDF" action on any approved press release card to generate an official Government of Maharashtra stamped PDF with QR verification.'
    },
    {
      label: 'District Targeting',
      query: 'Can press releases be targeted to specific districts?',
      localAnswer: 'Yes, you can target statewide broadcast or select specific revenue divisions and districts for localized agricultural, weather, or civic advisories.'
    },
    {
      label: 'Release Speed (TAT)',
      query: 'What is the average press release dispatch turnaround?',
      localAnswer: 'The average press release dispatch turnaround time is 38 minutes from initial ministerial sign-off to media wire broadcast.'
    },
    {
      label: 'Media Pool Distribution',
      query: 'Which media pools receive authorized releases?',
      localAnswer: 'Authorized releases are automatically dispatched to accredited state correspondents, PTI/UNI wire services, regional daily editors, and official DGIPR social channels.'
    }
  ],
  '/media': [
    {
      label: 'Media Asset Vault',
      query: 'What assets are stored in the media vault?',
      localAnswer: 'The vault archives high-resolution event photographs with photographer credits, CMO video broadcasts, TV news airtime recordings, and regional daily OCR clippings.'
    },
    {
      label: 'OCR Clipping Search',
      query: 'How do I search newspaper clippings by keyword?',
      localAnswer: 'Enter English or Devanagari Marathi keywords into the media search bar to filter OCR transcripts across 18 regional daily newspapers.'
    },
    {
      label: 'TV Airtime Distribution',
      query: 'How is broadcast TV coverage measured?',
      localAnswer: 'Airtime is categorized by ministry and sentiment across Doordarshan Sahyadri, ABP Majha, Zee 24 Taas, and TV9 Marathi.'
    },
    {
      label: 'Download Media Reels',
      query: 'Can I download high-definition event video reels?',
      localAnswer: 'Yes, authorized officers can download 1080p MP4 reels and photographic archives tagged with date, event, and ministerial speaker.'
    },
    {
      label: 'Sentiment Breakdown',
      query: 'What is the overall statewide media sentiment breakdown?',
      localAnswer: 'Statewide media coverage is currently 68% Positive, 24% Neutral, and 8% Under-Review/Negative across all verified outlets.'
    },
    {
      label: 'Social Listening Feeds',
      query: 'Where are social media intelligence metrics displayed?',
      localAnswer: 'Real-time social feeds from X, Facebook, Instagram, and YouTube are aggregated with engagement metrics and sentiment tagging in the Social Media card.'
    }
  ],
  '/activities': [
    {
      label: '24-Hour PR Lifecycle',
      query: 'What is the 24-hour state PR operational cycle?',
      localAnswer: 'The 24-hour cycle runs:\n- 06:00-08:30 AM: Scraping & OCR Ingestion\n- 08:30-10:00 AM: DIO Verification & Sentiment\n- 10:00-01:00 PM: Departmental Dispatch\n- 01:00-04:30 PM: Crisis SLA Monitoring\n- 04:30-07:00 PM: Live CMO Relays\n- 07:00-09:30 PM: Leadership Briefings.'
    },
    {
      label: 'Morning Ingestion Window',
      query: 'What happens between 06:00 AM and 08:30 AM?',
      localAnswer: 'Field DIOs and automated ingestion scrapers scan 18 regional dailies, log morning TV broadcasts, and compile initial sentiment dossiers for divisional directors.'
    },
    {
      label: 'CMO Press Pool',
      query: 'How are ministerial itineraries tracked?',
      localAnswer: 'The Activities calendar displays scheduled cabinet meetings, state infrastructure inaugurations, and assigned official press pools with DIO contact assignments.'
    },
    {
      label: 'Evening Briefing',
      query: 'What is included in the 07:00 PM leadership briefing?',
      localAnswer: 'The evening briefing synthesizes the day\'s CPI scores, refuted rumors, top positive news stories, and viral media risks for the Chief Minister and Chief Secretary.'
    },
    {
      label: 'Cabinet Hall Relays',
      query: 'How are live cabinet press briefings managed?',
      localAnswer: 'Live briefings are coordinated via the Audio-Visual wing with simultaneous English and Marathi audio interpretation and direct YouTube/DD relays.'
    },
    {
      label: 'Field PR Coordination',
      query: 'How do district DIOs report activity milestones?',
      localAnswer: 'DIOs submit hourly activity logs and dispatch confirmations directly through the field desk interface, updating the statewide activity ledger in real time.'
    }
  ],
  '/reports': [
    {
      label: 'Daily Intelligence Dossier',
      query: 'How do I generate the statewide daily intelligence dossier?',
      localAnswer: 'Navigate to Reports, select the desired date range and revenue divisions, and click "Generate Executive Dossier" to compile an automated multi-page summary.'
    },
    {
      label: 'Export Formats',
      query: 'Which export formats are supported for reports?',
      localAnswer: 'The platform supports structured CSV for raw data analysis and institutional GIGW-compliant PDF dossiers with official government headers and charts.'
    },
    {
      label: 'Scheduled Morning Report',
      query: 'Can reports be scheduled automatically?',
      localAnswer: 'Yes, daily executive briefings are automatically compiled at 07:00 AM and 07:00 PM and archived in the reports ledger for leadership review.'
    },
    {
      label: 'Metrics Included',
      query: 'What metrics are included in executive reports?',
      localAnswer: 'Reports synthesize 36-district CPI composite scores, average turnaround times, crisis SLA compliance rates, sentiment distribution charts, and major news clippings.'
    },
    {
      label: 'Custom District Report',
      query: 'Can I export a single district\'s performance record?',
      localAnswer: 'Yes, use the District filter dropdown in Reports to generate a dedicated single-district report detailing volume, TAT, sentiment, and crisis refutations.'
    },
    {
      label: 'Report Recipients',
      query: 'Who has access to executive reports?',
      localAnswer: 'Tier 1 DG Admin and Tier 2 Divisional Directors & District Collectors have full access to generate and download signed intelligence reports.'
    }
  ],
  '/notifications': [
    {
      label: 'SLA Escalation Alerts',
      query: 'What triggers high-priority operational alerts?',
      localAnswer: 'Alerts trigger when a crisis SLA timer drops below 30 minutes, when an unverified viral rumor exceeds 10,000 views, or when ingestion queues experience unexpected spikes.'
    },
    {
      label: 'Filter by Urgency',
      query: 'How do I filter notifications by SLA urgency?',
      localAnswer: 'Use the urgency tabs (All, Critical, Warning, Info) to view active 90-minute crisis countdowns and high-priority departmental queries.'
    },
    {
      label: 'DIO Field Queries',
      query: 'How do I respond to field DIO queries?',
      localAnswer: 'Click on any DIO notification item to open the query response drawer, type field instructions or factual clarifications, and send directly to the officer.'
    },
    {
      label: 'Mark All Read',
      query: 'Can I clear or mark all notifications as read?',
      localAnswer: 'Click the "Mark All as Read" button at the top right of the Notifications Center to clear unread indicator badges while preserving the audit ledger.'
    },
    {
      label: 'Audio Chime Alerts',
      query: 'Do critical crisis alerts play an audio alert?',
      localAnswer: 'High-priority Zone 5 emergency alerts trigger an optional subtle executive chime on the command desk to alert duty operators immediately.'
    },
    {
      label: 'Dispatch Log',
      query: 'Where are notification dispatch logs recorded?',
      localAnswer: 'All operational alerts and responses are archived in the telemetry audit ledger with officer timestamps and resolution durations.'
    }
  ],
  '/profile': [
    {
      label: 'Clearance Tiers',
      query: 'What are the 3 government clearance tiers?',
      localAnswer: 'Tier 1 (Full State Command: DG Admin, statewide purview)\nTier 2 (Divisional/District Command: Collectors & Divisional Directors)\nTier 3 (Field Desk: DIO Operators, drafting and monitoring only).'
    },
    {
      label: 'Language Toggle',
      query: 'How do I toggle between English and Marathi?',
      localAnswer: 'Click the language switch pill in the top header or in your Profile screen to switch the entire application between English and Marathi (मराठी) localization.'
    },
    {
      label: 'Current Officer',
      query: 'How do I check my active credentials and designation?',
      localAnswer: 'Your Profile screen displays your official designation, clearance tier, assigned revenue division, official gov email, and active 12-hour session expiration timer.'
    },
    {
      label: 'Logout Security',
      query: 'How do I securely log out of the command center?',
      localAnswer: 'Click "Secure Logout" in the Profile screen or user header dropdown to revoke your active JWT session cookie and return to the authentication portal.'
    },
    {
      label: 'Evaluation Personas',
      query: 'How do I switch between test personas for evaluation?',
      localAnswer: 'On the /login screen, click the "Evaluation / Demo Quick-Auth (5 Personas)" floating bar at the bottom right to prefill credentials for DG Gokhale, Collector Mahajan, and others with PIN 8842.'
    },
    {
      label: 'Session Duration',
      query: 'How long does my login session remain active?',
      localAnswer: 'Sessions remain active for 12 hours from authentication, enforced by cryptographic HMAC-SHA256 JWT cookies with automatic background renewal.'
    }
  ],
  default: [
    {
      label: 'Portal Overview',
      query: 'What is the Maha-Command Center?',
      localAnswer: 'The Maha-Command Center is the central statewide media intelligence, crisis management, and public relations command portal for the Directorate General of Information and Public Relations (DGIPR), Government of Maharashtra.'
    },
    {
      label: 'CPI Formula',
      query: 'What is the Communication Performance Index (CPI)?',
      localAnswer: 'CPI is an objective 100-point composite score: Volume (25) + TAT Dispatch (25) + Sentiment (25) + Crisis SLA (25), benchmarking all 36 districts across 6 revenue divisions.'
    },
    {
      label: 'Crisis 90-Min SLA',
      query: 'How does the 90-minute crisis rebuttal SLA work?',
      localAnswer: 'Viral rumors and crisis incidents must be investigated, verified by DIOs, and officially refuted by authorized District Collectors or the DG within 90 minutes of detection.'
    },
    {
      label: '6 Revenue Divisions',
      query: 'Which revenue divisions are covered by the platform?',
      localAnswer: 'The platform covers all 6 administrative divisions of Maharashtra: Konkan, Pune, Nashik, Chhatrapati Sambhajinagar, Amravati, and Nagpur, encompassing 36 administrative districts.'
    },
    {
      label: 'Bilingual Support',
      query: 'Is the platform available in Marathi?',
      localAnswer: 'Yes, the entire portal is fully bilingual with seamless real-time switching between English and Marathi (मराठी), including numbers, charts, and dates.'
    },
    {
      label: 'Test Credentials',
      query: 'What are the test login credentials?',
      localAnswer: 'Use PIN 8842 with any authorized officer persona (e.g., admin, collector_palghar, collector_thane, director_konkan) or use the 1-click Quick-Auth drawer on /login.'
    }
  ]
};

/**
 * Structured local FAQ / route-knowledge dictionary
 */
export const LOCAL_KNOWLEDGE_BASE: LocalKnowledgeItem[] = [
  {
    keywords: ['cpi', 'formula', 'composite index', 'score calculation', 'scoring'],
    intent: 'CPI Calculation',
    answer: 'The Communication Performance Index (CPI) is calculated out of 100 points:\n\nCPI = Volume Score (25) + TAT Dispatch Score (25) + Sentiment Score (25) + Crisis SLA Score (25).\n\nEach pillar evaluates public relations efficiency across all 36 Maharashtra districts.'
  },
  {
    keywords: ['sla', '90-minute', '90 min', 'crisis deadline', 'timer', 'rebuttal window'],
    intent: '90-Minute Crisis SLA',
    answer: 'State protocol mandates a strict 90-minute Service Level Agreement (SLA) for countering viral misinformation. Authorized District Collectors or the Director General must review ground facts from the field DIO and broadcast an official rebuttal before the timer reaches 00:00.'
  },
  {
    keywords: ['konkan', 'districts in konkan', 'palghar', 'thane', 'raigad', 'ratnagiri', 'sindhudurg'],
    intent: 'Konkan Division Districts',
    answer: 'Konkan Division comprises 5 primary administrative districts: Palghar, Thane, Raigad, Ratnagiri, and Sindhudurg (in addition to Mumbai City and Mumbai Suburban under Greater Mumbai operational desks).'
  },
  {
    keywords: ['tat', 'turnaround', 'dispatch time', 'dispatch speed'],
    intent: 'Turnaround Time (TAT)',
    answer: 'Average Turnaround Time (TAT) measures the minutes elapsed between incident occurrence or press notification and official government press issuance. Target speed is <= 45 minutes; Thane currently leads with 28 minutes.'
  },
  {
    keywords: ['persona', 'login', 'pin', 'credentials', 'password', '8842', 'test user'],
    intent: 'Login Credentials',
    answer: 'Authorized test accounts use Security PIN 8842 (or any password):\n- DG Admin: admin (Dr. Arvind M. Gokhale)\n- Collector Palghar: collector_palghar (Vikram S. Mahajan, IAS)\n- Collector Thane: collector_thane (Nilesh R. Kelkar, IAS)\n- Divisional Director: director_konkan (Rudresh K. Sawant)\n- Field Desk: operator_konkan (Mandar S. Nerurkar)\nOr use the 1-click demo drawer on /login.'
  },
  {
    keywords: ['clearance', 'tier', 'role', 'authority', 'permission'],
    intent: 'Clearance Tiers',
    answer: 'The platform enforces 3 security clearance tiers:\n- Tier 1: Full State Command (DG Admin, statewide purview & rebuttal authority)\n- Tier 2: Divisional / District Command (Collectors & Deputy Directors, localized rebuttal authority)\n- Tier 3: Field Desk (DIO Operators, drafting & raw ingestion monitoring).'
  },
  {
    keywords: ['ocr', 'newspaper', 'print', 'clipping', 'dailies'],
    intent: 'Newspaper OCR Stream',
    answer: 'The system ingests 18 regional daily newspapers between 06:00 AM and 08:30 AM daily, running optical character recognition (OCR) to convert scanned Marathi and English print clippings into searchable, sentiment-tagged intelligence records.'
  },
  {
    keywords: ['live stream', 'video', 'broadcast', 'sahyadri', 'cmo live'],
    intent: 'Live Broadcast Relays',
    answer: 'The Audio-Visual wing streams live broadcast feeds from 4 official channels: DD Sahyadri, CMO Live Room, State Cabinet Hall, and Press Conference Hall, switchable via the 2x2 relay selector.'
  },
  {
    keywords: ['export', 'pdf', 'csv', 'download report', 'dossier'],
    intent: 'Data Export Formats',
    answer: 'Statewide district rankings, intelligence reports, and press releases can be exported directly as structured CSV spreadsheets or official GIGW-compliant PDF dossiers with government emblems and verification stamps.'
  },
  {
    keywords: ['bilingual', 'marathi', 'english', 'language', 'भाषा'],
    intent: 'Bilingual Support',
    answer: 'The portal supports full bilingual English and Marathi (मराठी) localization. Toggle the language pill in the top header to dynamically translate all UI text, numerals, chart labels, and dates.'
  },
  {
    keywords: ['lifecycle', '24-hour', 'daily workflow', 'schedule', 'hours'],
    intent: '24-Hour Operational Cycle',
    answer: 'The 24-hour state communications cycle runs:\n- 06:00-08:30 AM: Scraping & OCR Ingestion\n- 08:30-10:00 AM: DIO Verification & Sentiment\n- 10:00-01:00 PM: Departmental Press Dispatch\n- 01:00-04:30 PM: Crisis SLA Monitoring\n- 04:30-07:00 PM: Live CMO Relays & Briefings\n- 07:00-09:30 PM: Leadership Dossier Compilation.'
  }
];

/**
 * Lightweight fuzzy/keyword match against local site knowledge
 */
export function resolveLocalQuery(query: string): string | null {
  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery) return null;

  // 1. Direct prompt query match
  for (const routePool of Object.values(ROUTE_PROMPT_POOL)) {
    for (const prompt of routePool) {
      if (prompt.query.toLowerCase() === cleanQuery && prompt.localAnswer) {
        return prompt.localAnswer;
      }
    }
  }

  // 2. Keyword & intent match in local knowledge base
  let bestMatch: LocalKnowledgeItem | null = null;
  let highestScore = 0;

  for (const item of LOCAL_KNOWLEDGE_BASE) {
    let score = 0;
    for (const keyword of item.keywords) {
      if (cleanQuery.includes(keyword.toLowerCase())) {
        score += keyword.length;
      }
    }
    if (score > highestScore && score >= 3) {
      highestScore = score;
      bestMatch = item;
    }
  }

  return bestMatch ? bestMatch.answer : null;
}

/**
 * Hydration-safe client-side Fisher-Yates shuffle
 * Slices count (default 3-4) prompts combining current route pool with general pool
 */
export function getRandomRoutePrompts(pathname: string, count: number = 4): RoutePrompt[] {
  // Normalize pathname (strip trailing slash)
  const normalized = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

  const currentPool = ROUTE_PROMPT_POOL[normalized] || ROUTE_PROMPT_POOL['/dashboard'] || [];
  const defaultPool = ROUTE_PROMPT_POOL['default'] || [];

  // Combine current route pool with default pool, deduplicating by query
  const seen = new Set<string>();
  const combined: RoutePrompt[] = [];

  for (const p of [...currentPool, ...defaultPool]) {
    if (!seen.has(p.query)) {
      seen.add(p.query);
      combined.push(p);
    }
  }

  // Fisher-Yates deterministic copy shuffle
  const shuffled = [...combined];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }

  return shuffled.slice(0, Math.min(count, shuffled.length));
}
