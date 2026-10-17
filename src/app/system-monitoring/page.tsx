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
            <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              CRC-32 & SHA-256 Validated
            </span>
          </div>
          <RawEventStreamInspector />
        </div>
      </div>
    </DashboardLayout>
  );
}
