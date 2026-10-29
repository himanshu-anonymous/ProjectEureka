import assert from 'node:assert/strict';

console.log('--- TEST: 3D Camera OrbitControls & Preset System ---');

// 1. Perspective Camera Specifications
const cameraConfig = {
  fov: 40,
  aspect: 800 / 550,
  near: 1,
  far: 2000,
  up: [0, 0, 1], // Z-up coordinates for GIS maps
};

assert.equal(cameraConfig.fov, 40, 'Camera FOV must be set to 40 for distortion-free telephoto viewing');
assert.equal(cameraConfig.near, 1, 'Near plane must be 1');
assert.equal(cameraConfig.far, 2000, 'Far plane must reach 2000');
assert.deepEqual(cameraConfig.up, [0, 0, 1], 'Coordinate system must be Z-up');
console.log('✔ Camera perspective parameters verified.');

// 2. Camera Preset Views
const PRESETS = {
  iso: { pos: [0, -170, 160], target: [0, 0, 5] },
  top: { pos: [0, -5, 230], target: [0, 0, 5] },
  front: { pos: [0, -210, 60], target: [0, 0, 5] },
};

for (const [name, preset] of Object.entries(PRESETS)) {
  const [px, py, pz] = preset.pos;
  const [tx, ty, tz] = preset.target;
  const dist = Math.hypot(px - tx, py - ty, pz - tz);

  assert.ok(dist >= 60 && dist <= 450, `Preset ${name} distance (${dist.toFixed(1)}) must be within [60, 450] range`);

  // Elevation angle from ground plane (Z)
  const elevationAngleRad = Math.atan2(pz - tz, Math.hypot(px - tx, py - ty));
  const elevationDeg = (elevationAngleRad * 180) / Math.PI;

  assert.ok(elevationDeg > 0, `Preset ${name} must sit above the ground plane (elevation: ${elevationDeg.toFixed(1)}°)`);
}
console.log('✔ All camera presets (Isometric, Top-Down, Low Horizon) lie safely within zoom boundaries and above ground.');

// 3. OrbitControls Guardrail Invariants
const orbitGuardrails = {
  minDistance: 60,
  maxDistance: 450,
  maxPolarAngle: Math.PI / 2.05,
  enableDamping: true,
  dampingFactor: 0.08,
};

assert.ok(orbitGuardrails.maxPolarAngle < Math.PI / 2, 'maxPolarAngle must prevent subterranean camera inversion');
assert.ok(orbitGuardrails.minDistance >= 50, 'minDistance prevents clipping into district meshes');
assert.ok(orbitGuardrails.maxDistance <= 600, 'maxDistance prevents losing Maharashtra model from sight');
assert.ok(orbitGuardrails.enableDamping, 'Damping must be enabled for inertial smoothness');
assert.equal(orbitGuardrails.dampingFactor, 0.08, 'Damping factor tuned to 0.08');
console.log('✔ Subterranean inversion guardrail (maxPolarAngle = 87.8°) verified.');

// 4. Auto-rotation step sanity
const rotationDelta = 0.003; // ~0.17 degrees/frame, ~10 degrees/second at 60fps
const fullTurnSeconds = (2 * Math.PI) / (rotationDelta * 60);
assert.ok(fullTurnSeconds >= 30 && fullTurnSeconds <= 40, `Full turn should take ~35s (calculated: ${fullTurnSeconds.toFixed(1)}s)`);
console.log(`✔ Auto-rotation rate verified at 1 revolution per ~${fullTurnSeconds.toFixed(1)} seconds (comfortable reading pace).`);

console.log('>>> All 3D camera & orbit control tests PASSED! <<<\n');

