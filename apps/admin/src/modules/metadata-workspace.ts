import {
  type AdminConceptSnapshot,
  createMockAdminMetadataProvider,
  type AdminConceptItem,
  type AdminNavigationItem,
  type AdminNavigationSnapshot,
  type AdminRelationItem,
  type AdminTopicSnapshot,
  type AdminTopicItem
} from "@knowledge/shared";

const STORAGE_KEY = "knowledge-admin-metadata-workspace";

export interface AdminMetadataDrafts {
  navigationItems: AdminNavigationItem[];
  relationItems: AdminRelationItem[];
  topicItems: AdminTopicItem[];
  conceptItems: AdminConceptItem[];
  updatedAt: string;
}

export interface NavigationDraftForm {
  slug: string;
  title: string;
  categoryPath: string;
  tags: string;
  status: "draft" | "published";
  publishedAt: string | null;
  publishedSnapshot: AdminNavigationSnapshot | null;
  conceptCount: number;
  relatedCount: number;
  updatedAt: string;
}

export interface RelationDraftForm {
  id: string;
  sourceSlug: string;
  sourceTitle: string;
  target: string;
  targetLabel: string;
  relationType: AdminRelationItem["relationType"];
  label: string;
  weight: number;
}

export interface TopicDraftForm {
  id: string;
  name: string;
  description: string;
  articleTitles: string;
  status: "draft" | "published";
  publishedAt: string | null;
  publishedSnapshot: AdminTopicSnapshot | null;
}

export interface ConceptDraftForm {
  id: string;
  name: string;
  type: string;
  articleRefs: string;
  status: "draft" | "published";
  publishedAt: string | null;
  publishedSnapshot: AdminConceptSnapshot | null;
}

export async function loadDefaultAdminMetadataDrafts(): Promise<AdminMetadataDrafts> {
  const provider = createMockAdminMetadataProvider();
  return createDraftsSnapshot({
    navigationItems: await provider.listNavigationItems(),
    relationItems: await provider.listRelationItems(),
    topicItems: await provider.listTopicItems(),
    conceptItems: await provider.listConceptItems()
  });
}

export async function loadAdminMetadataDrafts(): Promise<AdminMetadataDrafts> {
  const fallback = await loadDefaultAdminMetadataDrafts();

  if (typeof window === "undefined") {
    return fallback;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<AdminMetadataDrafts>;
    return {
      navigationItems: Array.isArray(parsed.navigationItems) ? parsed.navigationItems : fallback.navigationItems,
      relationItems: Array.isArray(parsed.relationItems) ? parsed.relationItems : fallback.relationItems,
      topicItems: Array.isArray(parsed.topicItems) ? parsed.topicItems : fallback.topicItems,
      conceptItems: Array.isArray(parsed.conceptItems) ? parsed.conceptItems : fallback.conceptItems,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : fallback.updatedAt
    };
  } catch {
    return fallback;
  }
}

export function persistAdminMetadataDrafts(drafts: AdminMetadataDrafts) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

export function createDraftsSnapshot(payload: Omit<AdminMetadataDrafts, "updatedAt">): AdminMetadataDrafts {
  return {
    ...payload,
    updatedAt: formatToday()
  };
}

export function createNavigationDraft(item?: AdminNavigationItem): NavigationDraftForm {
  return {
    slug: item?.slug ?? "",
    title: item?.title ?? "",
    categoryPath: item?.categoryPath ?? "",
    tags: item?.tags.join(", ") ?? "",
    status: item?.status ?? "draft",
    publishedAt: item?.publishedAt ?? null,
    publishedSnapshot: item?.publishedSnapshot ?? null,
    conceptCount: item?.conceptCount ?? 0,
    relatedCount: item?.relatedCount ?? 0,
    updatedAt: item?.updatedAt ?? formatToday()
  };
}

export function materializeNavigationDraft(form: NavigationDraftForm): AdminNavigationItem {
  return {
    slug: form.slug.trim(),
    title: form.title.trim(),
    categoryPath: normalizeDelimitedText(form.categoryPath, "/").join(" / "),
    updatedAt: form.updatedAt.trim() || formatToday(),
    tags: normalizeDelimitedText(form.tags, ","),
    status: form.status,
    publishedAt: form.status === "published" ? form.publishedAt?.trim() || form.updatedAt.trim() || formatToday() : null,
    publishedSnapshot:
      form.status === "published"
        ? form.publishedSnapshot ?? createNavigationSnapshot(form)
        : form.publishedSnapshot ?? null,
    conceptCount: normalizeCount(form.conceptCount),
    relatedCount: normalizeCount(form.relatedCount)
  };
}

export function upsertNavigationItem(items: AdminNavigationItem[], item: AdminNavigationItem) {
  const nextItems = [...items];
  const index = nextItems.findIndex((current) => current.slug === item.slug);
  if (index >= 0) {
    nextItems[index] = item;
  } else {
    nextItems.unshift(item);
  }
  return nextItems;
}

export function createRelationDraft(item?: AdminRelationItem): RelationDraftForm {
  return {
    id: item?.id ?? "",
    sourceSlug: item?.sourceSlug ?? "",
    sourceTitle: item?.sourceTitle ?? "",
    target: item?.target ?? "",
    targetLabel: item?.targetLabel ?? "",
    relationType: item?.relationType ?? "references",
    label: item?.label ?? "",
    weight: item?.weight ?? 0.5
  };
}

export function materializeRelationDraft(form: RelationDraftForm): AdminRelationItem {
  const identifier = form.id.trim() || `${form.sourceSlug.trim() || "relation"}-${form.target.trim() || "target"}`;
  return {
    id: identifier,
    source: form.sourceSlug.trim(),
    sourceSlug: form.sourceSlug.trim(),
    sourceTitle: form.sourceTitle.trim(),
    target: form.target.trim(),
    targetLabel: form.targetLabel.trim(),
    relationType: form.relationType,
    label: form.label.trim(),
    weight: normalizeWeight(form.weight)
  };
}

export function upsertRelationItem(items: AdminRelationItem[], item: AdminRelationItem) {
  const nextItems = [...items];
  const index = nextItems.findIndex((current) => current.id === item.id);
  if (index >= 0) {
    nextItems[index] = item;
  } else {
    nextItems.unshift(item);
  }
  return nextItems;
}

export function createTopicDraft(item?: AdminTopicItem): TopicDraftForm {
  return {
    id: item?.id ?? "",
    name: item?.name ?? "",
    description: item?.description ?? "",
    articleTitles: item?.articleTitles.join(", ") ?? "",
    status: item?.status ?? "draft",
    publishedAt: item?.publishedAt ?? null,
    publishedSnapshot: item?.publishedSnapshot ?? null
  };
}

export function materializeTopicDraft(form: TopicDraftForm): AdminTopicItem {
  const articleTitles = normalizeDelimitedText(form.articleTitles, ",");
  return {
    id: form.id.trim(),
    name: form.name.trim(),
    description: form.description.trim(),
    articleTitles,
    articleCount: articleTitles.length,
    status: form.status,
    publishedAt: form.status === "published" ? form.publishedAt?.trim() || formatToday() : null,
    publishedSnapshot:
      form.status === "published"
        ? form.publishedSnapshot ?? createTopicSnapshot(form)
        : form.publishedSnapshot ?? null
  };
}

export function upsertTopicItem(items: AdminTopicItem[], item: AdminTopicItem) {
  const nextItems = [...items];
  const index = nextItems.findIndex((current) => current.id === item.id);
  if (index >= 0) {
    nextItems[index] = item;
  } else {
    nextItems.unshift(item);
  }
  return nextItems;
}

export function createConceptDraft(item?: AdminConceptItem): ConceptDraftForm {
  return {
    id: item?.id ?? "",
    name: item?.name ?? "",
    type: item?.type ?? "concept",
    articleRefs: item?.articleRefs.join(", ") ?? "",
    status: item?.status ?? "draft",
    publishedAt: item?.publishedAt ?? null,
    publishedSnapshot: item?.publishedSnapshot ?? null
  };
}

export function materializeConceptDraft(form: ConceptDraftForm): AdminConceptItem {
  const articleRefs = normalizeDelimitedText(form.articleRefs, ",");
  return {
    id: form.id.trim(),
    name: form.name.trim(),
    type: form.type.trim() || "concept",
    articleRefs,
    articleCount: articleRefs.length,
    status: form.status,
    publishedAt: form.status === "published" ? form.publishedAt?.trim() || formatToday() : null,
    publishedSnapshot:
      form.status === "published"
        ? form.publishedSnapshot ?? createConceptSnapshot(form)
        : form.publishedSnapshot ?? null
  };
}

export function upsertConceptItem(items: AdminConceptItem[], item: AdminConceptItem) {
  const nextItems = [...items];
  const index = nextItems.findIndex((current) => current.id === item.id);
  if (index >= 0) {
    nextItems[index] = item;
  } else {
    nextItems.unshift(item);
  }
  return nextItems;
}

function normalizeDelimitedText(value: string, separator: string) {
  return value
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeCount(value: number) {
  return Math.max(0, Math.round(value));
}

function normalizeWeight(value: number) {
  const normalized = Number.isFinite(value) ? value : 0;
  return Math.min(1, Math.max(0, Number(normalized.toFixed(2))));
}

export function formatToday() {
  return new Date().toISOString().slice(0, 10);
}

export function createNavigationSnapshot(
  form: Pick<NavigationDraftForm, "title" | "categoryPath" | "tags" | "conceptCount" | "relatedCount" | "publishedAt" | "updatedAt">
): AdminNavigationSnapshot {
  return {
    title: form.title.trim(),
    categoryPath: normalizeDelimitedText(form.categoryPath, "/").join(" / "),
    tags: normalizeDelimitedText(form.tags, ","),
    conceptCount: normalizeCount(form.conceptCount),
    relatedCount: normalizeCount(form.relatedCount),
    publishedAt: form.publishedAt?.trim() || form.updatedAt.trim() || formatToday()
  };
}

export function createTopicSnapshot(
  form: Pick<TopicDraftForm, "name" | "description" | "articleTitles" | "publishedAt">
): AdminTopicSnapshot {
  const articleTitles = normalizeDelimitedText(form.articleTitles, ",");
  return {
    name: form.name.trim(),
    description: form.description.trim(),
    articleTitles,
    articleCount: articleTitles.length,
    publishedAt: form.publishedAt?.trim() || formatToday()
  };
}

export function createConceptSnapshot(
  form: Pick<ConceptDraftForm, "name" | "type" | "articleRefs" | "publishedAt">
): AdminConceptSnapshot {
  const articleRefs = normalizeDelimitedText(form.articleRefs, ",");
  return {
    name: form.name.trim(),
    type: form.type.trim() || "concept",
    articleRefs,
    articleCount: articleRefs.length,
    publishedAt: form.publishedAt?.trim() || formatToday()
  };
}
