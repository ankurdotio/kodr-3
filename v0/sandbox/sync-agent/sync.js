/**
 * sync.js  ← entry point
 *
 * Orchestrates the full sync lifecycle:
 *   1. Validate required environment variables.
 *   2. Run the bootstrap (initial two-way sync with S3).
 *   3. Start Chokidar watcher for ongoing real-time sync.
 *
 * Environment variables expected (set in .env or injected by Kubernetes):
 *   AWS_REGION           - e.g. "us-east-1"
 *   AWS_ACCESS_KEY_ID    - IAM access key
 *   AWS_SECRET_ACCESS_KEY- IAM secret key
 *   S3_BUCKET            - bucket name
 *   PROJECTID            - unique project identifier (used as S3 key prefix)
 *   WORKDIR              - (optional) override the workspace path; default "/workspace"
 */

import "dotenv/config";
import { S3Client } from "@aws-sdk/client-s3";
import { bootstrap } from "./src/bootstrap.js";
import { startWatcher } from "./src/watcher.js";
import { buildPrefix, log } from "./src/utils.js";

// ── Configuration ────────────────────────────────────────────────────────────

const WORKDIR = process.env.WORKDIR || "/workspace";

const REQUIRED_ENV = [
    "AWS_REGION",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "S3_BUCKET",
    "PROJECTID",
];

function validateEnv() {
    const missing = REQUIRED_ENV.filter((key) => !process.env[ key ]);
    if (missing.length > 0) {
        console.error(
            `[FATAL] Missing required environment variables: ${missing.join(", ")}`
        );
        process.exit(1);
    }
}

// ── Bootstrap ────────────────────────────────────────────────────────────────

async function main() {
    validateEnv();

    const bucket = process.env.S3_BUCKET;
    const projectPrefix = buildPrefix(process.env.PROJECTID); // e.g. "proj-abc123/"

    log(`Starting sync — project: "${process.env.PROJECTID}", bucket: "${bucket}", workdir: "${WORKDIR}"`);

    // Initialise the S3 client
    const s3Client = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });

    // ── Step 1: Initial two-way sync ──────────────────────────────────────────
    await bootstrap(s3Client, bucket, projectPrefix, WORKDIR);

    // ── Step 2: Watch for changes and sync continuously ───────────────────────
    startWatcher(s3Client, bucket, projectPrefix, WORKDIR);
}

// ── Graceful shutdown ────────────────────────────────────────────────────────

process.on("SIGTERM", () => {
    log("Received SIGTERM — shutting down gracefully.");
    process.exit(0);
});

process.on("SIGINT", () => {
    log("Received SIGINT — shutting down.");
    process.exit(0);
});

process.on("uncaughtException", (err) => {
    log(`Uncaught exception: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
});

main().catch((err) => {
    log(`Fatal error in main: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
});