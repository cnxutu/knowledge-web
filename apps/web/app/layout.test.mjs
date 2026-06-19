import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("RootLayout", () => {
  it("suppresses hydration warnings on the html tag for extension-injected attributes", async () => {
    const filePath = path.resolve(
      import.meta.dirname,
      "layout.tsx"
    );
    const source = await readFile(filePath, "utf8");

    expect(source).toContain("<html lang=\"zh-CN\" suppressHydrationWarning>");
  });
});
