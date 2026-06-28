#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sandboxDir = path.join(root, "src", "engines", "world", "sandbox");
const variantsFile = path.join(
  root,
  "src",
  "engines",
  "world",
  "components",
  "worldMotionVariants.ts"
);

const deprecatedCommonJsScript = path.join(sandboxDir, "runAiAudit.js");

const requiredSandboxFiles = [
  "index.ts",
  "AiAssetSpecs.ts",
  "ExperimentalShader.tsx",
  "aiOperationalConfig.ts",
  "aiPromptFactory.ts",
  "runAiAudit.mjs",
];

const requiredVariantTokens = ["worldMotionVariants", "worldTransitions"];

function pass(message) {
  console.log(`PASS - ${message}`);
}

function fail(message) {
  console.error(`FAIL - ${message}`);
  process.exitCode = 1;
}

console.log("");
console.log("=================================================================");
console.log("🧪 XETHKIOZ AI SANDBOX — OPERATIONAL AUDIT");
console.log("=================================================================");
console.log("");

if (!fs.existsSync(sandboxDir)) {
  fail("Sandbox directory is missing: src/engines/world/sandbox/");
} else {
  pass("Sandbox directory exists");
}

for (const file of requiredSandboxFiles) {
  const filePath = path.join(sandboxDir, file);

  if (fs.existsSync(filePath)) {
    pass(`Sandbox file present: ${file}`);
  } else {
    fail(`Missing sandbox file: ${file}`);
  }
}

if (fs.existsSync(deprecatedCommonJsScript)) {
  fail("Deprecated CommonJS script still exists: runAiAudit.js. Use runAiAudit.mjs.");
} else {
  pass("Deprecated CommonJS script is absent");
}

const sandboxIndexPath = path.join(sandboxDir, "index.ts");

if (fs.existsSync(sandboxIndexPath)) {
  const indexSource = fs.readFileSync(sandboxIndexPath, "utf8");

  if (indexSource.includes("export {};")) {
    pass("Sandbox index has empty export boundary");
  } else {
    fail("Sandbox index should keep an empty export boundary");
  }
}

if (!fs.existsSync(variantsFile)) {
  fail("worldMotionVariants.ts not found for compatibility check");
} else {
  const variantsSource = fs.readFileSync(variantsFile, "utf8");

  for (const token of requiredVariantTokens) {
    if (variantsSource.includes(token)) {
      pass(`Variant token found: ${token}`);
    } else {
      fail(`Variant token missing: ${token}`);
    }
  }
}

console.log("");

if (process.exitCode) {
  console.log("Result: FAILED");
} else {
  console.log("Result: PASSED");
}

console.log("");
