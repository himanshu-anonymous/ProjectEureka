'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { DashboardToolbar } from './DashboardToolbar';
import { useDashboardStore } from '@/stores/dashboardStore';
import { MaterialIcon } from '@/components/shared/MaterialIcon';

// Precision Skeletons for Route-Aware Initial Load
import { DashboardPageSkeleton } from '@/components/skeletons/DashboardPageSkeleton';
import { CrisisPageSkeleton } from '@/components/skeletons/CrisisPageSkeleton';
import { DistrictsPageSkeleton } from '@/components/skeletons/DistrictsPageSkeleton';
import { CommandCenterSkeleton } from '@/components/skeletons/CommandCenterSkeleton';
import { PipelineFlowSkeleton } from '@/components/skeletons/PipelineFlowSkeleton';
import { RawIngestionSkeleton } from '@/components/skeletons/RawIngestionSkeleton';
import { SystemMonitoringSkeleton } from '@/components/skeletons/SystemMonitoringSkeleton';
import { PressReleasesSkeleton } from '@/components/skeletons/PressReleasesSkeleton';
import { ActivitiesSkeleton } from '@/components/skeletons/ActivitiesSkeleton';
import { ReportsSkeleton } from '@/components/skeletons/ReportsSkeleton';
import { MediaMonitoringSkeleton } from '@/components/skeletons/MediaMonitoringSkeleton';
import { NotificationsSkeleton } from '@/components/skeletons/NotificationsSkeleton';
import { ProfileSkeleton } from '@/components/skeletons/ProfileSkeleton';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Safeguard #2: Map pathname to the exact component-wise skeleton
 * so that hard refreshing or loading any route produces zero CLS.
 */
function getRouteSkeleton(pathname: string) {
  if (pathname.startsWith('/crisis')) return <CrisisPageSkeleton />;
  if (pathname.startsWith('/districts')) return <DistrictsPageSkeleton />;
  if (pathname.startsWith('/publications')) return <ActivitiesSkeleton />;
  if (pathname.startsWith('/attendance')) return <DistrictsPageSkeleton />;
  if (pathname.startsWith('/live-events')) return <CommandCenterSkeleton />;
  if (pathname.startsWith('/advertisements')) return <PressReleasesSkeleton />;
  if (pathname === '/command-center/pipeline-flow' || pathname === '/system-monitoring/pipeline-flow') {
    return <PipelineFlowSkeleton />;
  }
  if (pathname === '/command-center/raw-ingestion' || pathname === '/system-monitoring/raw-ingestion') {
    return <RawIngestionSkeleton />;
  }
  if (pathname.startsWith('/command-center')) return <CommandCenterSkeleton />;
  if (pathname.startsWith('/system-monitoring')) return <SystemMonitoringSkeleton />;
  if (pathname.startsWith('/press-releases')) return <PressReleasesSkeleton />;
  if (pathname.startsWith('/activities')) return <ActivitiesSkeleton />;
  if (pathname.startsWith('/reports')) return <ReportsSkeleton />;
  if (pathname.startsWith('/media')) return <MediaMonitoringSkeleton />;
  if (pathname.startsWith('/notifications')) return <NotificationsSkeleton />;
  if (pathname.startsWith('/profile')) return <ProfileSkeleton />;
  return <DashboardPageSkeleton />;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isToolbarVisible =
    !pathname?.startsWith('/command-center') &&
    !pathname?.startsWith('/profile') &&
    !pathname?.startsWith('/system-monitoring');
  const {
    isAuthenticated,
    authInitialized,
    checkAuth,
    isLoadingData,
    toast,
    setToast,
  } = useDashboardStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (authInitialized && !isAuthenticated) {
      router.replace('/login');
    }
  }, [authInitialized, isAuthenticated, router]);

  // Dismiss toast after 4 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, setToast]);

  const showProgressBar = !authInitialized || isLoadingData;
  const isVerifyingAuth = !authInitialized;

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#F8FAFC]">
      {/* 1. Top Command Header (Permanently Mounted — Never Hidden) */}
      <Header />

      {/* 2. Lower Workspace Wrapper (Sidebar + Right Content Area) */}
      <div className="flex-1 flex min-h-0 w-full overflow-hidden relative">
        {/* Left Sidebar (Permanently Mounted — Never Unmounts or Hides) */}
        <Sidebar />

        {/* Right Column Wrapper (The ONLY Scrollable Region) */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden relative">
          {/* Stationary White Sub-Header Bar */}
          {isToolbarVisible && <DashboardToolbar />}

          {/* 2px Saffron Shimmer Progress Bar (Active when verifying or filtering) */}
          {showProgressBar && (
            <div className="absolute top-0 left-0 right-0 z-40 h-0.5 w-full bg-gradient-to-r from-amber-500 via-amber-300 to-amber-600 animate-shimmer-amber shadow-xs" />
          )}

          {/* Scrollable Dashboard Canvas with Precision Route Skeleton while verifying */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 relative">
            {isVerifyingAuth ? getRouteSkeleton(pathname || '/') : children}
          </main>
        </div>

        {/* Floating Operational Toast Feedback */}
        {toast && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-lg border text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 bg-slate-900 text-white border-slate-700">
            <MaterialIcon
              name={toast.type === 'error' ? 'warning' : 'check_circle'}
              size="sm"
              className={
                toast.type === 'success'
                  ? 'text-emerald-400'
                  : toast.type === 'error'
                  ? 'text-rose-400'
                  : 'text-amber-400'
              }
            />
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 text-slate-400 hover:text-white cursor-pointer"
            >
              <MaterialIcon name="close" size="xs" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
