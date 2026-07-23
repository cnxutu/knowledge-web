"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getArticleHistory, type ArticleHistoryItem } from "@/lib/workspace-api";

export default function ArticleHistoryPage() {
  const [items, setItems] = useState<ArticleHistoryItem[]>([]);
  const [error, setError] = useState("");
  useEffect(() => { getArticleHistory().then(setItems).catch((e) => setError(e instanceof Error ? e.message : "加载失败")); }, []);
  return <main className="workspace-page history-page"><header className="workspace-header"><div><Link href="/workspace" className="eyebrow">← 返回工作区</Link><h1>知识文章</h1><p>知识沉淀文章的结构化目录与发布记录。</p></div><Link href="/workspace/articles/new" className="primary-button">+ 新建文章</Link></header>{error && <p className="error-message">{error}</p>}<section className="history-list">{items.length === 0 ? <div className="empty-preview">暂无文章，先创建一篇知识沉淀。</div> : items.map((item) => <Link className="history-card" key={item.documentId} href={`/workspace/articles/${item.slug}`}><div><span className="eyebrow">{item.slug}</span><h2>{item.title}</h2><p>{item.summary}</p></div><span>{item.status} · {item.markdownPath}</span></Link>)}</section></main>;
}
