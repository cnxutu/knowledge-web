import { describe, expect, it } from "vitest";
import {
  buildNavigationTree,
  createMockContentProvider,
  mockArticles
} from "../index";

describe("content provider", () => {
  it("builds a category tree from article metadata", async () => {
    const provider = createMockContentProvider(mockArticles);
    const navigation = await provider.getNavigation();

    expect(navigation).toEqual(
      buildNavigationTree(mockArticles.map((article) => article.meta))
    );
    expect(
      navigation[0]?.children?.[0]?.children?.[0]?.children?.[0]?.articleSlug
    ).toBe("security-login-overview");
  });

  it("returns article detail with graph data for a given slug", async () => {
    const provider = createMockContentProvider(mockArticles);
    const article = await provider.getArticleBySlug("security-login-overview");

    expect(article?.meta.title).toBe("登录场景总览");
    expect(article?.graph.nodes.length).toBeGreaterThan(2);
    expect(article?.graph.edges.some((edge) => edge.target === "jwt-token-flow")).toBe(true);
  });
});
