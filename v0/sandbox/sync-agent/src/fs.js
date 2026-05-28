/**
 * fs.js
 * Local filesystem helpers: recursive directory walk, mtime lookup,
 * directory creation, and ignore-list filtering.
 */

import { readdir, stat, mkdir } from "fs/promises";
import path from "path";

/**
 * Patterns to ignore during sync (relative to WORKDIR).
 * Chokidar uses its own ignore config; this list is used
 * for the initial full-scan before the watcher starts.
 */
export const IGNORE_PATTERNS = [
  "node_modules",
  ".env",
  ".env.local",
  ".env.*.local",
  ".git",
  ".DS_Store",
  "dist",           // built output — usually not worth syncing
  "*.log",
];

/**
 * Check whether a relative path should be ignored.
 *
 * @param {string} relPath - path relative to workdir
 * @returns {boolean}
 */
export function shouldIgnore(relPath) {
  const parts = relPath.split(path.sep);
  return parts.some((part) =>
    IGNORE_PATTERNS.some((pattern) => {
      if (pattern.includes("*")) {
        // Very simple glob: only supports leading wildcard (*.ext)
        const ext = pattern.slice(1);
        return part.endsWith(ext);
      }
      return part === pattern;
    })
  );
}

/**
 * Recursively walk a directory and return all file paths
 * (relative to the root) that aren't ignored.
 *
 * @param {string} root  - absolute path to walk
 * @param {string} [base] - used internally for recursion
 * @returns {Promise<string[]>} list of relative file paths
 */
export async function walkDir(root, base = "") {
  const entries = await readdir(path.join(root, base), {
    withFileTypes: true,
  });

  const results = [];

  for (const entry of entries) {
    const rel = base ? path.join(base, entry.name) : entry.name;

    if (shouldIgnore(rel)) continue;

    if (entry.isDirectory()) {
      const nested = await walkDir(root, rel);
      results.push(...nested);
    } else if (entry.isFile()) {
      results.push(rel);
    }
  }

  return results;
}

/**
 * Get the last-modified time of a local file.
 *
 * @param {string} filePath - absolute path
 * @returns {Promise<Date>}
 */
export async function getLocalMtime(filePath) {
  const info = await stat(filePath);
  return info.mtime;
}

/**
 * Ensure a directory (and all parents) exist.
 *
 * @param {string} dirPath - absolute path
 */
export async function ensureDir(dirPath) {
  await mkdir(dirPath, { recursive: true });
}