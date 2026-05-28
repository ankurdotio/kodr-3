/**
 * watcher.js
 * Uses Chokidar to monitor WORKDIR for file changes and immediately
 * reflects those changes to S3:
 *   - add / change  → upload to S3
 *   - unlink        → delete from S3
 *   - addDir        → no-op (S3 has no real directories)
 *   - unlinkDir     → no-op
 */

import chokidar from "chokidar";
import path from "path";
import { uploadFile, deleteS3Object } from "./s3.js";
import { toS3Key, log } from "./utils.js";

/**
 * Debounce map to batch rapid successive saves (e.g. editor auto-save).
 * Key: absolute file path, Value: NodeJS Timeout handle.
 */
const pending = new Map();
const DEBOUNCE_MS = 300; // wait 300 ms after last change before syncing

/**
 * Start watching WORKDIR and sync changes to S3 in real time.
 *
 * @param {S3Client} s3Client
 * @param {string}   bucket
 * @param {string}   projectPrefix  - e.g. "proj-abc123/"
 * @param {string}   workdir        - absolute local path
 */
export function startWatcher(s3Client, bucket, projectPrefix, workdir) {
  log("Watcher: starting file watcher…");

  const watcher = chokidar.watch(workdir, {
    // ── Ignore rules ────────────────────────────────────────────────────────
    ignored: [
      /(^|[/\\])\../,           // dot-files / dot-folders
      /node_modules/,
      /\.env(\..*)?$/,          // .env, .env.local, .env.production, etc.
      /dist[/\\]/,
      /\.log$/,
    ],

    persistent: true,           // keep process alive
    ignoreInitial: true,        // skip events for files already on disk at start
    awaitWriteFinish: {
      // Wait until the file size stabilises before firing the event.
      // Prevents uploading partially-written files.
      stabilityThreshold: 500,
      pollInterval: 100,
    },
  });

  // ── Helpers ────────────────────────────────────────────────────────────────

  /**
   * Schedule an upload with debounce.
   * Cancels any existing timer for the same file before setting a new one.
   */
  function scheduleUpload(absolutePath) {
    if (pending.has(absolutePath)) clearTimeout(pending.get(absolutePath));

    const timer = setTimeout(async () => {
      pending.delete(absolutePath);
      const relKey = toRelKey(absolutePath);
      try {
        await uploadFile(
          s3Client,
          bucket,
          toS3Key(projectPrefix, relKey),
          absolutePath
        );
        log(`  ↑ synced  ${relKey}`);
      } catch (err) {
        log(`  ✗ upload failed for ${relKey}: ${err.message}`);
      }
    }, DEBOUNCE_MS);

    pending.set(absolutePath, timer);
  }

  /**
   * Convert an absolute local path to a forward-slash S3 relative key.
   */
  function toRelKey(absolutePath) {
    return path.relative(workdir, absolutePath).split(path.sep).join("/");
  }

  // ── Event handlers ─────────────────────────────────────────────────────────

  watcher
    .on("add", (filePath) => {
      log(`  + detected  ${toRelKey(filePath)}`);
      scheduleUpload(filePath);
    })
    .on("change", (filePath) => {
      log(`  ~ changed   ${toRelKey(filePath)}`);
      scheduleUpload(filePath);
    })
    .on("unlink", async (filePath) => {
      // Cancel any pending upload for this file first
      if (pending.has(filePath)) {
        clearTimeout(pending.get(filePath));
        pending.delete(filePath);
      }

      const relKey = toRelKey(filePath);
      try {
        await deleteS3Object(s3Client, bucket, toS3Key(projectPrefix, relKey));
        log(`  - deleted   ${relKey}`);
      } catch (err) {
        log(`  ✗ delete failed for ${relKey}: ${err.message}`);
      }
    })
    .on("error", (err) => {
      log(`Watcher error: ${err.message}`);
    })
    .on("ready", () => {
      log("Watcher: ready — watching for changes.");
    });

  return watcher;
}