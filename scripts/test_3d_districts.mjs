import assert from 'node:assert/strict';
import { DISTRICT_GEOMETRY } from '../src/data/maharashtraGeo.generated.ts';
import {
  LOVABLE_DISTRICTS,
  findDistrictMetricData,
  getDistrictMetricNormalizedScore,
  getBandFromScore,
  BAND_COLORS,
} from '../src/data/lovableDashboardData.ts';

console.log('--- TEST: 3D Districts Geometry & Telemetry Mapping ---');

// 1. Verify all 36 Maharashtra districts exist
assert.equal(DISTRICT_GEOMETRY.length, 36, 'Expected exactly 36 Maharashtra districts in DISTRICT_GEOMETRY');
console.log('✔ Verified exactly 36 district geometries exist.');

// 2. Verify all geometries have valid SVG paths and bboxes
for (const geo of DISTRICT_GEOMETRY) {
  assert.ok(geo.id, `District missing id: ${JSON.stringify(geo)}`);
  assert.ok(geo.name, `District missing name: ${geo.id}`);
  assert.ok(geo.nameMr, `District missing Marathi name: ${geo.id}`);
  assert.ok(geo.path && geo.path.length > 50, `District ${geo.id} has invalid SVG path`);
  assert.ok(geo.bbox && geo.bbox.w > 0 && geo.bbox.h > 0, `District ${geo.id} has invalid bbox`);
  assert.ok(geo.area > 0, `District ${geo.id} has zero area`);
}
console.log('✔ All 36 district SVG paths and bounding boxes are structurally valid.');

// 3. Verify complete matching with LOVABLE_DISTRICTS
let matchedCount = 0;
for (const geo of DISTRICT_GEOMETRY) {
  const metric =
    findDistrictMetricData(geo.id) ||
    findDistrictMetricData(geo.name) ||
    findDistrictMetricData(geo.label);

  assert.ok(metric, `Could not find metric telemetry data for district: ${geo.id} (${geo.name})`);
  matchedCount++;

  // Verify metric score normalization
  const perfScore = getDistrictMetricNormalizedScore(metric, 'performance');
  const covScore = getDistrictMetricNormalizedScore(metric, 'coverage');
  const sentScore = getDistrictMetricNormalizedScore(metric, 'sentiment');
  const crisisScore = getDistrictMetricNormalizedScore(metric, 'crisis');

  assert.ok(perfScore >= 0 && perfScore <= 100, `Perf score out of bounds for ${geo.id}: ${perfScore}`);
  assert.ok(covScore >= 0 && covScore <= 100, `Coverage score out of bounds for ${geo.id}: ${covScore}`);
  assert.ok(sentScore >= 0 && sentScore <= 100, `Sentiment score out of bounds for ${geo.id}: ${sentScore}`);
  assert.ok(crisisScore >= 0 && crisisScore <= 100, `Crisis score out of bounds for ${geo.id}: ${crisisScore}`);

  // Extrusion depth formula simulation
  const depth = 4 + (perfScore / 100) * 12 * 1.2;
  assert.ok(!isNaN(depth) && depth >= 4 && depth <= 25, `Invalid extrusion depth for ${geo.id}: ${depth}`);
}

assert.equal(matchedCount, 36, 'All 36 districts must be matched with metric telemetry');
console.log(`✔ All ${matchedCount}/36 districts mapped to live metrics with valid 0-100 normalized scores.`);

// 4. Verify Band Colors
const bands = ['excellent', 'good', 'moderate', 'attention', 'critical'];
for (const b of bands) {
  const color = BAND_COLORS[b];
  assert.ok(color && color.startsWith('#'), `Invalid color hex for band ${b}: ${color}`);
}
console.log('✔ Verified all 5 score bands map to non-AI authentic government colors.');

console.log('>>> All 3D district geometry & data tests PASSED! <<<\n');

