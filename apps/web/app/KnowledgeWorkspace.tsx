"use client";

import {
  collapsePanel,
  closePanel,
  createInitialReadingState,
  openLinkedPanel,
  type KnowledgeArticle,
  type NavigationNode,
  type ReadingWorkspaceState
} from "@knowledge/shared";
import { KnowledgeShell, RelationshipList } from "@knowledge/ui-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";

interface KnowledgeWorkspaceProps {
  initialArticle: KnowledgeArticle;
  relatedArticles: KnowledgeArticle[];
  navigation: NavigationNode[];
  allArticles: KnowledgeArticle[];
}

export function KnowledgeWorkspace({
  initialArticle,
  relatedArticles,
  navigation,
  allArticles
}: KnowledgeWorkspaceProps) {
  const [workspace, setWorkspace] = useState<ReadingWorkspaceState>(() =>
    createInitialReadingState(initialArticle.meta.slug)
  );

  const articleMap = useMemo(
    () => new Map(allArticles.map((article) => [article.meta.slug, article])),
    [allArticles]
  );

  const openedArticles = workspace.openedPanels.map((panel) => ({
    panel,
    article: articleMap.get(panel.articleSlug) ?? initialArticle
  }));

  function openArticle(slug: string, parentPanelId: string) {
    if (!articleMap.has(slug)) {
      return;
    }
    setWorkspace((current) => openLinkedPanel(current, slug, parentPanelId));
  }

  const sidebar = (
    <div style={{ display: "grid", gap: 14 }}>
      {navigation.map((node) => (
        <div key={node.id}>
          <div style={{ fontWeight: 700, marginBottom: 8, color: "#31281c" }}>{node.title}</div>
          <div style={{ display: "grid", gap: 6, paddingLeft: 12 }}>
            {node.children?.map((child) => (
              <div key={child.id}>
                <div style={{ color: "#5c5549", marginBottom: 6 }}>{child.title}</div>
                <div style={{ display: "grid", gap: 6, paddingLeft: 12 }}>
                  {child.children?.flatMap((deep) =>
                    deep.children?.map((leaf) => (
                      <Link key={leaf.id} href={`/articles/${leaf.articleSlug}`} style={{ color: "#7a5d2b" }}>
                        {leaf.title}
                      </Link>
                    )) ?? []
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <Link href="/search" style={{ marginTop: 8, color: "#7a5d2b", fontWeight: 700 }}>
        打开搜索页
      </Link>
    </div>
  );

  const panels = (
    <div style={{ display: "flex", gap: 16, padding: 24, minWidth: "fit-content" }}>
      {openedArticles.map(({ panel, article }, index) => (
        <section
          key={panel.panelId}
          style={{
            width: panel.collapsed ? 92 : panel.width,
            transition: "width 0.2s ease",
            borderRadius: 24,
            border: panel.panelId === workspace.focusedPanelId ? "2px solid #d4952e" : "1px solid #d8ccbb",
            background: panel.panelId === workspace.focusedPanelId ? "#fffaf1" : "#fffdf8",
            boxShadow: "0 16px 30px rgba(89, 67, 34, 0.08)",
            overflow: "hidden"
          }}
        >
          <header
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 18px",
              background: "#efe3ce",
              borderBottom: "1px solid #d8ccbb"
            }}
          >
            <div>
              <div style={{ fontSize: 12, color: "#8d7857", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                {index === 0 ? "Primary" : `Right ${index}`}
              </div>
              {!panel.collapsed && <strong style={{ color: "#2d261d" }}>{article.meta.title}</strong>}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={() => setWorkspace((current) => collapsePanel(current, panel.panelId))}>
                {panel.collapsed ? "展开" : "折叠"}
              </button>
              {panel.panelId !== "panel-root" && (
                <button type="button" onClick={() => setWorkspace((current) => closePanel(current, panel.panelId))}>
                  关闭
                </button>
              )}
            </div>
          </header>
          {!panel.collapsed && (
            <div style={{ padding: 18, display: "grid", gap: 18 }}>
              <div>
                <p style={{ margin: 0, color: "#675c4e", lineHeight: 1.6 }}>{article.meta.summary}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                  {article.meta.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{ padding: "4px 10px", borderRadius: 999, background: "#f4e7ca", color: "#6f5a27", fontSize: 12 }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: "1px solid #eadfce", paddingTop: 14 }}>
                <ReactMarkdown>{article.body}</ReactMarkdown>
              </div>

              <div style={{ borderTop: "1px solid #eadfce", paddingTop: 14 }}>
                <h3 style={{ marginTop: 0 }}>关联阅读</h3>
                <RelationshipList edges={article.graph.edges} onOpen={(slug) => openArticle(slug, panel.panelId)} />
              </div>

              {index === 0 && relatedArticles.length > 0 && (
                <div style={{ borderTop: "1px solid #eadfce", paddingTop: 14 }}>
                  <h3 style={{ marginTop: 0 }}>推荐入口</h3>
                  <div style={{ display: "grid", gap: 8 }}>
                    {relatedArticles.map((related) => (
                      <button key={related.meta.slug} type="button" onClick={() => openArticle(related.meta.slug, panel.panelId)}>
                        {related.meta.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      ))}
    </div>
  );

  return <KnowledgeShell navigation={navigation} openedPanels={workspace.openedPanels} focusedPanelId={workspace.focusedPanelId} sidebar={sidebar} panels={panels} />;
}

