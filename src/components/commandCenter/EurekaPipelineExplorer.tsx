'use client';

import React, { useState } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import {
  CpuChipIcon,
  ServerStackIcon,
  SparklesIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  BoltIcon,
  CheckCircleIcon,
  EyeIcon,
  ShareIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { DrawerPayload } from '@/components/shared/ContextualIntelligenceDrawer';

interface PipelineNode {
  id: string;
  name: string;
  marathiName: string;
  category: 'Ingestion' | 'Processing' | 'Inference' | 'Governance' | 'Delivery';
  status: 'Operational' | 'Healthy' | 'Active';
  modelOrEngine: string;
  throughput: string;
  latency: string;
  errorRate: string;
  description: string;
  details: string;
}

const PIPELINE_NODES: PipelineNode[] = [
  {
    id: 'node-1',
    name: 'Multi-Source Media Ingestion',
    marathiName: 'माध्यम स्रोत अंतर्ग्रहण',
    category: 'Ingestion',
    status: 'Operational',
    modelOrEngine: 'Distributed Ring Buffer • Kafka',
    throughput: '14,820 items/day',
    latency: '18 ms',
    errorRate: '0.01%',
    description: 'Continuous ingestion of 18 regional newspapers, 4 TV broadcasts, and social streams.',
    details: 'Zero-copy ring buffer with adaptive backpressure handling OCR streams from Sakal, Lokmat, Loksatta, Pudhari, and broadcast feeds from DD Sahyadri and ABP Majha.',
  },
  {
    id: 'node-2',
    name: 'OCR & Text Normalization',
    marathiName: 'ऑप्टिकल कॅरेक्टर ओळख व प्रमाणीकरण',
    category: 'Processing',
    status: 'Operational',
    modelOrEngine: 'Devanagari OCR v4.2 • Tesseract',
    throughput: '1,240 pages/hr',
    latency: '42 ms',
    errorRate: '0.04%',
    description: 'High-accuracy Devanagari script recognition with column segmentation.',
    details: 'Bilingual normalization pipeline converting multi-column print broadsheet scans into structured UTF-8 JSON payloads with font confidence metrics.',
  },
  {
    id: 'node-3',
    name: 'MuRIL Multilingual NLP',
    marathiName: 'म्युरिल बहुभाषिक भाषा मॉडेल',
    category: 'Inference',
    status: 'Healthy',
    modelOrEngine: 'Google MuRIL • Marathi Embeddings',
    throughput: '320 claims/sec',
    latency: '34 ms',
    errorRate: '0.00%',
    description: 'Deep semantic understanding across Marathi, Hindi, and Indian English.',
    details: 'Pretrained multilingual representations for Indian languages extracting entities, governmental department tags, and contextual relevance scores across 36 districts.',
  },
  {
    id: 'node-4',
    name: 'StGNN Claim & Sentiment Graph',
    marathiName: 'दावे व जनभावना ग्राफ विश्लेषण',
    category: 'Inference',
    status: 'Healthy',
    modelOrEngine: 'Spatio-Temporal Graph Neural Net',
    throughput: '950 edges/sec',
    latency: '28 ms',
    errorRate: '0.02%',
    description: 'District narrative velocity tracking and coordinated rumor propagation detection.',
    details: 'Graph learning model linking social mentions, newspaper articles, and TV airtime to compute district-level Sentiment Index and identify synthetic viral cascades.',
  },
  {
    id: 'node-5',
    name: 'QUAD Model & IRF Binding',
    marathiName: 'क्वाड मॉडेल व वस्तुस्थिती पडताळणी',
    category: 'Governance',
    status: 'Active',
    modelOrEngine: 'QUAD Fact-Verification Matrix',
    throughput: '140 tickets/hr',
    latency: '52 ms',
    errorRate: '0.00%',
    description: 'Cross-references viral claims against verified government resolutions (GRs) and ground facts.',
    details: 'Automated retrieval-augmented fact verification matching public claims against official state gazettes, Mantralaya notifications, and field DIO status feeds.',
  },
  {
    id: 'node-6',
    name: '90-Min Crisis SLA Engine',
    marathiName: '९०-मिनिट एसएलए संकट निवारण',
    category: 'Governance',
    status: 'Active',
    modelOrEngine: 'SLA Countdown Controller',
    throughput: '3 active timers',
    latency: '< 5 ms',
    errorRate: '0.00%',
    description: 'Enforces statutory 90-minute deadline for Collector-authorized rebuttals.',
    details: 'Automated notification and escalation countdown alerting District Magistrates, Divisional Directors, and DGIPR State Admin as refutation deadlines approach.',
  },
  {
    id: 'node-7',
    name: 'Human-in-the-Loop Review',
    marathiName: 'जिल्हाधिकारी व डीआयओ मंजुरी',
    category: 'Governance',
    status: 'Operational',
    modelOrEngine: 'RBAC Authorization Gateway',
    throughput: '100% Collector Sign-off',
    latency: 'Human Review',
    errorRate: '0.00%',
    description: 'District Collector ground evidence verification and rebuttal sign-off.',
    details: 'Multi-tier digital sign-off ensuring that no official rebuttal or counter-statement is disseminated without explicit IAS Collector or DGIPR clearance.',
  },
  {
    id: 'node-8',
    name: 'Multi-Channel Dissemination',
    marathiName: 'बहु-माध्यम प्रसिद्धी व वितरण',
    category: 'Delivery',
    status: 'Operational',
    modelOrEngine: 'DGIPR News Wire • CMO Relays',
    throughput: '42 regional outlets',
    latency: '15 ms',
    errorRate: '0.00%',
    description: 'Real-time broadcast to accredited journalists, social channels, and district portals.',
    details: 'Automated bilingual dispatch transmitting verified rebuttals, press releases, and ministerial video briefs via WhatsApp API, X/Twitter, and the DGIPR Media Pool.',
  },
];

interface EurekaPipelineExplorerProps {
  onInspectNode?: (payload: DrawerPayload) => void;
}

export const EurekaPipelineExplorer: React.FC<EurekaPipelineExplorerProps> = ({
  onInspectNode,
}) => {
  const { language } = useDashboardStore();
  const t = useTranslation(language);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-3');

  const selectedNode = PIPELINE_NODES.find((n) => n.id === selectedNodeId) || PIPELINE_NODES[0];

  const handleNodeClick = (node: PipelineNode) => {
    setSelectedNodeId(node.id);
    if (onInspectNode) {
      onInspectNode({
        type: 'pipeline',
        title: node.name,
        subtitle: `${node.category} Stage • ${node.modelOrEngine}`,
        status: node.status,
        timestamp: 'Live Active Conduit • Pipeline Stream',
        metrics: {
          'Throughput': node.throughput,
          'Processing Latency': node.latency,
          'Error Rate': node.errorRate,
          'Execution Engine': node.modelOrEngine,
        },
        pipelineStage: {
          name: node.name,
          latency: node.latency,
          throughput: node.throughput,
          errorRate: node.errorRate,
          model: node.modelOrEngine,
          status: node.status === 'Operational' ? 'Operational' : 'Healthy',
        },
        details: node.details,
      });
    }
  };

  return (
    <div className="bg-[#0B111D] border border-white/10 rounded-xl overflow-hidden shadow-xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-[#070B14]/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <CpuChipIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                {language === 'mr' ? 'युरीका डेटा प्रक्रिया व ऑपरेशन्स पाइपलाइन' : 'EUREKA Operations & Ingestion Pipeline'}
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ARCHITECTURE v2.4
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {language === 'mr'
                ? 'माध्यम अंतर्ग्रहण ते जिल्हाधिकारी पडताळणी व बहुभाषिक प्रसिद्धी अखंड प्रक्रिया'
                : 'Automated media ingestion, MuRIL NLP, StGNN claim graphs, 90-min SLA war room & verified delivery'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>PIPELINE HEALTH: 99.98%</span>
          </span>
          <span className="px-2.5 py-1 rounded bg-white/5 text-slate-300 border border-white/10 hidden sm:inline">
            MEDIAN TAT: 34.2m
          </span>
        </div>
      </div>

      {/* Interactive Flow Conduit View */}
      <div className="p-4 overflow-x-auto">
        <div className="min-w-[980px] flex items-center justify-between gap-2 py-2">
          {PIPELINE_NODES.map((node, idx) => {
            const isSelected = node.id === selectedNodeId;
            return (
              <React.Fragment key={node.id}>
                {/* Node Card */}
                <button
                  type="button"
                  onClick={() => handleNodeClick(node)}
                  className={`flex-1 p-3 rounded-lg border text-left transition-all cursor-pointer relative group flex flex-col justify-between min-h-[115px] ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)] ring-1 ring-amber-500/40'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  {/* Category Pill + Step */}
                  <div className="flex items-center justify-between text-[10px] mb-1.5">
                    <span className="font-mono text-amber-400 font-bold">
                      0{idx + 1}
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold uppercase ${
                        node.category === 'Inference'
                          ? 'bg-sky-500/20 text-sky-400'
                          : node.category === 'Governance'
                          ? 'bg-amber-500/20 text-amber-400'
                          : node.category === 'Delivery'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-500/20 text-slate-400'
                      }`}
                    >
                      {node.category}
                    </span>
                  </div>

                  {/* Node Name */}
                  <div className="mb-2">
                    <div className="text-xs font-bold text-white leading-snug group-hover:text-amber-300 transition-colors">
                      {language === 'mr' ? node.marathiName : node.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                      {node.modelOrEngine}
                    </div>
                  </div>

                  {/* Metrics Footer */}
                  <div className="pt-1.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400">{node.latency}</span>
                    <span className="text-emerald-400 font-semibold">{node.throughput}</span>
                  </div>
                </button>

                {/* Arrow Connector */}
                {idx < PIPELINE_NODES.length - 1 && (
                  <div className="flex items-center justify-center shrink-0 text-slate-600 px-0.5">
                    <ArrowRightIcon className="w-3.5 h-3.5 text-amber-500/60" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Node Deep Inspection Strip */}
      <div className="p-4 border-t border-white/10 bg-[#070B14]/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="p-2 rounded bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
            <CpuChipIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">
                {selectedNode.name}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                ({selectedNode.modelOrEngine})
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 max-w-3xl leading-relaxed">
              {selectedNode.details}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
          <div className="text-right font-mono text-xs hidden lg:block">
            <span className="text-slate-400 block text-[10px]">Active Latency</span>
            <span className="text-emerald-400 font-bold">{selectedNode.latency}</span>
          </div>
          <button
            type="button"
            onClick={() => handleNodeClick(selectedNode)}
            className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <EyeIcon className="w-3.5 h-3.5" />
            <span>{language === 'mr' ? 'संपूर्ण माहिती पहा' : 'Inspect Telemetry'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
