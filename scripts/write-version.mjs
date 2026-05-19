#!/usr/bin/env node
/**
 * Emits a version.json next to every built index.html so the front-end
 * cache-busting script can detect new deployments and force a fresh load.
 *
 * Runs as a `postbuild` step. Safe to run when dist/ does not exist yet.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const distRoot = path.join(repoRoot, 'dist');

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function findIndexHtmlDirs(root) {
  const out = [];
  async function walk(dir, depth = 0) {
    if (depth > 6) return;
    let entries;
    try { entries = await fs.readdir(dir, { withFileTypes: true }); } catch { return; }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
        await walk(full, depth + 1);
      } else if (entry.isFile() && entry.name === 'index.html') {
        out.push(dir);
      }
    }
  }
  await walk(root);
  return out;
}

(async () => {
  if (!(await exists(distRoot))) {
    console.log('[write-version] dist/ not found, skipping.');
    return;
  }

  const dirs = await findIndexHtmlDirs(distRoot);
  if (dirs.length === 0) {
    console.log('[write-version] No index.html found under dist/, skipping.');
    return;
  }

  const version = Date.now();
  const payload = JSON.stringify({
    version,
    builtAt: new Date(version).toISOString(),
  });

  await Promise.all(
    dirs.map(async (dir) => {
      const target = path.join(dir, 'version.json');
      await fs.writeFile(target, payload, 'utf8');
      console.log(`[write-version] wrote ${path.relative(repoRoot, target)} → ${version}`);
    }),
  );
})().catch((err) => {
  console.error('[write-version] failed:', err);
  process.exit(1);
});
