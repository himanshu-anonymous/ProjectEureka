import React from 'react';
import { NotFoundDisplay } from '@/components/notFound/NotFoundDisplay';
import { NotFoundMessage } from '@/components/notFound/NotFoundMessage';
import { NotFoundActions } from '@/components/notFound/NotFoundActions';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-page flex flex-col items-center justify-center p-6 text-content-primary">
      <div className="w-full max-w-lg bg-surface border border-borderLine-standard rounded-md p-8 sm:p-10 flex flex-col items-center text-center shadow-sm">
        {/* Isolated Element 1: Bold 404 Display & Official Header */}
        <NotFoundDisplay />

        {/* Isolated Element 2: Clear, Human-readable Explanation */}
        <NotFoundMessage />

        {/* Isolated Element 3: Focused Recovery Actions */}
        <NotFoundActions />
      </div>

      {/* Official System Subtext */}
      <footer className="mt-6 text-center text-xs text-content-muted">
        Maha-Command Center • DGIPR, Government of Maharashtra
      </footer>
    </main>
  );
}
