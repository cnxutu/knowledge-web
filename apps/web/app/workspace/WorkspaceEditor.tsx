"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getDocument, previewDocument, publishDocument, type Category, type NextAction, type WorkItem, type WorkItemStatus, type WorkspaceDocument } from "@/lib/workspace-api";
import MermaidDiagram from "./MermaidDiagram";

const today = () => { const value = new Date(); const offset = value.getTimezoneOffset(); return new Date(value.getTime() - offset * 60_000).toISOString().slice(0, 10); };
const id = () => Math.random().toString(36).slice(2, 9);
const blankItem = (): WorkItem => ({ id: id(), title: "", status: "TODO", summary: "", details: "", tags: [] });
const blankCategory = (): Category => ({ id: id(), name: "新分类", items: [blankItem()] });
const initial = (date: string): WorkspaceDocument => ({ schemaVersion: 1, templateCode: "daily-work", title: "", date, status: "DRAFT", categories: ["工作记录"], workItems: [blankCategory()], nextActions: [{ id: id(), title: "", done: false }] });

export default function WorkspaceEditor({ date: requestedDate }: { date?: string }) {
  const date = requestedDate ?? today();
  const storageKey = `knowledge-workspace:draft:${date}`;
  const [document, setDocument] = useState<WorkspaceDocument>(() => initial(date));
  const [markdown, setMarkdown] = useState("");
  const [message, setMessage] = useState("草稿尚未发布");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const draft = window.localStorage.getItem(storageKey);
    getDocument(date).then((saved) => { if (!active) return; setDocument(saved ?? (draft ? JSON.parse(draft) : initial(date))); }).catch(() => { if (active && draft) setDocument(JSON.parse(draft)); }).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [date, storageKey]);
  useEffect(() => { if (!loading) window.localStorage.setItem(storageKey, JSON.stringify(document)); }, [document, loading, storageKey]);

  const itemCount = useMemo(() => document.workItems.reduce((sum, category) => sum + category.items.length, 0), [document.workItems]);
  function updateCategory(categoryId: string, patch: Partial<Category>) { setDocument((d) => ({ ...d, workItems: d.workItems.map((c) => c.id === categoryId ? { ...c, ...patch } : c) })); }
  function updateItem(categoryId: string, itemId: string, patch: Partial<WorkItem>) { setDocument((d) => ({ ...d, workItems: d.workItems.map((c) => c.id === categoryId ? { ...c, items: c.items.map((i) => i.id === itemId ? { ...i, ...patch } : i) } : c) })); }
  function clearDraft() { window.localStorage.removeItem(storageKey); setDocument(initial(date)); setMarkdown(""); setMessage("已清除当天草稿"); }
  async function generatePreview() { setMessage("正在生成预览…"); try { setMarkdown((await previewDocument(document)).markdown); setMessage("预览已更新"); } catch (error) { setMessage(error instanceof Error ? error.message : "预览失败"); } }
  async function publish() { setMessage("正在发布…"); try { const result = await publishDocument(document); setDocument(result.document); setMarkdown(result.markdown); window.localStorage.removeItem(storageKey); setMessage(`已发布：JSON ${result.jsonPath} · Markdown ${result.markdownPath}`); } catch (error) { setMessage(error instanceof Error ? error.message : "发布失败"); } }

  return <main className="workspace-page">
    <header className="workspace-header"><div><Link href="/" className="eyebrow">Knowledge Web / Workspace</Link><h1>每日工作记录</h1><p>结构化填写，Markdown 发布到 Obsidian Vault。</p></div><div className="header-actions"><Link href="/workspace/articles/new" className="secondary-button">录入知识文章</Link><Link href="/workspace/history" className="secondary-button">历史记录</Link></div></header>
    <div className="workspace-toolbar"><label>日期<input type="date" value={document.date} onChange={(e) => setDocument({ ...document, date: e.target.value })} /></label><label>模板<select value={document.templateCode} onChange={(e) => setDocument({ ...document, templateCode: e.target.value })}><option value="daily-work">每日工作记录</option></select></label><span className="save-state">{message}</span><button type="button" className="secondary-button" onClick={clearDraft}>清除草稿</button><button type="button" className="secondary-button" onClick={generatePreview}>更新预览</button><button type="button" className="primary-button" onClick={publish}>发布</button></div>
    <div className="workspace-grid"><section className="editor-panel"><div className="section-heading"><div><span className="eyebrow">Structured source</span><h2>编辑内容</h2></div><span>{itemCount} 个事项</span></div><label className="field-label">今日概述<input value={document.title} placeholder="例如：完成知识工作区 MVP" onChange={(e) => setDocument({ ...document, title: e.target.value })} /></label>
      <div className="section-heading"><h2>工作事项</h2><button type="button" className="text-button" onClick={() => setDocument({ ...document, workItems: [...document.workItems, blankCategory()] })}>+ 新增分类</button></div>
      {document.workItems.map((category) => <div className="category-card" key={category.id}><div className="category-title"><input value={category.name} onChange={(e) => updateCategory(category.id, { name: e.target.value })} /><button type="button" className="danger-button" onClick={() => setDocument({ ...document, workItems: document.workItems.filter((c) => c.id !== category.id) })}>删除分类</button></div>{category.items.map((item) => <article className="item-card" key={item.id}><div className="item-row"><input value={item.title} placeholder="事项标题" onChange={(e) => updateItem(category.id, item.id, { title: e.target.value })} /><select value={item.status} onChange={(e) => updateItem(category.id, item.id, { status: e.target.value as WorkItemStatus })}>{["TODO", "DOING", "DONE", "BLOCKED", "CANCELLED"].map((status) => <option key={status}>{status}</option>)}</select><button type="button" className="danger-button" onClick={() => updateCategory(category.id, { items: category.items.filter((i) => i.id !== item.id) })}>删除</button></div><textarea value={item.summary} placeholder="简要说明" onChange={(e) => updateItem(category.id, item.id, { summary: e.target.value })} /><textarea value={item.details} placeholder="详细记录（支持 Markdown）" rows={3} onChange={(e) => updateItem(category.id, item.id, { details: e.target.value })} /><input value={item.tags.join(", ")} placeholder="标签，用逗号分隔" onChange={(e) => updateItem(category.id, item.id, { tags: e.target.value.split(",").map((tag) => tag.trim()).filter(Boolean) })} /></article>)}<button type="button" className="text-button" onClick={() => updateCategory(category.id, { items: [...category.items, blankItem()] })}>+ 新增事项</button></div>)}
      <div className="section-heading"><h2>明日计划</h2><button type="button" className="text-button" onClick={() => setDocument({ ...document, nextActions: [...document.nextActions, { id: id(), title: "", done: false }] })}>+ 新增计划</button></div>{document.nextActions.map((action) => <div className="next-action" key={action.id}><input type="checkbox" checked={action.done} onChange={(e) => setDocument({ ...document, nextActions: document.nextActions.map((a) => a.id === action.id ? { ...a, done: e.target.checked } : a) })} /><input value={action.title} placeholder="下一项计划" onChange={(e) => setDocument({ ...document, nextActions: document.nextActions.map((a) => a.id === action.id ? { ...a, title: e.target.value } : a) })} /><button type="button" className="danger-button" onClick={() => setDocument({ ...document, nextActions: document.nextActions.filter((a) => a.id !== action.id) })}>删除</button></div>)}</section>
      <section className="preview-panel"><div className="section-heading"><div><span className="eyebrow">Rendered archive</span><h2>Markdown 预览</h2></div></div>{markdown ? <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ code: ({ className, children }) => { const language = /language-(\w+)/.exec(className ?? "")?.[1]; return language === "mermaid" ? <MermaidDiagram chart={String(children).replace(/\n$/, "")} /> : <code className="markdown-code">{children}</code>; } }}>{markdown}</ReactMarkdown> : <div className="empty-preview">点击“更新预览”查看发布后的 Markdown。<br />支持 GFM 表格、任务列表、代码块和 Mermaid 图表。</div>}</section></div>
  </main>;
}
