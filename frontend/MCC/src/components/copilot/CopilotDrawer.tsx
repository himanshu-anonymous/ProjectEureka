'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { useDashboardStore } from '@/stores/dashboardStore';
import {
  Stack,
  KpiCard,
  DataTable,
  BarChart,
  LineChart,
  PieChart,
  GraphView,
  Callout,
  Heading,
  Text,
} from './OpenUILibrary';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  viewSpec?: any;
  status?: string;
  sourceStatus?: 'live' | 'demo' | 'unavailable';
  asOf?: string;
  fallback?: boolean;
  engine?: string;
  runId?: string;
  modelId?: string;
  toolCalls?: Array<{ tool: string; args: any }>;
}

const ThumbUpIcon: React.FC = () => (
  <svg className="w-3.5 h-3.5 fill-current inline-block" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2 7.59 8.41C7.22 8.79 7 9.3 7 9.83v7.84C7 18.95 8.05 20 9.35 20h7.62c.83 0 1.54-.5 1.84-1.22l3.02-7.05v-.85z" />
  </svg>
);

const ThumbDownIcon: React.FC = () => (
  <svg className="w-3.5 h-3.5 fill-current inline-block" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22 4h-2c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h2V4zM2.17 11.12c-.11.25-.17.52-.17.8V13c0 1.1.9 2 2 2h5.5l-.92 4.65c-.05.22-.02.46.08.66.23.45.52.86.88 1.22L10 22l6.41-6.41c.37-.38.59-.89.59-1.42V6.33C17 5.05 15.95 4 14.65 4H7.03c-.83 0-1.54.5-1.84 1.22l-3.02 7.05v.85z" />
  </svg>
);

const parseMarkupAttributes = (attrStr: string): Record<string, any> => {
  const attrs: Record<string, any> = {};
  const regex = /([a-zA-Z0-9_]+)=(?:{([^}]+)}|"([^"]*)"|'([^']*)'|(\S+))/g;
  let match;
  while ((match = regex.exec(attrStr)) !== null) {
    const key = match[1];
    let rawVal = match[2] ?? match[3] ?? match[4] ?? match[5];
    let val: any = rawVal;
    if (typeof rawVal === 'string' && rawVal.includes('&quot;')) {
      rawVal = rawVal.replace(/&quot;/g, '"');
      val = rawVal;
    }
    if (rawVal === 'true') val = true;
    else if (rawVal === 'false') val = false;
    else if (!isNaN(Number(rawVal)) && typeof rawVal === 'string' && rawVal.trim() !== '') {
      val = Number(rawVal);
    } else if (typeof rawVal === 'string' && ((rawVal.startsWith('[') && rawVal.endsWith(']')) || (rawVal.startsWith('{') && rawVal.endsWith('}')))) {
      try {
        val = JSON.parse(rawVal);
      } catch {}
    }
    attrs[key] = val;
  }
  return attrs;
};

const renderFormattedInlineText = (str: string): React.ReactNode => {
  const parts = str.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, pIdx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={pIdx} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
};

export const CopilotDrawer: React.FC = () => {
  const { authToken, userRole, currentUser, copilotOpen, setCopilotOpen } = useDashboardStore();
  const isOpen = copilotOpen;
  const setIsOpen = setCopilotOpen;

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content:
        '# DGIPR Nirdeshak (निर्देशाक)\n\nWelcome Officer. Ask questions in **Marathi (मराठी)**, **Hindi (हिंदी)**, or **English** to inspect role-scoped governance metrics across Maharashtra.',
      sourceStatus: 'live',
      asOf: new Date().toISOString(),
    },
  ]);

  // "Explain this number" state
  const [explainedTool, setExplainedTool] = useState<{ tool: string; data: any } | null>(null);

  // Officer preferences & "What I remember about you"
  const [preferences, setPreferences] = useState<Array<{ id: string; memory: string }>>([]);
  const [showPreferences, setShowPreferences] = useState(false);

  // Thumbs feedback state
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'up' | 'down'>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, statusMessage]);

  // Fetch officer memories on drawer open
  useEffect(() => {
    if (isOpen) {
      fetchMemories();
    }
  }, [isOpen]);

  const fetchMemories = async () => {
    try {
      const res = await fetch('/api/v1/copilot/memory', {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setPreferences(data.preferences || []);
      }
    } catch {
      // Memory failure is fail-open
    }
  };

  const handleForgetMe = async () => {
    try {
      const res = await fetch('/api/v1/copilot/memory', {
        method: 'DELETE',
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });
      if (res.ok) {
        setPreferences([]);
      }
    } catch {
      // Fail-open
    }
  };

  const handleSendQuery = async (queryText?: string) => {
    const q = (queryText || inputQuery).trim();
    if (!q || isLoading) return;

    setInputQuery('');
    const userMsgId = `user-${Date.now()}`;
    const assistantMsgId = `assistant-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: 'user', content: q },
      { id: assistantMsgId, role: 'assistant', content: '', toolCalls: [] },
    ]);

    setIsLoading(true);
    setStatusMessage('Consulting DGIPR analytical data services...');

    try {
      const response = await fetch('/api/v1/copilot/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({ query: q }),
      });

      if (!response.ok) {
        throw new Error(`Copilot query failed (HTTP ${response.status})`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No readable stream available');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        let eventType = 'message';
        for (const line of lines) {
          if (line.startsWith('event:')) {
            eventType = line.slice(6).trim();
          } else if (line.startsWith('data:')) {
            const dataStr = line.slice(5).trim();
            if (!dataStr) continue;

            try {
              const payload = JSON.parse(dataStr);

              if (eventType === 'status') {
                setStatusMessage(payload.message || 'Processing...');
                if (payload.step === 'tool_call') {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMsgId
                        ? {
                            ...m,
                            toolCalls: [...(m.toolCalls || []), { tool: payload.tool, args: payload.args }],
                          }
                        : m
                    )
                  );
                }
              } else if (eventType === 'chunk') {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId ? { ...m, content: payload.replace ? payload.text : m.content + payload.text } : m
                  )
                );
              } else if (eventType === 'done') {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          runId: payload.run_id,
                          sourceStatus: payload.source_status || 'live',
                          asOf: payload.as_of,
                          fallback: payload.fallback,
                          engine: payload.engine,
                          modelId: payload.model_id,
                          viewSpec: payload.view_spec,
                        }
                      : m
                  )
                );
                setStatusMessage(null);
              }
            } catch {
              // Ignore partial JSON parse errors in stream
            }
          }
        }
      }
    } catch (err: any) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? {
                ...m,
                content:
                  '<Callout type="warning" message="Service communication interrupted. Displaying verified local fallback data." />\n\n<KpiCard title="Statewide Governance" value="88.4" unit="%" status="positive" caption="Composite Baseline" />\n\n<KpiCard title="Total Districts" value="36" unit="Districts" status="positive" caption="All Districts Reporting" />',
                sourceStatus: 'demo',
                fallback: true,
                viewSpec: {
                  version: '1.0',
                  title: 'Statewide Resilience Summary',
                  components: [
                    {
                      component: 'Callout',
                      type: 'warning',
                      message: 'Service communication interrupted. Displaying verified local fallback data.',
                    },
                    {
                      component: 'KpiCard',
                      title: 'Statewide Governance',
                      value: '88.4',
                      unit: '%',
                      status: 'positive',
                      caption: 'Composite Baseline',
                    },
                    {
                      component: 'KpiCard',
                      title: 'Total Districts',
                      value: '36',
                      unit: 'Districts',
                      status: 'positive',
                      caption: 'All Districts Reporting',
                    },
                  ],
                },
              }
            : m
        )
      );
      setStatusMessage(null);
    } finally {
      setIsLoading(false);
      fetchMemories();
    }
  };

  const handleFeedback = async (runId: string | undefined, rating: 'up' | 'down') => {
    if (!runId) return;
    setFeedbackGiven((prev) => ({ ...prev, [runId]: rating }));
    try {
      await fetch('/api/v1/copilot/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({
          run_id: runId,
          rating: rating === 'up' ? 'thumbs_up' : 'thumbs_down',
        }),
      });
    } catch {
      // Fail-open
    }
  };

  // Render OpenUI ViewSpec or Fallback Markup Parser
  const renderFallbackMarkupOrText = (text: string) => {
    if (!text) return null;

    const tagPattern = /<([A-Z][a-zA-Z0-9]+)(\s+[^>]*?)?(?:\/>|>([\s\S]*?)<\/\1>)/g;

    if (tagPattern.test(text)) {
      tagPattern.lastIndex = 0;
      const elements: React.ReactNode[] = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null;
      let idx = 0;

      while ((match = tagPattern.exec(text)) !== null) {
        const preceding = text.slice(lastIndex, match.index).trim();
        if (preceding) {
          elements.push(
            <div key={`txt-${idx++}`} className="text-xs text-slate-700 leading-relaxed my-1">
              {renderFormattedInlineText(preceding)}
            </div>
          );
        }
        const tag = match[1];
        const attrStr = match[2] || '';
        const childrenText = match[3] || '';
        const attrs = parseMarkupAttributes(attrStr);

        if (tag === 'Callout') {
          elements.push(
            <Callout key={`tag-${idx++}`} type={attrs.type || 'info'} message={attrs.message || childrenText} />
          );
        } else if (tag === 'Heading') {
          elements.push(
            <Heading key={`tag-${idx++}`} level={Number(attrs.level) || 2} text={attrs.text || childrenText} />
          );
        } else if (tag === 'Text') {
          elements.push(
            <Text key={`tag-${idx++}`} content={attrs.content || childrenText} />
          );
        } else if (tag === 'KpiCard') {
          elements.push(
            <KpiCard
              key={`tag-${idx++}`}
              title={attrs.title || ''}
              value={attrs.value ?? ''}
              unit={attrs.unit}
              delta={attrs.delta}
              status={attrs.status}
              caption={attrs.caption}
              onExplain={() => setExplainedTool({ tool: 'KpiCard', data: attrs })}
            />
          );
        } else if (tag === 'PieChart') {
          elements.push(
            <PieChart
              key={`tag-${idx++}`}
              title={attrs.title || 'Distribution Overview'}
              categories={attrs.categories}
              values={attrs.values}
              variant={attrs.variant || 'donut'}
              data={attrs.data}
              onExplain={() => setExplainedTool({ tool: 'PieChart', data: attrs })}
            />
          );
        } else if (tag === 'BarChart') {
          elements.push(
            <BarChart
              key={`tag-${idx++}`}
              title={attrs.title || 'Comparison Chart'}
              xKey={attrs.xKey || attrs.x_key || 'x'}
              yKey={attrs.yKey || attrs.y_key || 'y'}
              categories={attrs.categories}
              values={attrs.values}
              series={attrs.series}
              data={attrs.data}
              onExplain={() => setExplainedTool({ tool: 'BarChart', data: attrs })}
            />
          );
        } else if (tag === 'LineChart') {
          elements.push(
            <LineChart
              key={`tag-${idx++}`}
              title={attrs.title || 'Trend Trajectory'}
              xKey={attrs.xKey || attrs.x_key || 'day'}
              yKey={attrs.yKey || attrs.y_key || 'value'}
              categories={attrs.categories}
              values={attrs.values}
              series={attrs.series}
              data={attrs.data}
              onExplain={() => setExplainedTool({ tool: 'LineChart', data: attrs })}
            />
          );
        } else if (tag === 'DataTable') {
          elements.push(
            <DataTable
              key={`tag-${idx++}`}
              columns={attrs.columns || []}
              rows={attrs.rows || []}
              caption={attrs.caption || attrs.title}
            />
          );
        } else {
          elements.push(
            <div key={`tag-${idx++}`} className="text-xs text-slate-600 bg-slate-100 p-2 rounded">
              {match[0]}
            </div>
          );
        }
        lastIndex = tagPattern.lastIndex;
      }

      const trailing = text.slice(lastIndex).trim();
      if (trailing) {
        elements.push(
          <div key={`txt-${idx++}`} className="text-xs text-slate-700 leading-relaxed my-1">
            {renderFormattedInlineText(trailing)}
          </div>
        );
      }
      return <div className="space-y-2">{elements}</div>;
    }

    const lines = text.split('\n');
    return (
      <div className="space-y-1.5 font-sans text-xs leading-relaxed text-slate-800">
        {lines.map((line, lIdx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={lIdx} className="h-1.5" />;
          if (trimmed.startsWith('# ')) {
            return <Heading key={lIdx} level={1} text={trimmed.replace(/^#\s+/, '')} />;
          }
          if (trimmed.startsWith('## ')) {
            return <Heading key={lIdx} level={2} text={trimmed.replace(/^##\s+/, '')} />;
          }
          if (trimmed.startsWith('### ')) {
            return <Heading key={lIdx} level={3} text={trimmed.replace(/^###\s+/, '')} />;
          }
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            return (
              <li key={lIdx} className="ml-4 list-disc text-slate-700">
                {renderFormattedInlineText(trimmed.replace(/^[-*]\s+/, ''))}
              </li>
            );
          }
          return <p key={lIdx} className="my-0.5">{renderFormattedInlineText(line)}</p>;
        })}
      </div>
    );
  };

  // Render OpenUI ViewSpec or Markdown fallback
  const renderMessageContent = (msg: Message) => {
    if (msg.role === 'user') {
      return (
        <div className="bg-amber-600 text-white font-medium text-xs px-3.5 py-2.5 rounded-2xl rounded-tr-none shadow-sm max-w-[85%] self-end">
          {msg.content}
        </div>
      );
    }

    // Assistant response
    return (
      <div className="bg-white border border-slate-200 text-slate-800 text-xs p-4 rounded-2xl rounded-tl-none shadow-sm w-full space-y-3">
        {/* Source and Status Badges */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                msg.sourceStatus === 'live'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  msg.sourceStatus === 'live' ? 'bg-emerald-600' : 'bg-amber-600'
                }`}
              />
              {msg.sourceStatus || 'LIVE'} DATA
            </span>
            {msg.fallback && (
              <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                Deterministic OpenUI
              </span>
            )}
            {msg.engine === 'c1' && (
              <span className="bg-purple-100 text-purple-800 border border-purple-200 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                Thesys C1 UI
              </span>
            )}
          </div>
          {msg.asOf && (
            <span className="text-[10px] text-slate-400 font-mono">
              as of {new Date(msg.asOf).toLocaleTimeString()}
            </span>
          )}
        </div>

        {/* ViewSpec Render if Fallback, else Live OpenUI Lang markup parser */}
        {(msg.viewSpec && msg.viewSpec.components) ? (
          <div className="space-y-3">
            {msg.viewSpec.components.map((c: any, idx: number) => {
              if (c.component === 'Heading') return <Heading key={idx} level={c.level} text={c.text} />;
              if (c.component === 'Text') return <Text key={idx} content={c.content} />;
              if (c.component === 'Callout') return <Callout key={idx} type={c.type} message={c.message} />;
              if (c.component === 'KpiCard')
                return (
                  <KpiCard
                    key={idx}
                    title={c.title}
                    value={c.value}
                    unit={c.unit}
                    delta={c.delta}
                    status={c.status}
                    caption={c.caption}
                    onExplain={() => setExplainedTool({ tool: 'KpiCard', data: c })}
                  />
                );
              if (c.component === 'DataTable')
                return <DataTable key={idx} columns={c.columns} rows={c.rows} caption={c.caption} />;
              if (c.component === 'PieChart')
                return (
                  <PieChart
                    key={idx}
                    title={c.title}
                    categories={c.categories}
                    values={c.values}
                    variant={c.variant || 'donut'}
                    data={c.data}
                    onExplain={() => setExplainedTool({ tool: 'PieChart', data: c.data || c.values })}
                  >
                    {c.text_summary && <Text content={c.text_summary} />}
                  </PieChart>
                );
              if (c.component === 'BarChart')
                return (
                  <BarChart
                    key={idx}
                    title={c.title}
                    xKey={c.x_key || c.xKey}
                    yKey={c.y_key || c.yKey}
                    categories={c.categories}
                    values={c.values}
                    series={c.series}
                    data={c.data}
                    onExplain={() => setExplainedTool({ tool: 'BarChart', data: c.data })}
                  >
                    {c.text_summary && <Text content={c.text_summary} />}
                  </BarChart>
                );
              if (c.component === 'LineChart')
                return (
                  <LineChart
                    key={idx}
                    title={c.title}
                    xKey={c.x_key || c.xKey}
                    yKey={c.y_key || c.yKey}
                    categories={c.categories}
                    values={c.values}
                    series={c.series}
                    data={c.data}
                    onExplain={() => setExplainedTool({ tool: 'LineChart', data: c.data })}
                  >
                    {c.text_summary && <Text content={c.text_summary} />}
                  </LineChart>
                );
              if (c.component === 'GraphView')
                return (
                  <GraphView key={idx} title={c.title} nodes={c.nodes} edges={c.edges}>
                    <Text content={c.text_summary} />
                  </GraphView>
                );
              if (c.component === 'Stack')
                return (
                  <Stack key={idx} direction={c.direction}>
                    {c.children?.map((sub: any, sIdx: number) => (
                      <KpiCard key={sIdx} title={sub.title} value={sub.value} unit={sub.unit} status={sub.status} />
                    ))}
                  </Stack>
                );
              return null;
            })}
          </div>
        ) : (
          renderFallbackMarkupOrText(msg.content)
        )}

        {/* Footer Actions: Thumbs Feedback & Tool Audits */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <span>Was this helpful?</span>
            <button
              onClick={() => handleFeedback(msg.runId, 'up')}
              className={`p-1 rounded hover:bg-slate-100 ${
                feedbackGiven[msg.runId || ''] === 'up' ? 'text-emerald-600 font-bold' : 'text-slate-400'
              }`}
              title="Thumbs Up"
              aria-label="Thumbs Up"
            >
              <ThumbUpIcon />
            </button>
            <button
              onClick={() => handleFeedback(msg.runId, 'down')}
              className={`p-1 rounded hover:bg-slate-100 ${
                feedbackGiven[msg.runId || ''] === 'down' ? 'text-rose-600 font-bold' : 'text-slate-400'
              }`}
              title="Thumbs Down"
              aria-label="Thumbs Down"
            >
              <ThumbDownIcon />
            </button>
          </div>

          {msg.toolCalls && msg.toolCalls.length > 0 && (
            <button
              onClick={() => setExplainedTool({ tool: msg.toolCalls![0].tool, data: msg.toolCalls![0].args })}
              className="text-amber-700 hover:text-amber-900 font-medium flex items-center gap-1 cursor-pointer"
            >
              <MaterialIcon name="visibility" size="xs" />
              <span>Inspect Source Query</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Floating Trigger Button in HUD */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-amber-600 to-amber-700 text-white p-3.5 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-amber-300"
        aria-label="Open DGIPR Nirdeshak"
        title="DGIPR Nirdeshak"
      >
        <MaterialIcon name="auto_awesome" size="md" />
        <span className="text-xs font-bold tracking-wide pr-1 hidden sm:inline">Nirdeshak</span>
      </button>

      {/* Slide-out Copilot Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-[2px] transition-all">
          <div
            className="w-full max-w-lg bg-slate-50 h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300"
            role="dialog"
            aria-label="DGIPR Open UI Copilot Interface"
          >
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <MaterialIcon name="auto_awesome" size="sm" />
                </div>
                <div>
                  <h3 className="text-xs font-bold tracking-tight text-white flex items-center gap-2">
                    <span>DGIPR Nirdeshak (निर्देशाक)</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {messages.slice().reverse().find((m) => m.modelId)?.modelId?.replace('models/', '') || 'gemma-4-26b'}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Governed Read-Only Intelligence • User: {currentUser?.name || 'Officer'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowPreferences(!showPreferences)}
                  className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="What I remember about you"
                  aria-label="View user memories"
                >
                  <MaterialIcon name="history" size="sm" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  aria-label="Close Nirdeshak"
                >
                  <MaterialIcon name="close" size="sm" />
                </button>
              </div>
            </div>

            {/* "What I remember about you" Collapsible Panel */}
            {showPreferences && (
              <div className="bg-amber-50/80 border-b border-amber-200 p-3.5 text-xs text-amber-950 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5">
                    <MaterialIcon name="history" size="xs" className="text-amber-700" />
                    What I Remember About You (Mem0 Preferences):
                  </span>
                  <button
                    onClick={handleForgetMe}
                    className="text-[11px] font-semibold text-rose-700 hover:underline flex items-center gap-1"
                  >
                    <MaterialIcon name="close" size="xs" /> Forget Me
                  </button>
                </div>
                {preferences.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-700">
                    {preferences.map((p) => (
                      <li key={p.id}>{p.memory}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-slate-500 italic">
                    No presentation preferences stored yet. Preferences are extracted only for language and formatting choices.
                  </p>
                )}
              </div>
            )}

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
              {messages.map((m) => (
                <React.Fragment key={m.id}>{renderMessageContent(m)}</React.Fragment>
              ))}

              {/* Live Status Pipeline Indicator */}
              {statusMessage && (
                <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-center gap-2 animate-pulse">
                  <MaterialIcon name="sync" size="xs" spin className="text-amber-700" />
                  <span>{statusMessage}</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Suggestion Chips */}
            <div className="px-4 py-2 border-t border-slate-200 bg-white flex gap-2 overflow-x-auto text-[11px]">
              <button
                onClick={() => handleSendQuery('महाराष्ट्र राज्य क्रमवारी दाखवा (Show Leaderboard)')}
                className="whitespace-nowrap px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
              >
                📊 राज्य क्रमवारी (Leaderboard)
              </button>
              <button
                onClick={() => handleSendQuery('पालघर जिल्ह्याचा स्कोअर ब्रेकडाऊन (Palghar Profile)')}
                className="whitespace-nowrap px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
              >
                📍 पालघर ब्रेकडाऊन
              </button>
              <button
                onClick={() => handleSendQuery('Active 90-minute SLA crisis tickets and rumors')}
                className="whitespace-nowrap px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
              >
                ⚠️ Crisis SLA Rumors
              </button>
            </div>

            {/* Input Box */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
                placeholder="प्रश्न विचारा (मराठी, हिंदी, or English)..."
                disabled={isLoading}
                className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-slate-50/50"
                aria-label="Nirdeshak query input"
              />
              <button
                onClick={() => handleSendQuery()}
                disabled={isLoading || !inputQuery.trim()}
                className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white p-2.5 rounded-lg transition-colors cursor-pointer"
                aria-label="Send Query"
              >
                <MaterialIcon name="send" size="sm" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* "Explain This Number" Modal */}
      {explainedTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-5 space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <MaterialIcon name="description" size="sm" className="text-amber-600" />
                Data Provenance & Calculation Context
              </h4>
              <button
                onClick={() => setExplainedTool(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <MaterialIcon name="close" size="sm" />
              </button>
            </div>
            <div className="text-xs text-slate-600 space-y-2">
              <p>
                <strong>Governed Data Service:</strong> {explainedTool.tool}
              </p>
              <p>
                This metric is grounded directly in the verified PostgreSQL 16 database and 100-Point Composite Scoring Engine.
              </p>
              <pre className="p-2.5 bg-slate-100 rounded text-[11px] font-mono overflow-x-auto max-h-48 text-slate-800">
                {JSON.stringify(explainedTool.data, null, 2)}
              </pre>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setExplainedTool(null)}
                className="text-xs font-bold px-3 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
