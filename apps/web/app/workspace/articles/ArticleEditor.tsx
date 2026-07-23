"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import MermaidDiagram from "../MermaidDiagram";
import { getArticle, previewArticle, publishArticle, type KnowledgeArticle } from "@/lib/workspace-api";

const id = () => Math.random().toString(36).slice(2, 10);
const initialArticle = (): KnowledgeArticle => ({ schemaVersion: 1, contentType: "knowledge-article", slug: "my-knowledge-note", title: "", summary: "", body: "", tags: [], concepts: [], categoryPath: ["知识沉淀"], relatedArticles: [], status: "DRAFT" });
const split = (value: string) => value.split(",").map((item) => item.trim()).filter(Boolean);

export default function ArticleEditor({ slug }: { slug?: string }) {
  const [article, setArticle] = useState<KnowledgeArticle>(() => initialArticle());
  const [markdown, setMarkdown] = useState("");
  const [message, setMessage] = useState("草稿尚未发布");
  const [loading, setLoading] = useState(Boolean(slug));
  const storageKey = `knowledge-workspace:article:${slug ?? "new"}`;

  useEffect(() => {
    let active = true;
    const draft = window.localStorage.getItem(storageKey);
    const load = slug ? getArticle(slug).then((saved) => saved ?? (draft ? JSON.parse(draft) : initialArticle())) : Promise.resolve(draft ? JSON.parse(draft) : initialArticle());
    load.then((value) => active && setArticle(value)).catch(() => active && draft && setArticle(JSON.parse(draft))).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [slug, storageKey]);
  useEffect(() => { if (!loading) window.localStorage.setItem(storageKey, JSON.stringify(article)); }, [article, loading, storageKey]);

  const wordCount = useMemo(() => article.body.trim() ? article.body.trim().length : 0, [article.body]);
  function update(patch: Partial<KnowledgeArticle>) { setArticle((current) => ({ ...current, ...patch })); }
  function clearDraft() { window.localStorage.removeItem(storageKey); setArticle(initialArticle()); setMarkdown(""); setMessage("已清除文章草稿"); }
  async function preview() { setMessage("正在生成预览…"); try { setMarkdown((await previewArticle(article)).markdown); setMessage("预览已更新"); } catch (error) { setMessage(error instanceof Error ? error.message : "预览失败"); } }
  async function publish() { setMessage("正在发布…"); try { const result = await publishArticle(article); setArticle(result.article); setMarkdown(result.markdown); window.localStorage.removeItem(storageKey); setMessage(`已发布：JSON ${result.jsonPath} · Markdown ${result.markdownPath}`); } catch (error) { setMessage(error instanceof Error ? error.message : "发布失败"); } }

  return <main className="workspace-page"><header className="workspace-header"><div><Link href="/workspace" className="eyebrow">Knowledge Workspace / 知识沉淀</Link><h1>录入知识文章</h1><p>把经验、方案和学习笔记整理成可迁移的 Markdown 文章。</p></div><Link href="/workspace/articles" className="secondary-button">文章历史</Link></header>
    <div className="workspace-toolbar"><span className="save-state">{message}</span><span className="save-state">正文 {wordCount} 字</span><button type="button" className="secondary-button" onClick={clearDraft}>清除草稿</button><button type="button" className="secondary-button" onClick={preview}>更新预览</button><button type="button" className="primary-button" onClick={publish}>发布文章</button></div>
    <div className="workspace-grid"><section className="editor-panel"><div className="section-heading"><div><span className="eyebrow">Article source</span><h2>文章信息</h2></div></div>
      <label className="field-label">标题<input value={article.title} placeholder="例如：Spring Boot 文件存储设计笔记" onChange={(e) => update({ title: e.target.value })} /></label>
      <label className="field-label">Slug <span className="field-help">只允许小写字母、数字和短横线，发布后建议不要修改</span><input value={article.slug} placeholder="spring-boot-file-storage" onChange={(e) => update({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} /></label>
      <label className="field-label">摘要<textarea rows={3} value={article.summary} placeholder="用一两句话说明这篇文章解决什么问题" onChange={(e) => update({ summary: e.target.value })} /></label>
      <div className="article-meta-grid"><label className="field-label">标签<input value={article.tags.join(", ")} placeholder="Java, Spring Boot" onChange={(e) => update({ tags: split(e.target.value) })} /></label><label className="field-label">概念<input value={article.concepts.join(", ")} placeholder="文件存储, 原子写入" onChange={(e) => update({ concepts: split(e.target.value) })} /></label><label className="field-label">分类路径<input value={article.categoryPath.join(" / ")} placeholder="知识沉淀 / 后端" onChange={(e) => update({ categoryPath: e.target.value.split("/").map((item) => item.trim()).filter(Boolean) })} /></label><label className="field-label">相关文章 Slug<input value={article.relatedArticles.join(", ")} placeholder="article-a, article-b" onChange={(e) => update({ relatedArticles: split(e.target.value) })} /></label></div>
      <label className="field-label">正文 <span className="field-help">支持 Markdown、GFM 表格/任务列表和 Mermaid 代码块</span><textarea className="article-body-input" value={article.body} placeholder={'# 问题\n\n## 结论\n\n记录你的方案、取舍和可复用经验。'} rows={22} onChange={(e) => update({ body: e.target.value })} /></label>
    </section><section className="preview-panel"><div className="section-heading"><div><span className="eyebrow">Rendered archive</span><h2>文章预览</h2></div></div>{markdown ? <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ code: ({ className, children }) => { const language = /language-(\w+)/.exec(className ?? "")?.[1]; return language === "mermaid" ? <MermaidDiagram chart={String(children).replace(/\n$/, "")} /> : <code className="markdown-code">{children}</code>; } }}>{markdown}</ReactMarkdown> : <div className="empty-preview">点击“更新预览”查看 Front Matter 和正文渲染效果。</div>}</section></div>
  </main>;
}
