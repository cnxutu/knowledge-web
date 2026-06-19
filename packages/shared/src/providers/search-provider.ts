import { defaultSearchConfig, mockArticles } from "../mock/knowledge";
import type { KnowledgeArticle, SearchIndexConfig, SearchResultItem } from "../types/content";

export interface SearchProvider {
  search(query: string): Promise<SearchResultItem[]>;
  getConfig(): Promise<SearchIndexConfig>;
}

function scoreArticle(article: KnowledgeArticle, normalizedQuery: string) {
  const corpus = [
    article.meta.title,
    article.meta.summary,
    article.meta.tags.join(" "),
    article.meta.concepts.join(" "),
    article.body
  ].join(" ").toLowerCase();

  const hitCount = corpus.split(normalizedQuery).length - 1;
  return hitCount <= 0 ? 0 : Number((hitCount + article.meta.tags.length * 0.1).toFixed(2));
}

export function createMockSearchProvider(seedArticles = mockArticles): SearchProvider {
  return {
    async search(query: string) {
      const normalized = query.trim().toLowerCase();
      if (!normalized) {
        return [];
      }

      return seedArticles
        .map<SearchResultItem | null>((article) => {
          const score = scoreArticle(article, normalized);
          if (score <= 0) {
            return null;
          }

          return {
            id: article.meta.slug,
            title: article.meta.title,
            snippet: article.meta.summary,
            type: "article",
            score,
            targetSlug: article.meta.slug
          };
        })
        .filter((item): item is SearchResultItem => item !== null)
        .sort((left, right) => right.score - left.score);
    },
    async getConfig() {
      return defaultSearchConfig;
    }
  };
}

