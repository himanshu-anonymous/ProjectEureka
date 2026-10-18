import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SystemMonitoringNavHeader } from '@/components/commandCenter/SystemMonitoringNavHeader';
import { TelemetryOperationsView } from '@/components/commandCenter/TelemetryOperationsView';
import { RawEventStreamInspector } from '@/components/commandCenter/RawEventStreamInspector';

export default function SystemMonitoringPage() {
  return (
    <DashboardLayout>
      <div className="max-w-[1720px] w-full mx-auto space-y-5">
        {/* Dedicated System & Infrastructure Monitoring Navigation Header */}
        <SystemMonitoringNavHeader />

        {/* Primary Hub: 7 In-Page Technical Modules (Node Telemetry, Filtration, Pipeline, Monitoring, TimescaleDB, Logs, Audit) */}
        <TelemetryOperationsView />

        {/* Dedicated Technical Payload & Checksum Inspector */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Technical Payload & Checksum Verification Inspector
            </h3>
            <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-emerald-700 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
              <span>CRC-32 & SHA-256 Validated</span>
            </span>
          </div>
          <RawEventStreamInspector />
        </div>
      </div>
    </DashboardLayout>
  );
}
