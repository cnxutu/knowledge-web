import { mockArticles } from "../mock/knowledge";
import type { ArticleGraph } from "../types/content";

export interface GraphProvider {
  getGraphBySlug(slug: string): Promise<ArticleGraph | undefined>;
}

export function createMockGraphProvider(): GraphProvider {
  return {
    async getGraphBySlug(slug: string) {
      return mockArticles.find((article) => article.meta.slug === slug)?.graph;
    }
  };
}

