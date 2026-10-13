'use client';

import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { DashboardToolbar } from './DashboardToolbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-page">
      {/* 1. Header (56-64px) */}
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* 2. Persistent Left Navigation (208-224px) */}
        <Sidebar />

        {/* 3. Main Operational Content Workspace */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          {/* Dashboard Toolbar */}
          <DashboardToolbar />

          {/* Child Page Content */}
          {children}
        </main>
      </div>
    </div>
  );
};
