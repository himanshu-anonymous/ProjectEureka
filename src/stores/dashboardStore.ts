import { create } from 'zustand';
import { UserRole, Language, DistrictData, IncidentData, OCRRecord } from '@/types/dashboard';
import { INITIAL_DISTRICTS, INITIAL_INCIDENTS, INITIAL_OCR_FEED } from '@/data/dashboardData';

interface DashboardStore {
  // Navigation & Role
  selectedNav: string;
  setSelectedNav: (nav: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;

  // Filters & State
  selectedDivision: string;
  setSelectedDivision: (division: string) => void;
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  searchDistrict: string;
  setSearchDistrict: (search: string) => void;

  // Selected District for Score Inspection (Zone 2 -> Zone 3 & Map sync)
  selectedDistrictId: string;
  setSelectedDistrictId: (id: string) => void;

  // Data
  districts: DistrictData[];
  incidents: IncidentData[];
  ocrFeed: OCRRecord[];
  
  // Actions
  authorizeRebuttal: (incidentId: string) => void;
  insertSampleOCR: (record: OCRRecord) => void;
  setSentimentFilter: (sentiment: string) => void;
  sentimentFilter: string;
  
  // Sidebar collapsed state
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  selectedNav: 'command-overview',
  setSelectedNav: (nav) => set({ selectedNav: nav }),
  userRole: 'dg_admin',
  setUserRole: (role) => set({ userRole: role }),
  language: 'en',
  setLanguage: (language) => set({ language }),

  selectedDivision: 'All Maharashtra',
  setSelectedDivision: (selectedDivision) => set({ selectedDivision }),
  selectedPeriod: 'Last 7 days',
  setSelectedPeriod: (selectedPeriod) => set({ selectedPeriod }),
  searchDistrict: '',
  setSearchDistrict: (searchDistrict) => set({ searchDistrict }),

  selectedDistrictId: 'pune',
  setSelectedDistrictId: (selectedDistrictId) => set({ selectedDistrictId }),

  districts: INITIAL_DISTRICTS,
  incidents: INITIAL_INCIDENTS,
  ocrFeed: INITIAL_OCR_FEED,
  sentimentFilter: 'All',

  authorizeRebuttal: (incidentId) =>
    set((state) => ({
      incidents: state.incidents.map((inc) =>
        inc.id === incidentId ? { ...inc, authorized: true, verificationStatus: 'Authorized Rebuttal' } : inc
      ),
    })),

  insertSampleOCR: (record) =>
    set((state) => ({
      ocrFeed: [record, ...state.ocrFeed],
    })),

  setSentimentFilter: (sentimentFilter) => set({ sentimentFilter }),

  sidebarCollapsed: false,
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
}));
