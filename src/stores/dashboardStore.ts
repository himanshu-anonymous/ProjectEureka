import { create } from 'zustand';
import { UserRole, Language, DistrictData, IncidentData, OCRRecord, AuthUser } from '@/types/dashboard';
import { INITIAL_DISTRICTS, INITIAL_INCIDENTS, INITIAL_OCR_FEED } from '@/data/dashboardData';

export interface OverviewMetricsData {
  scopeName: string;
  scopeType: string;
  totalReleases: {
    value: number | string;
    targetText: string;
    trendDirection: 'up' | 'down';
    trendValue: string;
    positiveTrend: boolean;
  };
  avgTAT: {
    value: number;
    unit: string;
    targetText: string;
    trendDirection: 'up' | 'down';
    trendValue: string;
    positiveTrend: boolean;
  };
  sentimentIndex: {
    value: string;
    targetText: string;
    trendDirection: 'up' | 'down';
    trendValue: string;
    positiveTrend: boolean;
  };
  misinformationTickets: {
    value: number;
    unit: string;
    targetText: string;
    trendDirection: 'up' | 'down';
    trendValue: string;
    positiveTrend: boolean;
  };
}

interface ToastNotification {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface DashboardStore {
  // Authentication & Session (JWT with 12h TTL)
  isAuthenticated: boolean;
  authInitialized: boolean;
  currentUser: AuthUser | null;
  authToken: string | null;
  userRole: UserRole;
  login: (user: AuthUser, token?: string) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUserRole: (role: UserRole) => void;

  // Navigation & Localization
  selectedNav: string;
  setSelectedNav: (nav: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;

  // Filters & State
  selectedDivision: string;
  setSelectedDivision: (division: string) => void;
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  searchDistrict: string;
  setSearchDistrict: (search: string) => void;

  // Selected District for Score Inspection
  selectedDistrictId: string;
  setSelectedDistrictId: (id: string) => void;

  // Selected Department for Department-Wise Data
  selectedDepartmentId: string;
  setSelectedDepartmentId: (id: string) => void;

  // Active Workflow Step
  activeWorkflowStep: number;
  setActiveWorkflowStep: (step: number) => void;

  // Dynamic Data & Loading States
  overviewMetrics: OverviewMetricsData | null;
  districts: DistrictData[];
  incidents: IncidentData[];
  ocrFeed: OCRRecord[];
  sentimentFilter: string;
  setSentimentFilter: (sentiment: string) => void;
  isLoadingData: boolean;

  // Toast Notification
  toast: ToastNotification | null;
  setToast: (toast: ToastNotification | null) => void;

  // Dynamic API Actions
  fetchOverviewMetrics: () => Promise<void>;
  fetchDistricts: () => Promise<void>;
  fetchIncidents: () => Promise<void>;
  fetchOcrFeed: () => Promise<void>;
  fetchAllData: () => Promise<void>;
  authorizeRebuttalApi: (
    incidentId: string,
    action?: 'authorize' | 'issue_advisory' | 'request_edits'
  ) => Promise<{ success: boolean; message: string }>;
  insertSampleOcrApi: (
    district?: string,
    headline?: string,
    source?: string,
    sentiment?: 'Positive' | 'Neutral' | 'Negative'
  ) => Promise<void>;

  // Sidebar collapsed & mobile drawer states
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

// Internal sequence and timer tracking to debounce and prevent overlapping filter transitions
let filterRequestSeq = 0;
let filterTimeout: NodeJS.Timeout | null = null;

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  // Authentication Defaults
  isAuthenticated: false,
  authInitialized: false,
  currentUser: null,
  authToken: null,
  userRole: 'dg_admin',

  login: (user: AuthUser, token?: string) => {
    try {
      localStorage.setItem('maha_auth_user', JSON.stringify(user));
      if (token) {
        localStorage.setItem('maha_auth_token', token);
      }
    } catch {}

    // Synchronize role and geographic constraints
    const defaultDivision = user.division === 'All Maharashtra' ? 'All Maharashtra' : user.division;
    const defaultDistrict = user.district === 'All' ? 'thane' : user.district.toLowerCase();

    set({
      isAuthenticated: true,
      authInitialized: true,
      currentUser: user,
      authToken: token || get().authToken,
      userRole: user.role,
      selectedDivision: defaultDivision,
      selectedDistrictId: defaultDistrict,
    });

    // Refresh dynamic data for this user's scope
    get().fetchAllData();
  },

  logout: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}

    try {
      localStorage.removeItem('maha_auth_user');
      localStorage.removeItem('maha_auth_token');
    } catch {}

    set({
      isAuthenticated: false,
      authInitialized: true,
      currentUser: null,
      authToken: null,
      userRole: 'dg_admin',
      selectedDivision: 'All Maharashtra',
    });
  },

  checkAuth: async () => {
    // Check via API with JWT verification (strict 12-hour TTL validation)
    try {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('maha_auth_token') : null;
      const headers: Record<string, string> = {};
      if (storedToken) {
        headers['Authorization'] = `Bearer ${storedToken}`;
      }

      const res = await fetch('/api/auth/me', { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          try {
            localStorage.setItem('maha_auth_user', JSON.stringify(data.user));
          } catch {}

          set({
            isAuthenticated: true,
            authInitialized: true,
            currentUser: data.user,
            authToken: storedToken || null,
            userRole: data.user.role,
            selectedDivision: data.user.division,
            selectedDistrictId: data.user.district === 'All' ? 'thane' : data.user.district.toLowerCase(),
          });
          get().fetchAllData();
          return;
        }
      } else if (res.status === 401) {
        // Explicit 401: JWT expired (>12-hour TTL) or signature invalid
        try {
          localStorage.removeItem('maha_auth_user');
          localStorage.removeItem('maha_auth_token');
        } catch {}
        set({ isAuthenticated: false, authInitialized: true, currentUser: null, authToken: null });
        return;
      }
    } catch {}

    // Fallback to localStorage only if network error occurred, while validating officer names
    try {
      const stored = localStorage.getItem('maha_auth_user');
      const storedToken = localStorage.getItem('maha_auth_token');
      if (stored && storedToken) {
        let user: AuthUser = JSON.parse(stored);
        if (
          user.name.includes('Chavan') ||
          user.name.includes('Sanjay') ||
          user.name.includes('Patil') ||
          user.name.includes('Deshmukh') ||
          user.name.includes('Shinde')
        ) {
          localStorage.removeItem('maha_auth_user');
          localStorage.removeItem('maha_auth_token');
        } else {
          set({
            isAuthenticated: true,
            authInitialized: true,
            currentUser: user,
            authToken: storedToken,
            userRole: user.role,
            selectedDivision: user.division,
            selectedDistrictId: user.district === 'All' ? 'thane' : user.district.toLowerCase(),
          });
          get().fetchAllData();
          return;
        }
      }
    } catch {}

    set({ isAuthenticated: false, authInitialized: true, currentUser: null, authToken: null });
  },

  setUserRole: (role) => {
    set({ userRole: role });
    get().fetchAllData();
  },

  selectedNav: 'command-overview',
  setSelectedNav: (nav) => set({ selectedNav: nav }),
  language: 'en',
  setLanguage: (language) => set({ language }),

  selectedDivision: 'Konkan',
  setSelectedDivision: (selectedDivision) => {
    set({ selectedDivision });
    get().fetchAllData();
  },
  selectedPeriod: 'Last 7 days',
  setSelectedPeriod: (selectedPeriod) => {
    set({ selectedPeriod });
    get().fetchAllData();
  },
  searchDistrict: '',
  setSearchDistrict: (searchDistrict) => set({ searchDistrict }),

  selectedDistrictId: 'thane',
  setSelectedDistrictId: (selectedDistrictId) => {
    set({ selectedDistrictId });
    get().fetchAllData();
  },

  selectedDepartmentId: 'dept-agri',
  setSelectedDepartmentId: (selectedDepartmentId) => set({ selectedDepartmentId }),

  activeWorkflowStep: 3,
  setActiveWorkflowStep: (activeWorkflowStep) => set({ activeWorkflowStep }),

  overviewMetrics: null,
  districts: INITIAL_DISTRICTS,
  incidents: INITIAL_INCIDENTS,
  ocrFeed: INITIAL_OCR_FEED,
  sentimentFilter: 'All',
  isLoadingData: false,
  toast: null,
  setToast: (toast) => set({ toast }),

  setSentimentFilter: (sentimentFilter) => {
    set({ sentimentFilter });
    get().fetchOcrFeed();
  },

  fetchOverviewMetrics: async () => {
    const { userRole, currentUser, selectedDivision } = get();
    try {
      const params = new URLSearchParams();
      if (userRole) params.set('role', userRole);
      if (currentUser?.district && currentUser.district !== 'All') {
        params.set('district', currentUser.district);
      }
      if (selectedDivision) params.set('division', selectedDivision);

      const res = await fetch(`/api/dashboard/overview?${params.toString()}`);
      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          set({ overviewMetrics: result.data });
        }
      }
    } catch (err) {
      console.warn('Failed to fetch overview metrics:', err);
    }
  },

  fetchDistricts: async () => {
    const { userRole, currentUser, selectedDivision } = get();
    try {
      const params = new URLSearchParams();
      if (userRole) params.set('role', userRole);
      if (currentUser?.district && currentUser.district !== 'All') {
        params.set('district', currentUser.district);
      }
      if (selectedDivision) params.set('division', selectedDivision);

      const res = await fetch(`/api/districts?${params.toString()}`);
      if (res.ok) {
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          set({ districts: result.data });
        }
      }
    } catch (err) {
      console.warn('Failed to fetch districts:', err);
    }
  },

  fetchIncidents: async () => {
    const { userRole, currentUser } = get();
    try {
      const params = new URLSearchParams();
      if (userRole) params.set('role', userRole);
      if (currentUser?.district && currentUser.district !== 'All') {
        params.set('district', currentUser.district);
      }

      const res = await fetch(`/api/crisis/incidents?${params.toString()}`);
      if (res.ok) {
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          set({ incidents: result.data });
        }
      }
    } catch (err) {
      console.warn('Failed to fetch incidents:', err);
    }
  },

  fetchOcrFeed: async () => {
    const { sentimentFilter } = get();
    try {
      const params = new URLSearchParams();
      if (sentimentFilter) params.set('sentiment', sentimentFilter);

      const res = await fetch(`/api/ocr/stream?${params.toString()}`);
      if (res.ok) {
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          set({ ocrFeed: result.data });
        }
      }
    } catch (err) {
      console.warn('Failed to fetch OCR feed:', err);
    }
  },

  fetchAllData: async () => {
    filterRequestSeq += 1;
    const currentSeq = filterRequestSeq;

    if (filterTimeout) {
      clearTimeout(filterTimeout);
      filterTimeout = null;
    }

    set({ isLoadingData: true });

    await Promise.all([
      get().fetchOverviewMetrics(),
      get().fetchDistricts(),
      get().fetchIncidents(),
      get().fetchOcrFeed(),
      new Promise<void>((resolve) => {
        filterTimeout = setTimeout(() => {
          resolve();
        }, 350);
      }),
    ]);

    // Safeguard #4: Only conclude loading if this is still the most recent request sequence
    if (currentSeq === filterRequestSeq) {
      set({ isLoadingData: false });
    }
  },

  authorizeRebuttalApi: async (incidentId, action = 'authorize') => {
    const { currentUser, userRole } = get();
    try {
      const res = await fetch(`/api/crisis/incidents/${incidentId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          username: currentUser?.username,
          role: userRole,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        // Update local incidents state
        set((state) => ({
          incidents: state.incidents.map((inc) =>
            inc.id === incidentId
              ? {
                  ...inc,
                  authorized: action !== 'request_edits',
                  verificationStatus:
                    action === 'authorize'
                      ? 'Rebuttal Authorized & Published'
                      : action === 'issue_advisory'
                      ? 'Official Press Advisory Issued'
                      : 'System Monitoring · Re-audit Queued',
                  slaRemaining: action === 'authorize' ? '00:00' : inc.slaRemaining,
                  slaMinutes: action === 'authorize' ? 0 : inc.slaMinutes,
                }
              : inc
          ),
          toast: { message: result.message, type: 'success' },
        }));
        return { success: true, message: result.message };
      } else {
        set({
          toast: {
            message: result.message || 'Operation failed.',
            type: 'error',
          },
        });
        return { success: false, message: result.message };
      }
    } catch (err) {
      const msg = 'Network error while executing action.';
      set({ toast: { message: msg, type: 'error' } });
      return { success: false, message: msg };
    }
  },

  insertSampleOcrApi: async (
    targetDistrict?: string,
    customHeadline?: string,
    customSource?: string,
    customSentiment?: 'Positive' | 'Neutral' | 'Negative'
  ) => {
    const { selectedDistrictId, districts } = get();
    const effectiveDistrict =
      targetDistrict ||
      (selectedDistrictId
        ? districts.find((d) => d.id === selectedDistrictId)?.name || 'Palghar'
        : 'Palghar');

    const samplePool: Record<
      string,
      {
        headlineEn: string;
        headlineMr: string;
        sourceEn: string;
        sourceMr: string;
        sentiment: 'Positive' | 'Neutral' | 'Negative';
      }[]
    > = {
      Palghar: [
        {
          headlineMr: 'पालघर वाढवण बंदर प्रकल्प: स्थानिक भूमिपुत्रांसाठी विशेष रोजगार व कौशल्य केंद्र मंजूर',
          headlineEn: 'Palghar Vadhvan Port Project: Special employment and skill development center approved for local youth',
          sourceMr: 'लोकमत',
          sourceEn: 'Lokmat',
          sentiment: 'Positive',
        },
        {
          headlineMr: 'पालघर किनारपट्टीवरील मच्छीमार बांधवांना आधुनिक जीपीएस ट्रॅकिंग उपकरणांचे वाटप संपन्न',
          headlineEn: 'Distribution of modern GPS tracking devices completed for coastal fishermen in Palghar',
          sourceMr: 'सकाळ',
          sourceEn: 'Sakal',
          sentiment: 'Positive',
        },
        {
          headlineMr: 'पालघर मनोर-वाडा महामार्गावर अवजड वाहतूक नियंत्रण; पर्यायी मार्ग जाहीर',
          headlineEn: 'Heavy traffic regulation on Palghar Manor-Wada highway; alternate detour routes announced',
          sourceMr: 'पुढारी',
          sourceEn: 'Pudhari',
          sentiment: 'Neutral',
        },
        {
          headlineMr: 'पालघर जलजीवन मिशन अंतर्गत ग्रामीण पाणीपुरवठा योजना ९५% पूर्ण',
          headlineEn: 'Rural tap water scheme under Jal Jeevan Mission achieves 95% completion across Palghar',
          sourceMr: 'सामना',
          sourceEn: 'Saamana',
          sentiment: 'Positive',
        },
      ],
      Thane: [
        {
          headlineMr: 'ठाणे मेट्रो मार्ग ४: कापूरबावडी ते मानपाडा दरम्यान ट्रायल रन यशस्वी',
          headlineEn: 'Thane Metro Line 4: Successful trial run conducted between Kapurbawdi and Manpada stations',
          sourceMr: 'ठाणे वैभव',
          sourceEn: 'Thane Vaibhav',
          sentiment: 'Positive',
        },
        {
          headlineMr: 'ठाणे जिल्हा सामान्य रुग्णालयात २०० खाटांच्या नवीन अतिदक्षता विभागाचे लोकार्पण',
          headlineEn: 'Inauguration of new 200-bed intensive critical care unit at Thane District General Hospital',
          sourceMr: 'लोकसत्ता',
          sourceEn: 'Loksatta',
          sentiment: 'Positive',
        },
        {
          headlineMr: 'कळवा पुलावरील वाहतूक कोंडी सोडवण्यासाठी विशेष उड्डाणपुलाला प्रशासकीय मंजुरी',
          headlineEn: 'Administrative sanction granted for elevated corridor to resolve Kalwa Bridge traffic congestion',
          sourceMr: 'महाराष्ट्र टाइम्स',
          sourceEn: 'Maharashtra Times',
          sentiment: 'Positive',
        },
        {
          headlineMr: 'ठाणे महापालिका क्षेत्रात पाणीबचतीसाठी आधुनिक सेन्सर आधारित यंत्रणा कार्यान्वित',
          headlineEn: 'Smart sensor-based conservation system operationalised across Thane Municipal Corporation area',
          sourceMr: 'पुढारी',
          sourceEn: 'Pudhari',
          sentiment: 'Neutral',
        },
      ],
      Raigad: [
        {
          headlineMr: 'रायगड: मुंबई-गोवा महामार्गावरील खड्डे दुरुस्तीची कामे युध्दपातळीवर पूर्ण',
          headlineEn: 'Raigad: Rapid pothole repair works on Mumbai-Goa National Highway completed on war footing',
          sourceMr: 'सकाळ',
          sourceEn: 'Sakal',
          sentiment: 'Positive',
        },
        {
          headlineMr: 'अलिबाग पर्यटन क्षेत्राच्या विकासासाठी २५ कोटींच्या विशेष निधीचे तात्काळ वितरण',
          headlineEn: 'Immediate allocation of ₹25 crore special grant for Alibag tourism infrastructure expansion',
          sourceMr: 'लोकमत',
          sourceEn: 'Lokmat',
          sentiment: 'Positive',
        },
        {
          headlineMr: 'रायगड जिल्ह्यात भातशेती कापणी मोहिमेस प्रारंभ; कृषी विभागाचे तज्ज्ञ पथक तैनात',
          headlineEn: 'Paddy harvest season begins across Raigad; Agriculture Department deploys technical task force',
          sourceMr: 'कृषी जागरण',
          sourceEn: 'Krishi Jagran',
          sentiment: 'Neutral',
        },
        {
          headlineMr: 'माथेरान घाटातील मिनी ट्रेन सेवा पूर्ववत सुरू, पर्यटकांकडून उत्स्फूर्त प्रतिसाद',
          headlineEn: 'Matheran Ghat toy train service fully restored; enthusiastic reception from hill station tourists',
          sourceMr: 'पुढारी',
          sourceEn: 'Pudhari',
          sentiment: 'Positive',
        },
      ],
      Ratnagiri: [
        {
          headlineMr: 'रत्नागिरी हापूस आंबा उत्पादकांसाठी थेट आंतरराष्ट्रीय निर्यात प्रक्रिया केंद्र मंजूर',
          headlineEn: 'Direct international export facilitation terminal sanctioned for Ratnagiri Alphonso mango growers',
          sourceMr: 'रत्नागिरी एक्स्प्रेस',
          sourceEn: 'Ratnagiri Express',
          sentiment: 'Positive',
        },
        {
          headlineMr: 'चिपळूण पूर नियंत्रण योजनेच्या पहिल्या टप्प्यासाठी १०० कोटींची भरीव तरतूद',
          headlineEn: 'Substantial ₹100 crore budgetary provision cleared for Phase 1 of Chiplun Flood Mitigation Scheme',
          sourceMr: 'सकाळ',
          sourceEn: 'Sakal',
          sentiment: 'Positive',
        },
        {
          headlineMr: 'रत्नागिरी शासकीय वैद्यकीय महाविद्यालयाच्या नवीन इमारतीची प्रत्यक्ष पाहणी',
          headlineEn: 'On-site structural review conducted for new campus of Ratnagiri Government Medical College',
          sourceMr: 'पुढारी',
          sourceEn: 'Pudhari',
          sentiment: 'Neutral',
        },
        {
          headlineMr: 'जयगड बंदरावर नवीन ग्रीन कार्गो टर्मिनलचे काम वेगाने सुरू',
          headlineEn: 'Rapid progress underway for state-of-the-art Green Cargo Terminal at Jaigad Port',
          sourceMr: 'लोकमत',
          sourceEn: 'Lokmat',
          sentiment: 'Positive',
        },
      ],
      Sindhudurg: [
        {
          headlineMr: 'चिपी विमानतळावरून मुंबईसाठी अतिरिक्त विमानफेऱ्या सुरू करण्याची नागरी विमान वाहतूक मंजुरी',
          headlineEn: 'Civil Aviation clearance granted for additional scheduled flights connecting Chipi Airport to Mumbai',
          sourceMr: 'तरुण भारत',
          sourceEn: 'Tarun Bharat',
          sentiment: 'Positive',
        },
        {
          headlineMr: 'सिंधुदुर्ग काजू प्रक्रिया उद्योगांना विशेष वीज सवलत व क्लस्टर पॅकेज जाहीर',
          headlineEn: 'Special subsidized electricity tariff and industrial cluster package announced for cashew units',
          sourceMr: 'लोकमत',
          sourceEn: 'Lokmat',
          sentiment: 'Positive',
        },
        {
          headlineMr: 'तारकर्ली व मालवण सागरी क्रीडा केंद्रांना राष्ट्रीय मानांकन प्राप्त',
          headlineEn: 'Tarkarli and Malvan coastal water sports centers achieve top national safety and quality ranking',
          sourceMr: 'पुढारी',
          sourceEn: 'Pudhari',
          sentiment: 'Positive',
        },
        {
          headlineMr: 'सिंधुदुर्ग जिल्हा पर्यटनासाठी पर्यावरणपूरक इलेक्ट्रिक बस सेवा सुरू करण्यास हिरवा कंदील',
          headlineEn: 'Green signal approved for eco-friendly electric bus transit network across Sindhudurg tourist circuit',
          sourceMr: 'सकाळ',
          sourceEn: 'Sakal',
          sentiment: 'Neutral',
        },
      ],
    };

    const districtSamples = samplePool[effectiveDistrict] || samplePool.Palghar;
    const randomSample = districtSamples[Math.floor(Math.random() * districtSamples.length)];
    const currentLang = get().language;

    const payload = {
      source: customSource || (currentLang === 'mr' ? randomSample.sourceMr : randomSample.sourceEn),
      headline: customHeadline || (currentLang === 'mr' ? randomSample.headlineMr : randomSample.headlineEn),
      headlineEn: randomSample.headlineEn,
      headlineMr: randomSample.headlineMr,
      district: effectiveDistrict,
      sentiment: customSentiment || randomSample.sentiment,
    };

    try {
      const res = await fetch('/api/ocr/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          set((state) => ({
            ocrFeed: [result.data, ...state.ocrFeed],
            toast: { message: `New incoming wire ingested for ${effectiveDistrict}.`, type: 'info' },
          }));
        }
      }
    } catch (err) {
      console.warn('Failed to insert sample OCR:', err);
    }
  },

  sidebarCollapsed: false,
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  mobileMenuOpen: false,
  setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
}));
