import { describe, expect, it } from "vitest";
import {
  collapsePanel,
  createInitialReadingState,
  focusPanel,
  openLinkedPanel
} from "../index";

describe("reading panels", () => {
  it("opens linked articles as focusable side panels", () => {
    const initial = createInitialReadingState("security-login-overview");
    const state = openLinkedPanel(initial, "jwt-token-flow", "panel-root");

    expect(state.focusedPanelId).toBe("panel-2");
    expect(state.openedPanels).toHaveLength(2);
    expect(state.openedPanels[1]).toMatchObject({
      panelId: "panel-2",
      articleSlug: "jwt-token-flow",
      parentPanelId: "panel-root"
    });
  });

  it("supports focus switching and collapse for distraction-free reading", () => {
    const initial = createInitialReadingState("security-login-overview");
    const withPanel = openLinkedPanel(initial, "redis-session-strategy", "panel-root");
    const focused = focusPanel(withPanel, "panel-root");
    const collapsed = collapsePanel(focused, "panel-2");

    expect(focused.focusedPanelId).toBe("panel-root");
    expect(collapsed.openedPanels[1]?.collapsed).toBe(true);
  });
});

