import Link from "next/link";
import { listArticles } from "@/lib/content";

export default async function HomePage() {
  const articles = await listArticles();

  return (
    <main style={{ padding: "48px min(6vw, 72px)" }}>
      <p style={{ margin: 0, color: "#8a7756", letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 12 }}>
        Knowledge Web
      </p>
      <h1 style={{ margin: "10px 0 16px", fontSize: "clamp(42px, 7vw, 84px)", color: "#211b15" }}>知识库前台骨架</h1>
      <p style={{ maxWidth: 760, lineHeight: 1.8, color: "#5c5449" }}>
        这是个人知识库的前台主入口：左侧导航树、中心主阅读栏、右侧多栏关联阅读、MDX 文章源和未来知识图谱的共用数据边界，都从这里开始稳定下来。
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 24, marginTop: 32 }}>
        <section style={{ padding: 24, borderRadius: 28, background: "#fff9ef", border: "1px solid #e1d4c0" }}>
          <h2 style={{ marginTop: 0 }}>起步入口</h2>
          <div style={{ display: "grid", gap: 12 }}>
            {articles.map((article) => (
              <Link
                key={article.meta.slug}
                href={`/articles/${article.meta.slug}`}
                style={{ padding: 16, borderRadius: 18, background: "#f0e4cf", color: "#31261a" }}
              >
                <strong>{article.meta.title}</strong>
                <p style={{ margin: "8px 0 0", color: "#60574d" }}>{article.meta.summary}</p>
              </Link>
            ))}
          </div>
        </section>

        <section style={{ padding: 24, borderRadius: 28, background: "#241d15", color: "#f7eedc" }}>
          <h2 style={{ marginTop: 0 }}>产品方向</h2>
          <ul style={{ lineHeight: 1.9, paddingLeft: 20 }}>
            <li>Repo 内 MDX 作为首期内容源</li>
            <li>右栏逐层打开关联文章，形成专注阅读路径</li>
            <li>后台只管元数据和关系，不先做重 CMS</li>
            <li>搜索 provider 与图谱 provider 先抽象，后续换 ES / React Flow</li>
          </ul>
          <Link href="/search" style={{ display: "inline-block", marginTop: 16, color: "#f4c873" }}>
            进入搜索体验
          </Link>
          <Link href="/workspace" style={{ display: "inline-block", marginTop: 16, marginLeft: 18, color: "#f4c873" }}>
            打开每日工作区
          </Link>
          <Link href="/workspace/articles/new" style={{ display: "inline-block", marginTop: 16, marginLeft: 18, color: "#f4c873" }}>
            录入知识文章
          </Link>
        </section>
      </div>
    </main>
  );
}
