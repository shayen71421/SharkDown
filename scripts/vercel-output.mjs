import { cpSync, existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync } from "fs";
import { join } from "path";

const dist = "dist";
const output = ".vercel/output";

const nitro = JSON.parse(readFileSync(join(dist, "nitro.json"), "utf8"));
if (nitro.preset !== "vercel") {
  console.log(`Skipping Vercel output step: preset is "${nitro.preset}"`);
  process.exit(0);
}

if (!existsSync(output)) mkdirSync(output, { recursive: true });

// Copy config.json
cpSync(join(dist, "config.json"), join(output, "config.json"), { force: true });

// Copy static files (rename client/ → static/ for Vercel v3 API)
cpSync(join(dist, "client"), join(output, "static"), { recursive: true, force: true });

// Set up serverless function
const funcDir = join(output, "functions", "__server.func");
mkdirSync(funcDir, { recursive: true });

// Copy server code into function directory
const serverDir = join(dist, "server");
for (const entry of ["index.mjs", "package.json", ".vc-config.json"]) {
  const src = join(serverDir, entry);
  if (existsSync(src)) cpSync(src, join(funcDir, entry), { force: true });
}

// Copy all top-level server chunks (e.g. _repo-*.mjs, _tanstack-start-manifest_*.mjs)
for (const entry of readdirSync(serverDir)) {
  const src = join(serverDir, entry);
  const dst = join(funcDir, entry);
  if (entry.endsWith(".mjs") && !existsSync(dst)) {
    cpSync(src, dst, { force: true });
  }
}

// Copy server subdirectories (chunks, libs, ssr, node_modules)
for (const sub of ["_chunks", "_libs", "_ssr", "node_modules"]) {
  const src = join(serverDir, sub);
  if (existsSync(src)) cpSync(src, join(funcDir, sub), { recursive: true, force: true });
}

// Create handler wrapper — Vercel Node.js launcher gives a request with plain-object headers,
// but Nitro's vercel_web.fetch() calls req.headers.get() (Web API Headers method).
// This wrapper normalizes the request before passing it to Nitro.
const handlerCode = `import nitro from "./index.mjs";

function toRequest(req) {
  if (typeof req.headers?.get === "function") {
    return req;
  }
  const protocol = req.headers?.["x-forwarded-proto"] || "https";
  const host = req.headers?.["host"] || "localhost";
  const url = new URL(req.url, protocol + "://" + host).href;
  const headers = new Headers();
  for (const k of Object.keys(req.headers || {})) {
    const v = req.headers[k];
    if (v !== undefined) {
      headers.set(k, Array.isArray(v) ? v.join(", ") : String(v));
    }
  }
  return new Request(url, {
    method: req.method,
    headers,
    body: ["GET", "HEAD", "OPTIONS"].includes(req.method) ? undefined : req.body,
  });
}

export default (req, context) => nitro.fetch(toRequest(req), context);
`;
writeFileSync(join(funcDir, "handler.mjs"), handlerCode);

// .vc-config.json — point to our wrapper
writeFileSync(
  join(funcDir, ".vc-config.json"),
  JSON.stringify({
    runtime: "nodejs22.x",
    handler: "handler.mjs",
    launcherType: "Nodejs",
    shouldAddHelpers: false,
    supportsResponseStreaming: true,
    operationType: "SSR",
  }),
);

console.log("Vercel output prepared at .vercel/output/");
