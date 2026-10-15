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
  // Authentication & Session
  isAuthenticated: boolean;
  authInitialized: boolean;
  currentUser: AuthUser | null;
  userRole: UserRole;
  login: (user: AuthUser) => void;
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

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  // Authentication Defaults
  isAuthenticated: false,
  authInitialized: false,
  currentUser: null,
  userRole: 'dg_admin',

  login: (user: AuthUser) => {
    try {
      localStorage.setItem('maha_auth_user', JSON.stringify(user));
    } catch {}

    // Synchronize role and geographic constraints
    const defaultDivision = user.division === 'All Maharashtra' ? 'All Maharashtra' : user.division;
    const defaultDistrict = user.district === 'All' ? 'pune' : user.district.toLowerCase();

    set({
      isAuthenticated: true,
      authInitialized: true,
      currentUser: user,
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
    } catch {}

    set({
      isAuthenticated: false,
      authInitialized: true,
      currentUser: null,
      userRole: 'dg_admin',
      selectedDivision: 'All Maharashtra',
    });
  },

  checkAuth: async () => {
    // Check localStorage first for instant hydration
    try {
      const stored = localStorage.getItem('maha_auth_user');
      if (stored) {
        const user: AuthUser = JSON.parse(stored);
        set({
          isAuthenticated: true,
          authInitialized: true,
          currentUser: user,
          userRole: user.role,
          selectedDivision: user.division,
          selectedDistrictId: user.district === 'All' ? 'pune' : user.district.toLowerCase(),
        });
        get().fetchAllData();
        return;
      }
    } catch {}

    // Fallback check via API
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          set({
            isAuthenticated: true,
            authInitialized: true,
            currentUser: data.user,
            userRole: data.user.role,
            selectedDivision: data.user.division,
            selectedDistrictId: data.user.district === 'All' ? 'pune' : data.user.district.toLowerCase(),
          });
          get().fetchAllData();
          return;
        }
      }
    } catch {}

    set({ isAuthenticated: false, authInitialized: true });
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
  setSelectedPeriod: (selectedPeriod) => set({ selectedPeriod }),
  searchDistrict: '',
  setSearchDistrict: (searchDistrict) => set({ searchDistrict }),

  selectedDistrictId: 'thane',
  setSelectedDistrictId: (selectedDistrictId) => set({ selectedDistrictId }),

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
    set({ isLoadingData: true });
    await Promise.all([
      get().fetchOverviewMetrics(),
      get().fetchDistricts(),
      get().fetchIncidents(),
      get().fetchOcrFeed(),
    ]);
    set({ isLoadingData: false });
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
                      : 'Returned to DIO for Verification',
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
      { headline: string; source: string; sentiment: 'Positive' | 'Neutral' | 'Negative' }[]
    > = {
      Palghar: [
        {
          headline: 'पालघर वाढवण बंदर प्रकल्प: स्थानिक भूमिपुत्रांसाठी विशेष रोजगार व कौशल्य केंद्र मंजूर',
          source: 'लोकमत कोकण (Lokmat)',
          sentiment: 'Positive',
        },
        {
          headline: 'पालघर किनारपट्टीवरील मच्छीमार बांधवांना आधुनिक जीपीएस ट्रॅकिंग उपकरणांचे वाटप संपन्न',
          source: 'सकाळ कोकण (Sakal)',
          sentiment: 'Positive',
        },
        {
          headline: 'पालघर मनोर-वाडा महामार्गावर अवजड वाहतूक नियंत्रण; पर्यायी मार्ग जाहीर',
          source: 'पुढारी पालघर (Pudhari)',
          sentiment: 'Neutral',
        },
        {
          headline: 'पालघर जलजीवन मिशन अंतर्गत ग्रामीण पाणीपुरवठा योजना ९५% पूर्ण',
          source: 'सामना (Saamana)',
          sentiment: 'Positive',
        },
      ],
      Thane: [
        {
          headline: 'ठाणे मेट्रो मार्ग ४: कापूरबावडी ते मानपाडा दरम्यान ट्रायल रन यशस्वी',
          source: 'ठाणे वैभव (Thane Vaibhav)',
          sentiment: 'Positive',
        },
        {
          headline: 'ठाणे जिल्हा सामान्य रुग्णालयात २०० खाटांच्या नवीन अतिदक्षता विभागाचे लोकार्पण',
          source: 'लोकसत्ता ठाणे (Loksatta)',
          sentiment: 'Positive',
        },
        {
          headline: 'कळवा पुलावरील वाहतूक कोंडी सोडवण्यासाठी विशेष उड्डाणपुलाला प्रशासकीय मंजुरी',
          source: 'महाराष्ट्र टाइम्स (MT)',
          sentiment: 'Positive',
        },
        {
          headline: 'ठाणे महापालिका क्षेत्रात पाणीबचतीसाठी आधुनिक सेन्सर आधारित यंत्रणा कार्यान्वित',
          source: 'पुढारी ठाणे (Pudhari)',
          sentiment: 'Neutral',
        },
      ],
      Raigad: [
        {
          headline: 'रायगड: मुंबई-गोवा महामार्गावरील खड्डे दुरुस्तीची कामे युध्दपातळीवर पूर्ण',
          source: 'सकाळ रायगड (Sakal)',
          sentiment: 'Positive',
        },
        {
          headline: 'अलिबाग पर्यटन क्षेत्राच्या विकासासाठी २५ कोटींच्या विशेष निधीचे तात्काळ वितरण',
          source: 'लोकमत रायगड (Lokmat)',
          sentiment: 'Positive',
        },
        {
          headline: 'रायगड जिल्ह्यात भातशेती कापणी मोहिमेस प्रारंभ; कृषी विभागाचे तज्ज्ञ पथक तैनात',
          source: 'कृषी जागरण (Krishi)',
          sentiment: 'Neutral',
        },
        {
          headline: 'माथेरान घाटातील मिनी ट्रेन सेवा पूर्ववत सुरू, पर्यटकांकडून उत्स्फूर्त प्रतिसाद',
          source: 'पुढारी रायगड (Pudhari)',
          sentiment: 'Positive',
        },
      ],
      Ratnagiri: [
        {
          headline: 'रत्नागिरी हापूस आंबा उत्पादकांसाठी थेट आंतरराष्ट्रीय निर्यात प्रक्रिया केंद्र मंजूर',
          source: 'रत्नागिरी एक्स्प्रेस (Express)',
          sentiment: 'Positive',
        },
        {
          headline: 'चिपळूण पूर नियंत्रण योजनेच्या पहिल्या टप्प्यासाठी १०० कोटींची भरीव तरतूद',
          source: 'सकाळ कोकण (Sakal)',
          sentiment: 'Positive',
        },
        {
          headline: 'रत्नागिरी शासकीय वैद्यकीय महाविद्यालयाच्या नवीन इमारतीची प्रत्यक्ष पाहणी',
          source: 'पुढारी (Pudhari)',
          sentiment: 'Neutral',
        },
        {
          headline: 'जयगड बंदरावर नवीन ग्रीन कार्गो टर्मिनलचे काम वेगाने सुरू',
          source: 'लोकमत (Lokmat)',
          sentiment: 'Positive',
        },
      ],
      Sindhudurg: [
        {
          headline: 'चिपी विमानतळावरून मुंबईसाठी अतिरिक्त विमानफेऱ्या सुरू करण्याची नागरी विमान वाहतूक मंजुरी',
          source: 'तरुण भारत (Tarun Bharat)',
          sentiment: 'Positive',
        },
        {
          headline: 'सिंधुदुर्ग काजू प्रक्रिया उद्योगांना विशेष वीज सवलत व क्लस्टर पॅकेज जाहीर',
          source: 'लोकमत सिंधुदुर्ग (Lokmat)',
          sentiment: 'Positive',
        },
        {
          headline: 'तारकर्ली व मालवण सागरी क्रीडा केंद्रांना राष्ट्रीय मानांकन प्राप्त',
          source: 'पुढारी (Pudhari)',
          sentiment: 'Positive',
        },
        {
          headline: 'सिंधुदुर्ग जिल्हा पर्यटनासाठी पर्यावरणपूरक इलेक्ट्रिक बस सेवा सुरू करण्यास हिरवा कंदील',
          source: 'सकाळ (Sakal)',
          sentiment: 'Neutral',
        },
      ],
    };

    const districtSamples = samplePool[effectiveDistrict] || samplePool.Palghar;
    const randomSample = districtSamples[Math.floor(Math.random() * districtSamples.length)];

    const payload = {
      source: customSource || randomSample.source,
      headline: customHeadline || randomSample.headline,
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
