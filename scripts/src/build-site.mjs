import { copyFile, mkdir, readFile } from "node:fs/promises";

// Both Preview and publishing use the homepage tracked at GitHub's root.
const source = new URL("../../index.html", import.meta.url);
const output = new URL(
  "../../artifacts/simply-spacial/dist/public/",
  import.meta.url,
);
const html = await readFile(source, "utf8");
if (!/<!doctype html>/i.test(html) || !/<title>.+?<\/title>/i.test(html)) {
  throw new Error("The root homepage is missing valid HTML or a page title.");
}

await mkdir(output, { recursive: true });
await copyFile(source, new URL("index.html", output));
console.info("Prepared the current root homepage for publishing.");
