import { describe, expect, it } from "vitest";
import type {
  AdminConceptItem,
  AdminNavigationItem,
  AdminRelationItem,
  AdminTopicItem
} from "@knowledge/shared";
import { createAdminMetadataService } from "../modules/admin-metadata-service";
import { createDraftsSnapshot, type AdminMetadataDrafts } from "../modules/metadata-workspace";

function createSeedDrafts(): AdminMetadataDrafts {
  return createDraftsSnapshot({
    navigationItems: [],
    relationItems: [],
    topicItems: [],
    conceptItems: []
  });
}

describe("admin metadata service", () => {
  it("saves navigation items through a single service boundary", async () => {
    let state = createSeedDrafts();
    const service = createAdminMetadataService({
      loadDrafts: async () => state,
      persistDrafts: (drafts) => {
        state = drafts;
      }
    });

    const item: AdminNavigationItem = {
      slug: "intro-to-search",
      title: "搜索入门",
      categoryPath: "搜索 / 入门",
      updatedAt: "2026-06-20",
      tags: ["search"],
      status: "draft",
      publishedAt: null,
      publishedSnapshot: null,
      conceptCount: 1,
      relatedCount: 0
    };

    const result = await service.saveNavigationItem(item);

    expect(result.navigationItems[0]?.slug).toBe("intro-to-search");
    expect(state.navigationItems).toHaveLength(1);
  });

  it("saves relation, topic and concept items without touching other slices", async () => {
    let state = createDraftsSnapshot({
      navigationItems: [
        {
          slug: "security-login-overview",
          title: "登录场景总览",
          categoryPath: "架构设计 / 认证鉴权 / 登录体系",
          updatedAt: "2026-06-20",
          tags: ["login"],
          status: "draft",
          publishedAt: null,
          publishedSnapshot: null,
          conceptCount: 1,
          relatedCount: 1
        }
      ],
      relationItems: [],
      topicItems: [],
      conceptItems: []
    });
    const service = createAdminMetadataService({
      loadDrafts: async () => state,
      persistDrafts: (drafts) => {
        state = drafts;
      }
    });

    const relation: AdminRelationItem = {
      id: "security-jwt",
      source: "security-login-overview",
      sourceSlug: "security-login-overview",
      sourceTitle: "登录场景总览",
      target: "jwt-token-flow",
      targetLabel: "JWT 令牌链路",
      relationType: "extends",
      label: "延伸阅读",
      weight: 0.9
    };
    const topic: AdminTopicItem = {
      id: "auth-architecture",
      name: "认证鉴权",
      description: "登录、权限与会话链路",
      articleCount: 1,
      articleTitles: ["登录场景总览"],
      status: "draft",
      publishedAt: null,
      publishedSnapshot: null
    };
    const concept: AdminConceptItem = {
      id: "jwt",
      name: "JWT",
      type: "concept",
      articleCount: 1,
      articleRefs: ["jwt-token-flow"],
      status: "draft",
      publishedAt: null,
      publishedSnapshot: null
    };

    await service.saveRelationItem(relation);
    await service.saveTopicItem(topic);
    const result = await service.saveConceptItem(concept);

    expect(result.navigationItems).toHaveLength(1);
    expect(result.relationItems[0]?.id).toBe("security-jwt");
    expect(result.topicItems[0]?.id).toBe("auth-architecture");
    expect(result.conceptItems[0]?.id).toBe("jwt");
  });

  it("deletes items and reports the latest updated marker", async () => {
    let state = createDraftsSnapshot({
      navigationItems: [
        {
          slug: "security-login-overview",
          title: "登录场景总览",
          categoryPath: "架构设计 / 认证鉴权 / 登录体系",
          updatedAt: "2026-06-20",
          tags: ["login"],
          status: "published",
          publishedAt: "2026-06-20",
          publishedSnapshot: {
            title: "登录场景总览",
            categoryPath: "架构设计 / 认证鉴权 / 登录体系",
            tags: ["login"],
            conceptCount: 1,
            relatedCount: 1,
            publishedAt: "2026-06-20"
          },
          conceptCount: 1,
          relatedCount: 1
        }
      ],
      relationItems: [
        {
          id: "security-jwt",
          source: "security-login-overview",
          sourceSlug: "security-login-overview",
          sourceTitle: "登录场景总览",
          target: "jwt-token-flow",
          targetLabel: "JWT 令牌链路",
          relationType: "extends",
          label: "延伸阅读",
          weight: 0.9
        }
      ],
      topicItems: [
        {
          id: "auth-architecture",
          name: "认证鉴权",
          description: "登录、权限与会话链路",
          articleCount: 1,
          articleTitles: ["登录场景总览"],
          status: "published",
          publishedAt: "2026-06-20",
          publishedSnapshot: {
            name: "认证鉴权",
            description: "登录、权限与会话链路",
            articleTitles: ["登录场景总览"],
            articleCount: 1,
            publishedAt: "2026-06-20"
          }
        }
      ],
      conceptItems: [
        {
          id: "jwt",
          name: "JWT",
          type: "concept",
          articleCount: 1,
          articleRefs: ["jwt-token-flow"],
          status: "published",
          publishedAt: "2026-06-20",
          publishedSnapshot: {
            name: "JWT",
            type: "concept",
            articleRefs: ["jwt-token-flow"],
            articleCount: 1,
            publishedAt: "2026-06-20"
          }
        }
      ]
    });
    const service = createAdminMetadataService({
      loadDrafts: async () => state,
      persistDrafts: (drafts) => {
        state = drafts;
      }
    });

    await service.deleteNavigationItem("security-login-overview");
    await service.deleteRelationItem("security-jwt");
    await service.deleteTopicItem("auth-architecture");
    const result = await service.deleteConceptItem("jwt");

    expect(result.navigationItems).toHaveLength(0);
    expect(result.relationItems).toHaveLength(0);
    expect(result.topicItems).toHaveLength(0);
    expect(result.conceptItems).toHaveLength(0);
    expect(await service.getLastUpdated()).toBe(state.updatedAt);
  });

  it("can toggle publish state for navigation, topic and concept items", async () => {
    let state = createDraftsSnapshot({
      navigationItems: [
        {
          slug: "security-login-overview",
          title: "登录场景总览",
          categoryPath: "架构设计 / 认证鉴权 / 登录体系",
          updatedAt: "2026-06-20",
          tags: ["login"],
          status: "draft",
          publishedAt: null,
          publishedSnapshot: null,
          conceptCount: 1,
          relatedCount: 1
        }
      ],
      relationItems: [],
      topicItems: [
        {
          id: "auth-architecture",
          name: "认证鉴权",
          description: "登录、权限与会话链路",
          articleCount: 1,
          articleTitles: ["登录场景总览"],
          status: "draft",
          publishedAt: null,
          publishedSnapshot: null
        }
      ],
      conceptItems: [
        {
          id: "jwt",
          name: "JWT",
          type: "concept",
          articleCount: 1,
          articleRefs: ["jwt-token-flow"],
          status: "draft",
          publishedAt: null,
          publishedSnapshot: null
        }
      ]
    });
    const service = createAdminMetadataService({
      loadDrafts: async () => state,
      persistDrafts: (drafts) => {
        state = drafts;
      }
    });

    await service.publishNavigationItem("security-login-overview");
    await service.publishTopicItem("auth-architecture");
    const conceptDrafts = await service.publishConceptItem("jwt");

    expect(conceptDrafts.navigationItems[0]?.status).toBe("published");
    expect(conceptDrafts.navigationItems[0]?.publishedSnapshot?.title).toBe("登录场景总览");
    expect(conceptDrafts.topicItems[0]?.status).toBe("published");
    expect(conceptDrafts.topicItems[0]?.publishedSnapshot?.name).toBe("认证鉴权");
    expect(conceptDrafts.conceptItems[0]?.status).toBe("published");
    expect(conceptDrafts.conceptItems[0]?.publishedAt).toBeTruthy();
    expect(conceptDrafts.conceptItems[0]?.publishedSnapshot?.name).toBe("JWT");
  });
});
