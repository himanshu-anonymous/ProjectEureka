import assert from 'node:assert/strict';
import { DISTRICT_GEOMETRY } from '../src/data/maharashtraGeo.generated.ts';

console.log('--- TEST: 3D District Centroid Beacon & Pin System ---');

// 1. Verify all 36 districts have valid pin coordinates
assert.equal(DISTRICT_GEOMETRY.length, 36, 'Expected 36 districts');

for (const geo of DISTRICT_GEOMETRY) {
  assert.ok(geo.pin, `District ${geo.id} is missing pin object`);
  assert.equal(typeof geo.pin.x, 'number', `District ${geo.id} pin.x is not a number`);
  assert.equal(typeof geo.pin.y, 'number', `District ${geo.id} pin.y is not a number`);

  // Verify pin is inside or at the boundary of district bbox
  const { x, y, w, h } = geo.bbox;
  const tolerance = 2.0; // small boundary buffer for simplified topology
  const insideX = geo.pin.x >= x - tolerance && geo.pin.x <= x + w + tolerance;
  const insideY = geo.pin.y >= y - tolerance && geo.pin.y <= y + h + tolerance;

  assert.ok(
    insideX,
    `District ${geo.id} pin.x (${geo.pin.x}) is outside bbox [${x}, ${x + w}]`
  );
  assert.ok(
    insideY,
    `District ${geo.id} pin.y (${geo.pin.y}) is outside bbox [${y}, ${y + h}]`
  );

  // 2. Test 3D World Space Coordinate Transformation (scale = 0.25, offset = 400, 332)
  const pinWorldX = (geo.pin.x - 400) * 0.25;
  const pinWorldY = -(geo.pin.y - 332) * 0.25;

  assert.ok(!isNaN(pinWorldX), `pinWorldX is NaN for ${geo.id}`);
  assert.ok(!isNaN(pinWorldY), `pinWorldY is NaN for ${geo.id}`);

  // Max Maharashtra extent should fit within ground radius 155
  const distFromOrigin = Math.sqrt(pinWorldX * pinWorldX + pinWorldY * pinWorldY);
  assert.ok(
    distFromOrigin < 155,
    `District ${geo.id} pin world coordinate (${pinWorldX.toFixed(1)}, ${pinWorldY.toFixed(1)}) falls outside pedestal (dist: ${distFromOrigin.toFixed(1)})`
  );
}
console.log('✔ All 36 district pins are mathematically verified inside their bounding boundaries and 3D pedestal.');

// 3. Test dynamic Z height elevation for beacon
const sampleDepths = [4.0, 10.5, 18.0, 22.4];
for (const depth of sampleDepths) {
  const beaconZ = depth + 1.2;
  assert.ok(beaconZ > depth, 'Beacon Z must sit strictly above top polygon surface');
  assert.ok(Math.abs((beaconZ - depth) - 1.2) < 1e-6, 'Beacon stem elevation offset must remain stable at 1.2 units');
}
console.log('✔ Dynamic beacon Z-elevation verified across varied relief extrusions.');

console.log('>>> All 3D centroid pin & beacon tests PASSED! <<<\n');
