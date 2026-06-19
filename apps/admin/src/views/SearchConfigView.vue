<template>
  <AdminSection title="搜索配置占位" eyebrow="Search">
    <el-descriptions :column="1" border>
      <el-descriptions-item label="Provider">{{ config?.provider }}</el-descriptions-item>
      <el-descriptions-item label="启用字段">{{ config?.enabledFields.join(", ") }}</el-descriptions-item>
      <el-descriptions-item label="高亮标签">{{ config?.highlightTag }}</el-descriptions-item>
    </el-descriptions>
  </AdminSection>
</template>

<script setup lang="ts">
import { AdminSection } from "@knowledge/ui-vue";
import { createMockSearchProvider } from "@knowledge/shared";
import { onMounted, ref } from "vue";

const config = ref<Awaited<ReturnType<ReturnType<typeof createMockSearchProvider>["getConfig"]>>>();

onMounted(async () => {
  config.value = await createMockSearchProvider().getConfig();
});
</script>

