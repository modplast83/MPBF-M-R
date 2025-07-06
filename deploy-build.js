#!/usr/bin/env node

import { build } from "esbuild";
import { writeFileSync, mkdirSync, existsSync, rmSync, cpSync } from "fs";
import { execSync } from "child_process";

async function buildForDeployment() {
  try {
    console.log("Building for deployment...");

    // Clean and create dist directory
    if (existsSync("dist")) {
      rmSync("dist", { recursive: true, force: true });
    }
    mkdirSync("dist", { recursive: true });

    // Build frontend first
    console.log("Building frontend...");
    execSync("vite build", { stdio: "inherit" });

    // Copy frontend build to dist/public
    if (existsSync("client/dist")) {
      cpSync("client/dist", "dist/public", { recursive: true });
      console.log("Frontend assets copied to dist/public");
    }

    // Build server with production optimizations
    console.log("Building server...");
    await build({
      entryPoints: ["server/index.ts"],
      bundle: true,
      platform: "node",
      target: "node18",
      format: "esm",
      outfile: "dist/index.js",
      packages: "external",
      mainFields: ["module", "main"],
      conditions: ["import", "node"],
      banner: {
        js: `import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);`,
      },
      define: {
        "process.env.NODE_ENV": '"production"',
      },
      external: [
        "express",
        "pg",
        "drizzle-orm",
        "@neondatabase/serverless",
        "express-session",
        "passport",
        "passport-local",
        "connect-pg-simple",
        "express-fileupload",
        "@sendgrid/mail",
        "twilio",
        "bcrypt",
        "uuid",
        "memorystore",
        "ws",
      ],
    });

    // Create proper package.json for ES modules
    const packageJson = {
      type: "module",
      main: "index.js",
      scripts: {
        start: "node index.js",
      },
      engines: {
        node: ">=18.0.0",
      },
    };
    writeFileSync("dist/package.json", JSON.stringify(packageJson, null, 2));

    // Create theme.json in dist if it exists in root
    if (existsSync("theme.json")) {
      cpSync("theme.json", "dist/theme.json");
    }

    console.log("Deployment build completed successfully!");
    console.log("Created files:");
    execSync("find dist -type f | head -10", { stdio: "inherit" });
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

buildForDeployment();
