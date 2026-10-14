'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';

export const NotFoundActions: React.FC = () => {
  const router = useRouter();

  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xs mt-2">
      {/* Primary Action: Return to Operations Dashboard */}
      <Link
        href="/"
        className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-action-primary text-content-inverse rounded text-xs font-semibold hover:bg-action-primary-hover transition-colors shadow-sm"
      >
        <LayoutDashboard className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>

      {/* Secondary Action: Go Back */}
      <button
        onClick={handleGoBack}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 border border-borderLine-standard rounded text-content-primary bg-surface text-xs font-medium hover:bg-surface-secondary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Go Back</span>
      </button>
    </div>
  );
};
