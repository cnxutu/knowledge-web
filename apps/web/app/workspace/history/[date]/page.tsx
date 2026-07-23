"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { getMarkdown } from "@/lib/workspace-api";

export default function WorkspaceDocumentPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = use(params);
  const [markdown, setMarkdown] = useState("");
  const [error, setError] = useState("");
  useEffect(() => { getMarkdown(date).then(setMarkdown).catch((e) => setError(e instanceof Error ? e.message : "加载失败")); }, [date]);
  return <main className="workspace-page document-page"><header className="workspace-header"><div><Link href="/workspace/history" className="eyebrow">← 历史记录</Link><h1>{date} 工作记录</h1></div><Link href={`/workspace?date=${date}`} className="primary-button">继续编辑</Link></header>{error ? <p className="error-message">{error}</p> : <article className="markdown-document">{markdown ? <ReactMarkdown>{markdown}</ReactMarkdown> : <div className="empty-preview">文档不存在。</div>}</article>}</main>;
}
