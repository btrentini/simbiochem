#!/usr/bin/env node
/**
 * Re-encode oversized images in public/ down to sane source dimensions.
 *
 *   node scripts/optimize-images.mjs          # apply
 *   node scripts/optimize-images.mjs --dry    # report only
 *
 * Every source here was far larger than anything it renders at. next/image
 * resizes on request, but the browser still pays for the hero sprites, which
 * are loaded through `new Image()` in hero-physics.tsx and therefore bypass
 * next/image entirely and download at full resolution.
 *
 * Targets are ~2x the largest rendered size, which covers retina.
 * Idempotent: files already at or below target are skipped.
 *
 * sharp comes from next's dependency tree (next requires it for the image
 * optimizer), so there is no extra install step.
 */

import { readdir, stat, rename } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const DRY = process.argv.includes("--dry");

// longest side, in px. Rendered sizes noted for justification.
const RULES = [
  { match: /^public\/simbiochemLogo\.png$/, max: 400 },        // renders at <=60px tall
  { match: /^public\/hero\/protein\.png$/, max: 680 },          // sprite size 340
  { match: /^public\/hero\/protein-myoglobin\.png$/, max: 680 },// currently unused
  { match: /^public\/hero\/mol-dna\.png$/, max: 320 },          // sprite size 132
  { match: /^public\/hero\/mol-nacl\.png$/, max: 288 },         // sprite size 120
  { match: /^public\/hero\/mol-.*\.png$/, max: 256 },           // sprite size 104
  { match: /^public\/people\//, max: 512 },                     // avatars <=160px
  { match: /^public\/venue\//, max: 1600 },                     // hero-ish, sizes=600px
  { match: /^public\/sponsors\//, max: 512 },
];

async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(p, out);
    else if (/\.(png|jpe?g|webp)$/i.test(entry.name)) out.push(p);
  }
  return out;
}

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

const files = (await walk("public")).sort();
let before = 0;
let after = 0;
let changed = 0;

for (const file of files) {
  const rule = RULES.find((r) => r.match.test(file));
  const originalSize = (await stat(file)).size;
  before += originalSize;

  if (!rule) {
    after += originalSize;
    continue;
  }

  const image = sharp(file);
  const meta = await image.metadata();
  const longest = Math.max(meta.width, meta.height);
  const needsResize = longest > rule.max;

  // Re-encode even when already small enough: these were exported with weak
  // compression, so there is meaningful headroom without touching dimensions.
  const pipeline = sharp(file, { animated: false });
  if (needsResize) {
    pipeline.resize({
      width: meta.width >= meta.height ? rule.max : undefined,
      height: meta.height > meta.width ? rule.max : undefined,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  // Re-encode in the SOURCE format. An earlier version of this script branched
  // only on "is it a PNG", which sent transparent WebP down the JPEG path: it
  // flattened the alpha to black and wrote JPEG bytes into a .webp file. That
  // is how the NVIDIA logo became a black bar. Never let an image with an alpha
  // channel reach the JPEG encoder.
  if (meta.format === "png") {
    // Palette quantisation is a large win on flat molecular renders, and
    // preserves the alpha channel they rely on.
    pipeline.png({ compressionLevel: 9, effort: 10, palette: true, quality: 90 });
  } else if (meta.format === "webp" || meta.hasAlpha) {
    pipeline.webp({ quality: 82, effort: 6 });
  } else {
    pipeline.jpeg({ quality: 82, mozjpeg: true, progressive: true });
  }

  const buf = await pipeline.toBuffer();

  if (buf.length >= originalSize && !needsResize) {
    after += originalSize;
    continue; // never make a file bigger
  }

  const dims = needsResize
    ? `${meta.width}x${meta.height} -> max ${rule.max}`
    : `${meta.width}x${meta.height} (recompress)`;
  const pct = (100 * (1 - buf.length / originalSize)).toFixed(0);
  console.log(
    `${DRY ? "[dry] " : ""}${file}\n    ${dims}   ${kb(originalSize)} -> ${kb(buf.length)}  (-${pct}%)`,
  );

  if (!DRY) {
    const tmp = `${file}.tmp`;
    await sharp(buf).toFile(tmp);
    await rename(tmp, file);
  }
  after += buf.length;
  changed += 1;
}

console.log(
  `\n${changed} file(s) ${DRY ? "would be " : ""}optimised.\n` +
    `public/ total: ${kb(before)} -> ${kb(after)}  (-${(100 * (1 - after / before)).toFixed(0)}%)`,
);
