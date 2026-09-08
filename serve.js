// Local preview: bun serve.js          serves the repository
//                bun serve.js build    serves the upload directory
// Opening index.html over file:// is not equivalent - Chrome gives file://
// documents an opaque origin and refuses to load the fonts.
import { resolve } from "node:path";

const root = resolve(import.meta.dir, process.argv[2] ?? ".");
const port = Number(process.env.PORT) || 8731;

Bun.serve({
  port,
  async fetch(req) {
    // Parsing as a URL resolves away any ".." before it reaches the filesystem.
    const path = new URL(req.url).pathname;
    const file = Bun.file(root + (path.endsWith("/") ? path + "index.html" : path));
    return (await file.exists())
      ? new Response(file)
      : new Response("Not found\n", { status: 404 });
  },
});

console.log(`Serving ${root} on http://localhost:${port}`);
