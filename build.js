// Produces build/ - the exact set of files to upload, and nothing else.
// Run with: bun build.js
import { cp, rm, mkdir } from "node:fs/promises";
import { join } from "node:path";

const root = import.meta.dir;
const out = join(root, "build");

// An allowlist rather than a denylist: a new file in the repository root is
// never published by accident, it has to be named here first.
const publish = [
  "index.html",
  "favicon.svg",
  "favicon.ico",
  "apple-touch-icon.png",
  "assets",
  "_headers", // Cloudflare Pages reads this from the upload root.
];

// Rebuilt from empty every time, so a file deleted from the repository cannot
// linger in the upload - the trimmed font subsets would otherwise still ship.
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

for (const entry of publish) {
  await cp(join(root, entry), join(out, entry), { recursive: true });
}

console.log(`build/ ready - upload it to Cloudflare Pages`);
