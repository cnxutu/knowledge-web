<template>
  <AdminSection title="概念关系与推荐跳转" eyebrow="Relations">
    <el-table :data="rows" style="width: 100%">
      <el-table-column prop="source" label="来源文章" />
      <el-table-column prop="target" label="目标节点" />
      <el-table-column prop="relationType" label="关系类型" />
      <el-table-column prop="label" label="说明" />
      <el-table-column prop="weight" label="权重" />
    </el-table>
  </AdminSection>
</template>

<script setup lang="ts">
import { AdminSection } from "@knowledge/ui-vue";
import { createMockContentProvider } from "@knowledge/shared";
import { onMounted, ref } from "vue";

const rows = ref<Array<{ source: string; target: string; relationType: string; label: string; weight: number }>>([]);

onMounted(async () => {
  const articles = await createMockContentProvider().listArticles();
  rows.value = articles.flatMap((article) => article.graph.edges);
});
</script>

