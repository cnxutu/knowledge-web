import type { ArticleMeta, NavigationNode } from "../types/content";

function normalizeId(parts: string[]) {
  return parts.join("/").toLowerCase();
}

export function buildNavigationTree(articles: ArticleMeta[]): NavigationNode[] {
  const root: NavigationNode[] = [];

  for (const article of articles) {
    let currentLevel = root;
    const pathSegments = article.categoryPath;

    pathSegments.forEach((segment, index) => {
      const path = pathSegments.slice(0, index + 1);
      let node = currentLevel.find((item) => item.id === normalizeId(path));

      if (!node) {
        node = {
          id: normalizeId(path),
          title: segment,
          type: "category",
          children: []
        };
        currentLevel.push(node);
      }

      currentLevel = node.children ?? [];
    });

    currentLevel.push({
      id: article.slug,
      title: article.title,
      type: "article",
      articleSlug: article.slug
    });
  }

  return root;
}

