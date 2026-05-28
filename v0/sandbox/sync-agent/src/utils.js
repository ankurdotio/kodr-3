/**
 * utils.js
 * Shared helpers used across all modules.
 */

/**
 * Build the full S3 key from a project prefix and a relative file key.
 *
 * Example:
 *   prefix  = "proj-abc123/"
 *   relKey  = "src/App.jsx"
 *   result  = "proj-abc123/src/App.jsx"
 *
 * @param {string} prefix - always ends with "/"
 * @param {string} relKey - forward-slash separated relative path
 * @returns {string}
 */
export function toS3Key(prefix, relKey) {
    // Guard against double slashes
    return `${prefix}${relKey.replace(/^\/+/, "")}`;
}

/**
 * Normalise the project ID into a safe S3 prefix.
 * Strips leading/trailing slashes and appends exactly one trailing slash.
 *
 * @param {string} projectId
 * @returns {string}  e.g. "proj-abc123/"
 */
export function buildPrefix(projectId) {
    const clean = projectId.replace(/^\/+|\/+$/g, "");
    if (!clean) throw new Error("PROJECTID must not be empty");
    return `${clean}/`;
}

/**
 * Lightweight logger with ISO timestamp.
 * Replace with a proper logger (pino, winston) if needed.
 *
 * @param {string} message
 */
export function log(message) {
    const ts = new Date().toISOString();
    console.log(`[${ts}] ${message}`);
}