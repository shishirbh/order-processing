#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PLUGIN_DIR = join(ROOT, "plugin");
const OUTPUT = join(PLUGIN_DIR, "dist", "order-processing.plugin");

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function filesUnder(path) {
  const files = [];
  const visit = directory => {
    for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const full = join(directory, entry.name);
      if (entry.isDirectory()) visit(full);
      else if (entry.isFile()) files.push(full);
    }
  };
  visit(path);
  return files;
}

function zipBuffer(entries) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  for (const entry of entries) {
    const name = Buffer.from(entry.name);
    const data = entry.data;
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0, 6);
    local.writeUInt16LE(0, 8);
    local.writeUInt16LE(0, 10);
    local.writeUInt16LE(33, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);
    localParts.push(local, name, data);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(0x0314, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0, 8);
    central.writeUInt16LE(0, 10);
    central.writeUInt16LE(0, 12);
    central.writeUInt16LE(33, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(data.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt16LE(0, 30);
    central.writeUInt16LE(0, 32);
    central.writeUInt16LE(0, 34);
    central.writeUInt16LE(0, 36);
    central.writeUInt32LE((0o100644 * 0x10000) >>> 0, 38);
    central.writeUInt32LE(offset, 42);
    centralParts.push(central, name);
    offset += local.length + name.length + data.length;
  }
  const centralDirectory = Buffer.concat(centralParts);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralDirectory.length, 12);
  end.writeUInt32LE(offset, 16);
  end.writeUInt16LE(0, 20);
  return Buffer.concat([...localParts, centralDirectory, end]);
}

export function buildPluginBuffer() {
  const included = [join(PLUGIN_DIR, ".claude-plugin", "plugin.json"), join(PLUGIN_DIR, "README.md"), ...filesUnder(join(PLUGIN_DIR, "skills"))];
  return zipBuffer(included.map(path => ({ name: relative(PLUGIN_DIR, path).split(sep).join("/"), data: readFileSync(path) })));
}

export function validatePluginSource() {
  const manifest = JSON.parse(readFileSync(join(PLUGIN_DIR, ".claude-plugin", "plugin.json"), "utf8"));
  const skills = readdirSync(join(PLUGIN_DIR, "skills"), { withFileTypes: true })
    .filter(entry => entry.isDirectory() && existsSync(join(PLUGIN_DIR, "skills", entry.name, "SKILL.md")))
    .map(entry => entry.name)
    .sort();
  const readme = readFileSync(join(PLUGIN_DIR, "README.md"), "utf8");
  const errors = [];
  if (skills.length !== 6) errors.push(`Expected 6 release skills, found ${skills.length}`);
  if (!manifest.description.includes("Six skills")) errors.push("Manifest description must say Six skills");
  if (!readme.includes(`**${manifest.version}**`)) errors.push(`README version history is missing ${manifest.version}`);
  return { manifest, skills, errors };
}

function main() {
  const command = process.argv[2] || "build";
  const validation = validatePluginSource();
  if (validation.errors.length) {
    console.error(validation.errors.join("\n"));
    process.exitCode = 1;
    return;
  }
  const expected = buildPluginBuffer();
  if (command === "build") {
    mkdirSync(dirname(OUTPUT), { recursive: true });
    writeFileSync(OUTPUT, expected);
    console.log(`Built plugin ${validation.manifest.version} with ${validation.skills.length} skills: ${relative(ROOT, OUTPUT)}`);
    return;
  }
  if (command === "check") {
    if (!existsSync(OUTPUT) || !readFileSync(OUTPUT).equals(expected)) {
      console.error("Plugin artifact differs from source. Run npm run plugin:build and commit the result.");
      process.exitCode = 1;
      return;
    }
    console.log(`Plugin artifact matches source (${validation.manifest.version}, ${validation.skills.length} skills).`);
    return;
  }
  console.error("Usage: node scripts/build-plugin.mjs [build|check]");
  process.exitCode = 2;
}

if (resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) main();
