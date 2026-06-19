<template>
  <div class="page-grid">
    <AdminPageHeader
      eyebrow="Navigation"
      title="目录与文章导航"
      description="这里先管理知识库的入口组织方式。正文仍然由 MDX 承载，后台重点维护分类路径、标签密度和相关推荐这些可扩展元数据。"
    >
      <template #actions>
        <el-space>
          <el-button :loading="navigationCollection.isResetting.value" :disabled="navigationCollection.isBusy.value" @click="handleReset">重置默认数据</el-button>
          <el-button type="primary" plain :disabled="navigationCollection.isBusy.value" @click="openCreateDrawer">新建导航规则</el-button>
        </el-space>
      </template>
    </AdminPageHeader>

    <AdminToolbar :summary="`共 ${filteredRows.length} 篇文章，覆盖 ${rows.length ? uniqueCategories : 0} 条分类路径`">
      <el-input v-model="keyword" clearable placeholder="按标题 / slug 搜索" style="width: 260px" :disabled="navigationCollection.isLoading.value" />
      <el-select v-model="selectedTag" clearable placeholder="标签筛选" style="width: 180px" :disabled="navigationCollection.isLoading.value">
        <el-option v-for="tag in allTags" :key="tag" :label="tag" :value="tag" />
      </el-select>
      <template #actions>
        <span class="toolbar-meta">最近更新：{{ lastUpdated || "未记录" }}</span>
        <el-tag type="warning" effect="plain">内容源：MDX + 元数据</el-tag>
      </template>
    </AdminToolbar>

    <div class="page-two-column">
      <div class="page-grid">
        <AdminDataPanel title="文章导航列表" description="后续这里可以继续接目录排序、专题挂载、草稿状态和推荐位配置。">
          <el-table
            v-loading="navigationCollection.isLoading.value || navigationCollection.isDeleting.value"
            :data="filteredRows"
            style="width: 100%"
            @row-click="handleSelectRow"
          >
          <el-table-column prop="title" label="标题" min-width="180" />
          <el-table-column prop="categoryPath" label="分类路径" min-width="220" />
          <el-table-column prop="slug" label="Slug" min-width="180" />
          <el-table-column label="标签" min-width="180">
            <template #default="{ row }">
              <el-space wrap>
                <el-tag v-for="tag in row.tags" :key="tag" size="small" effect="plain">{{ tag }}</el-tag>
              </el-space>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="120">
            <template #default="{ row }">
              <el-tag :type="row.status === 'published' ? 'success' : 'info'" effect="plain">
                {{ row.status === "published" ? "已发布" : "草稿" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="conceptCount" label="概念数" width="90" />
          <el-table-column prop="relatedCount" label="关联文" width="90" />
          <el-table-column prop="updatedAt" label="更新时间" width="120" />
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" :disabled="navigationCollection.isBusy.value" @click="openEditDrawer(row)">编辑</el-button>
              <el-button
                link
                :type="row.status === 'published' ? 'warning' : 'success'"
                :disabled="navigationCollection.isBusy.value"
                @click="handleTogglePublish(row)"
              >
                {{ row.status === "published" ? "转草稿" : "发布" }}
              </el-button>
              <el-button link type="danger" :loading="navigationCollection.isDeleting.value" :disabled="navigationCollection.isBusy.value" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
          </el-table>
        </AdminDataPanel>

        <AdminDataPanel title="当前规则建议" description="适合先沉淀一套后台可执行的管理规则，避免后面文章越来越多时再返工。">
          <el-space direction="vertical" fill>
            <el-alert title="分类路径建议控制在 3 到 4 层，保证树结构清晰。" type="success" :closable="false" />
            <el-alert title="标签面向检索，概念面向图谱，不建议混着用。" type="warning" :closable="false" />
            <el-alert title="相关推荐优先承载问题链路，不只是同类文章跳转。" type="info" :closable="false" />
          </el-space>
        </AdminDataPanel>
      </div>

      <AdminSnapshotPanel
        v-if="selectedRow"
        eyebrow="Published Snapshot"
        :title="selectedRow.title"
        :description="selectedRow.status === 'published' ? '右侧保持已发布快照，左侧继续承载当前草稿修改。' : '当前内容仍是草稿，但如果已有发布快照，仍会在这里保留对照。'"
        :status="selectedRow.status"
        :published-at="selectedRow.publishedAt"
        :draft-fields="draftSnapshotFields"
        :snapshot-fields="publishedSnapshotFields"
        :changed-fields="changedFields"
      />
    </div>

    <AdminFormDrawer
      v-model="drawerOpen"
      :title="editingSlug ? '编辑导航规则' : '新建导航规则'"
      description="这里先维护知识目录的基础元数据。后续如果接真实后台接口，这个抽屉表单可以直接复用为模块模板。"
      :submit-text="navigationCollection.isSaving.value ? '保存中...' : '保存'"
      @submit="handleSubmit"
    >
      <el-form label-position="top" class="drawer-form">
        <el-form-item label="文章标题">
          <el-input v-model="draft.title" placeholder="例如：登录场景总览" :disabled="navigationCollection.isSaving.value" />
        </el-form-item>
        <el-form-item label="Slug">
          <el-input v-model="draft.slug" placeholder="例如：security-login-overview" :disabled="Boolean(editingSlug) || navigationCollection.isSaving.value" />
        </el-form-item>
        <el-form-item label="分类路径">
          <el-input v-model="draft.categoryPath" placeholder="使用 / 分隔，例如：架构设计 / 认证鉴权 / 登录体系" :disabled="navigationCollection.isSaving.value" />
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="draft.tags" placeholder="使用英文逗号分隔，例如：login, security, auth" :disabled="navigationCollection.isSaving.value" />
        </el-form-item>
        <div class="drawer-grid">
          <el-form-item label="内容状态">
            <el-select v-model="draft.status" :disabled="navigationCollection.isSaving.value">
              <el-option label="草稿" value="draft" />
              <el-option label="已发布" value="published" />
            </el-select>
          </el-form-item>
          <el-form-item label="发布时间">
            <el-input v-model="draft.publishedAt" placeholder="YYYY-MM-DD" :disabled="navigationCollection.isSaving.value || draft.status === 'draft'" />
          </el-form-item>
        </div>
        <div class="drawer-grid">
          <el-form-item label="概念数">
            <el-input-number v-model="draft.conceptCount" :min="0" :max="99" :disabled="navigationCollection.isSaving.value" />
          </el-form-item>
          <el-form-item label="关联文章数">
            <el-input-number v-model="draft.relatedCount" :min="0" :max="99" :disabled="navigationCollection.isSaving.value" />
          </el-form-item>
        </div>
        <el-form-item label="更新时间">
          <el-input v-model="draft.updatedAt" placeholder="YYYY-MM-DD" :disabled="navigationCollection.isSaving.value" />
        </el-form-item>
      </el-form>
    </AdminFormDrawer>
  </div>
</template>

<script setup lang="ts">
import { AdminDataPanel, AdminFormDrawer, AdminPageHeader, AdminSnapshotPanel, AdminToolbar } from "@knowledge/ui-vue";
import { ElMessage } from "element-plus";
import type { AdminNavigationItem } from "@knowledge/shared";
import { computed, onMounted, ref } from "vue";
import {
  createNavigationDraft,
  materializeNavigationDraft,
  type NavigationDraftForm
} from "@/modules/metadata-workspace";
import { adminMetadataService } from "@/modules/admin-metadata-service";
import { useMetadataCollection } from "@/composables/use-metadata-collection";

type SnapshotField = {
  label: string;
  value: string;
};

const keyword = ref("");
const selectedTag = ref("");
const selectedSlug = ref("");
const drawerOpen = ref(false);
const editingSlug = ref("");
const draft = ref<NavigationDraftForm>(createNavigationDraft());
const navigationCollection = useMetadataCollection<AdminNavigationItem, string>({
  getItems: (drafts) => drafts.navigationItems,
  load: () => adminMetadataService.loadWorkspace(),
  save: (item) => adminMetadataService.saveNavigationItem(item),
  remove: (slug) => adminMetadataService.deleteNavigationItem(slug),
  reset: () => adminMetadataService.resetWorkspace()
});
const rows = navigationCollection.items;
const lastUpdated = navigationCollection.lastUpdated;

const filteredRows = computed(() =>
  rows.value.filter((row) => {
    const matchedKeyword =
      !keyword.value ||
      row.title.toLowerCase().includes(keyword.value.toLowerCase()) ||
      row.slug.toLowerCase().includes(keyword.value.toLowerCase());
    const matchedTag = !selectedTag.value || row.tags.includes(selectedTag.value);
    return matchedKeyword && matchedTag;
  })
);

const allTags = computed(() =>
  Array.from(new Set(rows.value.flatMap((row) => row.tags))).sort((left, right) => left.localeCompare(right))
);

const uniqueCategories = computed(() => new Set(rows.value.map((row) => row.categoryPath)).size);
const selectedRow = computed(() => rows.value.find((row) => row.slug === selectedSlug.value) ?? rows.value[0] ?? null);
const draftSnapshotFields = computed<SnapshotField[]>(() => {
  if (!selectedRow.value) return [];
  return [
    { label: "标题", value: selectedRow.value.title },
    { label: "分类路径", value: selectedRow.value.categoryPath },
    { label: "标签", value: selectedRow.value.tags.join(", ") || "无" },
    { label: "概念 / 关联", value: `${selectedRow.value.conceptCount} / ${selectedRow.value.relatedCount}` }
  ];
});
const publishedSnapshotFields = computed<SnapshotField[]>(() => {
  if (!selectedRow.value?.publishedSnapshot) {
    return [
      { label: "标题", value: "未发布" },
      { label: "分类路径", value: "未发布" },
      { label: "标签", value: "未发布" },
      { label: "概念 / 关联", value: "未发布" }
    ];
  }
  return [
    { label: "标题", value: selectedRow.value.publishedSnapshot.title },
    { label: "分类路径", value: selectedRow.value.publishedSnapshot.categoryPath },
    { label: "标签", value: selectedRow.value.publishedSnapshot.tags.join(", ") || "无" },
    {
      label: "概念 / 关联",
      value: `${selectedRow.value.publishedSnapshot.conceptCount} / ${selectedRow.value.publishedSnapshot.relatedCount}`
    }
  ];
});
const changedFields = computed(() => {
  if (!selectedRow.value?.publishedSnapshot) return ["尚未生成已发布快照"];
  const changes: string[] = [];
  if (selectedRow.value.title !== selectedRow.value.publishedSnapshot.title) changes.push("标题");
  if (selectedRow.value.categoryPath !== selectedRow.value.publishedSnapshot.categoryPath) changes.push("分类路径");
  if (selectedRow.value.tags.join(",") !== selectedRow.value.publishedSnapshot.tags.join(",")) changes.push("标签");
  if (selectedRow.value.conceptCount !== selectedRow.value.publishedSnapshot.conceptCount) changes.push("概念数");
  if (selectedRow.value.relatedCount !== selectedRow.value.publishedSnapshot.relatedCount) changes.push("关联文章数");
  return changes;
});

function openCreateDrawer() {
  editingSlug.value = "";
  draft.value = createNavigationDraft();
  drawerOpen.value = true;
}

function openEditDrawer(item: AdminNavigationItem) {
  editingSlug.value = item.slug;
  selectedSlug.value = item.slug;
  draft.value = createNavigationDraft(item);
  drawerOpen.value = true;
}

function handleSelectRow(item: AdminNavigationItem) {
  selectedSlug.value = item.slug;
}

async function handleSubmit() {
  const item = materializeNavigationDraft(draft.value);
  if (!item.slug || !item.title || !item.categoryPath) {
    ElMessage.warning("请至少填写标题、Slug 和分类路径。");
    return;
  }

  await navigationCollection.saveItem(item);
  drawerOpen.value = false;
  ElMessage.success(editingSlug.value ? "导航规则已更新。" : "导航规则已新增。");
}

async function handleDelete(item: AdminNavigationItem) {
  await navigationCollection.deleteItem(item.slug);
  if (selectedSlug.value === item.slug) {
    selectedSlug.value = rows.value[0]?.slug ?? "";
  }
  ElMessage.success("导航规则已删除。");
}

async function handleTogglePublish(item: AdminNavigationItem) {
  if (item.status === "published") {
    await navigationCollection.saveItem({ ...item, status: "draft", publishedAt: null });
    ElMessage.success("导航规则已切换为草稿。");
    return;
  }
  await navigationCollection.saveItem({ ...item, status: "published", publishedAt: item.publishedAt ?? item.updatedAt });
  ElMessage.success("导航规则已发布。");
}

async function handleReset() {
  await navigationCollection.resetItems();
  ElMessage.success("导航数据已重置为默认 mock 内容。");
}

onMounted(async () => {
  await navigationCollection.loadItems();
  selectedSlug.value = rows.value[0]?.slug ?? "";
});
</script>
