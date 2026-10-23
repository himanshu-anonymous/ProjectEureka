import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();

describe('Three-Column Executive Dashboard Workspace (v5.0 Responsive Refinement)', () => {
  describe('1. Preservation of Original Dashboard', () => {
    it('MainDashboard.tsx should remain preserved intact in the codebase', () => {
      const mainDashboardPath = path.join(
        ROOT_DIR,
        'src',
        'components',
        'dashboard',
        'MainDashboard.tsx'
      );
      assert.ok(fs.existsSync(mainDashboardPath), 'MainDashboard.tsx must exist in codebase');
      const content = fs.readFileSync(mainDashboardPath, 'utf8');
      assert.ok(content.includes('export const MainDashboard'), 'MainDashboard component must be exported');
    });
  });

  describe('2. Progressive Responsive ThreeColumnDashboard Component Architecture', () => {
    it('ThreeColumnDashboard.tsx should exist and support multi-breakpoint responsive stages', () => {
      const threeColPath = path.join(
        ROOT_DIR,
        'src',
        'components',
        'dashboard',
        'ThreeColumnDashboard.tsx'
      );
      assert.ok(fs.existsSync(threeColPath), 'ThreeColumnDashboard.tsx must exist');
      const content = fs.readFileSync(threeColPath, 'utf8');

      // Full-width KPI Ribbon at Top
      assert.ok(content.includes('<section className="w-full">'), 'KPIRibbon must be placed in a full-width section at the top');
      assert.ok(content.includes('<KPIRibbon layout="ribbon" />'), 'ThreeColumnDashboard must render KPIRibbon with layout="ribbon"');

      // Outer Container
      assert.ok(content.includes('max-w-[1860px]'), 'ThreeColumnDashboard must use max-w-[1860px]');
      assert.ok(content.includes('bg-[#f4f6fa]'), 'ThreeColumnDashboard must have bg-[#f4f6fa] background');

      // Stage 2 (md/lg 2-Column Asymmetric Layout)
      assert.ok(content.includes('md:col-span-12 lg:col-span-7'), 'Primary Column must span 12 at md and 7 at lg');
      assert.ok(content.includes('md:col-span-12 lg:col-span-5'), 'Secondary Column must span 12 at md and 5 at lg');

      // Stage 3 (xl 3-Column Balanced Layout)
      assert.ok(content.includes('xl:col-span-3'), 'Left Column must span 3 at xl');
      assert.ok(content.includes('xl:col-span-5'), 'Center Column must span 5 at xl');
      assert.ok(content.includes('xl:col-span-4'), 'Right Column must span 4 at xl');

      // Components Assembled
      assert.ok(content.includes('ScoreDecomposition'), 'Must include ScoreDecomposition');
      assert.ok(content.includes('KeyMetricsTrends'), 'Must include KeyMetricsTrends');
      assert.ok(content.includes('TopLowerMatrix'), 'Must include TopLowerMatrix');
      assert.ok(content.includes('GISMap'), 'Must include GISMap');
      assert.ok(content.includes('BreakingNewsTicker'), 'Must include BreakingNewsTicker');
      assert.ok(content.includes('DistrictLeaderboard'), 'Must include DistrictLeaderboard');
      assert.ok(content.includes('showChart={false}'), 'Must pass showChart={false} to DistrictLeaderboard');
      assert.ok(content.includes('SocialMediaAnalysis'), 'Must include SocialMediaAnalysis');
      assert.ok(content.includes('EmergencyAlert'), 'Must include EmergencyAlert');
      assert.ok(content.includes('LiveStreaming'), 'Must include LiveStreaming');
      assert.ok(content.includes('LiveNewsQueue'), 'Must include LiveNewsQueue');

      // Bottom baseline alignment
      assert.ok(content.includes('[&>*]:flex-1 [&>*]:h-full'), 'Bottom panels must be anchored with flex-1 and h-full');
    });
  });

  describe('3. Route Page Module Replacement', () => {
    it('src/app/dashboard/page.tsx should render ThreeColumnDashboard', () => {
      const pagePath = path.join(ROOT_DIR, 'src', 'app', 'dashboard', 'page.tsx');
      const content = fs.readFileSync(pagePath, 'utf8');
      assert.ok(content.includes('ThreeColumnDashboard'), '/dashboard page must render ThreeColumnDashboard');
      assert.ok(content.includes('DashboardLayout'), '/dashboard page must wrap with DashboardLayout');
    });

    it('src/app/page.tsx should render ThreeColumnDashboard', () => {
      const pagePath = path.join(ROOT_DIR, 'src', 'app', 'page.tsx');
      const content = fs.readFileSync(pagePath, 'utf8');
      assert.ok(content.includes('ThreeColumnDashboard'), 'Root / page must render ThreeColumnDashboard');
      assert.ok(content.includes('DashboardLayout'), 'Root / page must wrap with DashboardLayout');
    });
  });

  describe('4. Decongestion & Responsive Bug Fixes (Bugs 1-4)', () => {
    it('Bug 1: SocialMediaAnalysis should stack on desktop and split on 2xl with tab toggle', () => {
      const socialPath = path.join(
        ROOT_DIR,
        'src',
        'components',
        'leadership',
        'SocialMediaAnalysis',
        'SocialMediaAnalysis.tsx'
      );
      const content = fs.readFileSync(socialPath, 'utf8');
      assert.ok(content.includes('grid-cols-1 2xl:grid-cols-2'), 'Streams must stack on standard desktop and split on 2xl to avoid text collision');
      assert.ok(content.includes('activeTab'), 'SocialMediaAnalysis must support tab filtering toggle');
      assert.ok(content.includes('max-h-[240px]'), 'Streams must be capped at max-h-[240px]');
    });

    it('Bug 2: GISMap should give map 100% width and place telemetry details below', () => {
      const gisPath = path.join(
        ROOT_DIR,
        'src',
        'components',
        'leadership',
        'GISMap',
        'GISMap.tsx'
      );
      const content = fs.readFileSync(gisPath, 'utf8');
      assert.ok(content.includes('min-h-[300px] sm:min-h-[360px]'), 'Map canvas must have min-h-[300px] sm:min-h-[360px]');
      assert.ok(content.includes('w-full'), 'Map canvas must take full 100% width');
      assert.ok(content.includes('District Live State'), 'Telemetry details must be present below map');
      assert.ok(content.includes('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'), 'Telemetry strip must use multi-column sub-grid below map');
    });

    it('Bug 3: LiveStreaming should have enlarged 16:9 canvas and 2x2 relay buttons on desktop', () => {
      const liveStreamPath = path.join(
        ROOT_DIR,
        'src',
        'components',
        'leadership',
        'LiveStreaming',
        'LiveStreaming.tsx'
      );
      const content = fs.readFileSync(liveStreamPath, 'utf8');
      assert.ok(content.includes('aspect-video'), 'Video player must be aspect-video 16:9');
      assert.ok(content.includes('min-h-[240px] sm:min-h-[280px]'), 'Video canvas must have min-h-[240px] sm:min-h-[280px]');
      assert.ok(content.includes('grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4'), 'Relay stream buttons must be in spacious 2x2 grid on desktop');
    });

    it('Bug 4: KeyMetricsTrends & ScoreDecomposition should eliminate redundant subtitles and use 2x2 channel mix', () => {
      const chartPath = path.join(
        ROOT_DIR,
        'src',
        'components',
        'zones',
        'DistrictLeaderboard',
        'DistrictPerformanceChart.tsx'
      );
      const chartContent = fs.readFileSync(chartPath, 'utf8');
      assert.ok(!chartContent.includes('Top 5 Districts by 4-Pillar Composite Index (25/25/25/25)'), 'Redundant duplicate chart subtitle must be removed');
      assert.ok(chartContent.includes('itemGap: 14'), 'Legend must have breathing room');

      const scorePath = path.join(
        ROOT_DIR,
        'src',
        'components',
        'zones',
        'ScoreDecomposition',
        'ScoreDecomposition.tsx'
      );
      const scoreContent = fs.readFileSync(scorePath, 'utf8');
      assert.ok(scoreContent.includes('grid grid-cols-2 gap-2 p-3'), 'ScoreDecomposition must display 4-Channel mix in a clean 2-column grid box with p-3');
    });

    it('BreakingNewsTicker should be solid red bar with rounded-xl px-4 py-2 and white text', () => {
      const tickerPath = path.join(
        ROOT_DIR,
        'src',
        'components',
        'dashboard',
        'BreakingNewsTicker.tsx'
      );
      assert.ok(fs.existsSync(tickerPath), 'BreakingNewsTicker.tsx must exist');
      const content = fs.readFileSync(tickerPath, 'utf8');
      assert.ok(content.includes('bg-red-600'), 'BreakingNewsTicker must have solid red bg-red-600 background');
      assert.ok(content.includes('rounded-xl px-4'), 'BreakingNewsTicker must have rounded-xl px-4');
      assert.ok(content.includes('BREAKING NEWS'), 'BreakingNewsTicker must display English BREAKING NEWS badge');
      assert.ok(content.includes('थेट घडामोड'), 'BreakingNewsTicker must display Marathi थेट घडामोड badge');
    });

    it('LiveNewsQueue should be capped at max-h-[210px]', () => {
      const queuePath = path.join(
        ROOT_DIR,
        'src',
        'components',
        'dashboard',
        'LiveNewsQueue.tsx'
      );
      const content = fs.readFileSync(queuePath, 'utf8');
      assert.ok(content.includes('max-h-[210px]'), 'LiveNewsQueue feed list must be capped at max-h-[210px]');
    });

    it('DistrictTable should provide vertical row breathing room and overflow-x-auto -mx-1 px-1', () => {
      const tablePath = path.join(
        ROOT_DIR,
        'src',
        'components',
        'zones',
        'DistrictLeaderboard',
        'DistrictTable.tsx'
      );
      const content = fs.readFileSync(tablePath, 'utf8');
      assert.ok(content.includes('py-3 px-3'), 'DistrictTable must use py-3 px-3 for vertical breathing room');
      assert.ok(content.includes('overflow-x-auto -mx-1 px-1'), 'DistrictTable must wrap in overflow-x-auto -mx-1 px-1');
      assert.ok(content.includes('min-w-[500px]'), 'DistrictTable must fit comfortably with zero clipping');
    });

    it('TopLowerMatrix should fit Left Column with comfortable padding and overflow-x-auto -mx-1 px-1', () => {
      const matrixPath = path.join(
        ROOT_DIR,
        'src',
        'components',
        'leadership',
        'TopLowerMatrix',
        'TopLowerMatrix.tsx'
      );
      const content = fs.readFileSync(matrixPath, 'utf8');
      assert.ok(content.includes('py-3 px-3'), 'TopLowerMatrix must use py-3 px-3 padding');
      assert.ok(content.includes('overflow-x-auto -mx-1 px-1'), 'TopLowerMatrix must use overflow-x-auto -mx-1 px-1');
      assert.ok(content.includes('hidden 2xl:inline-block'), 'Progress bar must hide on narrow column spans');
    });
  });

  describe('5. Skeleton Synchronization (Zero CLS)', () => {
    it('DashboardPageSkeleton should mirror the layout, chart skeleton, and red ticker', () => {
      const skeletonPath = path.join(
        ROOT_DIR,
        'src',
        'components',
        'skeletons',
        'DashboardPageSkeleton.tsx'
      );
      const content = fs.readFileSync(skeletonPath, 'utf8');
      assert.ok(content.includes('max-w-[1860px]'), 'DashboardPageSkeleton must mirror outer max-w-[1860px]');
      assert.ok(content.includes('bg-[#f4f6fa]'), 'DashboardPageSkeleton must mirror bg-[#f4f6fa]');
      assert.ok(content.includes('lg:grid-cols-12'), 'DashboardPageSkeleton must mirror 12-column grid at lg breakpoint');
      assert.ok(content.includes('items-stretch'), 'DashboardPageSkeleton must use items-stretch');
      assert.ok(content.includes('lg:col-span-4 xl:col-span-3'), 'DashboardPageSkeleton col 1 must match ThreeColumnDashboard');
      assert.ok(content.includes('lg:col-span-4 xl:col-span-5'), 'DashboardPageSkeleton col 2 must match ThreeColumnDashboard');
      assert.ok(content.includes('lg:col-span-4 xl:col-span-4'), 'DashboardPageSkeleton col 3 must match ThreeColumnDashboard');
      assert.ok(content.includes('bg-red-600/90'), 'DashboardPageSkeleton must mirror red ticker banner');
      assert.ok(content.includes('GISMapSkeleton'), 'DashboardPageSkeleton must include GISMapSkeleton in column 2');
      assert.ok(content.includes('SocialMediaSkeleton'), 'DashboardPageSkeleton must include SocialMediaSkeleton in column 3');
      assert.ok(content.includes('TopLowerMatrixSkeleton'), 'DashboardPageSkeleton must include TopLowerMatrixSkeleton in column 1');
      assert.ok(content.includes('LeaderboardSkeleton'), 'DashboardPageSkeleton must include LeaderboardSkeleton in column 2');
    });
  });
});
