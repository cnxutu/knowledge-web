<template>
  <div class="page-grid">
    <AdminPageHeader
      eyebrow="Taxonomy"
      title="专题与概念管理"
      description="专题更偏一组文章的组织和学习路径，概念更偏图谱节点和术语中心。把这两层分开，后面前台的树、关联卡片和图谱都会更清晰。"
    >
      <template #actions>
        <el-space>
          <el-button :loading="topicCollection.isResetting.value || conceptCollection.isResetting.value" :disabled="topicCollection.isBusy.value || conceptCollection.isBusy.value" @click="handleReset">重置默认数据</el-button>
          <el-button plain :disabled="topicCollection.isBusy.value || conceptCollection.isBusy.value" @click="openConceptDrawer()">新建概念</el-button>
          <el-button type="primary" plain :disabled="topicCollection.isBusy.value || conceptCollection.isBusy.value" @click="openTopicDrawer()">新建专题</el-button>
        </el-space>
      </template>
    </AdminPageHeader>

    <AdminDataPanel title="草稿状态" description="当前 taxonomy 模块的本地维护状态。后续切到真实接口后，这块可以替换成发布状态、保存人和版本信息。">
      <el-space>
        <el-tag type="warning" effect="plain">最近更新：{{ lastUpdated || "未记录" }}</el-tag>
        <el-tag effect="plain">专题 {{ topics.length }}</el-tag>
        <el-tag effect="plain">概念 {{ concepts.length }}</el-tag>
      </el-space>
    </AdminDataPanel>

    <div class="page-two-column">
      <div class="page-grid">
        <AdminDataPanel title="专题列表" description="用于承载学习路径、问题域聚合和系列文章打包。">
          <el-table
            v-loading="topicCollection.isLoading.value || topicCollection.isDeleting.value"
            :data="topics"
            style="width: 100%"
            @row-click="handleSelectTopic"
          >
          <el-table-column prop="name" label="专题名称" min-width="160" />
          <el-table-column prop="description" label="说明" min-width="220" />
          <el-table-column label="状态" width="120">
            <template #default="{ row }">
              <el-tag :type="row.status === 'published' ? 'success' : 'info'" effect="plain">
                {{ row.status === "published" ? "已发布" : "草稿" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="articleCount" label="文章数" width="90" />
          <el-table-column label="覆盖文章" min-width="220">
            <template #default="{ row }">
              <el-space wrap>
                <el-tag v-for="title in row.articleTitles" :key="title" size="small" effect="plain">{{ title }}</el-tag>
              </el-space>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" :disabled="topicCollection.isBusy.value || conceptCollection.isBusy.value" @click="openTopicDrawer(row)">编辑</el-button>
              <el-button
                link
                :type="row.status === 'published' ? 'warning' : 'success'"
                :disabled="topicCollection.isBusy.value || conceptCollection.isBusy.value"
                @click="handleTopicTogglePublish(row)"
              >
                {{ row.status === "published" ? "转草稿" : "发布" }}
              </el-button>
              <el-button link type="danger" :loading="topicCollection.isDeleting.value" :disabled="topicCollection.isBusy.value || conceptCollection.isBusy.value" @click="handleTopicDelete(row)">删除</el-button>
            </template>
          </el-table-column>
          </el-table>
        </AdminDataPanel>

        <AdminDataPanel title="概念节点" description="用于知识点抽象、文章互链、图谱节点和搜索补全。">
          <el-table
            v-loading="conceptCollection.isLoading.value || conceptCollection.isDeleting.value"
            :data="concepts"
            style="width: 100%"
            @row-click="handleSelectConcept"
          >
          <el-table-column prop="name" label="概念名称" min-width="160" />
          <el-table-column prop="type" label="类型" width="100" />
          <el-table-column label="状态" width="120">
            <template #default="{ row }">
              <el-tag :type="row.status === 'published' ? 'success' : 'info'" effect="plain">
                {{ row.status === "published" ? "已发布" : "草稿" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="articleCount" label="文章数" width="90" />
          <el-table-column label="关联文章" min-width="220">
            <template #default="{ row }">
              <el-space wrap>
                <el-tag v-for="slug in row.articleRefs" :key="slug" size="small">{{ slug }}</el-tag>
              </el-space>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" :disabled="topicCollection.isBusy.value || conceptCollection.isBusy.value" @click="openConceptDrawer(row)">编辑</el-button>
              <el-button
                link
                :type="row.status === 'published' ? 'warning' : 'success'"
                :disabled="topicCollection.isBusy.value || conceptCollection.isBusy.value"
                @click="handleConceptTogglePublish(row)"
              >
                {{ row.status === "published" ? "转草稿" : "发布" }}
              </el-button>
              <el-button link type="danger" :loading="conceptCollection.isDeleting.value" :disabled="topicCollection.isBusy.value || conceptCollection.isBusy.value" @click="handleConceptDelete(row)">删除</el-button>
            </template>
          </el-table-column>
          </el-table>
        </AdminDataPanel>
      </div>

      <AdminSnapshotPanel
        v-if="selectedPreview"
        eyebrow="Published Snapshot"
        :title="selectedPreview.title"
        :description="selectedPreview.description"
        :status="selectedPreview.status"
        :published-at="selectedPreview.publishedAt"
        :draft-fields="selectedPreview.draftFields"
        :snapshot-fields="selectedPreview.snapshotFields"
        :changed-fields="selectedPreview.changedFields"
      />
    </div>

    <AdminFormDrawer
      v-model="topicDrawerOpen"
      :title="editingTopicId ? '编辑专题' : '新建专题'"
      description="专题适合承载一组文章的学习路径和问题域聚合，这里先维护最基础的名称、说明和覆盖文章。"
      :submit-text="topicCollection.isSaving.value ? '保存中...' : '保存'"
      @submit="handleTopicSubmit"
    >
      <el-form label-position="top" class="drawer-form">
        <el-form-item label="专题 ID">
          <el-input v-model="topicDraft.id" placeholder="例如：auth-architecture" :disabled="Boolean(editingTopicId) || topicCollection.isSaving.value" />
        </el-form-item>
        <el-form-item label="专题名称">
          <el-input v-model="topicDraft.name" placeholder="例如：认证鉴权" :disabled="topicCollection.isSaving.value" />
        </el-form-item>
        <el-form-item label="专题说明">
          <el-input v-model="topicDraft.description" type="textarea" :rows="4" placeholder="说明专题聚焦的问题域或学习路径。" :disabled="topicCollection.isSaving.value" />
        </el-form-item>
        <div class="drawer-grid">
          <el-form-item label="内容状态">
            <el-select v-model="topicDraft.status" :disabled="topicCollection.isSaving.value">
              <el-option label="草稿" value="draft" />
              <el-option label="已发布" value="published" />
            </el-select>
          </el-form-item>
          <el-form-item label="发布时间">
            <el-input v-model="topicDraft.publishedAt" placeholder="YYYY-MM-DD" :disabled="topicCollection.isSaving.value || topicDraft.status === 'draft'" />
          </el-form-item>
        </div>
        <el-form-item label="覆盖文章">
          <el-input v-model="topicDraft.articleTitles" placeholder="使用英文逗号分隔，例如：登录场景总览, JWT 令牌链路" :disabled="topicCollection.isSaving.value" />
        </el-form-item>
      </el-form>
    </AdminFormDrawer>

    <AdminFormDrawer
      v-model="conceptDrawerOpen"
      :title="editingConceptId ? '编辑概念' : '新建概念'"
      description="概念节点是文章互链、术语中心和未来知识图谱里的稳定节点，建议保持命名统一、引用清晰。"
      :submit-text="conceptCollection.isSaving.value ? '保存中...' : '保存'"
      @submit="handleConceptSubmit"
    >
      <el-form label-position="top" class="drawer-form">
        <el-form-item label="概念 ID">
          <el-input v-model="conceptDraft.id" placeholder="例如：redis" :disabled="Boolean(editingConceptId) || conceptCollection.isSaving.value" />
        </el-form-item>
        <el-form-item label="概念名称">
          <el-input v-model="conceptDraft.name" placeholder="例如：Redis" :disabled="conceptCollection.isSaving.value" />
        </el-form-item>
        <div class="drawer-grid">
          <el-form-item label="内容状态">
            <el-select v-model="conceptDraft.status" :disabled="conceptCollection.isSaving.value">
              <el-option label="草稿" value="draft" />
              <el-option label="已发布" value="published" />
            </el-select>
          </el-form-item>
          <el-form-item label="发布时间">
            <el-input v-model="conceptDraft.publishedAt" placeholder="YYYY-MM-DD" :disabled="conceptCollection.isSaving.value || conceptDraft.status === 'draft'" />
          </el-form-item>
        </div>
        <el-form-item label="类型">
          <el-input v-model="conceptDraft.type" placeholder="通常保持为 concept" :disabled="conceptCollection.isSaving.value" />
        </el-form-item>
        <el-form-item label="关联文章 Slug">
          <el-input v-model="conceptDraft.articleRefs" placeholder="使用英文逗号分隔，例如：security-login-overview, redis-session-strategy" :disabled="conceptCollection.isSaving.value" />
        </el-form-item>
      </el-form>
    </AdminFormDrawer>
  </div>
</template>

<script setup lang="ts">
import { AdminDataPanel, AdminFormDrawer, AdminPageHeader, AdminSnapshotPanel } from "@knowledge/ui-vue";
import { ElMessage } from "element-plus";
import type { AdminConceptItem, AdminTopicItem } from "@knowledge/shared";
import { computed, onMounted, ref } from "vue";
import {
  createConceptDraft,
  createTopicDraft,
  materializeConceptDraft,
  materializeTopicDraft,
  type ConceptDraftForm,
  type TopicDraftForm
} from "@/modules/metadata-workspace";
import { adminMetadataService } from "@/modules/admin-metadata-service";
import { useMetadataCollection } from "@/composables/use-metadata-collection";

type SnapshotField = {
  label: string;
  value: string;
};

const topicDrawerOpen = ref(false);
const conceptDrawerOpen = ref(false);
const editingTopicId = ref("");
const editingConceptId = ref("");
const selectedPreviewKind = ref<"topic" | "concept">("topic");
const selectedTopicId = ref("");
const selectedConceptId = ref("");
const topicDraft = ref<TopicDraftForm>(createTopicDraft());
const conceptDraft = ref<ConceptDraftForm>(createConceptDraft());
const topicCollection = useMetadataCollection<AdminTopicItem, string>({
  getItems: (drafts) => drafts.topicItems,
  load: () => adminMetadataService.loadWorkspace(),
  save: (item) => adminMetadataService.saveTopicItem(item),
  remove: (id) => adminMetadataService.deleteTopicItem(id),
  reset: () => adminMetadataService.resetWorkspace()
});
const conceptCollection = useMetadataCollection<AdminConceptItem, string>({
  getItems: (drafts) => drafts.conceptItems,
  load: () => adminMetadataService.loadWorkspace(),
  save: (item) => adminMetadataService.saveConceptItem(item),
  remove: (id) => adminMetadataService.deleteConceptItem(id),
  reset: () => adminMetadataService.resetWorkspace()
});
const topics = topicCollection.items;
const concepts = conceptCollection.items;
const lastUpdated = topicCollection.lastUpdated;
const selectedTopic = computed(() => topics.value.find((item) => item.id === selectedTopicId.value) ?? topics.value[0] ?? null);
const selectedConcept = computed(() => concepts.value.find((item) => item.id === selectedConceptId.value) ?? concepts.value[0] ?? null);
const selectedPreview = computed(() => {
  if (selectedPreviewKind.value === "topic" && selectedTopic.value) {
    const item = selectedTopic.value;
    const snapshot = item.publishedSnapshot;
    const changedFields: string[] = [];
    if (snapshot) {
      if (item.name !== snapshot.name) changedFields.push("专题名称");
      if (item.description !== snapshot.description) changedFields.push("专题说明");
      if (item.articleTitles.join(",") !== snapshot.articleTitles.join(",")) changedFields.push("覆盖文章");
    }
    return {
      title: item.name,
      description: item.status === "published" ? "左侧继续修改草稿，右侧固定展示已发布专题快照。" : "当前专题仍在草稿态，可以继续对照已发布快照。",
      status: item.status,
      publishedAt: item.publishedAt,
      draftFields: [
        { label: "专题名称", value: item.name },
        { label: "专题说明", value: item.description || "无" },
        { label: "覆盖文章", value: item.articleTitles.join(", ") || "无" },
        { label: "文章数量", value: String(item.articleCount) }
      ] satisfies SnapshotField[],
      snapshotFields: snapshot
        ? [
            { label: "专题名称", value: snapshot.name },
            { label: "专题说明", value: snapshot.description || "无" },
            { label: "覆盖文章", value: snapshot.articleTitles.join(", ") || "无" },
            { label: "文章数量", value: String(snapshot.articleCount) }
          ]
        : [
            { label: "专题名称", value: "未发布" },
            { label: "专题说明", value: "未发布" },
            { label: "覆盖文章", value: "未发布" },
            { label: "文章数量", value: "未发布" }
          ],
      changedFields: snapshot ? changedFields : ["尚未生成已发布快照"]
    };
  }

  if (selectedConcept.value) {
    const item = selectedConcept.value;
    const snapshot = item.publishedSnapshot;
    const changedFields: string[] = [];
    if (snapshot) {
      if (item.name !== snapshot.name) changedFields.push("概念名称");
      if (item.type !== snapshot.type) changedFields.push("类型");
      if (item.articleRefs.join(",") !== snapshot.articleRefs.join(",")) changedFields.push("关联文章");
    }
    return {
      title: item.name,
      description: item.status === "published" ? "右侧快照保持已发布版本，便于继续修订概念边界和引用范围。" : "当前概念仍在草稿态，可以继续与已发布版本对照。",
      status: item.status,
      publishedAt: item.publishedAt,
      draftFields: [
        { label: "概念名称", value: item.name },
        { label: "类型", value: item.type },
        { label: "关联文章", value: item.articleRefs.join(", ") || "无" },
        { label: "文章数量", value: String(item.articleCount) }
      ] satisfies SnapshotField[],
      snapshotFields: snapshot
        ? [
            { label: "概念名称", value: snapshot.name },
            { label: "类型", value: snapshot.type },
            { label: "关联文章", value: snapshot.articleRefs.join(", ") || "无" },
            { label: "文章数量", value: String(snapshot.articleCount) }
          ]
        : [
            { label: "概念名称", value: "未发布" },
            { label: "类型", value: "未发布" },
            { label: "关联文章", value: "未发布" },
            { label: "文章数量", value: "未发布" }
          ],
      changedFields: snapshot ? changedFields : ["尚未生成已发布快照"]
    };
  }

  return null;
});

function openTopicDrawer(item?: AdminTopicItem) {
  editingTopicId.value = item?.id ?? "";
  selectedPreviewKind.value = "topic";
  selectedTopicId.value = item?.id ?? selectedTopicId.value;
  topicDraft.value = createTopicDraft(item);
  topicDrawerOpen.value = true;
}

function openConceptDrawer(item?: AdminConceptItem) {
  editingConceptId.value = item?.id ?? "";
  selectedPreviewKind.value = "concept";
  selectedConceptId.value = item?.id ?? selectedConceptId.value;
  conceptDraft.value = createConceptDraft(item);
  conceptDrawerOpen.value = true;
}

function handleSelectTopic(item: AdminTopicItem) {
  selectedPreviewKind.value = "topic";
  selectedTopicId.value = item.id;
}

function handleSelectConcept(item: AdminConceptItem) {
  selectedPreviewKind.value = "concept";
  selectedConceptId.value = item.id;
}

async function handleTopicSubmit() {
  const item = materializeTopicDraft(topicDraft.value);
  if (!item.id || !item.name) {
    ElMessage.warning("请填写专题 ID 和名称。");
    return;
  }

  await topicCollection.saveItem(item);
  lastUpdated.value = topicCollection.lastUpdated.value;
  topicDrawerOpen.value = false;
  ElMessage.success(editingTopicId.value ? "专题已更新。" : "专题已新增。");
}

async function handleConceptSubmit() {
  const item = materializeConceptDraft(conceptDraft.value);
  if (!item.id || !item.name) {
    ElMessage.warning("请填写概念 ID 和名称。");
    return;
  }

  await conceptCollection.saveItem(item);
  lastUpdated.value = conceptCollection.lastUpdated.value;
  conceptDrawerOpen.value = false;
  ElMessage.success(editingConceptId.value ? "概念已更新。" : "概念已新增。");
}

async function handleTopicDelete(item: AdminTopicItem) {
  await topicCollection.deleteItem(item.id);
  lastUpdated.value = topicCollection.lastUpdated.value;
  ElMessage.success("专题已删除。");
}

async function handleTopicTogglePublish(item: AdminTopicItem) {
  await topicCollection.saveItem({
    ...item,
    status: item.status === "published" ? "draft" : "published",
    publishedAt: item.status === "published" ? null : ((item.publishedAt ?? lastUpdated.value) || null)
  });
  lastUpdated.value = topicCollection.lastUpdated.value;
  ElMessage.success(item.status === "published" ? "专题已切换为草稿。" : "专题已发布。");
}

async function handleConceptDelete(item: AdminConceptItem) {
  await conceptCollection.deleteItem(item.id);
  lastUpdated.value = conceptCollection.lastUpdated.value;
  ElMessage.success("概念已删除。");
}

async function handleConceptTogglePublish(item: AdminConceptItem) {
  await conceptCollection.saveItem({
    ...item,
    status: item.status === "published" ? "draft" : "published",
    publishedAt: item.status === "published" ? null : ((item.publishedAt ?? lastUpdated.value) || null)
  });
  lastUpdated.value = conceptCollection.lastUpdated.value;
  ElMessage.success(item.status === "published" ? "概念已切换为草稿。" : "概念已发布。");
}

async function handleReset() {
  await Promise.all([topicCollection.resetItems(), conceptCollection.resetItems()]);
  lastUpdated.value = topicCollection.lastUpdated.value;
  ElMessage.success("taxonomy 数据已重置为默认 mock 内容。");
}

onMounted(async () => {
  await Promise.all([topicCollection.loadItems(), conceptCollection.loadItems()]);
  lastUpdated.value = topicCollection.lastUpdated.value;
  selectedTopicId.value = topics.value[0]?.id ?? "";
  selectedConceptId.value = concepts.value[0]?.id ?? "";
});
</script>
