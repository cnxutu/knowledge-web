import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const rootDir = path.resolve(import.meta.dirname, "..");

describe("root scripts", () => {
  it("uses direct local binaries for admin and web entry scripts", async () => {
    const packageJson = JSON.parse(
      await readFile(path.join(rootDir, "package.json"), "utf8")
    );

    expect(packageJson.scripts["dev:admin"]).toBe("cd ./apps/admin && node ./node_modules/vite/bin/vite.js --config ./vite.config.ts");
    expect(packageJson.scripts["dev:web"]).toBe("node ./node_modules/next/dist/bin/next dev ./apps/web");
    expect(packageJson.scripts["build:admin"]).toBe("cd ./apps/admin && node ./node_modules/vite/bin/vite.js build --config ./vite.config.ts");
    expect(packageJson.scripts["build:web"]).toBe("node ./node_modules/next/dist/bin/next build ./apps/web");
  });
});
