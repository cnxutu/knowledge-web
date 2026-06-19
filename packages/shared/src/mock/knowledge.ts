import type {
  ConceptNode,
  KnowledgeArticle,
  SearchIndexConfig,
  TopicCategory
} from "../types/content";

export const mockArticles: KnowledgeArticle[] = [
  {
    meta: {
      slug: "security-login-overview",
      title: "登录场景总览",
      summary: "用一个完整登录链路把 Security、OAuth2、JWT、Session 和 Redis 串起来。",
      tags: ["login", "security", "auth"],
      concepts: ["security", "oauth2", "jwt", "session", "redis"],
      categoryPath: ["架构设计", "认证鉴权", "登录体系"],
      relatedArticles: ["jwt-token-flow", "redis-session-strategy"],
      updatedAt: "2026-06-19",
      source: "apps/web/content/articles/security-login-overview.mdx"
    },
    body: `
# 登录场景总览

个人知识库里的登录专题，需要把认证、会话、令牌和缓存放进同一个问题域里理解。

## 为什么放在一起

- Security 负责整体安全框架能力
- OAuth2 更偏授权协议
- JWT 偏无状态令牌
- Session / Redis 偏状态保持与会话共享
`,
    graph: {
      nodes: [
        { id: "security-login-overview", label: "登录总览", type: "article" },
        { id: "jwt-token-flow", label: "JWT 令牌链路", type: "article" },
        { id: "redis-session-strategy", label: "Redis 会话策略", type: "article" },
        { id: "security", label: "Spring Security", type: "concept" }
      ],
      edges: [
        {
          source: "security-login-overview",
          target: "jwt-token-flow",
          relationType: "extends",
          label: "延伸阅读",
          weight: 0.9
        },
        {
          source: "security-login-overview",
          target: "redis-session-strategy",
          relationType: "solution",
          label: "会话方案",
          weight: 0.8
        },
        {
          source: "security-login-overview",
          target: "security",
          relationType: "references",
          label: "核心框架",
          weight: 0.7
        }
      ]
    }
  },
  {
    meta: {
      slug: "jwt-token-flow",
      title: "JWT 令牌链路",
      summary: "梳理登录、签发、续签、鉴权和失效控制的关键节点。",
      tags: ["jwt", "token", "security"],
      concepts: ["jwt", "claims", "signature"],
      categoryPath: ["架构设计", "认证鉴权", "令牌策略"],
      relatedArticles: ["security-login-overview", "redis-session-strategy"],
      updatedAt: "2026-06-19",
      source: "apps/web/content/articles/jwt-token-flow.mdx"
    },
    body: `
# JWT 令牌链路

JWT 适合承载跨服务认证，但需要和刷新策略、黑名单、权限缓存一起看。
`,
    graph: {
      nodes: [
        { id: "jwt-token-flow", label: "JWT 令牌链路", type: "article" },
        { id: "security-login-overview", label: "登录总览", type: "article" },
        { id: "claims", label: "Claims", type: "concept" }
      ],
      edges: [
        {
          source: "jwt-token-flow",
          target: "security-login-overview",
          relationType: "prerequisite",
          label: "场景入口",
          weight: 0.6
        },
        {
          source: "jwt-token-flow",
          target: "claims",
          relationType: "references",
          label: "结构组成",
          weight: 0.5
        }
      ]
    }
  },
  {
    meta: {
      slug: "redis-session-strategy",
      title: "Redis 会话策略",
      summary: "在需要可控失效、踢人和会话共享时，Redis Session 是怎样接入的。",
      tags: ["redis", "session", "cluster"],
      concepts: ["redis", "session", "cookie"],
      categoryPath: ["架构设计", "认证鉴权", "会话方案"],
      relatedArticles: ["security-login-overview"],
      updatedAt: "2026-06-19",
      source: "apps/web/content/articles/redis-session-strategy.mdx"
    },
    body: `
# Redis 会话策略

当业务需要集中会话控制时，Redis Session 往往比纯 JWT 更容易落地管理策略。
`,
    graph: {
      nodes: [
        { id: "redis-session-strategy", label: "Redis 会话策略", type: "article" },
        { id: "security-login-overview", label: "登录总览", type: "article" },
        { id: "redis", label: "Redis", type: "concept" }
      ],
      edges: [
        {
          source: "redis-session-strategy",
          target: "security-login-overview",
          relationType: "prerequisite",
          label: "所属场景",
          weight: 0.7
        },
        {
          source: "redis-session-strategy",
          target: "redis",
          relationType: "references",
          label: "依赖中间件",
          weight: 0.5
        }
      ]
    }
  }
];

export const mockConcepts: ConceptNode[] = [
  { id: "security", name: "Spring Security", type: "concept", articleRefs: ["security-login-overview"] },
  { id: "jwt", name: "JWT", type: "concept", articleRefs: ["security-login-overview", "jwt-token-flow"] },
  { id: "redis", name: "Redis", type: "concept", articleRefs: ["security-login-overview", "redis-session-strategy"] }
];

export const mockTopics: TopicCategory[] = [
  {
    id: "auth-architecture",
    name: "认证鉴权",
    description: "围绕登录、权限、会话和令牌策略的知识集合。",
    articleSlugs: mockArticles.map((article) => article.meta.slug)
  }
];

export const defaultSearchConfig: SearchIndexConfig = {
  provider: "mock",
  enabledFields: ["title", "summary", "tags", "concepts", "body"],
  highlightTag: "mark"
};

