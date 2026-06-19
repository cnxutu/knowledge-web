export type ContentNodeType = "article" | "concept" | "topic";

export type RelationType =
  | "references"
  | "extends"
  | "prerequisite"
  | "solution"
  | "compare";

export interface ArticleMeta {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  concepts: string[];
  categoryPath: string[];
  relatedArticles: string[];
  updatedAt: string;
  source: string;
}

export interface ConceptNode {
  id: string;
  name: string;
  type: ContentNodeType;
  articleRefs: string[];
}

export interface TopicCategory {
  id: string;
  name: string;
  description: string;
  articleSlugs: string[];
}

export interface RelationEdge {
  source: string;
  target: string;
  relationType: RelationType;
  label: string;
  weight: number;
}

export interface SearchIndexConfig {
  provider: "mock" | "elasticsearch";
  enabledFields: Array<"title" | "summary" | "tags" | "concepts" | "body">;
  highlightTag: string;
}

export interface NavigationNode {
  id: string;
  title: string;
  type: "category" | "article";
  children?: NavigationNode[];
  articleSlug?: string;
}

export interface ReadingPanelState {
  panelId: string;
  articleSlug: string;
  collapsed: boolean;
  width: number;
  parentPanelId: string | null;
}

export interface SearchResultItem {
  id: string;
  title: string;
  snippet: string;
  type: ContentNodeType;
  score: number;
  targetSlug: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: ContentNodeType;
}

export interface ArticleGraph {
  nodes: GraphNode[];
  edges: RelationEdge[];
}

export interface KnowledgeArticle {
  meta: ArticleMeta;
  body: string;
  graph: ArticleGraph;
}

export interface ReadingWorkspaceState {
  openedPanels: ReadingPanelState[];
  focusedPanelId: string;
  readingHistory: string[];
}

