import { describe, expect, it } from "vitest";
import {
  createConceptDraft,
  createNavigationDraft,
  createRelationDraft,
  createTopicDraft,
  loadAdminMetadataDrafts,
  loadDefaultAdminMetadataDrafts,
  materializeConceptDraft,
  materializeNavigationDraft,
  materializeRelationDraft,
  materializeTopicDraft,
  upsertConceptItem,
  upsertNavigationItem,
  upsertRelationItem,
  upsertTopicItem
} from "../modules/metadata-workspace";

describe("metadata workspace helpers", () => {
  it("normalizes navigation drafts into stable admin items", () => {
    const draft = createNavigationDraft();
    draft.slug = " jwt-token-flow ";
    draft.title = " JWT 令牌链路 ";
    draft.categoryPath = "架构设计 / 认证鉴权 / 令牌策略";
    draft.tags = "jwt, token, security";
    draft.conceptCount = 2.4;
    draft.relatedCount = -1;
    draft.updatedAt = "2026-06-20";

    expect(materializeNavigationDraft(draft)).toEqual({
      slug: "jwt-token-flow",
      title: "JWT 令牌链路",
      categoryPath: "架构设计 / 认证鉴权 / 令牌策略",
      tags: ["jwt", "token", "security"],
      status: "draft",
      publishedAt: null,
      publishedSnapshot: null,
      conceptCount: 2,
      relatedCount: 0,
      updatedAt: "2026-06-20"
    });
  });

  it("upserts relation items by id and keeps new ones at the top", () => {
    const first = materializeRelationDraft({
      ...createRelationDraft(),
      id: "security-jwt",
      sourceSlug: "security-login-overview",
      sourceTitle: "登录场景总览",
      target: "jwt-token-flow",
      targetLabel: "JWT 令牌链路",
      relationType: "extends",
      label: "延伸阅读",
      weight: 0.9
    });
    const second = materializeRelationDraft({
      ...createRelationDraft(),
      id: "jwt-claims",
      sourceSlug: "jwt-token-flow",
      sourceTitle: "JWT 令牌链路",
      target: "claims",
      targetLabel: "Claims",
      relationType: "references",
      label: "结构组成",
      weight: 2
    });

    const inserted = upsertRelationItem([first], second);
    const updated = upsertRelationItem(inserted, { ...second, label: "核心结构" });

    expect(inserted[0]?.id).toBe("jwt-claims");
    expect(updated).toHaveLength(2);
    expect(updated[0]?.weight).toBe(1);
    expect(updated[0]?.label).toBe("核心结构");
  });

  it("upserts navigation items by slug", () => {
    const base = materializeNavigationDraft({
      ...createNavigationDraft(),
      slug: "redis-session-strategy",
      title: "Redis 会话策略",
      categoryPath: "架构设计 / 认证鉴权 / 会话方案",
      tags: "redis, session",
      conceptCount: 2,
      relatedCount: 1,
      updatedAt: "2026-06-20"
    });
    const updated = { ...base, title: "Redis 会话策略（修订）" };

    const result = upsertNavigationItem([base], updated);

    expect(result).toHaveLength(1);
    expect(result[0]?.title).toBe("Redis 会话策略（修订）");
  });

  it("normalizes topic and concept drafts into count-aware admin items", () => {
    const topic = materializeTopicDraft({
      ...createTopicDraft(),
      id: "frontend-patterns",
      name: "前端模式",
      description: "聚合阅读体验、状态管理和工程化内容。",
      articleTitles: "多栏阅读, 状态管理, Monorepo"
    });
    const concept = materializeConceptDraft({
      ...createConceptDraft(),
      id: "zustand",
      name: "Zustand",
      type: "concept",
      articleRefs: "state-overview, panel-layout"
    });

    expect(topic.articleCount).toBe(3);
    expect(topic.status).toBe("draft");
    expect(topic.publishedSnapshot).toBeNull();
    expect(topic.articleTitles[1]).toBe("状态管理");
    expect(concept.articleCount).toBe(2);
    expect(concept.status).toBe("draft");
    expect(concept.publishedSnapshot).toBeNull();
    expect(concept.articleRefs[0]).toBe("state-overview");
  });

  it("supports publication lifecycle fields on local metadata items", () => {
    const navigation = materializeNavigationDraft({
      ...createNavigationDraft(),
      slug: "panel-layout",
      title: "多栏布局",
      categoryPath: "前端 / 体验设计",
      tags: "layout, panel",
      conceptCount: 2,
      relatedCount: 1,
      updatedAt: "2026-06-20",
      status: "published",
      publishedAt: "2026-06-20"
    });
    const topic = materializeTopicDraft({
      ...createTopicDraft(),
      id: "frontend-patterns",
      name: "前端模式",
      description: "布局与状态管理",
      articleTitles: "多栏阅读, 状态管理",
      status: "published",
      publishedAt: "2026-06-20"
    });

    expect(navigation.status).toBe("published");
    expect(navigation.publishedAt).toBe("2026-06-20");
    expect(navigation.publishedSnapshot?.title).toBe("多栏布局");
    expect(topic.status).toBe("published");
    expect(topic.publishedAt).toBe("2026-06-20");
    expect(topic.publishedSnapshot?.name).toBe("前端模式");
  });

  it("preserves published snapshots while draft content keeps changing", () => {
    const base = materializeNavigationDraft({
      ...createNavigationDraft(),
      slug: "panel-layout",
      title: "多栏布局",
      categoryPath: "前端 / 体验设计",
      tags: "layout, panel",
      status: "published",
      publishedAt: "2026-06-20",
      updatedAt: "2026-06-20"
    });
    const edited = materializeNavigationDraft({
      ...createNavigationDraft(base),
      title: "多栏布局（草稿修订）",
      status: "published",
      publishedAt: "2026-06-20",
      updatedAt: "2026-06-21"
    });

    expect(base.publishedSnapshot?.title).toBe("多栏布局");
    expect(edited.title).toBe("多栏布局（草稿修订）");
    expect(edited.publishedSnapshot?.title).toBe("多栏布局");
  });

  it("upserts topics and concepts by id", () => {
    const topic = materializeTopicDraft({
      ...createTopicDraft(),
      id: "auth-architecture",
      name: "认证鉴权",
      description: "登录与权限链路",
      articleTitles: "登录场景总览"
    });
    const updatedTopic = { ...topic, description: "登录、权限与会话链路" };
    const concept = materializeConceptDraft({
      ...createConceptDraft(),
      id: "redis",
      name: "Redis",
      type: "concept",
      articleRefs: "security-login-overview"
    });
    const updatedConcept = { ...concept, articleRefs: ["security-login-overview", "redis-session-strategy"], articleCount: 2 };

    expect(upsertTopicItem([topic], updatedTopic)[0]?.description).toBe("登录、权限与会话链路");
    expect(upsertConceptItem([concept], updatedConcept)[0]?.articleCount).toBe(2);
  });

  it("loads full draft snapshots with all metadata slices", async () => {
    const drafts = await loadAdminMetadataDrafts();

    expect(Array.isArray(drafts.navigationItems)).toBe(true);
    expect(Array.isArray(drafts.relationItems)).toBe(true);
    expect(Array.isArray(drafts.topicItems)).toBe(true);
    expect(Array.isArray(drafts.conceptItems)).toBe(true);
  });

  it("loads default draft snapshots for reset semantics", async () => {
    const drafts = await loadDefaultAdminMetadataDrafts();

    expect(drafts.navigationItems.length).toBeGreaterThan(0);
    expect(drafts.relationItems.length).toBeGreaterThan(0);
    expect(drafts.topicItems.length).toBeGreaterThan(0);
    expect(drafts.conceptItems.length).toBeGreaterThan(0);
  });
});
