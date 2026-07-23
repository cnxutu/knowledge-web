"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getHistory, type HistoryItem } from "@/lib/workspace-api";

export default function WorkspaceHistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [error, setError] = useState("");
  useEffect(() => { getHistory().then(setItems).catch((e) => setError(e instanceof Error ? e.message : "加载失败")); }, []);
  return <main className="workspace-page history-page"><header className="workspace-header"><div><Link href="/workspace" className="eyebrow">← 返回编辑器</Link><h1>历史工作记录</h1><p>已发布到本地 Obsidian Vault 的结构化记录。</p></div><Link href="/" className="secondary-button">知识库首页</Link></header>{error && <p className="error-message">{error}</p>}<section className="history-list">{items.length === 0 ? <div className="empty-preview">暂无已发布记录。</div> : items.map((item) => <Link className="history-card" key={item.documentId} href={`/workspace/history/${item.date}`}><div><span className="eyebrow">{item.date}</span><h2>{item.title}</h2></div><span>{item.status} · {item.jsonPath}</span></Link>)}</section></main>;
}
