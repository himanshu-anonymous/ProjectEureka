'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { DashboardToolbar } from './DashboardToolbar';
import { useDashboardStore } from '@/stores/dashboardStore';
import { GovEmblem } from '@/components/shared/GovEmblem';
import { MaterialIcon } from '@/components/shared/MaterialIcon';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, authInitialized, checkAuth, toast, setToast } = useDashboardStore();

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

  // Clean institutional loader while checking auth status
  if (!authInitialized || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 space-y-4">
        <GovEmblem size="lg" />
        <div className="flex items-center gap-2 text-white text-sm font-semibold tracking-wide">
          <MaterialIcon name="refresh" size="sm" spin className="text-amber-400" />
          <span>Verifying Government Officer Security Clearance...</span>
        </div>
        <p className="text-slate-400 text-xs font-mono">
          DGIPR State Information Operations System
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-page">
      {/* 1. Header (56-64px) */}
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* 2. Persistent Left Navigation (208-224px) */}
        <Sidebar />

        {/* 3. Main Operational Content Workspace */}
        <main className="flex-1 overflow-y-auto flex flex-col relative">
          {/* Dashboard Toolbar */}
          <DashboardToolbar />

          {/* Child Page Content */}
          {children}

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
                className="ml-2 text-slate-400 hover:text-white"
              >
                <MaterialIcon name="close" size="xs" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
