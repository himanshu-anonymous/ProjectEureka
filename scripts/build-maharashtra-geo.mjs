#!/usr/bin/env node
/**
 * Builds src/data/maharashtraGeo.generated.ts from real district boundary data.
 *
 *   node scripts/build-maharashtra-geo.mjs [--src file.geojson] [--simplify 8] [--width 800]
 *
 * Pipeline
 *   1. Load district polygons (Census-2011 vintage + Palghar 2014 update, with LGD codes).
 *   2. Topology-preserving Visvalingam simplification (mapshaper) so shared borders stay
 *      shared: no gaps or overlaps between neighbouring districts.
 *   3. Project (Mercator), emit SVG path strings rounded to 0.1 unit.
 *   4. Pole-of-inaccessibility per district (best label / pin position, always inside the shape).
 *   5. Division borders + state outline derived from the shared topology.
 *
 * --simplify is the % of vertices kept (higher = more precise, bigger file). 8 is a good
 * balance for a dashboard widget with zoom; use 15-20 for a full-page map.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { geoMercator, geoPath } from 'd3-geo';
import polylabel from 'polylabel';
import { topology } from 'topojson-server';
import { mesh } from 'topojson-client';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith('--')) acc.push([a.slice(2), arr[i + 1]]);
    return acc;
  }, [])
);

const SRC = resolve(args.src ?? '.cache/maharashtra_districts.geojson');
const SIMPLIFY_PCT = Number(args.simplify ?? 8);
const WIDTH = Number(args.width ?? 800);
const PAD = 12;
const OUT = resolve('src/data/maharashtraGeo.generated.ts');
const SRC_URL =
  'https://raw.githubusercontent.com/datta07/INDIAN-SHAPEFILES/master/STATES/MAHARASHTRA/MAHARASHTRA_DISTRICTS.geojson';

/* ------------------------------------------------------------------ */
/* Official metadata, keyed by Census-2011 district code (dtcode11).   */
/* Names are the current official ones (Ahilyanagar, Dharashiv,       */
/* Chhatrapati Sambhajinagar), not the 2011 spellings in the source.  */
/* ------------------------------------------------------------------ */
const DIVISIONS = {
  konkan: { name: 'Konkan', nameMr: 'कोकण' },
  nashik: { name: 'Nashik', nameMr: 'नाशिक' },
  pune: { name: 'Pune', nameMr: 'पुणे' },
  'chhatrapati-sambhajinagar': { name: 'Chhatrapati Sambhajinagar', nameMr: 'छत्रपती संभाजीनगर' },
  amravati: { name: 'Amravati', nameMr: 'अमरावती' },
  nagpur: { name: 'Nagpur', nameMr: 'नागपूर' },
};

const D = (id, name, nameMr, division, label) => ({ id, name, nameMr, division, label: label ?? name });
const META = {
  497: D('nandurbar', 'Nandurbar', 'नंदुरबार', 'nashik'),
  498: D('dhule', 'Dhule', 'धुळे', 'nashik'),
  499: D('jalgaon', 'Jalgaon', 'जळगाव', 'nashik'),
  500: D('buldhana', 'Buldhana', 'बुलढाणा', 'amravati'),
  501: D('akola', 'Akola', 'अकोला', 'amravati'),
  502: D('washim', 'Washim', 'वाशीम', 'amravati'),
  503: D('amravati', 'Amravati', 'अमरावती', 'amravati'),
  504: D('wardha', 'Wardha', 'वर्धा', 'nagpur'),
  505: D('nagpur', 'Nagpur', 'नागपूर', 'nagpur'),
  506: D('bhandara', 'Bhandara', 'भंडारा', 'nagpur'),
  507: D('gondia', 'Gondia', 'गोंदिया', 'nagpur'),
  508: D('gadchiroli', 'Gadchiroli', 'गडचिरोली', 'nagpur'),
  509: D('chandrapur', 'Chandrapur', 'चंद्रपूर', 'nagpur'),
  510: D('yavatmal', 'Yavatmal', 'यवतमाळ', 'amravati'),
  511: D('nanded', 'Nanded', 'नांदेड', 'chhatrapati-sambhajinagar'),
  512: D('hingoli', 'Hingoli', 'हिंगोली', 'chhatrapati-sambhajinagar'),
  513: D('parbhani', 'Parbhani', 'परभणी', 'chhatrapati-sambhajinagar'),
  514: D('jalna', 'Jalna', 'जालना', 'chhatrapati-sambhajinagar'),
  515: D('chhatrapati-sambhajinagar', 'Chhatrapati Sambhajinagar', 'छत्रपती संभाजीनगर', 'chhatrapati-sambhajinagar', 'Chh. Sambhajinagar'),
  516: D('nashik', 'Nashik', 'नाशिक', 'nashik'),
  517: D('thane', 'Thane', 'ठाणे', 'konkan'),
  518: D('mumbai-suburban', 'Mumbai Suburban', 'मुंबई उपनगर', 'konkan', 'Mumbai Sub.'),
  519: D('mumbai-city', 'Mumbai City', 'मुंबई शहर', 'konkan'),
  520: D('raigad', 'Raigad', 'रायगड', 'konkan'),
  521: D('pune', 'Pune', 'पुणे', 'pune'),
  522: D('ahilyanagar', 'Ahilyanagar', 'अहिल्यानगर', 'nashik'),
  523: D('beed', 'Beed', 'बीड', 'chhatrapati-sambhajinagar'),
  524: D('latur', 'Latur', 'लातूर', 'chhatrapati-sambhajinagar'),
  525: D('dharashiv', 'Dharashiv', 'धाराशिव', 'chhatrapati-sambhajinagar'),
  526: D('solapur', 'Solapur', 'सोलापूर', 'pune'),
  527: D('satara', 'Satara', 'सातारा', 'pune'),
  528: D('ratnagiri', 'Ratnagiri', 'रत्नागिरी', 'konkan'),
  529: D('sindhudurg', 'Sindhudurg', 'सिंधुदुर्ग', 'konkan'),
  530: D('kolhapur', 'Kolhapur', 'कोल्हापूर', 'pune'),
  531: D('sangli', 'Sangli', 'सांगली', 'pune'),
  732: D('palghar', 'Palghar', 'पालघर', 'konkan'),
};

/* ------------------------------------------------------------------ */
/* 1. Load source                                                      */
/* ------------------------------------------------------------------ */
if (!existsSync(SRC)) {
  console.log(`Downloading source data -> ${SRC}`);
  mkdirSync(dirname(SRC), { recursive: true });
  const res = await fetch(SRC_URL);
  if (!res.ok) throw new Error(`Download failed: HTTP ${res.status}`);
  writeFileSync(SRC, Buffer.from(await res.arrayBuffer()));
}

/* ------------------------------------------------------------------ */
/* 2. Topology-preserving simplification                               */
/* ------------------------------------------------------------------ */
const tmp = resolve('.cache/simplified.geojson');
mkdirSync(dirname(tmp), { recursive: true });
execFileSync(
  resolve('node_modules/.bin/mapshaper'),
  [SRC, 'snap', '-simplify', 'visvalingam', `percentage=${SIMPLIFY_PCT}%`, 'keep-shapes',
   '-o', tmp, 'precision=0.00001', 'force'],
  { stdio: 'inherit' }
);
const src = JSON.parse(readFileSync(tmp, 'utf8'));

/**
 * d3-geo uses spherical winding: exterior rings must be clockwise, holes counter-clockwise.
 * mapshaper/RFC 7946 output is the opposite, which makes d3 treat each district as
 * "the whole globe except this shape". Rewind every ring to d3's convention.
 */
const signedArea = (ring) => {
  let a = 0;
  for (let i = 0, n = ring.length - 1; i < n; i++) a += (ring[i + 1][0] - ring[i][0]) * (ring[i + 1][1] + ring[i][1]);
  return a / 2; // > 0 => clockwise (y-up)
};
const rewindPolygon = (poly) =>
  poly.map((ring, i) => {
    const clockwise = signedArea(ring) > 0;
    return (i === 0) === clockwise ? ring : [...ring].reverse();
  });
const rewindGeometry = (g) =>
  g.type === 'MultiPolygon'
    ? { ...g, coordinates: g.coordinates.map(rewindPolygon) }
    : { ...g, coordinates: rewindPolygon(g.coordinates) };

const features = src.features.map((f) => {
  const code = Number(f.properties.dtcode11);
  const meta = META[code];
  if (!meta) throw new Error(`No metadata for district code ${code} (${f.properties.dtname})`);
  return { ...f, geometry: rewindGeometry(f.geometry), properties: { ...meta, code, lgd: Number(f.properties.Dist_LGD) } };
});

// Sanity checks: this is the part that makes "all 36 districts" a verified claim
if (features.length !== 36) throw new Error(`Expected 36 districts, got ${features.length}`);
if (new Set(features.map((f) => f.properties.id)).size !== 36) throw new Error('Duplicate district ids');
const perDivision = {};
for (const f of features) perDivision[f.properties.division] = (perDivision[f.properties.division] ?? 0) + 1;
const expected = { konkan: 7, nashik: 5, pune: 5, 'chhatrapati-sambhajinagar': 8, amravati: 5, nagpur: 6 };
for (const [k, n] of Object.entries(expected)) {
  if (perDivision[k] !== n) throw new Error(`Division ${k}: expected ${n} districts, got ${perDivision[k]}`);
}

/* ------------------------------------------------------------------ */
/* 3. Project + build paths                                            */
/* ------------------------------------------------------------------ */
const fc = { type: 'FeatureCollection', features };
const projection = geoMercator().fitWidth(WIDTH - PAD * 2, fc);
const [tx, ty] = projection.translate();
projection.translate([tx + PAD, ty + PAD]);
const path = geoPath(projection).digits(1);
const [, [, bottom]] = path.bounds(fc);
const HEIGHT = Math.ceil(bottom + PAD);
const r1 = (n) => Math.round(n * 10) / 10;

const ringArea = (ring) => {
  let a = 0;
  for (let i = 0, n = ring.length - 1; i < n; i++) a += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
  return Math.abs(a / 2);
};

const districts = features
  .map((f) => {
    const polys = f.geometry.type === 'MultiPolygon' ? f.geometry.coordinates : [f.geometry.coordinates];
    // project, then pick the biggest polygon so the pin never lands on an islet
    const projected = polys.map((poly) => poly.map((ring) => ring.map((p) => projection(p))));
    const main = projected.reduce((best, p) => (ringArea(p[0]) > ringArea(best[0]) ? p : best));
    const [px, py] = polylabel(main, 0.1);
    const [[x0, y0], [x1, y1]] = path.bounds(f);
    const p = f.properties;
    return {
      id: p.id,
      name: p.name,
      nameMr: p.nameMr,
      label: p.label,
      division: p.division,
      censusCode: p.code,
      lgdCode: p.lgd,
      path: path(f),
      pin: { x: r1(px), y: r1(py) },
      bbox: { x: r1(x0), y: r1(y0), w: r1(x1 - x0), h: r1(y1 - y0) },
      area: Math.round(path.area(f)),
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

/* ------------------------------------------------------------------ */
/* 4. Division borders + state outline from shared topology            */
/* ------------------------------------------------------------------ */
const topo = topology({ d: { type: 'FeatureCollection', features: features.map((f) => ({ ...f, properties: { division: f.properties.division } })) } });
const divisionBorders = path(mesh(topo, topo.objects.d, (a, b) => a !== b && a.properties.division !== b.properties.division));
const stateOutline = path(mesh(topo, topo.objects.d, (a, b) => a === b));

/* ------------------------------------------------------------------ */
/* 5. Emit TypeScript                                                  */
/* ------------------------------------------------------------------ */
const idUnion = districts.map((d) => `'${d.id}'`).join(' | ');
const divUnion = Object.keys(DIVISIONS).map((d) => `'${d}'`).join(' | ');
const json = (v) => JSON.stringify(v, null, 2);

const ts = `/* eslint-disable */
// AUTO-GENERATED by scripts/build-maharashtra-geo.mjs. Do not edit by hand; re-run \`npm run build:geo\`.
//
// Boundaries: Census-2011 district polygons with the 2014 Palghar update (community mirror of
// Survey of India data, ${SRC_URL.split('/').slice(3, 5).join('/')}),
// simplified to ${SIMPLIFY_PCT}% of vertices with a topology-preserving pass. Names are current official names.
// For on-screen orientation only; not a legal demarcation of district boundaries.

export type DistrictId = ${idUnion};
export type DivisionId = ${divUnion};

export const MAP_WIDTH = ${WIDTH};
export const MAP_HEIGHT = ${HEIGHT};

export interface DistrictGeometry {
  id: DistrictId;
  /** Current official English name */
  name: string;
  /** Name in Marathi (Devanagari) */
  nameMr: string;
  /** Short name used for on-map labels */
  label: string;
  division: DivisionId;
  /** Census 2011 district code */
  censusCode: number;
  /** Local Government Directory code */
  lgdCode: number;
  /** SVG path in map units (viewBox 0 0 MAP_WIDTH MAP_HEIGHT) */
  path: string;
  /** Pole of inaccessibility: the point deepest inside the district. Used for pin + label. */
  pin: { x: number; y: number };
  bbox: { x: number; y: number; w: number; h: number };
  /** Projected area in map units squared */
  area: number;
}

export const DIVISIONS: Record<DivisionId, { name: string; nameMr: string }> = ${json(DIVISIONS)};

export const DIVISION_ORDER: DivisionId[] = ${json(Object.keys(DIVISIONS))};

/** Internal borders between divisions only (no district borders). */
export const DIVISION_BORDERS_PATH = ${JSON.stringify(divisionBorders)};

/** Outer boundary of the state. */
export const STATE_OUTLINE_PATH = ${JSON.stringify(stateOutline)};

export const DISTRICT_GEOMETRY: DistrictGeometry[] = ${json(districts)};

export const DISTRICT_BY_ID = Object.fromEntries(
  DISTRICT_GEOMETRY.map((d) => [d.id, d])
) as Record<DistrictId, DistrictGeometry>;
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, ts);

const kb = Math.round(Buffer.byteLength(ts) / 1024);
const verts = districts.reduce((n, d) => n + (d.path.match(/[ML]/g)?.length ?? 0), 0);
console.log(`\nWrote ${OUT}`);
console.log(`  ${districts.length} districts, ~${verts} path vertices, ${kb} KB, viewBox 0 0 ${WIDTH} ${HEIGHT}`);
console.log('  per division:', perDivision);
