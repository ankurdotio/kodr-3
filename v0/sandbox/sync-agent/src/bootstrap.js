/**
 * bootstrap.js
 * Run once at startup:
 *   1. List all S3 objects under the project prefix.
 *   2. Download S3 files that are newer than (or missing from) local disk.
 *   3. Upload local files that are newer than (or missing from) S3.
 *
 * This gives a "last-write-wins" merge between the container and S3.
 */

import path from "path";
import { listS3Objects, uploadFile, downloadFile } from "./s3.js";
import { walkDir, getLocalMtime, ensureDir, shouldIgnore } from "./fs.js";
import { toS3Key, log } from "./utils.js";

/**
 * Perform the initial two-way sync between WORKDIR and S3.
 *
 * @param {S3Client} s3Client
 * @param {string}   bucket
 * @param {string}   projectPrefix  - e.g. "proj-abc123/"
 * @param {string}   workdir        - absolute local path
 */
export async function bootstrap(s3Client, bucket, projectPrefix, workdir) {
    log("Bootstrap: starting initial sync…");

    // ── 1. Fetch the current state of S3 ──────────────────────────────────────
    const s3Objects = await listS3Objects(s3Client, bucket, projectPrefix);
    log(`Bootstrap: found ${s3Objects.size} object(s) in S3 under prefix "${projectPrefix}"`);

    // ── 2. Walk local disk ────────────────────────────────────────────────────
    const localFiles = await walkDir(workdir);
    log(`Bootstrap: found ${localFiles.length} local file(s) in ${workdir}`);

    // Build a quick lookup: relPath -> local mtime
    const localMtimes = new Map();
    for (const rel of localFiles) {
        const mtime = await getLocalMtime(path.join(workdir, rel));
        localMtimes.set(rel, mtime);
    }

    // ── 3. Pull from S3: files that are newer in S3 or missing locally ────────
    let pulled = 0;
    for (const [ relKey, s3Mtime ] of s3Objects.entries()) {
        // Normalize separators (S3 always uses forward slashes)
        const relPath = relKey.split("/").join(path.sep);

        if (shouldIgnore(relPath)) continue;

        const localPath = path.join(workdir, relPath);
        const localMtime = localMtimes.get(relPath);


        await ensureDir(path.dirname(localPath));
        await downloadFile(
            s3Client,
            bucket,
            toS3Key(projectPrefix, relKey),
            localPath
        );
        log(`  ↓ pulled  ${relKey}`);
        pulled++;

    }

    // ── 4. Push to S3: files that are missing in S3 ──────────
    let pushed = 0;
    for (const [ relPath, localMtime ] of localMtimes.entries()) {
        // Convert local path sep to S3 forward-slash key
        const relKey = relPath.split(path.sep).join("/");
        const s3Mtime = s3Objects.get(relKey);

        if (shouldIgnore(relPath)) continue;

        const needsUpload = !s3Mtime

        if (needsUpload) {
            await uploadFile(
                s3Client,
                bucket,
                toS3Key(projectPrefix, relKey),
                path.join(workdir, relPath)
            );
            log(`  ↑ pushed  ${relKey}`);
            pushed++;
        }
    }

    log(`Bootstrap complete — pulled ${pulled}, pushed ${pushed} file(s).`);
}