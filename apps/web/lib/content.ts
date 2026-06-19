import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { mockArticles } from "@knowledge/shared";
import { buildNavigationTree, createMockSearchProvider, type ArticleMeta, type KnowledgeArticle } from "@knowledge/shared";

export function resolveArticlesDir(cwd = process.cwd()) {
  const appLocalDir = path.join(cwd, "content", "articles");
  if (cwd.endsWith(path.join("apps", "web"))) {
    return appLocalDir;
  }
  return path.join(cwd, "apps", "web", "content", "articles");
}

const articlesDir = resolveArticlesDir();

export async function getArticleSlugs() {
  const entries = await fs.readdir(articlesDir);
  return entries.filter((entry) => entry.endsWith(".mdx")).map((entry) => entry.replace(/\.mdx$/, ""));
}

export async function getArticleBySlug(slug: string): Promise<KnowledgeArticle | undefined> {
  try {
    const fullPath = path.join(articlesDir, `${slug}.mdx`);
    const source = await fs.readFile(fullPath, "utf8");
    const parsed = matter(source);
    const graph = mockArticles.find((article) => article.meta.slug === slug)?.graph ?? { nodes: [], edges: [] };

    const meta: ArticleMeta = {
      slug,
      title: parsed.data.title,
      summary: parsed.data.summary,
      tags: parsed.data.tags ?? [],
      concepts: parsed.data.concepts ?? [],
      categoryPath: parsed.data.categoryPath ?? [],
      relatedArticles: parsed.data.relatedArticles ?? [],
      updatedAt: parsed.data.updatedAt,
      source: fullPath
    };

    return {
      meta,
      body: parsed.content.trim(),
      graph
    };
  } catch {
    return undefined;
  }
}

export async function listArticles() {
  const slugs = await getArticleSlugs();
  const articles = await Promise.all(slugs.map((slug) => getArticleBySlug(slug)));
  return articles.filter((article): article is KnowledgeArticle => Boolean(article));
}

export async function getNavigation() {
  const articles = await listArticles();
  return buildNavigationTree(articles.map((article) => article.meta));
}

export async function getCategoryArticles(categoryLabel: string) {
  const articles = await listArticles();
  return articles.filter((article) => article.meta.categoryPath.includes(categoryLabel));
}

export async function searchArticles(query: string) {
  const articles = await listArticles();
  return createMockSearchProvider(articles).search(query);
}
