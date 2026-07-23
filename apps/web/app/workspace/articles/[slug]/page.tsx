import ArticleEditor from "../ArticleEditor";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ArticleEditor slug={slug} />;
}
