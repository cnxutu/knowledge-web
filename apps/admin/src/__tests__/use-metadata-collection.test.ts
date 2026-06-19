import { describe, expect, it } from "vitest";
import type { AdminNavigationItem } from "@knowledge/shared";
import { createDraftsSnapshot, type AdminMetadataDrafts } from "../modules/metadata-workspace";
import { useMetadataCollection } from "../composables/use-metadata-collection";

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((nextResolve) => {
    resolve = nextResolve;
  });
  return { promise, resolve };
}

describe("useMetadataCollection", () => {
  it("loads, saves, deletes and resets a metadata slice through one composable", async () => {
    const baseItem: AdminNavigationItem = {
      slug: "security-login-overview",
      title: "登录场景总览",
      categoryPath: "架构设计 / 认证鉴权 / 登录体系",
      updatedAt: "2026-06-20",
      tags: ["login"],
      status: "draft",
      publishedAt: null,
      publishedSnapshot: null,
      conceptCount: 1,
      relatedCount: 1
    };
    const editedItem: AdminNavigationItem = {
      ...baseItem,
      title: "登录场景总览（修订）"
    };
    const loadedDrafts = createDraftsSnapshot({
      navigationItems: [baseItem],
      relationItems: [],
      topicItems: [],
      conceptItems: []
    });
    const savedDrafts = createDraftsSnapshot({
      navigationItems: [editedItem],
      relationItems: [],
      topicItems: [],
      conceptItems: []
    });
    const deletedDrafts = createDraftsSnapshot({
      navigationItems: [],
      relationItems: [],
      topicItems: [],
      conceptItems: []
    });
    const resetDrafts = createDraftsSnapshot({
      navigationItems: [baseItem],
      relationItems: [],
      topicItems: [],
      conceptItems: []
    });

    let deletedSlug = "";
    const collection = useMetadataCollection<AdminNavigationItem, string>({
      getItems: (drafts) => drafts.navigationItems,
      load: async () => loadedDrafts,
      save: async () => savedDrafts,
      remove: async (slug) => {
        deletedSlug = slug;
        return deletedDrafts;
      },
      reset: async () => resetDrafts
    });

    await collection.loadItems();
    expect(collection.items.value[0]?.title).toBe("登录场景总览");

    await collection.saveItem(editedItem);
    expect(collection.items.value[0]?.title).toBe("登录场景总览（修订）");
    expect(collection.lastUpdated.value).toBe(savedDrafts.updatedAt);

    await collection.deleteItem("security-login-overview");
    expect(deletedSlug).toBe("security-login-overview");
    expect(collection.items.value).toHaveLength(0);

    await collection.resetItems();
    expect(collection.items.value[0]?.slug).toBe("security-login-overview");
    expect(collection.lastUpdated.value).toBe(resetDrafts.updatedAt);
  });

  it("tracks loading states for load, save, delete and reset actions", async () => {
    const baseDrafts = createDraftsSnapshot({
      navigationItems: [],
      relationItems: [],
      topicItems: [],
      conceptItems: []
    });
    const loadDeferred = createDeferred<AdminMetadataDrafts>();
    const saveDeferred = createDeferred<AdminMetadataDrafts>();
    const deleteDeferred = createDeferred<AdminMetadataDrafts>();
    const resetDeferred = createDeferred<AdminMetadataDrafts>();
    const collection = useMetadataCollection<AdminNavigationItem, string>({
      getItems: (drafts) => drafts.navigationItems,
      load: () => loadDeferred.promise,
      save: () => saveDeferred.promise,
      remove: () => deleteDeferred.promise,
      reset: () => resetDeferred.promise
    });

    const loadTask = collection.loadItems();
    expect(collection.isLoading.value).toBe(true);
    loadDeferred.resolve(baseDrafts);
    await loadTask;
    expect(collection.isLoading.value).toBe(false);

    const saveTask = collection.saveItem({
      slug: "jwt-token-flow",
      title: "JWT 令牌链路",
      categoryPath: "架构设计 / 认证鉴权 / 令牌策略",
      updatedAt: "2026-06-20",
      tags: ["jwt"],
      status: "draft",
      publishedAt: null,
      publishedSnapshot: null,
      conceptCount: 1,
      relatedCount: 1
    });
    expect(collection.isSaving.value).toBe(true);
    saveDeferred.resolve(baseDrafts);
    await saveTask;
    expect(collection.isSaving.value).toBe(false);

    const deleteTask = collection.deleteItem("jwt-token-flow");
    expect(collection.isDeleting.value).toBe(true);
    deleteDeferred.resolve(baseDrafts);
    await deleteTask;
    expect(collection.isDeleting.value).toBe(false);

    const resetTask = collection.resetItems();
    expect(collection.isResetting.value).toBe(true);
    resetDeferred.resolve(baseDrafts);
    await resetTask;
    expect(collection.isResetting.value).toBe(false);
  });
});
