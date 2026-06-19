import type { NavigationNode, ReadingPanelState } from "@knowledge/shared";
import type { ReactNode } from "react";

interface KnowledgeShellProps {
  navigation: NavigationNode[];
  openedPanels: ReadingPanelState[];
  focusedPanelId: string;
  sidebar: ReactNode;
  panels: ReactNode;
}

export function KnowledgeShell({
  navigation,
  openedPanels,
  focusedPanelId,
  sidebar,
  panels
}: KnowledgeShellProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", minHeight: "100vh", background: "#f5f1e8" }}>
      <aside style={{ borderRight: "1px solid #d8cfbf", padding: "24px", background: "#efe7d6" }}>
        <p style={{ margin: 0, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6e6557" }}>
          Knowledge Graph
        </p>
        <h1 style={{ margin: "12px 0 20px", fontSize: 28, color: "#1f1b16" }}>个人知识库</h1>
        <p style={{ margin: "0 0 20px", color: "#5b5449", lineHeight: 1.6 }}>
          {navigation.length} 个一级分类，当前打开 {openedPanels.length} 个阅读栏，聚焦于 {focusedPanelId}
        </p>
        {sidebar}
      </aside>
      <main style={{ overflowX: "auto" }}>{panels}</main>
    </div>
  );
}

