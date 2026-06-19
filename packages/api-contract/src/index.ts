import type {
  ArticleMeta,
  ConceptNode,
  NavigationNode,
  RelationEdge,
  SearchIndexConfig,
  SearchResultItem,
  TopicCategory
} from "@knowledge/shared";

export interface ArticleMetaPayload extends ArticleMeta {}
export interface ConceptNodePayload extends ConceptNode {}
export interface TopicCategoryPayload extends TopicCategory {}
export interface RelationEdgePayload extends RelationEdge {}
export interface SearchIndexConfigPayload extends SearchIndexConfig {}
export interface NavigationNodePayload extends NavigationNode {}
export interface SearchResultPayload extends SearchResultItem {}

export interface ArticleQuery {
  tag?: string;
  concept?: string;
  category?: string;
}

