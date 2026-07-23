export type WorkItemStatus = "TODO" | "DOING" | "DONE" | "BLOCKED" | "CANCELLED";
export type DocumentStatus = "DRAFT" | "PUBLISHED";

export interface WorkItem { id: string; title: string; status: WorkItemStatus; summary: string; details: string; tags: string[]; }
export interface Category { id: string; name: string; items: WorkItem[]; }
export interface NextAction { id: string; title: string; done: boolean; }
export interface WorkspaceDocument {
  schemaVersion: number; documentId?: string; templateCode: string; title: string; date: string;
  status: DocumentStatus; categories: string[]; workItems: Category[]; nextActions: NextAction[];
  markdownPath?: string; createdAt?: string; updatedAt?: string;
}
export interface HistoryItem { documentId: string; date: string; title: string; status: DocumentStatus; jsonPath: string; markdownPath: string; updatedAt: string; }
export interface KnowledgeArticle { schemaVersion: number; documentId?: string; contentType: "knowledge-article"; slug: string; title: string; summary: string; body: string; tags: string[]; concepts: string[]; categoryPath: string[]; relatedArticles: string[]; status: "DRAFT" | "PUBLISHED"; markdownPath?: string; createdAt?: string; updatedAt?: string; }
export interface ArticleHistoryItem { documentId: string; slug: string; title: string; summary: string; status: "DRAFT" | "PUBLISHED"; jsonPath: string; markdownPath: string; updatedAt: string; }

const API = process.env.NEXT_PUBLIC_KNOWLEDGE_WORKSPACE_API_URL ?? "http://localhost:8091/api/workspace";

async function request<T>(path: string, init?: RequestInit, parseJson = true): Promise<T> {
  const response = await fetch(`${API}${path}`, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) } });
  if (!response.ok) throw new Error((await response.text()) || `请求失败 (${response.status})`);
  return (parseJson ? response.json() : response.text()) as Promise<T>;
}
export function getDocument(date: string) { return request<WorkspaceDocument | null>(`/documents/${date}`); }
export function getHistory() { return request<HistoryItem[]>("/documents"); }
export function getMarkdown(date: string) { return request<string>(`/documents/${date}/markdown`, undefined, false); }
export function previewDocument(document: WorkspaceDocument) { return request<{ templateCode: string; markdown: string }>("/preview", { method: "POST", body: JSON.stringify({ templateCode: document.templateCode, document }) }); }
export function publishDocument(document: WorkspaceDocument) { return request<{ document: WorkspaceDocument; jsonPath: string; markdownPath: string; markdown: string }>("/publish", { method: "POST", body: JSON.stringify(document) }); }
export function previewArticle(article: KnowledgeArticle) { return request<{ markdown: string }>("/articles/preview", { method: "POST", body: JSON.stringify({ article }) }); }
export function publishArticle(article: KnowledgeArticle) { return request<{ article: KnowledgeArticle; jsonPath: string; markdownPath: string; markdown: string }>("/articles/publish", { method: "POST", body: JSON.stringify(article) }); }
export function getArticleHistory() { return request<ArticleHistoryItem[]>("/articles"); }
export function getArticle(slug: string) { return request<KnowledgeArticle | null>(`/articles/${slug}`); }
