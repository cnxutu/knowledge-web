import type { ReadingPanelState, ReadingWorkspaceState } from "../types/content";

function nextPanelId(openedPanels: ReadingPanelState[]) {
  return `panel-${openedPanels.length + 1}`;
}

export function createInitialReadingState(articleSlug: string): ReadingWorkspaceState {
  return {
    openedPanels: [
      {
        panelId: "panel-root",
        articleSlug,
        collapsed: false,
        width: 720,
        parentPanelId: null
      }
    ],
    focusedPanelId: "panel-root",
    readingHistory: [articleSlug]
  };
}

export function openLinkedPanel(
  state: ReadingWorkspaceState,
  articleSlug: string,
  parentPanelId: string
): ReadingWorkspaceState {
  const panelId = nextPanelId(state.openedPanels);
  return {
    openedPanels: [
      ...state.openedPanels,
      {
        panelId,
        articleSlug,
        collapsed: false,
        width: 480,
        parentPanelId
      }
    ],
    focusedPanelId: panelId,
    readingHistory: [...state.readingHistory, articleSlug]
  };
}

export function focusPanel(
  state: ReadingWorkspaceState,
  panelId: string
): ReadingWorkspaceState {
  return {
    ...state,
    focusedPanelId: panelId
  };
}

export function collapsePanel(
  state: ReadingWorkspaceState,
  panelId: string
): ReadingWorkspaceState {
  return {
    ...state,
    openedPanels: state.openedPanels.map((panel) =>
      panel.panelId === panelId ? { ...panel, collapsed: !panel.collapsed } : panel
    )
  };
}

export function closePanel(
  state: ReadingWorkspaceState,
  panelId: string
): ReadingWorkspaceState {
  const remainingPanels = state.openedPanels.filter((panel) => panel.panelId !== panelId);
  return {
    openedPanels: remainingPanels,
    focusedPanelId: remainingPanels[remainingPanels.length - 1]?.panelId ?? "panel-root",
    readingHistory: state.readingHistory
  };
}

