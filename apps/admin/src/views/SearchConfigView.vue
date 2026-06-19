<template>
  <div class="page-grid">
    <AdminPageHeader
      eyebrow="Search"
      title="搜索与索引配置"
      description="页面层只依赖抽象 search provider。现在先用 mock 配置驱动，后面切成 ES 时，尽量不动页面和表单结构。"
    />

    <AdminToolbar summary="首期只维护搜索元数据与字段策略，不直接耦合具体 ES 索引实现。">
      <el-tag type="success" effect="plain">Search Provider Ready</el-tag>
    </AdminToolbar>

    <AdminDataPanel title="搜索配置草案" description="这里是后台未来接 ES 时最先稳定的一层，建议把字段、provider、highlight 策略都在这里统一收口。">
      <el-form v-if="draft" label-position="top" class="search-form">
        <el-form-item label="Provider">
          <el-radio-group v-model="draft.provider">
            <el-radio value="mock">mock</el-radio>
            <el-radio value="elasticsearch">elasticsearch</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="启用字段">
          <el-checkbox-group v-model="draft.enabledFields">
            <el-checkbox v-for="field in allFields" :key="field" :value="field">{{ field }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="高亮标签">
          <el-input v-model="draft.highlightTag" placeholder="例如 mark / em" style="max-width: 320px" />
        </el-form-item>

        <el-space>
          <el-button type="primary" @click="handleSave">保存草案</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-space>
      </el-form>
    </AdminDataPanel>
  </div>
</template>

<script setup lang="ts">
import { AdminDataPanel, AdminPageHeader, AdminToolbar } from "@knowledge/ui-vue";
import { ElMessage } from "element-plus";
import { createMockAdminMetadataProvider, type SearchIndexConfig } from "@knowledge/shared";
import { onMounted, ref } from "vue";

const allFields: SearchIndexConfig["enabledFields"] = ["title", "summary", "tags", "concepts", "body"];
const config = ref<SearchIndexConfig>();
const draft = ref<SearchIndexConfig>();

function handleSave() {
  ElMessage.success("搜索配置草案已暂存，后续可接真实 provider 持久化。");
}

function handleReset() {
  draft.value = config.value ? structuredClone(config.value) : undefined;
}

onMounted(async () => {
  config.value = await createMockAdminMetadataProvider().getSearchConfig();
  handleReset();
});
</script>
