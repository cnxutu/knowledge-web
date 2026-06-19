<template>
  <AdminSection title="目录与文章导航" eyebrow="Navigation">
    <el-table :data="rows" style="width: 100%">
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="path" label="分类路径" />
      <el-table-column prop="slug" label="Slug" />
      <el-table-column prop="updatedAt" label="更新时间" />
    </el-table>
  </AdminSection>
</template>

<script setup lang="ts">
import { AdminSection } from "@knowledge/ui-vue";
import { createMockContentProvider } from "@knowledge/shared";
import { onMounted, ref } from "vue";

interface RowItem {
  title: string;
  path: string;
  slug: string;
  updatedAt: string;
}

const rows = ref<RowItem[]>([]);

onMounted(async () => {
  const articles = await createMockContentProvider().listArticles();
  rows.value = articles.map((article) => ({
    title: article.meta.title,
    path: article.meta.categoryPath.join(" / "),
    slug: article.meta.slug,
    updatedAt: article.meta.updatedAt
  }));
});
</script>

