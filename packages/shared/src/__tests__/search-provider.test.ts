import { describe, expect, it } from "vitest";
import { createMockSearchProvider, mockArticles } from "../index";

describe("search provider", () => {
  it("finds related articles by title and concept keywords", async () => {
    const provider = createMockSearchProvider(mockArticles);
    const results = await provider.search("jwt");

    expect(results.map((item) => item.targetSlug)).toContain("jwt-token-flow");
    expect(results.every((item) => item.score > 0)).toBe(true);
  });

  it("returns empty result for blank queries", async () => {
    const provider = createMockSearchProvider(mockArticles);
    const results = await provider.search("   ");

    expect(results).toEqual([]);
  });
});
