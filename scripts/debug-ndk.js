"use strict";
/**
 * Debug script: writes NDJSON to .cursor/debug.log to test hypotheses
 * for "worked yesterday, broken today" NDK build failure.
 * Run: node scripts/debug-ndk.js
 */
const fs = require("fs");
const path = require("path");

const LOG_PATH = path.join(__dirname, "..", ".cursor", "debug.log");
const NDK_VERSION = "27.3.13750724";

function appendLog(payload) {
  const line = JSON.stringify({
    ...payload,
    timestamp: Date.now(),
    sessionId: "debug-session",
  }) + "\n";
  const dir = path.dirname(LOG_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.appendFileSync(LOG_PATH, line, "utf8");
}

function main() {
  const androidHome =
    process.env.ANDROID_HOME ||
    process.env.ANDROID_SDK_ROOT ||
    path.join(process.env.LOCALAPPDATA || "", "Android", "Sdk");
  const ndkDir = path.join(androidHome, "ndk", NDK_VERSION);
  const sourceProps = path.join(ndkDir, "source.properties");

  // #region agent log
  appendLog({
    hypothesisId: "C",
    location: "scripts/debug-ndk.js:env",
    message: "ANDROID_HOME / NDK path env",
    data: {
      ANDROID_HOME: process.env.ANDROID_HOME || null,
      ANDROID_SDK_ROOT: process.env.ANDROID_SDK_ROOT || null,
      resolvedAndroidHome: androidHome,
      ndkDir,
    },
  });
  // #endregion

  // #region agent log
  const ndkDirExists = fs.existsSync(ndkDir);
  const sourcePropsExists = fs.existsSync(sourceProps);
  appendLog({
    hypothesisId: "A",
    location: "scripts/debug-ndk.js:exists",
    message: "NDK dir and source.properties existence",
    data: { ndkDirExists, sourcePropsExists, ndkDir, sourceProps },
  });
  // #endregion

  // #region agent log
  let dirContents = [];
  if (ndkDirExists) {
    try {
      dirContents = fs.readdirSync(ndkDir);
    } catch (e) {
      dirContents = ["readdir_error: " + (e && e.message)];
    }
  }
  appendLog({
    hypothesisId: "B",
    location: "scripts/debug-ndk.js:contents",
    message: "NDK dir contents (partial/corrupt check)",
    data: {
      ndkDirExists,
      fileCount: dirContents.length,
      firstTwenty: dirContents.slice(0, 20),
      hasSourceProps: dirContents.includes("source.properties"),
    },
  });
  // #endregion

  // #region agent log
  appendLog({
    hypothesisId: "E",
    location: "scripts/debug-ndk.js:partial",
    message: "Partial or missing source.properties",
    data: {
      sourcePropsExists,
      ndkDirExists,
      inference: !sourcePropsExists && ndkDirExists ? "partial_or_corrupt_install" : sourcePropsExists ? "ok" : "ndk_dir_missing",
    },
  });
  // #endregion
}

main();
