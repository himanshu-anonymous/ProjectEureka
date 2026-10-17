'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MaterialIcon } from '@/components/shared/MaterialIcon';

export default function PipelineFlowRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/system-monitoring/pipeline-flow');
  }, [router]);

  return (
    <DashboardLayout>
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-4 shadow-2xs">
          <MaterialIcon name="layers" size="md" />
        </div>
        <h2 className="text-base font-bold text-slate-800">
          Redirecting to System Monitoring Enclave
        </h2>
        <p className="text-xs text-slate-500 mt-1.5 mb-5 leading-relaxed">
          The 6-stage end-to-end data pipeline flowchart and DAG telemetry have been relocated to the dedicated System Monitoring enclave.
        </p>
        <Link
          href="/system-monitoring/pipeline-flow"
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-2 shadow-xs transition-colors"
        >
          <span>Continue to Pipeline Flow</span>
          <MaterialIcon name="arrow_forward" size="xs" />
        </Link>
      </div>
    </DashboardLayout>
  );
}
