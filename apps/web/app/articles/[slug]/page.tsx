import { notFound } from "next/navigation";
import { KnowledgeWorkspace } from "@/app/KnowledgeWorkspace";
import { getArticleBySlug, getNavigation, listArticles } from "@/lib/content";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const [navigation, allArticles] = await Promise.all([getNavigation(), listArticles()]);
  const relatedArticles = allArticles.filter((candidate) => article.meta.relatedArticles.includes(candidate.meta.slug));

  return (
    <KnowledgeWorkspace
      initialArticle={article}
      relatedArticles={relatedArticles}
      navigation={navigation}
      allArticles={allArticles}
    />
  );
}

