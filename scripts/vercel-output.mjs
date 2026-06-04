import { cpSync, existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";
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

// .vc-config.json
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

// Copy server code into function directory
const serverDir = join(dist, "server");
for (const entry of ["index.mjs", "package.json"]) {
  const src = join(serverDir, entry);
  if (existsSync(src)) cpSync(src, join(funcDir, entry), { force: true });
}

// Copy server chunks/libs
for (const sub of ["_chunks", "_libs", "_ssr"]) {
  const src = join(serverDir, sub);
  if (existsSync(src)) cpSync(src, join(funcDir, sub), { recursive: true, force: true });
}

// Copy node_modules
const nmSrc = join(serverDir, "node_modules");
if (existsSync(nmSrc)) cpSync(nmSrc, join(funcDir, "node_modules"), { recursive: true, force: true });

// Wrap Nitro's { fetch } default export as a proper function for Vercel
const indexSrc = readFileSync(join(funcDir, "index.mjs"), "utf8");
const patched = indexSrc.replace(
  /export\s*\{[^}]*vercel_web\s+as\s+default[^}]*\};?$/m,
  "const __nitro = vercel_web;\nexport default (req, context) => __nitro.fetch(req, context);",
);
writeFileSync(join(funcDir, "handler.mjs"), patched);

console.log("Vercel output prepared at .vercel/output/");
