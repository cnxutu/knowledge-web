"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getDocument, previewDocument, publishDocument, type Category, type WorkItem, type WorkItemStatus, type WorkspaceDocument } from "@/lib/workspace-api";
import MermaidDiagram from "./MermaidDiagram";

const today = () => { const value = new Date(); const offset = value.getTimezoneOffset(); return new Date(value.getTime() - offset * 60_000).toISOString().slice(0, 10); };
const id = () => Math.random().toString(36).slice(2, 9);
const blankItem = (): WorkItem => ({ id: id(), title: "", status: "TODO", summary: "", details: "", tags: [] });
const blankCategory = (): Category => ({ id: id(), name: "新分类", items: [blankItem()] });
const initial = (date: string): WorkspaceDocument => ({ schemaVersion: 1, templateCode: "daily-work", title: "", date, status: "DRAFT", categories: ["工作记录"], workItems: [blankCategory()], nextActions: [{ id: id(), title: "", done: false }] });

function Chevron() { return <svg aria-hidden="true" viewBox="0 0 16 16" className="workspace-icon"><path d="m4 6 4 4 4-4" /></svg>; }
function Eye({ hidden = false }: { hidden?: boolean }) { return <svg aria-hidden="true" viewBox="0 0 18 18" className="workspace-icon"><path d={hidden ? "M3 3.5 15 15.5M7.2 5.3A8.8 8.8 0 0 1 9 5.1c3.7 0 6.2 3.9 6.2 3.9a12 12 0 0 1-2.2 2.6M5.4 6.2C3.9 7.3 2.8 9 2.8 9s2.5 3.9 6.2 3.9c.7 0 1.4-.1 2-.4" : "M2.5 9s2.5-4 6.5-4 6.5 4 6.5 4-2.5 4-6.5 4-6.5-4-6.5-4Z"} /><circle cx="9" cy="9" r="1.8" /></svg>; }

export default function WorkspaceEditor({ date: requestedDate }: { date?: string }) {
  const date = requestedDate ?? today();
  const storageKey = `knowledge-workspace:draft:${date}`;
  const [document, setDocument] = useState<WorkspaceDocument>(() => initial(date));
  const [markdown, setMarkdown] = useState("");
  const [message, setMessage] = useState("草稿尚未发布");
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const [showEditor, setShowEditor] = useState(true);

  useEffect(() => {
    let active = true;
    const draft = window.localStorage.getItem(storageKey);
    getDocument(date).then((saved) => { if (!active) return; setDocument(saved ?? (draft ? JSON.parse(draft) : initial(date))); }).catch(() => { if (active && draft) setDocument(JSON.parse(draft)); }).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [date, storageKey]);
  useEffect(() => { if (!loading) window.localStorage.setItem(storageKey, JSON.stringify(document)); }, [document, loading, storageKey]);

  const itemCount = useMemo(() => document.workItems.reduce((sum, category) => sum + category.items.length, 0), [document.workItems]);
  const doneCount = useMemo(() => document.workItems.reduce((sum, category) => sum + category.items.filter((item) => item.status === "DONE").length, 0), [document.workItems]);
  function updateCategory(categoryId: string, patch: Partial<Category>) { setDocument((d) => ({ ...d, workItems: d.workItems.map((c) => c.id === categoryId ? { ...c, ...patch } : c) })); }
  function updateItem(categoryId: string, itemId: string, patch: Partial<WorkItem>) { setDocument((d) => ({ ...d, workItems: d.workItems.map((c) => c.id === categoryId ? { ...c, items: c.items.map((i) => i.id === itemId ? { ...i, ...patch } : i) } : c) })); }
  function clearDraft() { window.localStorage.removeItem(storageKey); setDocument(initial(date)); setMarkdown(""); setMessage("已清除当天草稿"); }
  async function generatePreview() { setMessage("正在生成预览…"); try { setMarkdown((await previewDocument(document)).markdown); setMessage("预览已更新"); } catch (error) { setMessage(error instanceof Error ? error.message : "预览失败"); } }
  async function publish() { setMessage("正在发布…"); try { const result = await publishDocument(document); setDocument(result.document); setMarkdown(result.markdown); window.localStorage.removeItem(storageKey); setMessage(`已发布：${result.markdownPath}`); } catch (error) { setMessage(error instanceof Error ? error.message : "发布失败"); } }

  return <main className="workspace-page workspace-modern">
    <header className="workspace-header">
      <div className="workspace-title-wrap"><Link href="/" className="workspace-breadcrumb"><span className="workspace-logo">K</span> KNOWLEDGE.WEB <span>/</span> WORKSPACE</Link><h1>每日工作记录</h1><p>把今天发生的事，整理成明天可以继续使用的上下文。</p></div>
      <div className="header-actions"><Link href="/workspace/history" className="workspace-ghost-button">历史记录</Link><Link href="/workspace/articles/new" className="workspace-ghost-button">知识文章 <span>↗</span></Link></div>
    </header>

    <div className="workspace-commandbar"><div className="commandbar-date"><span className="calendar-mark">◷</span><label>记录日期<input type="date" value={document.date} onChange={(e) => setDocument({ ...document, date: e.target.value })} /></label><Chevron /></div><div className="workspace-progress"><span className="progress-label">今日进度</span><span className="progress-track"><i style={{ width: `${itemCount ? Math.round((doneCount / itemCount) * 100) : 0}%` }} /></span><b>{doneCount}/{itemCount}</b></div><span className="save-state modern-save"><i />{message}</span><button type="button" className="preview-toggle" disabled={showEditor && !showPreview} onClick={() => setShowEditor((value) => !value)}><Eye hidden={!showEditor} /> {showEditor ? "隐藏输入" : "显示输入"}</button><button type="button" className="preview-toggle" disabled={!showEditor && showPreview} onClick={() => setShowPreview((value) => !value)}><Eye hidden={!showPreview} /> {showPreview ? "隐藏预览" : "显示预览"}</button><button type="button" className="modern-secondary" onClick={clearDraft}>清空</button><button type="button" className="modern-secondary" onClick={generatePreview}>更新预览</button><button type="button" className="modern-primary" onClick={publish}>发布记录 <span>↗</span></button></div>

    <div className={`workspace-grid workspace-split ${showPreview && showEditor ? "with-preview" : "single-pane"} ${showEditor ? "editor-visible" : "editor-hidden"} ${showPreview ? "preview-visible" : "preview-hidden"}`}>
      {showEditor && <section className="editor-panel modern-editor"><div className="panel-heading"><div><span className="panel-kicker">01 / CAPTURE</span><h2>今天发生了什么？</h2></div><span className="input-hint">自动保存至本地草稿</span></div>
        <label className="focus-title-field"><span>今日主题</span><input value={document.title} placeholder="用一句话概括今天的重点…" onChange={(e) => setDocument({ ...document, title: e.target.value })} /></label>
        <div className="quick-prompts"><span>快速开始</span><button type="button" onClick={() => setDocument({ ...document, title: "推进一个重要项目" })}>推进项目</button><button type="button" onClick={() => setDocument({ ...document, title: "学习与研究记录" })}>学习研究</button><button type="button" onClick={() => setDocument({ ...document, title: "整理与复盘" })}>整理复盘</button></div>
        <div className="panel-heading items-heading"><div><span className="panel-kicker">WORK ITEMS</span><h2>工作事项 <em>{itemCount}</em></h2></div><button type="button" className="add-button" onClick={() => setDocument({ ...document, workItems: [...document.workItems, blankCategory()] })}>+ 新增分组</button></div>
        {document.workItems.map((category, categoryIndex) => <div className="category-card modern-category" key={category.id}><div className="category-title modern-category-title"><span className="category-number">0{categoryIndex + 1}</span><input value={category.name} onChange={(e) => updateCategory(category.id, { name: e.target.value })} /><button type="button" className="category-delete" onClick={() => setDocument({ ...document, workItems: document.workItems.filter((c) => c.id !== category.id) })}>移除分组</button></div>{category.items.map((item, itemIndex) => <article className="item-card modern-item" key={item.id}><div className="item-topline"><span className={`item-status-dot status-${item.status.toLowerCase()}`} /><input className="item-title-input" value={item.title} placeholder={`事项 ${itemIndex + 1} · 你正在处理什么？`} onChange={(e) => updateItem(category.id, item.id, { title: e.target.value })} /><label className="status-select"><select value={item.status} onChange={(e) => updateItem(category.id, item.id, { status: e.target.value as WorkItemStatus })}><option value="TODO">待开始</option><option value="DOING">进行中</option><option value="DONE">已完成</option><option value="BLOCKED">已阻塞</option><option value="CANCELLED">已取消</option></select><Chevron /></label><button type="button" className="item-delete" onClick={() => updateCategory(category.id, { items: category.items.filter((i) => i.id !== item.id) })}>×</button></div><textarea value={item.summary} placeholder="一句话记录结果或当前状态…" onChange={(e) => updateItem(category.id, item.id, { summary: e.target.value })} /><textarea className="details-input" value={item.details} placeholder="补充细节、决策、遇到的问题（支持 Markdown）" rows={3} onChange={(e) => updateItem(category.id, item.id, { details: e.target.value })} /><div className="item-footer"><span className="tag-prefix">#</span><input value={item.tags.join(", ")} placeholder="添加标签，用逗号分隔" onChange={(e) => updateItem(category.id, item.id, { tags: e.target.value.split(",").map((tag) => tag.trim()).filter(Boolean) })} /></div></article>)}<button type="button" className="add-item-button" onClick={() => updateCategory(category.id, { items: [...category.items, blankItem()] })}>＋ 添加一项</button></div>)}
        <div className="next-actions-block"><div className="panel-heading items-heading"><div><span className="panel-kicker">LOOKING AHEAD</span><h2>明日计划</h2></div><button type="button" className="add-button" onClick={() => setDocument({ ...document, nextActions: [...document.nextActions, { id: id(), title: "", done: false }] })}>+ 添加计划</button></div>{document.nextActions.map((action) => <div className="next-action modern-next-action" key={action.id}><input type="checkbox" checked={action.done} onChange={(e) => setDocument({ ...document, nextActions: document.nextActions.map((a) => a.id === action.id ? { ...a, done: e.target.checked } : a) })} /><input value={action.title} placeholder="明天最重要的一件事…" onChange={(e) => setDocument({ ...document, nextActions: document.nextActions.map((a) => a.id === action.id ? { ...a, title: e.target.value } : a) })} /><button type="button" className="item-delete" onClick={() => setDocument({ ...document, nextActions: document.nextActions.filter((a) => a.id !== action.id) })}>×</button></div>)}</div>
      </section>}

      {showPreview && <section className="preview-panel modern-preview"><div className="preview-topbar"><div><span className="panel-kicker">02 / RENDERED OUTPUT</span><h2>最终预览</h2></div><div className="preview-head-actions"><span className="live-badge"><i /> MARKDOWN</span><button type="button" className="panel-hide-button" disabled={!showEditor} onClick={() => setShowPreview(false)} aria-label="关闭预览面板">×</button></div></div><div className="preview-paper">{markdown ? <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ code: ({ className, children }) => { const language = /language-(\w+)/.exec(className ?? "")?.[1]; return language === "mermaid" ? <MermaidDiagram chart={String(children).replace(/\n$/, "")} /> : <code className="markdown-code">{children}</code>; } }}>{markdown}</ReactMarkdown> : <div className="empty-preview modern-empty"><div className="empty-orb">✦</div><h3>你的工作记录会出现在这里</h3><p>填写左侧内容，然后点击“更新预览”。<br />最终会生成可发布到 Obsidian 的 Markdown 文档。</p><span className="empty-tip">支持 GFM · 任务列表 · Mermaid</span></div>}</div><div className="preview-footer"><span>LIVE DOCUMENT PREVIEW</span><span>⌘ ↵ 更新预览</span></div></section>}
    </div>
  </main>;
}
