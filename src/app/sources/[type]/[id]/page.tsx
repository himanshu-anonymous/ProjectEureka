'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { SampleDataBadge } from '@/components/shared/SampleDataBadge';
import { getSourceDetail } from '@/lib/backendClient';
import { isSafeUrl } from '@/lib/urlSecurity';
import type { SourceDetailData } from '@/types/dashboard';

export default function SourceDetailPage() {
  const params = useParams();
  const router = useRouter();

  const type = (params?.type as string) || '';
  const id = (params?.id as string) || '';

  const [loading, setLoading] = useState(true);
  const [sourceData, setSourceData] = useState<SourceDetailData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!type || !id) return;
    let isMounted = true;
    async function fetchDetail() {
      setLoading(true);
      setError(null);
      try {
        const data = await getSourceDetail(type, id);
        if (isMounted) {
          if (data && data.id) {
            setSourceData(data);
          } else {
            setError(`Source record [${type}/${id}] not found in media database.`);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Failed to retrieve media record.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchDetail();
    return () => {
      isMounted = false;
    };
  }, [type, id]);

  const targetUrl = sourceData?.source_url || sourceData?.post_url || sourceData?.clip_url || null;
  const canOpenOriginal = isSafeUrl(targetUrl);

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full flex flex-col gap-6">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition"
            >
              <MaterialIcon name="arrow_back" className="text-sm" />
              Back
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Media Repository</span>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-300 tracking-wider">
                {type}
              </span>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="text-xs font-mono text-slate-500">{id}</span>
            </div>
          </div>
          <SampleDataBadge />
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center text-slate-400 gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            <div className="w-9 h-9 border-3 border-gov-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-medium">Retrieving verified media clipping and broadcast metadata...</p>
          </div>
        ) : error || !sourceData ? (
          /* Error State */
          <div className="p-10 bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/60 rounded-2xl shadow-sm text-center flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950 flex items-center justify-center text-red-600">
              <MaterialIcon name="error" className="text-2xl" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Media Record Unavailable</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">{error}</p>
            </div>
            <Link
              href="/"
              className="text-xs font-semibold px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-200 transition"
            >
              Return to Command Center Dashboard
            </Link>
          </div>
        ) : (
          /* Main Record Detail Display */
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            {/* Header Banner */}
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                  <MaterialIcon
                    name={type === 'clipping' ? 'newspaper' : type === 'social' ? 'share' : 'tv'}
                    className="text-xl"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
                      {sourceData.type.toUpperCase()} VERIFICATION
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {sourceData.district_code}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {sourceData.headline || sourceData.programme || `${sourceData.platform} Post by ${sourceData.handle}`}
                  </h2>
                </div>
              </div>

              {/* Safe Open Original Button */}
              {canOpenOriginal && (
                <a
                  href={targetUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm hover:shadow transition shrink-0"
                >
                  <span>Open original source</span>
                  <MaterialIcon name="open_in_new" className="text-sm" />
                </a>
              )}
            </div>

            {/* Type Specific Body Content */}
            <div className="p-5 sm:p-6 lg:p-8 flex flex-col gap-6">
              {/* 1. CLIPPING VIEW */}
              {sourceData.type === 'clipping' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Clipping Image / Layout Frame (5 cols) */}
                  <div className="lg:col-span-5 flex flex-col gap-3">
                    <div className="w-full aspect-[3/4] rounded-xl border border-slate-300 dark:border-slate-700 bg-amber-50/40 dark:bg-slate-800/60 p-4 flex flex-col justify-between shadow-inner relative overflow-hidden">
                      <div className="border-b border-slate-300 dark:border-slate-700 pb-2 flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 font-serif">
                          {sourceData.outlet}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {sourceData.language?.toUpperCase()} ED.
                        </span>
                      </div>
                      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                        <MaterialIcon name="newspaper" className="text-5xl text-slate-400 dark:text-slate-500 mb-2" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-serif leading-tight">
                          "{sourceData.headline}"
                        </span>
                        <span className="text-[11px] text-slate-500 mt-2">
                          Scanned Archival Print Frame (OCR 300 DPI)
                        </span>
                      </div>
                      <div className="border-t border-slate-300 dark:border-slate-700 pt-2 flex items-center justify-between text-[10px] text-slate-500">
                        <span>DGIPR Archival Record</span>
                        <SampleDataBadge />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Extracted Summary & Metadata (7 cols) */}
                  <div className="lg:col-span-7 flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Publication Outlet</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{sourceData.outlet}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Published Date</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {sourceData.published_at ? new Date(sourceData.published_at).toLocaleString('en-IN') : 'N/A'}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Language & Script</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {sourceData.language === 'mr' ? 'Marathi (मराठी देवनागरी)' : sourceData.language}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">District Bureau</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {sourceData.district_code} (Verified)
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                          OCR Extracted Summary & Text
                        </span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <MaterialIcon name="check_circle" className="text-xs" />
                          Processed
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {sourceData.summary}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. SOCIAL MEDIA POST VIEW */}
              {sourceData.type === 'social' && (
                <div className="max-w-2xl mx-auto w-full flex flex-col gap-4">
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col gap-4 shadow-sm">
                    {/* Author Bar */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                          {(sourceData.handle || '@MH').slice(1, 3).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">
                              {sourceData.handle || 'Official Desk'}
                            </span>
                            <MaterialIcon name="verified_user" className="text-blue-500 text-xs" />
                          </div>
                          <span className="text-xs text-slate-400">
                            {sourceData.platform} •{' '}
                            {sourceData.posted_at ? new Date(sourceData.posted_at).toLocaleString('en-IN') : 'Recent'}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {sourceData.district_code}
                      </span>
                    </div>

                    {/* Post Content */}
                    <p className="text-sm sm:text-base text-slate-800 dark:text-slate-100 leading-relaxed font-sans">
                      {sourceData.text}
                    </p>

                    {/* Engagement Counters */}
                    <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-200 dark:border-slate-700 text-center text-xs">
                      {(() => {
                        const engNum =
                          typeof sourceData.engagement === 'number'
                            ? sourceData.engagement
                            : typeof sourceData.engagement === 'object' && sourceData.engagement
                            ? sourceData.engagement.likes || 120
                            : 120;
                        return (
                          <>
                            <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                              <span className="text-[10px] text-slate-400 block">Likes</span>
                              <span className="font-bold text-slate-800 dark:text-slate-200">{engNum}</span>
                            </div>
                            <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                              <span className="text-[10px] text-slate-400 block">Reposts</span>
                              <span className="font-bold text-slate-800 dark:text-slate-200">
                                {Math.round(engNum * 0.35)}
                              </span>
                            </div>
                            <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                              <span className="text-[10px] text-slate-400 block">Replies</span>
                              <span className="font-bold text-slate-800 dark:text-slate-200">
                                {Math.round(engNum * 0.15)}
                              </span>
                            </div>
                            <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                              <span className="text-[10px] text-slate-400 block">Reach</span>
                              <span className="font-bold text-slate-800 dark:text-slate-200">
                                {(engNum * 12).toLocaleString()}
                              </span>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. TV BROADCAST CLIP VIEW */}
              {sourceData.type === 'tv' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: TV Player Placeholder Frame (7 cols) */}
                  <div className="lg:col-span-7 flex flex-col gap-3">
                    <div className="w-full aspect-video rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between p-4 relative overflow-hidden shadow-lg group">
                      {/* Top Bar on Screen */}
                      <div className="flex items-center justify-between text-white z-10">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                          <span className="text-xs font-black uppercase tracking-wider bg-red-600 px-1.5 py-0.5 rounded text-[10px]">
                            {sourceData.channel}
                          </span>
                          <span className="text-xs text-slate-300 font-medium">{sourceData.programme}</span>
                        </div>
                        <span className="text-[11px] font-mono text-amber-400">
                          +{sourceData.start_offset_sec}s OFFSET
                        </span>
                      </div>

                      {/* Center Play Overlay */}
                      <div className="flex flex-col items-center justify-center text-center z-10">
                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center text-white cursor-pointer hover:scale-105 transition shadow-lg">
                          <MaterialIcon name="play_arrow" className="text-3xl ml-0.5" />
                        </div>
                        <span className="text-xs text-slate-300 mt-2 font-medium">Broadcast Archive Playback</span>
                      </div>

                      {/* Bottom Timecode Scrubber Bar */}
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-white/10 pt-2 z-10">
                        <span>Offset: 00:{String(sourceData.start_offset_sec || 0).padStart(2, '0')}:00</span>
                        <span>Recorded Feed Archive</span>
                      </div>

                      {/* Subtle TV Scanline gradient background */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80 pointer-events-none" />
                    </div>
                  </div>

                  {/* Right Column: Transcript and Metadata (5 cols) */}
                  <div className="lg:col-span-5 flex flex-col gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Channel</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{sourceData.channel}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Programme</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{sourceData.programme}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Aired At</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {sourceData.aired_at ? new Date(sourceData.aired_at).toLocaleString('en-IN') : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Segment Offset</span>
                        <span className="font-mono text-slate-800 dark:text-slate-200">+{sourceData.start_offset_sec}s</span>
                      </div>
                    </div>

                    {/* Timestamped Transcript */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                          Automated Transcript Segment
                        </span>
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 italic">
                          Speech-to-text preview
                        </span>
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed italic bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                        "{sourceData.transcript_text}"
                      </p>
                      <span className="text-[10px] text-slate-400">
                        Machine transcript generated from Marathi audio broadcast stream.
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
