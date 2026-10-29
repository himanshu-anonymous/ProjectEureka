import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();

describe('Precision Component-Wise Skeleton Loaders & Persistent App Shell', () => {
  describe('1. Persistent App Shell & No Full-Screen Blocking Spinners', () => {
    it('DashboardLayout should not render full-screen blocking overlay or verifying modal', () => {
      const layoutPath = path.join(ROOT_DIR, 'src', 'components', 'layout', 'DashboardLayout.tsx');
      const content = fs.readFileSync(layoutPath, 'utf8');

      // Assert no full-page blocking overlay
      assert.ok(!content.includes('Verifying Government Officer Security Clearance'), 'Found full-screen verifying overlay text');
      assert.ok(!content.includes('h-screen w-screen bg-slate-900'), 'Found full-screen dark blocking overlay container');

      // Assert persistent App Shell components are always present
      assert.ok(content.includes('<Header />'), 'Header must be permanently mounted in DashboardLayout');
      assert.ok(content.includes('<Sidebar />'), 'Sidebar must be permanently mounted in DashboardLayout');
      assert.ok(content.includes('DashboardToolbar'), 'DashboardToolbar must be integrated in DashboardLayout');
      assert.ok(content.includes('getRouteSkeleton'), 'getRouteSkeleton must be used for route-aware fallback during !authInitialized');
    });

    it('DashboardLayout should display subtle 2px saffron progress indicator during loading states', () => {
      const layoutPath = path.join(ROOT_DIR, 'src', 'components', 'layout', 'DashboardLayout.tsx');
      const content = fs.readFileSync(layoutPath, 'utf8');

      assert.ok(content.includes('animate-shimmer-amber'), 'Should include animate-shimmer-amber progress bar');
      assert.ok(content.includes('showProgressBar'), 'Should track showProgressBar state based on auth & data loading');
    });
  });

  describe('2. All 15 Route Segment loading.tsx Boundaries', () => {
    const requiredRoutes = [
      'src/app/loading.tsx',
      'src/app/crisis/loading.tsx',
      'src/app/districts/loading.tsx',
      'src/app/command-center/loading.tsx',
      'src/app/command-center/pipeline-flow/loading.tsx',
      'src/app/command-center/raw-ingestion/loading.tsx',
      'src/app/system-monitoring/loading.tsx',
      'src/app/system-monitoring/pipeline-flow/loading.tsx',
      'src/app/system-monitoring/raw-ingestion/loading.tsx',
      'src/app/press-releases/loading.tsx',
      'src/app/activities/loading.tsx',
      'src/app/reports/loading.tsx',
      'src/app/media/loading.tsx',
      'src/app/notifications/loading.tsx',
      'src/app/profile/loading.tsx',
    ];

    for (const routePath of requiredRoutes) {
      it(`should have ${routePath} with default export wrapping skeleton in DashboardLayout`, () => {
        const fullPath = path.join(ROOT_DIR, ...routePath.split('/'));
        assert.ok(fs.existsSync(fullPath), `Missing required route loading file: ${routePath}`);

        const content = fs.readFileSync(fullPath, 'utf8');
        assert.ok(content.includes('export default function Loading'), `${routePath} must default-export Loading component`);
        assert.ok(content.includes('DashboardLayout'), `${routePath} must wrap content in DashboardLayout to maintain persistent app shell`);
        assert.ok(content.includes('Skeleton'), `${routePath} must render a skeleton component`);
      });
    }
  });

  describe('3. In-Card Direct Root Returns (Safeguard #1 & Zero CLS)', () => {
    it('KPIRibbon should return KPIRibbonSkeleton directly on isLoadingData', () => {
      const filePath = path.join(ROOT_DIR, 'src', 'components', 'zones', 'KPIRibbon', 'KPIRibbon.tsx');
      const content = fs.readFileSync(filePath, 'utf8');
      assert.ok(content.includes('isLoadingData'), 'KPIRibbon must consume isLoadingData');
      assert.ok(content.includes('<KPIRibbonSkeleton'), 'KPIRibbon must return KPIRibbonSkeleton');
    });

    it('DistrictLeaderboard should return LeaderboardSkeleton directly on isLoadingData', () => {
      const filePath = path.join(ROOT_DIR, 'src', 'components', 'zones', 'DistrictLeaderboard', 'DistrictLeaderboard.tsx');
      const content = fs.readFileSync(filePath, 'utf8');
      assert.ok(content.includes('isLoadingData'), 'DistrictLeaderboard must consume isLoadingData');
      assert.ok(content.includes('<LeaderboardSkeleton />'), 'DistrictLeaderboard must return LeaderboardSkeleton');
    });

    it('ScoreDecomposition should return ScoreDecompositionSkeleton directly on isLoadingData', () => {
      const filePath = path.join(ROOT_DIR, 'src', 'components', 'zones', 'ScoreDecomposition', 'ScoreDecomposition.tsx');
      const content = fs.readFileSync(filePath, 'utf8');
      assert.ok(content.includes('isLoadingData'), 'ScoreDecomposition must consume isLoadingData');
      assert.ok(content.includes('<ScoreDecompositionSkeleton />'), 'ScoreDecomposition must return ScoreDecompositionSkeleton');
    });

    it('EmergencyAlert should return EmergencyAlertSkeleton directly with collapsed state preserved', () => {
      const filePath = path.join(ROOT_DIR, 'src', 'components', 'zones', 'EmergencyAlert', 'EmergencyAlert.tsx');
      const content = fs.readFileSync(filePath, 'utf8');
      assert.ok(content.includes('isLoadingData'), 'EmergencyAlert must consume isLoadingData');
      assert.ok(content.includes('<EmergencyAlertSkeleton isCollapsed={isCollapsed} isCrisisRoute={isCrisisRoute} />'), 'EmergencyAlert must pass isCollapsed and isCrisisRoute');
    });

    it('LiveNewsQueue should return LiveNewsQueueSkeleton directly on isLoadingData', () => {
      const filePath = path.join(ROOT_DIR, 'src', 'components', 'dashboard', 'LiveNewsQueue.tsx');
      const content = fs.readFileSync(filePath, 'utf8');
      assert.ok(content.includes('isLoadingData'), 'LiveNewsQueue must consume isLoadingData');
      assert.ok(content.includes('<LiveNewsQueueSkeleton />'), 'LiveNewsQueue must return LiveNewsQueueSkeleton');
    });

    it('TopLowerMatrix should return TopLowerMatrixSkeleton directly on isLoadingData', () => {
      const filePath = path.join(ROOT_DIR, 'src', 'components', 'leadership', 'TopLowerMatrix', 'TopLowerMatrix.tsx');
      const content = fs.readFileSync(filePath, 'utf8');
      assert.ok(content.includes('isLoadingData'), 'TopLowerMatrix must consume isLoadingData');
      assert.ok(content.includes('<TopLowerMatrixSkeleton />'), 'TopLowerMatrix must return TopLowerMatrixSkeleton');
    });

    it('GISMap should return GISMapSkeleton directly on isLoadingData', () => {
      const filePath = path.join(ROOT_DIR, 'src', 'components', 'leadership', 'GISMap', 'GISMap.tsx');
      const content = fs.readFileSync(filePath, 'utf8');
      assert.ok(content.includes('isLoadingData'), 'GISMap must consume isLoadingData');
      assert.ok(content.includes('<GISMapSkeleton />'), 'GISMap must return GISMapSkeleton');
    });
  });

  describe('4. Store Filter Debounce Safeguard', () => {
    it('dashboardStore should debounce rapid filter transitions and clear pending timeouts', () => {
      const storePath = path.join(ROOT_DIR, 'src', 'stores', 'dashboardStore.ts');
      const content = fs.readFileSync(storePath, 'utf8');

      assert.ok(content.includes('filterRequestSeq'), 'dashboardStore must track filterRequestSeq to avoid stale overwrites');
      assert.ok(content.includes('clearTimeout(filterTimeout)'), 'dashboardStore must clear pending timeout on rapid updates');
      assert.ok(content.includes('isLoadingData: true'), 'dashboardStore must trigger isLoadingData: true on filter updates');
    });
  });

  describe('5. CSS Shimmer Animation Definitions', () => {
    it('globals.css should define enterprise shimmer animations', () => {
      const cssPath = path.join(ROOT_DIR, 'src', 'app', 'globals.css');
      const content = fs.readFileSync(cssPath, 'utf8');

      assert.ok(content.includes('@keyframes shimmerSweep'), 'globals.css must define @keyframes shimmerSweep');
      assert.ok(content.includes('.animate-shimmer'), 'globals.css must define .animate-shimmer');
      assert.ok(content.includes('.animate-shimmer-subtle'), 'globals.css must define .animate-shimmer-subtle');
      assert.ok(content.includes('.animate-shimmer-dark'), 'globals.css must define .animate-shimmer-dark');
      assert.ok(content.includes('.animate-shimmer-amber'), 'globals.css must define .animate-shimmer-amber');
    });
  });
});
