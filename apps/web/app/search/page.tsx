import { SearchResultList } from "@knowledge/ui-react";
import Link from "next/link";
import { searchArticles } from "@/lib/content";

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = q ? await searchArticles(q) : [];

  return (
    <main style={{ padding: "42px min(6vw, 72px)", display: "grid", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ margin: 0, color: "#8a7756", letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 12 }}>
            Search Provider
          </p>
          <h1 style={{ margin: "10px 0 0", fontSize: 42 }}>知识搜索</h1>
        </div>
        <Link href="/" style={{ color: "#7a5d2b" }}>返回首页</Link>
      </div>

      <form style={{ display: "flex", gap: 12 }}>
        <input
          defaultValue={q}
          name="q"
          placeholder="搜索 jwt / redis / security"
          style={{ flex: 1, padding: "14px 16px", borderRadius: 16, border: "1px solid #d3c5af", background: "#fffef9" }}
        />
        <button type="submit" style={{ padding: "0 20px", borderRadius: 16, border: "none", background: "#2c2419", color: "#fff3de" }}>
          搜索
        </button>
      </form>

      {q ? <SearchResultList results={results} /> : <p style={{ color: "#5f5549" }}>输入关键词后将走 mock search provider，后续可无缝替换为 ES。</p>}
    </main>
  );
}

