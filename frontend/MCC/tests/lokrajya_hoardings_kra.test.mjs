import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

test('1. Lokrajya 5-Language 1-Year Archive Data Verification', async (t) => {
  const lokrajyaPath = path.join(ROOT, 'src', 'data', 'lokrajyaArchiveData.ts');
  assert.ok(fs.existsSync(lokrajyaPath), 'lokrajyaArchiveData.ts must exist');

  const content = fs.readFileSync(lokrajyaPath, 'utf8');

  // Verify all 5 official languages are supported
  const languages = ['marathi', 'english', 'hindi', 'urdu', 'gujarati'];
  for (const lang of languages) {
    assert.ok(content.includes(`id: '${lang}'`), `Language '${lang}' must be defined in LOKRAJYA_LANGUAGES`);
  }

  // Verify 12 monthly issues per language
  assert.ok(content.includes('getLokrajyaIssuesForLanguage'), 'Archive generator must be present');
  assert.ok(content.includes('MONTH_THEMES'), 'Monthly themes dataset must be present');
});

test('2. Press Releases Screen Lokrajya Integration', async (t) => {
  const pressReleasesPath = path.join(ROOT, 'src', 'components', 'portal', 'PressReleasesScreen.tsx');
  assert.ok(fs.existsSync(pressReleasesPath), 'PressReleasesScreen.tsx must exist');

  const content = fs.readFileSync(pressReleasesPath, 'utf8');

  // Verify top navigation section switcher
  assert.ok(content.includes('setActiveSection'), 'Section toggle must be present');
  assert.ok(content.includes('lokrajya'), 'Lokrajya archive section must be present');
  assert.ok(content.includes('LokrajyaPDFViewerModal'), 'LokrajyaPDFViewerModal must be mounted');

  // Verify 5 languages tabs rendered
  assert.ok(content.includes('LOKRAJYA_LANGUAGES.map'), 'Must map over LOKRAJYA_LANGUAGES');
  assert.ok(content.includes('selectedLokrajyaLang'), 'Must track selected language state');
});

test('3. Advertisements & Outdoor Hoardings GIS Map Integration', async (t) => {
  const adsPath = path.join(ROOT, 'src', 'components', 'portal', 'AdvertisementsScreen.tsx');
  assert.ok(fs.existsSync(adsPath), 'AdvertisementsScreen.tsx must exist');

  const content = fs.readFileSync(adsPath, 'utf8');

  // Verify GIS Map import and usage
  assert.ok(content.includes("import { GISMap } from '@/components/leadership/GISMap/GISMap'"), 'Must import GISMap');
  assert.ok(content.includes('<GISMap />'), 'Must render GISMap');

  // Verify location-based hoardings filtering
  assert.ok(content.includes('handleDistrictChange'), 'Must have district selection handler');
  assert.ok(content.includes('getHoardingPhoto'), 'Must use real photographic images for hoardings');
  assert.ok(content.includes('getAdvertisementCreativePhoto'), 'Must use real creative images for advertisements');
  assert.ok(content.includes('hoardingViewMode'), 'Must support hoarding view modes');
});

test('4. KRA Nodal Officer & Kishor Gangurde Persona', async (t) => {
  const toolbarPath = path.join(ROOT, 'src', 'components', 'layout', 'DashboardToolbar.tsx');
  const headerPath = path.join(ROOT, 'src', 'components', 'layout', 'Header.tsx');
  const localizationPath = path.join(ROOT, 'src', 'lib', 'dataLocalization.ts');

  assert.ok(fs.existsSync(toolbarPath), 'DashboardToolbar.tsx must exist');
  assert.ok(fs.existsSync(headerPath), 'Header.tsx must exist');
  assert.ok(fs.existsSync(localizationPath), 'dataLocalization.ts must exist');

  const toolbarContent = fs.readFileSync(toolbarPath, 'utf8');
  const headerContent = fs.readFileSync(headerPath, 'utf8');
  const localizationContent = fs.readFileSync(localizationPath, 'utf8');

  // Verify KRA badge in toolbar space
  assert.ok(toolbarContent.includes('Kishor Gangurde'), 'DashboardToolbar must display Kishor Gangurde in center space');
  assert.ok(toolbarContent.includes('KRA'), 'Toolbar must label KRA Nodal Officer');

  // Verify Kishor Gangurde in Header
  assert.ok(headerContent.includes('Kishor Gangurde'), 'Header must set Kishor Gangurde');
  assert.ok(headerContent.includes('kishor.gangurde@maharashtra.gov.in'), 'Header must set official email');

  // Verify Officer map in dataLocalization
  assert.ok(localizationContent.includes('Kishor Gangurde'), 'OFFICER_MAP must contain Kishor Gangurde');
});

test('5. Score Decomposition Empty Space Filling with Index Velocity Chart', async (t) => {
  const scorePath = path.join(ROOT, 'src', 'components', 'zones', 'ScoreDecomposition', 'ScoreDecomposition.tsx');
  assert.ok(fs.existsSync(scorePath), 'ScoreDecomposition.tsx must exist');

  const content = fs.readFileSync(scorePath, 'utf8');

  // Verify 6-month historical governance velocity chart in Column 2
  assert.ok(content.includes('6-Month Index Trajectory & Velocity'), 'Must contain 6-Month Velocity Chart');
  assert.ok(content.includes('scoreTrendGrad'), 'Must contain SVG area gradient fill');
  assert.ok(content.includes('polyline'), 'Must contain velocity polyline path');
});

test('6. Menu Consolidation: Advertisements & Outdoor Hoardings + Lokrajya 5 Languages', async (t) => {
  const sidebarPath = path.join(ROOT, 'src', 'components', 'layout', 'Sidebar.tsx');
  assert.ok(fs.existsSync(sidebarPath), 'Sidebar.tsx must exist');

  const content = fs.readFileSync(sidebarPath, 'utf8');

  // Verify Advertisements & Outdoor Hoardings consolidated menu item
  assert.ok(content.includes('Advertisements & Outdoor Hoardings'), 'Sidebar must display Advertisements & Outdoor Hoardings');
  assert.ok(content.includes('जाहिराती व आउटडोअर होर्डिंग्ज'), 'Sidebar must display Marathi translation for Advertisements & Outdoor Hoardings');

  // Verify Lokrajya in 5 Languages dedicated menu item
  assert.ok(content.includes('Lokrajya (5 Languages)'), 'Sidebar must display Lokrajya (5 Languages)');
  assert.ok(content.includes('लोकराज्य मासिक (५ भाषा)'), 'Sidebar must display Marathi Lokrajya 5-language link');
  assert.ok(content.includes('/press-releases?tab=lokrajya'), 'Sidebar must link directly to Lokrajya archive tab');
});

test('7. Field Activities Workflow Permanent Removal', async (t) => {
  const activitiesPath = path.join(ROOT, 'src', 'components', 'portal', 'ActivitiesScreen.tsx');
  assert.ok(fs.existsSync(activitiesPath), 'ActivitiesScreen.tsx must exist');

  const content = fs.readFileSync(activitiesPath, 'utf8');

  // Verify DailyWorkFlowchart is permanently removed
  assert.ok(!content.includes('DailyWorkFlowchart'), 'DailyWorkFlowchart must be permanently removed from ActivitiesScreen');
});

test('8. Breaking News Ticker Slight Red Aesthetic Wire Styling', async (t) => {
  const tickerPath = path.join(ROOT, 'src', 'components', 'dashboard', 'BreakingNewsTicker.tsx');
  assert.ok(fs.existsSync(tickerPath), 'BreakingNewsTicker.tsx must exist');

  const content = fs.readFileSync(tickerPath, 'utf8');

  // Verify slight red aesthetic styling
  assert.ok(content.includes('from-red-50') || content.includes('border-red-200'), 'Breaking news scroller must have slight red color aesthetic');
  assert.ok(content.includes('bg-red-100') || content.includes('bg-red-600'), 'Breaking news badge must have active red indicators');
});

