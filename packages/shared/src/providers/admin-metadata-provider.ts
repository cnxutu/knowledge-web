import { defaultSearchConfig, mockArticles, mockConcepts, mockTopics } from "../mock/knowledge";
import { createMockContentProvider } from "./content-provider";
import type { RelationEdge, SearchIndexConfig } from "../types/content";

export interface AdminMetadataSnapshot {
  articleCount: number;
  navigationCount: number;
  topicCount: number;
  conceptCount: number;
  relationCount: number;
  searchProvider: string;
}

export interface AdminNavigationItem {
  slug: string;
  title: string;
  categoryPath: string;
  updatedAt: string;
  tags: string[];
  status: "draft" | "published";
  publishedAt: string | null;
  publishedSnapshot: AdminNavigationSnapshot | null;
  conceptCount: number;
  relatedCount: number;
}

export interface AdminRelationItem extends RelationEdge {
  id: string;
  sourceSlug: string;
  sourceTitle: string;
  targetLabel: string;
}

export interface AdminTopicItem {
  id: string;
  name: string;
  description: string;
  articleCount: number;
  articleTitles: string[];
  status: "draft" | "published";
  publishedAt: string | null;
  publishedSnapshot: AdminTopicSnapshot | null;
}

export interface AdminConceptItem {
  id: string;
  name: string;
  type: string;
  articleCount: number;
  articleRefs: string[];
  status: "draft" | "published";
  publishedAt: string | null;
  publishedSnapshot: AdminConceptSnapshot | null;
}

export interface AdminNavigationSnapshot {
  title: string;
  categoryPath: string;
  tags: string[];
  conceptCount: number;
  relatedCount: number;
  publishedAt: string | null;
}

export interface AdminTopicSnapshot {
  name: string;
  description: string;
  articleTitles: string[];
  articleCount: number;
  publishedAt: string | null;
}

export interface AdminConceptSnapshot {
  name: string;
  type: string;
  articleRefs: string[];
  articleCount: number;
  publishedAt: string | null;
}

export interface AdminMetadataProvider {
  getSnapshot(): Promise<AdminMetadataSnapshot>;
  listNavigationItems(): Promise<AdminNavigationItem[]>;
  listRelationItems(): Promise<AdminRelationItem[]>;
  listTopicItems(): Promise<AdminTopicItem[]>;
  listConceptItems(): Promise<AdminConceptItem[]>;
  getSearchConfig(): Promise<SearchIndexConfig>;
}

export function createMockAdminMetadataProvider(): AdminMetadataProvider {
  const contentProvider = createMockContentProvider();

  return {
    async getSnapshot() {
      const [navigation, relationItems] = await Promise.all([
        contentProvider.getNavigation(),
        this.listRelationItems()
      ]);
      const articles = await contentProvider.listArticles();
      return {
        articleCount: articles.length,
        navigationCount: navigation.length,
        topicCount: mockTopics.length,
        conceptCount: mockConcepts.length,
        relationCount: relationItems.length,
        searchProvider: defaultSearchConfig.provider
      };
    },
    async listNavigationItems() {
      const articles = await contentProvider.listArticles();
      return articles.map((article) => ({
        slug: article.meta.slug,
        title: article.meta.title,
        categoryPath: article.meta.categoryPath.join(" / "),
        updatedAt: article.meta.updatedAt,
        tags: article.meta.tags,
        status: "published",
        publishedAt: article.meta.updatedAt,
        publishedSnapshot: {
          title: article.meta.title,
          categoryPath: article.meta.categoryPath.join(" / "),
          tags: article.meta.tags,
          conceptCount: article.meta.concepts.length,
          relatedCount: article.meta.relatedArticles.length,
          publishedAt: article.meta.updatedAt
        },
        conceptCount: article.meta.concepts.length,
        relatedCount: article.meta.relatedArticles.length
      }));
    },
    async listRelationItems() {
      const articles = await contentProvider.listArticles();
      const nodeLabelMap = new Map<string, string>();

      for (const article of articles) {
        nodeLabelMap.set(article.meta.slug, article.meta.title);
        for (const node of article.graph.nodes) {
          nodeLabelMap.set(node.id, node.label);
        }
      }

      return articles.flatMap((article) =>
        article.graph.edges.map((edge, index) => ({
          ...edge,
          id: `${article.meta.slug}-${index}`,
          sourceSlug: article.meta.slug,
          sourceTitle: article.meta.title,
          targetLabel: nodeLabelMap.get(edge.target) ?? edge.target
        }))
      );
    },
    async listTopicItems() {
      const articles = await contentProvider.listArticles();
      const articleTitleMap = new Map(articles.map((article) => [article.meta.slug, article.meta.title]));

      return mockTopics.map((topic) => ({
        id: topic.id,
        name: topic.name,
        description: topic.description,
        articleCount: topic.articleSlugs.length,
        articleTitles: topic.articleSlugs.map((slug) => articleTitleMap.get(slug) ?? slug),
        status: "published",
        publishedAt: articles[0]?.meta.updatedAt ?? null,
        publishedSnapshot: {
          name: topic.name,
          description: topic.description,
          articleTitles: topic.articleSlugs.map((slug) => articleTitleMap.get(slug) ?? slug),
          articleCount: topic.articleSlugs.length,
          publishedAt: articles[0]?.meta.updatedAt ?? null
        }
      }));
    },
    async listConceptItems() {
      return mockConcepts.map((concept) => ({
        id: concept.id,
        name: concept.name,
        type: concept.type,
        articleCount: concept.articleRefs.length,
        articleRefs: concept.articleRefs,
        status: "published",
        publishedAt: mockArticles[0]?.meta.updatedAt ?? null,
        publishedSnapshot: {
          name: concept.name,
          type: concept.type,
          articleRefs: concept.articleRefs,
          articleCount: concept.articleRefs.length,
          publishedAt: mockArticles[0]?.meta.updatedAt ?? null
        }
      }));
    },
    async getSearchConfig() {
      return defaultSearchConfig;
    }
  };
}
