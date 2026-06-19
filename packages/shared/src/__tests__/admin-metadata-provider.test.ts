import { describe, expect, it } from "vitest";
import { createMockAdminMetadataProvider } from "../providers/admin-metadata-provider";

describe("admin metadata provider", () => {
  it("builds dashboard snapshot and navigation rows for admin pages", async () => {
    const provider = createMockAdminMetadataProvider();

    const snapshot = await provider.getSnapshot();
    const navigationItems = await provider.listNavigationItems();

    expect(snapshot.articleCount).toBe(3);
    expect(snapshot.navigationCount).toBe(1);
    expect(snapshot.topicCount).toBe(1);
    expect(snapshot.conceptCount).toBe(3);
    expect(snapshot.relationCount).toBe(7);
    expect(navigationItems[0]).toMatchObject({
      slug: "security-login-overview",
      title: "登录场景总览",
      status: "published",
      publishedSnapshot: {
        title: "登录场景总览"
      },
      conceptCount: 5,
      relatedCount: 2
    });
  });

  it("exposes relation, topic, concept and search config models for management pages", async () => {
    const provider = createMockAdminMetadataProvider();

    const relationItems = await provider.listRelationItems();
    const topicItems = await provider.listTopicItems();
    const conceptItems = await provider.listConceptItems();
    const searchConfig = await provider.getSearchConfig();

    expect(relationItems).toHaveLength(7);
    expect(relationItems[0]).toMatchObject({
      sourceSlug: "security-login-overview",
      relationType: "extends",
      targetLabel: "JWT 令牌链路"
    });
    expect(topicItems[0]).toMatchObject({
      id: "auth-architecture",
      articleCount: 3,
      status: "published",
      publishedSnapshot: {
        name: "认证鉴权"
      }
    });
    expect(conceptItems.find((item) => item.id === "jwt")).toMatchObject({
      id: "jwt",
      status: "published",
      publishedSnapshot: {
        name: "JWT"
      },
      articleCount: 2
    });
    expect(searchConfig).toMatchObject({
      provider: "mock",
      highlightTag: "mark"
    });
  });
});
