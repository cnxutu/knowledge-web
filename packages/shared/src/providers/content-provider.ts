import { mockArticles, mockConcepts, mockTopics } from "../mock/knowledge";
import type {
  ArticleMeta,
  ConceptNode,
  KnowledgeArticle,
  NavigationNode,
  TopicCategory
} from "../types/content";
import { buildNavigationTree } from "../utils/navigation";

export interface ContentProvider {
  listArticles(): Promise<KnowledgeArticle[]>;
  getNavigation(): Promise<NavigationNode[]>;
  getArticleBySlug(slug: string): Promise<KnowledgeArticle | undefined>;
  getConcepts(): Promise<ConceptNode[]>;
  getTopics(): Promise<TopicCategory[]>;
}

export function createMockContentProvider(seedArticles = mockArticles): ContentProvider {
  return {
    async listArticles() {
      return seedArticles;
    },
    async getNavigation() {
      return buildNavigationTree(seedArticles.map((article) => article.meta));
    },
    async getArticleBySlug(slug: string) {
      return seedArticles.find((article) => article.meta.slug === slug);
    },
    async getConcepts() {
      return mockConcepts;
    },
    async getTopics() {
      return mockTopics;
    }
  };
}

export function listArticleMeta(articles: KnowledgeArticle[]): ArticleMeta[] {
  return articles.map((article) => article.meta);
}

