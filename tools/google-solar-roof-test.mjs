#!/usr/bin/env node
/**
 * Nexa Roof — bounded Google Solar API validation harness
 *
 * PURPOSE
 * Validate whether Google Solar Building Insights is useful as an EARLY roof-intelligence
 * layer for Belgian roofing lead qualification. This is NOT a quotation or certified roof
 * measurement tool.
 *
 * INPUT CSV (UTF-8):
 * id,latitude,longitude,reference_area_m2,notes
 * test-01,51.1761,4.8326,145,"known roof"
 *
 * ENV:
 * GOOGLE_SOLAR_API_KEY=...
 *
 * RUN:
 * node tools/google-solar-roof-test.mjs ./roof-test-input.csv > roof-test-output.csv
 *
 * BOUNDED TEST RULE:
 * Maximum 20 rows per run. No retry loop. The script uses Building Insights only.
 * It does not call Data Layers and does not geocode addresses.
 *
 * OUTPUT:
 * Per building: API status, imagery quality/date, whole-roof area, roof-segment count,
 * weighted average pitch, dominant segment area/pitch/azimuth, reference delta where
 * supplied, and raw building name for traceability.
 */

import fs from 'node:fs';

const API_KEY = process.env.GOOGLE_SOLAR_API_KEY;
if (!API_KEY) {
  console.error('Missing GOOGLE_SOLAR_API_KEY environment variable.');
  process.exit(2);
}

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: node tools/google-solar-roof-test.mjs ./roof-test-input.csv');
  process.exit(2);
}

function parseCsvLine(line) {
  const cells = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') { cell += '"'; i++; }
      else quoted = !quoted;
    } else if (ch === ',' && !quoted) {
      cells.push(cell);
      cell = '';
    } else cell += ch;
  }
  cells.push(cell);
  return cells;
}

function csvEscape(value) {
  if (value === null || value === undefined) return '';
  const s = String(value);
  return /[",\n\r]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
}

const lines = fs.readFileSync(inputPath, 'utf8')
  .replace(/^\uFEFF/, '')
  .split(/\r?\n/)
  .filter(Boolean);

if (lines.length < 2) {
  console.error('Input CSV has no data rows.');
  process.exit(2);
}

const headers = parseCsvLine(lines[0]).map(x => x.trim());
const required = ['id', 'latitude', 'longitude'];
for (const key of required) {
  if (!headers.includes(key)) {
    console.error(`Missing required column: ${key}`);
    process.exit(2);
  }
}

const rows = lines.slice(1).map(line => {
  const vals = parseCsvLine(line);
  return Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? '']));
});

if (rows.length > 20) {
  console.error(`Bounded test limit exceeded: ${rows.length} rows supplied; maximum is 20.`);
  process.exit(2);
}

const outputHeaders = [
  'id','status','http_status','latitude','longitude','imagery_quality','imagery_date',
  'whole_roof_area_m2','ground_area_m2','segment_count','weighted_pitch_deg',
  'dominant_segment_area_m2','dominant_segment_pitch_deg','dominant_segment_azimuth_deg',
  'reference_area_m2','area_delta_m2','area_delta_pct','building_name','error','notes'
];
console.log(outputHeaders.join(','));

for (const row of rows) {
  const lat = Number(row.latitude);
  const lng = Number(row.longitude);
  const refArea = row.reference_area_m2 === '' || row.reference_area_m2 == null
    ? null : Number(row.reference_area_m2);

  const out = Object.fromEntries(outputHeaders.map(h => [h, '']));
  out.id = row.id;
  out.latitude = row.latitude;
  out.longitude = row.longitude;
  out.reference_area_m2 = Number.isFinite(refArea) ? refArea.toFixed(2) : '';
  out.notes = row.notes ?? '';

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    out.status = 'INVALID_INPUT';
    out.error = 'Invalid latitude/longitude';
    console.log(outputHeaders.map(h => csvEscape(out[h])).join(','));
    continue;
  }

  const url = new URL('https://solar.googleapis.com/v1/buildingInsights:findClosest');
  url.searchParams.set('location.latitude', lat.toString());
  url.searchParams.set('location.longitude', lng.toString());
  url.searchParams.set('requiredQuality', 'BASE');
  url.searchParams.set('key', API_KEY);

  try {
    const response = await fetch(url, { headers: { accept: 'application/json' } });
    out.http_status = response.status;
    const body = await response.json();

    if (!response.ok) {
      out.status = response.status === 404 ? 'NOT_FOUND' : 'API_ERROR';
      out.error = body?.error?.message ?? JSON.stringify(body);
      console.log(outputHeaders.map(h => csvEscape(out[h])).join(','));
      continue;
    }

    const potential = body.solarPotential ?? {};
    const whole = potential.wholeRoofStats ?? {};
    const segments = Array.isArray(potential.roofSegmentStats) ? potential.roofSegmentStats : [];

    const normalizedSegments = segments
      .map(s => ({
        area: Number(s?.stats?.areaMeters2),
        pitch: Number(s?.pitchDegrees),
        azimuth: Number(s?.azimuthDegrees)
      }))
      .filter(s => Number.isFinite(s.area) && s.area > 0);

    const totalSegmentArea = normalizedSegments.reduce((sum, s) => sum + s.area, 0);
    const weightedPitch = totalSegmentArea > 0
      ? normalizedSegments.reduce((sum, s) => sum + s.area * (Number.isFinite(s.pitch) ? s.pitch : 0), 0) / totalSegmentArea
      : null;
    const dominant = [...normalizedSegments].sort((a, b) => b.area - a.area)[0] ?? null;

    const apiArea = Number(whole.areaMeters2);
    const delta = Number.isFinite(apiArea) && Number.isFinite(refArea) ? apiArea - refArea : null;
    const deltaPct = delta !== null && refArea > 0 ? (delta / refArea) * 100 : null;

    out.status = 'OK';
    out.imagery_quality = body.imageryQuality ?? '';
    out.imagery_date = body.imageryDate
      ? [body.imageryDate.year, String(body.imageryDate.month ?? '').padStart(2, '0'), String(body.imageryDate.day ?? '').padStart(2, '0')].join('-')
      : '';
    out.whole_roof_area_m2 = Number.isFinite(apiArea) ? apiArea.toFixed(2) : '';
    out.ground_area_m2 = Number.isFinite(Number(whole.groundAreaMeters2)) ? Number(whole.groundAreaMeters2).toFixed(2) : '';
    out.segment_count = normalizedSegments.length;
    out.weighted_pitch_deg = weightedPitch !== null ? weightedPitch.toFixed(2) : '';
    out.dominant_segment_area_m2 = dominant ? dominant.area.toFixed(2) : '';
    out.dominant_segment_pitch_deg = dominant && Number.isFinite(dominant.pitch) ? dominant.pitch.toFixed(2) : '';
    out.dominant_segment_azimuth_deg = dominant && Number.isFinite(dominant.azimuth) ? dominant.azimuth.toFixed(2) : '';
    out.area_delta_m2 = delta !== null ? delta.toFixed(2) : '';
    out.area_delta_pct = deltaPct !== null ? deltaPct.toFixed(2) : '';
    out.building_name = body.name ?? '';
  } catch (error) {
    out.status = 'FETCH_ERROR';
    out.error = error?.message ?? String(error);
  }

  console.log(outputHeaders.map(h => csvEscape(out[h])).join(','));
}
