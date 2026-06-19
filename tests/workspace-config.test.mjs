import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const rootDir = path.resolve(import.meta.dirname, "..");

async function readJson(filePath) {
  const content = await readFile(filePath, "utf8");
  return JSON.parse(content);
}

describe("workspace pnpm config", () => {
  it("keeps pnpm build approval settings in .npmrc instead of package.json", async () => {
    const packageJson = await readJson(path.join(rootDir, "package.json"));
    const npmrc = await readFile(path.join(rootDir, ".npmrc"), "utf8");

    expect(packageJson.pnpm).toBeUndefined();
    expect(npmrc).toContain("onlyBuiltDependencies[]=esbuild");
    expect(npmrc).toContain("onlyBuiltDependencies[]=sharp");
  });
});
