import type {
  AdminConceptItem,
  AdminNavigationItem,
  AdminRelationItem,
  AdminTopicItem
} from "@knowledge/shared";
import {
  createConceptSnapshot,
  createDraftsSnapshot,
  createNavigationSnapshot,
  createTopicSnapshot,
  loadAdminMetadataDrafts,
  loadDefaultAdminMetadataDrafts,
  persistAdminMetadataDrafts,
  upsertConceptItem,
  upsertNavigationItem,
  upsertRelationItem,
  upsertTopicItem,
  type AdminMetadataDrafts
} from "./metadata-workspace";

export interface AdminMetadataService {
  loadWorkspace(): Promise<AdminMetadataDrafts>;
  resetWorkspace(): Promise<AdminMetadataDrafts>;
  getLastUpdated(): Promise<string>;
  saveNavigationItem(item: AdminNavigationItem): Promise<AdminMetadataDrafts>;
  publishNavigationItem(slug: string): Promise<AdminMetadataDrafts>;
  moveNavigationItemToDraft(slug: string): Promise<AdminMetadataDrafts>;
  deleteNavigationItem(slug: string): Promise<AdminMetadataDrafts>;
  saveRelationItem(item: AdminRelationItem): Promise<AdminMetadataDrafts>;
  deleteRelationItem(id: string): Promise<AdminMetadataDrafts>;
  saveTopicItem(item: AdminTopicItem): Promise<AdminMetadataDrafts>;
  publishTopicItem(id: string): Promise<AdminMetadataDrafts>;
  moveTopicItemToDraft(id: string): Promise<AdminMetadataDrafts>;
  deleteTopicItem(id: string): Promise<AdminMetadataDrafts>;
  saveConceptItem(item: AdminConceptItem): Promise<AdminMetadataDrafts>;
  publishConceptItem(id: string): Promise<AdminMetadataDrafts>;
  moveConceptItemToDraft(id: string): Promise<AdminMetadataDrafts>;
  deleteConceptItem(id: string): Promise<AdminMetadataDrafts>;
}

interface AdminMetadataServiceOptions {
  loadDrafts?: () => Promise<AdminMetadataDrafts>;
  persistDrafts?: (drafts: AdminMetadataDrafts) => void;
}

export function createAdminMetadataService(options: AdminMetadataServiceOptions = {}): AdminMetadataService {
  const loadDrafts = options.loadDrafts ?? loadAdminMetadataDrafts;
  const persistDrafts = options.persistDrafts ?? persistAdminMetadataDrafts;

  return {
    async loadWorkspace() {
      return loadDrafts();
    },
    async resetWorkspace() {
      const drafts = await loadDefaultAdminMetadataDrafts();
      persistDrafts(drafts);
      return drafts;
    },
    async getLastUpdated() {
      return (await loadDrafts()).updatedAt;
    },
    async saveNavigationItem(item) {
      const drafts = await loadDrafts();
      const nextDrafts = createDraftsSnapshot({
        navigationItems: upsertNavigationItem(drafts.navigationItems, item),
        relationItems: drafts.relationItems,
        topicItems: drafts.topicItems,
        conceptItems: drafts.conceptItems
      });
      persistDrafts(nextDrafts);
      return nextDrafts;
    },
    async publishNavigationItem(slug) {
      return updateNavigationPublication(loadDrafts, persistDrafts, slug, "published");
    },
    async moveNavigationItemToDraft(slug) {
      return updateNavigationPublication(loadDrafts, persistDrafts, slug, "draft");
    },
    async deleteNavigationItem(slug) {
      const drafts = await loadDrafts();
      const nextDrafts = createDraftsSnapshot({
        navigationItems: drafts.navigationItems.filter((item) => item.slug !== slug),
        relationItems: drafts.relationItems,
        topicItems: drafts.topicItems,
        conceptItems: drafts.conceptItems
      });
      persistDrafts(nextDrafts);
      return nextDrafts;
    },
    async saveRelationItem(item) {
      const drafts = await loadDrafts();
      const nextDrafts = createDraftsSnapshot({
        navigationItems: drafts.navigationItems,
        relationItems: upsertRelationItem(drafts.relationItems, item),
        topicItems: drafts.topicItems,
        conceptItems: drafts.conceptItems
      });
      persistDrafts(nextDrafts);
      return nextDrafts;
    },
    async deleteRelationItem(id) {
      const drafts = await loadDrafts();
      const nextDrafts = createDraftsSnapshot({
        navigationItems: drafts.navigationItems,
        relationItems: drafts.relationItems.filter((item) => item.id !== id),
        topicItems: drafts.topicItems,
        conceptItems: drafts.conceptItems
      });
      persistDrafts(nextDrafts);
      return nextDrafts;
    },
    async saveTopicItem(item) {
      const drafts = await loadDrafts();
      const nextDrafts = createDraftsSnapshot({
        navigationItems: drafts.navigationItems,
        relationItems: drafts.relationItems,
        topicItems: upsertTopicItem(drafts.topicItems, item),
        conceptItems: drafts.conceptItems
      });
      persistDrafts(nextDrafts);
      return nextDrafts;
    },
    async publishTopicItem(id) {
      return updateTopicPublication(loadDrafts, persistDrafts, id, "published");
    },
    async moveTopicItemToDraft(id) {
      return updateTopicPublication(loadDrafts, persistDrafts, id, "draft");
    },
    async deleteTopicItem(id) {
      const drafts = await loadDrafts();
      const nextDrafts = createDraftsSnapshot({
        navigationItems: drafts.navigationItems,
        relationItems: drafts.relationItems,
        topicItems: drafts.topicItems.filter((item) => item.id !== id),
        conceptItems: drafts.conceptItems
      });
      persistDrafts(nextDrafts);
      return nextDrafts;
    },
    async saveConceptItem(item) {
      const drafts = await loadDrafts();
      const nextDrafts = createDraftsSnapshot({
        navigationItems: drafts.navigationItems,
        relationItems: drafts.relationItems,
        topicItems: drafts.topicItems,
        conceptItems: upsertConceptItem(drafts.conceptItems, item)
      });
      persistDrafts(nextDrafts);
      return nextDrafts;
    },
    async publishConceptItem(id) {
      return updateConceptPublication(loadDrafts, persistDrafts, id, "published");
    },
    async moveConceptItemToDraft(id) {
      return updateConceptPublication(loadDrafts, persistDrafts, id, "draft");
    },
    async deleteConceptItem(id) {
      const drafts = await loadDrafts();
      const nextDrafts = createDraftsSnapshot({
        navigationItems: drafts.navigationItems,
        relationItems: drafts.relationItems,
        topicItems: drafts.topicItems,
        conceptItems: drafts.conceptItems.filter((item) => item.id !== id)
      });
      persistDrafts(nextDrafts);
      return nextDrafts;
    }
  };
}

export const adminMetadataService = createAdminMetadataService();

async function updateNavigationPublication(
  loadDrafts: () => Promise<AdminMetadataDrafts>,
  persistDrafts: (drafts: AdminMetadataDrafts) => void,
  slug: string,
  status: "draft" | "published"
) {
  const drafts = await loadDrafts();
  const nextDrafts = createDraftsSnapshot({
    navigationItems: drafts.navigationItems.map((item) =>
      item.slug === slug
        ? {
            ...item,
            status,
            publishedAt: status === "published" ? item.publishedAt ?? item.updatedAt : null,
            publishedSnapshot:
              status === "published"
                ? createNavigationSnapshot({
                    title: item.title,
                    categoryPath: item.categoryPath,
                    tags: item.tags.join(", "),
                    conceptCount: item.conceptCount,
                    relatedCount: item.relatedCount,
                    publishedAt: item.publishedAt ?? item.updatedAt,
                    updatedAt: item.updatedAt
                  })
                : item.publishedSnapshot
          }
        : item
    ),
    relationItems: drafts.relationItems,
    topicItems: drafts.topicItems,
    conceptItems: drafts.conceptItems
  });
  persistDrafts(nextDrafts);
  return nextDrafts;
}

async function updateTopicPublication(
  loadDrafts: () => Promise<AdminMetadataDrafts>,
  persistDrafts: (drafts: AdminMetadataDrafts) => void,
  id: string,
  status: "draft" | "published"
) {
  const drafts = await loadDrafts();
  const nextDrafts = createDraftsSnapshot({
    navigationItems: drafts.navigationItems,
    relationItems: drafts.relationItems,
    topicItems: drafts.topicItems.map((item) =>
      item.id === id
        ? {
            ...item,
            status,
            publishedAt: status === "published" ? item.publishedAt ?? drafts.updatedAt : null,
            publishedSnapshot:
              status === "published"
                ? createTopicSnapshot({
                    name: item.name,
                    description: item.description,
                    articleTitles: item.articleTitles.join(", "),
                    publishedAt: item.publishedAt ?? drafts.updatedAt
                  })
                : item.publishedSnapshot
          }
        : item
    ),
    conceptItems: drafts.conceptItems
  });
  persistDrafts(nextDrafts);
  return nextDrafts;
}

async function updateConceptPublication(
  loadDrafts: () => Promise<AdminMetadataDrafts>,
  persistDrafts: (drafts: AdminMetadataDrafts) => void,
  id: string,
  status: "draft" | "published"
) {
  const drafts = await loadDrafts();
  const nextDrafts = createDraftsSnapshot({
    navigationItems: drafts.navigationItems,
    relationItems: drafts.relationItems,
    topicItems: drafts.topicItems,
    conceptItems: drafts.conceptItems.map((item) =>
      item.id === id
        ? {
            ...item,
            status,
            publishedAt: status === "published" ? item.publishedAt ?? drafts.updatedAt : null,
            publishedSnapshot:
              status === "published"
                ? createConceptSnapshot({
                    name: item.name,
                    type: item.type,
                    articleRefs: item.articleRefs.join(", "),
                    publishedAt: item.publishedAt ?? drafts.updatedAt
                  })
                : item.publishedSnapshot
          }
        : item
    )
  });
  persistDrafts(nextDrafts);
  return nextDrafts;
}
