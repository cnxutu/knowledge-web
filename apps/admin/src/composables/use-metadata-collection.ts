import { computed, ref } from "vue";
import type { AdminMetadataDrafts } from "@/modules/metadata-workspace";

interface UseMetadataCollectionOptions<TItem, TKey> {
  getItems: (drafts: AdminMetadataDrafts) => TItem[];
  load: () => Promise<AdminMetadataDrafts>;
  save: (item: TItem) => Promise<AdminMetadataDrafts>;
  remove: (key: TKey) => Promise<AdminMetadataDrafts>;
  reset: () => Promise<AdminMetadataDrafts>;
}

export function useMetadataCollection<TItem, TKey>(options: UseMetadataCollectionOptions<TItem, TKey>) {
  const items = ref<TItem[]>([]);
  const lastUpdated = ref("");
  const isLoading = ref(false);
  const isSaving = ref(false);
  const isDeleting = ref(false);
  const isResetting = ref(false);
  const isBusy = computed(() => isLoading.value || isSaving.value || isDeleting.value || isResetting.value);

  function applyDrafts(drafts: AdminMetadataDrafts) {
    items.value = options.getItems(drafts);
    lastUpdated.value = drafts.updatedAt;
    return drafts;
  }

  async function loadItems() {
    isLoading.value = true;
    try {
      return applyDrafts(await options.load());
    } finally {
      isLoading.value = false;
    }
  }

  async function saveItem(item: TItem) {
    isSaving.value = true;
    try {
      return applyDrafts(await options.save(item));
    } finally {
      isSaving.value = false;
    }
  }

  async function deleteItem(key: TKey) {
    isDeleting.value = true;
    try {
      return applyDrafts(await options.remove(key));
    } finally {
      isDeleting.value = false;
    }
  }

  async function resetItems() {
    isResetting.value = true;
    try {
      return applyDrafts(await options.reset());
    } finally {
      isResetting.value = false;
    }
  }

  return {
    items,
    lastUpdated,
    isLoading,
    isSaving,
    isDeleting,
    isResetting,
    isBusy,
    loadItems,
    saveItem,
    deleteItem,
    resetItems
  };
}
