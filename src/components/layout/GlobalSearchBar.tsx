'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDashboardStore } from '@/stores/dashboardStore';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ArrowRightIcon,
  MapPinIcon,
  ShieldExclamationIcon,
  Squares2X2Icon,
  CpuChipIcon,
  DocumentTextIcon,
  TvIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ServerStackIcon,
  BellIcon,
  UserIcon,
} from '@heroicons/react/20/solid';

export type SearchResultType = 'Route' | 'Heading' | 'Card' | 'Table Row' | 'Metric' | 'Alert' | 'On Page';

export interface SearchResultItem {
  id: string;
  title: string;
  snippet: string;
  matchKeyword: string;
  type: SearchResultType;
  route?: string;
  element?: HTMLElement;
}

interface NavRouteDef {
  title: string;
  marathiTitle: string;
  route: string;
  keywords: string;
  marathiKeywords: string;
  description: string;
  marathiDescription: string;
  iconName: string;
}

const NAVIGATION_ROUTES: NavRouteDef[] = [
  {
    title: 'Dashboard Cockpit',
    marathiTitle: 'राज्य कमांड डॅशबोर्ड',
    route: '/dashboard',
    keywords: 'dashboard state command kpi overview summary readiness konkan',
    marathiKeywords: 'डॅशबोर्ड राज्य कमांड सांख्यिकी आढावा',
    description: 'Executive overview, key performance metrics & district readiness index',
    marathiDescription: 'कार्यकारी आढावा, कार्यप्रदर्शन मेट्रिक्स व जिल्हा निर्देशांक',
    iconName: 'dashboard',
  },
  {
    title: 'Command Centre Desk',
    marathiTitle: 'कमांड सेंटर',
    route: '/command-center',
    keywords: 'command center desk live operational telemetry pipeline deck',
    marathiKeywords: 'कमांड सेंटर थेट नियंत्रण कक्ष दूरमिती',
    description: 'Operational control desk, live pipeline streaming & telemetry audit',
    marathiDescription: 'थेट नियंत्रण कक्ष, पाइपलाइन व दूरमिती ऑडिट',
    iconName: 'commandCenter',
  },
  {
    title: 'Telemetry Operations & Audit',
    marathiTitle: 'दूरमिती ऑपरेशन्स व ऑडिट',
    route: '/system-monitoring',
    keywords: 'telemetry operations system monitoring audit infrastructure logs',
    marathiKeywords: 'दूरमिती ऑपरेशन्स प्रणाली निरीक्षण ऑडिट नोंदी',
    description: 'Real-time telemetry feeds, actor logs & security audit trail',
    marathiDescription: 'थेट दूरमिती प्रवाह, सुरक्षा ऑडिट व नोंदी',
    iconName: 'system',
  },
  {
    title: 'Raw Ingestion Feeds',
    marathiTitle: 'कच्चा डेटा अंतर्ग्रहण',
    route: '/system-monitoring/raw-ingestion',
    keywords: 'raw ingestion data sources api rss ftp feeder channels',
    marathiKeywords: 'कच्चा डेटा अंतर्ग्रहण स्रोत वाहिन्या',
    description: 'Data ingestion channels, endpoint URIs & district feeder sources',
    marathiDescription: 'डेटा अंतर्ग्रहण वाहिन्या आणि स्रोत तपशील',
    iconName: 'system',
  },
  {
    title: 'Pipeline & Ops Flow',
    marathiTitle: 'पाइपलाइन व डेटा प्रवाह',
    route: '/system-monitoring/pipeline-flow',
    keywords: 'pipeline ops flow data nodes processing throughput latency',
    marathiKeywords: 'पाइपलाइन डेटा प्रवाह प्रक्रिया नोड्स',
    description: 'Animated stream pipeline, latency diagnostics & throughput matrix',
    marathiDescription: 'थेट डेटा पाइपलाइन आणि विलंब विश्लेषण',
    iconName: 'system',
  },
  {
    title: 'Districts Registry (36 Districts)',
    marathiTitle: 'जिल्हे व कार्यालये नोंदवही',
    route: '/districts',
    keywords: 'districts konkan thane palghar raigad ratnagiri sindhudurg cpi collector',
    marathiKeywords: 'जिल्हे ठाणे पालघर रायगड रत्नागिरी सिंधुदुर्ग जिल्हाधिकारी',
    description: '36 district performance scores, collector contacts & readiness registry',
    marathiDescription: 'सर्व जिल्ह्यांचे कार्यप्रदर्शन, संपर्क व स्थिती',
    iconName: 'districts',
  },
  {
    title: 'Crisis Response Unit',
    marathiTitle: 'आपत्कालीन प्रतिसाद कक्ष',
    route: '/crisis',
    keywords: 'crisis response emergency sdrf ndrf alert incident rescue floods',
    marathiKeywords: 'आपत्कालीन प्रतिसाद मदत बचाव कार्य एनडीआरएफ पूर',
    description: 'Disaster management alerts, SDRF response deployment & SLA countdown',
    marathiDescription: 'आपत्ती व्यवस्थापन इशारे आणि मदत कार्य',
    iconName: 'crisis',
  },
  {
    title: 'DGIPR Press Releases',
    marathiTitle: 'माहिती व जनसंपर्क प्रसिद्धीपत्रके',
    route: '/press-releases',
    keywords: 'press releases dgipr news bulletins cabinet official announcements',
    marathiKeywords: 'प्रसिद्धीपत्रके शासकीय निर्णय बातम्या पत्रक',
    description: 'Official government bulletins, cabinet press releases & releases archive',
    marathiDescription: 'शासकीय निर्णय व प्रसिद्धीपत्रके संग्रह',
    iconName: 'press',
  },
  {
    title: 'Media Monitoring Deck',
    marathiTitle: 'माध्यम निरीक्षण दालन',
    route: '/media',
    keywords: 'media monitoring tv channels broadcast sentiment analysis news coverage',
    marathiKeywords: 'माध्यम निरीक्षण वृत्तवाहिन्या बातम्या विश्लेषण',
    description: '24/7 TV & digital broadcast monitoring with sentiment categorization',
    marathiDescription: 'वृत्तवाहिन्या व डिजिटल मीडिया निरीक्षण',
    iconName: 'media',
  },
  {
    title: 'Field Activities Tracker',
    marathiTitle: 'क्षेत्रीय उपक्रम व पाहणी',
    route: '/activities',
    keywords: 'field activities inspections tours collectors camps village review',
    marathiKeywords: 'क्षेत्रीय उपक्रम पाहणी दौरे शिबिरे आढावा',
    description: 'Collectorate field inspections, revenue camps & welfare scheme tours',
    marathiDescription: 'जिल्हाधिकारी पाहणी दौरे आणि शिबिरे',
    iconName: 'activities',
  },
  {
    title: 'Reports & Analytics',
    marathiTitle: 'सांख्यिकी अहवाल व विश्लेषण',
    route: '/reports',
    keywords: 'reports analytics statistical trends comparative performance charts',
    marathiKeywords: 'अहवाल विश्लेषण आलेख तुलनात्मक सांख्यिकी',
    description: 'District comparative analytics, trend lines & department ranking reports',
    marathiDescription: 'जिल्हानिहाय तुलनात्मक आलेख आणि सांख्यिकी',
    iconName: 'reports',
  },
  {
    title: 'Operational Notifications',
    marathiTitle: 'शासकीय सूचना व इशारे',
    route: '/notifications',
    keywords: 'notifications alerts system broadcast security clearance',
    marathiKeywords: 'सूचना इशारे शासकीय संदेश सुरक्षा',
    description: 'System notices, high-priority state directives & protocol alerts',
    marathiDescription: 'प्रणाली सूचना आणि महत्त्वाचे शासकीय संदेश',
    iconName: 'notifications',
  },
  {
    title: 'Officer Profile & Clearance',
    marathiTitle: 'अधिकारी प्रोफाइल व अधिकार',
    route: '/profile',
    keywords: 'profile officer security clearance tier cadre posting ias gokhale',
    marathiKeywords: 'अधिकारी प्रोफाइल संवर्ग पदस्थापना गोखले',
    description: 'Tier credentials, IAS cadre details, postings & officer bio',
    marathiDescription: 'अधिकारी सुरक्षा स्तर, संवर्ग व पदस्थापना तपशील',
    iconName: 'profile',
  },
];

export const GlobalSearchBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { language } = useDashboardStore();

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [domResults, setDomResults] = useState<SearchResultItem[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Invisible keyboard shortcut listener for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Deduplicated DOM Scanner for current page
  const scanDomContent = useCallback((keyword: string): SearchResultItem[] => {
    if (typeof document === 'undefined') return [];
    const mainEl = document.querySelector('main');
    if (!mainEl || !keyword.trim()) return [];

    const q = keyword.trim().toLowerCase();
    const results: SearchResultItem[] = [];

    // Potential leaf and component elements to examine
    const candidates = Array.from(
      mainEl.querySelectorAll<HTMLElement>(
        'h1, h2, h3, h4, h5, h6, table tbody tr, [role="alert"], [data-alert], p, li, [data-metric], .font-mono'
      )
    );

    // Track matching elements to avoid parent/child duplicates
    const matchedElements = new Set<HTMLElement>();

    for (const el of candidates) {
      // Must be visible
      if (el.offsetParent === null && el.offsetWidth === 0 && el.offsetHeight === 0) {
        continue;
      }

      const text = el.textContent || '';
      const lowerText = text.toLowerCase();
      if (!lowerText.includes(q)) continue;

      // Strict Adjustment #2: Deduplicate Parent/Child DOM matches.
      // If any child element inside el also matches the query, prioritize the child and skip this parent!
      // Exception: For table rows <tr>, the entire row is the unit.
      if (el.tagName !== 'TR') {
        const subCandidates = el.querySelectorAll<HTMLElement>(
          'h1, h2, h3, h4, h5, h6, p, li, [data-metric], [role="alert"], td'
        );
        let childMatches = false;
        for (const child of Array.from(subCandidates)) {
          if (child !== el && (child.textContent || '').toLowerCase().includes(q)) {
            childMatches = true;
            break;
          }
        }
        if (childMatches) {
          // Skip this parent container because its child has the more specific match
          continue;
        }
      }

      // Check if an ancestor has already been registered or vice-versa
      let duplicate = false;
      for (const registered of matchedElements) {
        if (registered.contains(el) || el.contains(registered)) {
          duplicate = true;
          break;
        }
      }
      if (duplicate && el.tagName !== 'TR') continue;

      matchedElements.add(el);

      // Determine parent card or section title context
      let contextTitle = '';
      const cardContainer = el.closest<HTMLElement>(
        'section, article, [data-card], [data-section-title], .bg-white, .rounded-xl, .rounded-lg'
      );
      if (cardContainer) {
        const titleAttr =
          cardContainer.getAttribute('data-title') ||
          cardContainer.getAttribute('data-section-title') ||
          cardContainer.getAttribute('aria-label');
        if (titleAttr) {
          contextTitle = titleAttr.trim();
        } else {
          // Find first heading in card that is not the element itself
          const heading = cardContainer.querySelector<HTMLElement>('h1, h2, h3, h4');
          if (heading && heading !== el && heading.textContent) {
            contextTitle = heading.textContent.trim();
          }
        }
      }

      if (!contextTitle) {
        // Fallback: nearest preceding heading in DOM
        let sibling = el.previousElementSibling;
        while (sibling) {
          if (/^H[1-6]$/.test(sibling.tagName) && sibling.textContent) {
            contextTitle = sibling.textContent.trim();
            break;
          }
          sibling = sibling.previousElementSibling;
        }
      }

      if (!contextTitle) {
        contextTitle = language === 'mr' ? 'सध्याचे पृष्ठ' : 'Current Page';
      }

      // Determine category type
      let type: SearchResultType = 'On Page';
      if (el.tagName === 'TR' || el.closest('table')) {
        type = 'Table Row';
      } else if (
        el.getAttribute('role') === 'alert' ||
        el.closest('[role="alert"], [data-alert]') ||
        el.classList.contains('bg-rose-50') ||
        el.classList.contains('bg-amber-50')
      ) {
        type = 'Alert';
      } else if (/^H[1-6]$/.test(el.tagName)) {
        type = 'Heading';
      } else if (
        el.hasAttribute('data-metric') ||
        el.classList.contains('font-mono') ||
        el.closest('[data-metric]')
      ) {
        type = 'Metric';
      } else if (el.closest('[data-card], article')) {
        type = 'Card';
      }

      // Generate context snippet around the keyword match
      const matchIdx = lowerText.indexOf(q);
      const start = Math.max(0, matchIdx - 35);
      const end = Math.min(text.length, matchIdx + q.length + 45);
      let snippet = text.slice(start, end).replace(/\s+/g, ' ').trim();
      if (start > 0) snippet = '...' + snippet;
      if (end < text.length) snippet = snippet + '...';

      // Assign target id to DOM element for reliable retrieval
      const uniqueId = `st-dom-${results.length}-${Math.random().toString(36).slice(2, 6)}`;
      el.setAttribute('data-search-target-id', uniqueId);

      results.push({
        id: uniqueId,
        title: contextTitle.slice(0, 45),
        snippet,
        matchKeyword: q,
        type,
        element: el,
      });

      if (results.length >= 8) break;
    }

    return results;
  }, [language]);

  // Debounced DOM scanning whenever query changes
  useEffect(() => {
    if (!query.trim()) {
      setDomResults([]);
      return;
    }

    const timer = setTimeout(() => {
      const results = scanDomContent(query);
      setDomResults(results);
    }, 120);

    return () => clearTimeout(timer);
  }, [query, scanDomContent]);

  // Route matches
  const routeResults = useMemo<SearchResultItem[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Suggest top routes when search bar is focused but empty
      return NAVIGATION_ROUTES.slice(0, 4).map((r, i) => ({
        id: `route-suggest-${i}`,
        title: language === 'mr' ? r.marathiTitle : r.title,
        snippet: language === 'mr' ? r.marathiDescription : r.description,
        matchKeyword: '',
        type: 'Route',
        route: r.route,
      }));
    }

    return NAVIGATION_ROUTES.filter((r) => {
      const combined = `${r.title} ${r.marathiTitle} ${r.keywords} ${r.marathiKeywords} ${r.description} ${r.marathiDescription}`.toLowerCase();
      return combined.includes(q);
    })
      .slice(0, 4)
      .map((r, i) => ({
        id: `route-${i}`,
        title: language === 'mr' ? r.marathiTitle : r.title,
        snippet: language === 'mr' ? r.marathiDescription : r.description,
        matchKeyword: q,
        type: 'Route',
        route: r.route,
      }));
  }, [query, language]);

  // Combined Results (DOM matches first, followed by Route targets)
  const combinedResults = useMemo<SearchResultItem[]>(() => {
    if (!query.trim()) {
      return routeResults;
    }
    return [...domResults, ...routeResults];
  }, [query, domResults, routeResults]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [combinedResults]);

  // Highlight bold keyword helper
  const renderHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <strong key={i} className="font-bold text-amber-300 bg-amber-500/20 px-0.5 rounded">
          {part}
        </strong>
      ) : (
        part
      )
    );
  };


  // Selection Action Handler
  const handleSelectResult = (item: SearchResultItem) => {
    // 1. Close dropdown and blur input
    setIsOpen(false);
    inputRef.current?.blur();

    // 2. Handle Route navigation
    if (item.type === 'Route' && item.route) {
      router.push(item.route);
      return;
    }

    // 3. Handle On-Page DOM element
    const target = item.element || (item.id ? document.querySelector<HTMLElement>(`[data-search-target-id="${item.id}"]`) : null);
    if (target) {
      // Smooth viewport center scroll (avoids sticky header clipping)
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Apply temporary 2-second glowing ring highlight
      target.classList.add('search-highlight-target');
      setTimeout(() => {
        target.classList.remove('search-highlight-target');
      }, 2000);
    }
  };

  // Keyboard navigation inside dropdown
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || combinedResults.length === 0) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % combinedResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + combinedResults.length) % combinedResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (combinedResults[selectedIndex]) {
        handleSelectResult(combinedResults[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Input Container — Clean border only on search bar, NO visual Ctrl+K badge */}
      <div className="relative flex items-center w-full">
        <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-500">
          <MagnifyingGlassIcon className="w-4 h-4 text-slate-400" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleInputKeyDown}
          placeholder={
            language === 'mr'
              ? 'पृष्ठ मजकूर, कार्ड्स, मेट्रिक्स किंवा मार्ग शोधा...'
              : 'Search page content, cards, metrics, or routes...'
          }
          className="h-9 w-full pl-9 pr-9 bg-slate-900/80 hover:bg-slate-900 focus:bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-amber-500/70 rounded-lg text-xs text-slate-200 placeholder-slate-500 transition-all outline-hidden shadow-2xs"
          aria-label={language === 'mr' ? 'थेट शोध' : 'Live Search'}
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setDomResults([]);
              inputRef.current?.focus();
            }}
            className="absolute right-3 p-0.5 rounded text-slate-500 hover:text-white cursor-pointer"
            aria-label="Clear search"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Floating Autocomplete Results Dropdown matching search bar width */}
      {isOpen && (
        <div className="w-full mt-1.5 bg-[#0B1120] border border-slate-700/80 rounded-xl shadow-2xl shadow-black/90 p-1.5 z-50 absolute left-0 top-full max-h-96 overflow-y-auto animate-in fade-in slide-in-from-top-1 divide-y divide-slate-800/60 scrollbar-none">
          {combinedResults.length > 0 ? (
            <div className="space-y-0.5">
              {!query.trim() && (
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {language === 'mr' ? 'द्रुत नेव्हिगेशन शिफारसी' : 'Suggested Navigation Routes'}
                </div>
              )}

              {combinedResults.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectResult(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between gap-3 group ${
                      isSelected
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate font-sans">
                          {item.title}
                        </span>
                        {item.type !== 'Route' && (
                          <span className="text-[10px] font-medium text-slate-500 font-sans">
                            • {item.type}
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-200 truncate font-sans">
                        {renderHighlightedText(item.snippet, item.matchKeyword)}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center pl-1">
                      <ArrowRightIcon
                        className={`w-4 h-4 transition-transform ${
                          isSelected
                            ? 'text-amber-400 translate-x-0.5'
                            : 'text-slate-500 group-hover:text-slate-300'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-4 py-6 text-center text-xs text-slate-400 font-sans">
              <span>
                {language === 'mr'
                  ? `"${query}" साठी कोणतेही जुळणारे निकाल सापडले नाहीत`
                  : `No matching content or routes found for "${query}"`}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
