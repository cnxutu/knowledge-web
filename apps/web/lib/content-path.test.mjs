import path from "node:path";
import { describe, expect, it } from "vitest";
import { resolveArticlesDir } from "./content";

const repoRoot = "D:/workspace/github/knowledge-web";

describe("resolveArticlesDir", () => {
  it("finds the articles directory when web is started from the repo root", () => {
    expect(resolveArticlesDir(repoRoot)).toBe(
      path.join(repoRoot, "apps", "web", "content", "articles")
    );
  });

  it("finds the articles directory when web is started inside apps/web", () => {
    expect(resolveArticlesDir(path.join(repoRoot, "apps", "web"))).toBe(
      path.join(repoRoot, "apps", "web", "content", "articles")
    );
  });
});
