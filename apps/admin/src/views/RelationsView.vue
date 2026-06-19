<template>
  <div class="page-grid">
    <AdminPageHeader
      eyebrow="Relations"
      title="关系边与推荐跳转"
      description="这部分决定文章怎么串成学习路径。首期先把关系类型、来源目标和推荐强度收口，后面才能自然演进到图谱视图。"
    >
      <template #actions>
        <el-space>
          <el-button :loading="relationCollection.isResetting.value" :disabled="relationCollection.isBusy.value" @click="handleReset">重置默认数据</el-button>
          <el-button type="primary" plain :disabled="relationCollection.isBusy.value" @click="openCreateDrawer">新增关系规则</el-button>
        </el-space>
      </template>
    </AdminPageHeader>

    <AdminToolbar :summary="`当前 ${filteredRows.length} 条关系边，已覆盖 ${relationTypes.length} 种关系类型`">
      <el-input v-model="keyword" clearable placeholder="按来源 / 目标 / 说明搜索" style="width: 280px" :disabled="relationCollection.isLoading.value" />
      <el-select v-model="selectedType" clearable placeholder="关系类型" style="width: 180px" :disabled="relationCollection.isLoading.value">
        <el-option v-for="relationType in relationTypes" :key="relationType" :label="relationType" :value="relationType" />
      </el-select>
      <template #actions>
        <span class="toolbar-meta">最近更新：{{ lastUpdated || "未记录" }}</span>
        <el-tag type="info" effect="plain">后续可升级为 React Flow 图谱</el-tag>
      </template>
    </AdminToolbar>

    <AdminDataPanel title="关系边列表" description="这里优先沉淀几种稳定的边类型：引用、前置、延伸、问题方案、同类比较。">
      <el-table v-loading="relationCollection.isLoading.value || relationCollection.isDeleting.value" :data="filteredRows" style="width: 100%">
        <el-table-column prop="sourceTitle" label="来源文章" min-width="180" />
        <el-table-column prop="targetLabel" label="目标节点" min-width="180" />
        <el-table-column prop="relationType" label="关系类型" width="120" />
        <el-table-column prop="label" label="说明" min-width="120" />
        <el-table-column prop="weight" label="权重" width="90" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" :disabled="relationCollection.isBusy.value" @click="openEditDrawer(row)">编辑</el-button>
            <el-button link type="danger" :loading="relationCollection.isDeleting.value" :disabled="relationCollection.isBusy.value" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </AdminDataPanel>

    <AdminFormDrawer
      v-model="drawerOpen"
      :title="editingId ? '编辑关系规则' : '新增关系规则'"
      description="推荐关系、前置关系和问题方案关系都建议走同一套表单结构，方便后续切到真实接口后继续复用。"
      :submit-text="relationCollection.isSaving.value ? '保存中...' : '保存'"
      @submit="handleSubmit"
    >
      <el-form label-position="top" class="drawer-form">
        <el-form-item label="来源文章 Slug">
          <el-input v-model="draft.sourceSlug" placeholder="例如：security-login-overview" :disabled="relationCollection.isSaving.value" />
        </el-form-item>
        <el-form-item label="来源文章标题">
          <el-input v-model="draft.sourceTitle" placeholder="例如：登录场景总览" :disabled="relationCollection.isSaving.value" />
        </el-form-item>
        <div class="drawer-grid">
          <el-form-item label="目标节点 ID">
            <el-input v-model="draft.target" placeholder="例如：jwt-token-flow" :disabled="relationCollection.isSaving.value" />
          </el-form-item>
          <el-form-item label="目标节点显示名">
            <el-input v-model="draft.targetLabel" placeholder="例如：JWT 令牌链路" :disabled="relationCollection.isSaving.value" />
          </el-form-item>
        </div>
        <div class="drawer-grid">
          <el-form-item label="关系类型">
            <el-select v-model="draft.relationType" :disabled="relationCollection.isSaving.value">
              <el-option label="references" value="references" />
              <el-option label="extends" value="extends" />
              <el-option label="prerequisite" value="prerequisite" />
              <el-option label="solution" value="solution" />
              <el-option label="compare" value="compare" />
            </el-select>
          </el-form-item>
          <el-form-item label="权重">
            <el-input-number v-model="draft.weight" :min="0" :max="1" :step="0.1" :disabled="relationCollection.isSaving.value" />
          </el-form-item>
        </div>
        <el-form-item label="说明">
          <el-input v-model="draft.label" placeholder="例如：延伸阅读 / 会话方案 / 核心框架" :disabled="relationCollection.isSaving.value" />
        </el-form-item>
      </el-form>
    </AdminFormDrawer>
  </div>
</template>

<script setup lang="ts">
import { AdminDataPanel, AdminFormDrawer, AdminPageHeader, AdminToolbar } from "@knowledge/ui-vue";
import { ElMessage } from "element-plus";
import type { AdminRelationItem } from "@knowledge/shared";
import { computed, onMounted, ref } from "vue";
import {
  createRelationDraft,
  materializeRelationDraft,
  type RelationDraftForm
} from "@/modules/metadata-workspace";
import { adminMetadataService } from "@/modules/admin-metadata-service";
import { useMetadataCollection } from "@/composables/use-metadata-collection";

const keyword = ref("");
const selectedType = ref("");
const drawerOpen = ref(false);
const editingId = ref("");
const draft = ref<RelationDraftForm>(createRelationDraft());
const relationCollection = useMetadataCollection<AdminRelationItem, string>({
  getItems: (drafts) => drafts.relationItems,
  load: () => adminMetadataService.loadWorkspace(),
  save: (item) => adminMetadataService.saveRelationItem(item),
  remove: (id) => adminMetadataService.deleteRelationItem(id),
  reset: () => adminMetadataService.resetWorkspace()
});
const rows = relationCollection.items;
const lastUpdated = relationCollection.lastUpdated;

const filteredRows = computed(() =>
  rows.value.filter((row) => {
    const text = `${row.sourceTitle} ${row.targetLabel} ${row.label}`.toLowerCase();
    const matchedKeyword = !keyword.value || text.includes(keyword.value.toLowerCase());
    const matchedType = !selectedType.value || row.relationType === selectedType.value;
    return matchedKeyword && matchedType;
  })
);

const relationTypes = computed(() =>
  Array.from(new Set(rows.value.map((row) => row.relationType))).sort((left, right) => left.localeCompare(right))
);

function openCreateDrawer() {
  editingId.value = "";
  draft.value = createRelationDraft();
  drawerOpen.value = true;
}

function openEditDrawer(item: AdminRelationItem) {
  editingId.value = item.id;
  draft.value = createRelationDraft(item);
  drawerOpen.value = true;
}

async function handleSubmit() {
  const item = materializeRelationDraft(draft.value);
  if (!item.sourceSlug || !item.sourceTitle || !item.target || !item.targetLabel) {
    ElMessage.warning("请填写来源、目标和显示名称。");
    return;
  }

  await relationCollection.saveItem(item);
  drawerOpen.value = false;
  ElMessage.success(editingId.value ? "关系规则已更新。" : "关系规则已新增。");
}

async function handleDelete(item: AdminRelationItem) {
  await relationCollection.deleteItem(item.id);
  ElMessage.success("关系规则已删除。");
}

async function handleReset() {
  await relationCollection.resetItems();
  ElMessage.success("关系数据已重置为默认 mock 内容。");
}

onMounted(async () => {
  await relationCollection.loadItems();
});
</script>
