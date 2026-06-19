<template>
  <div style="display: grid; gap: 20px">
    <div class="stat-grid">
      <AdminStatCard label="一级导航" :value="snapshot?.navigationCount ?? 0" description="当前知识树已经有稳定的主分类入口。" />
      <AdminStatCard label="专题数量" :value="snapshot?.topicCount ?? 0" description="专题用于承载学习路径与问题域聚合。" />
      <AdminStatCard label="概念节点" :value="snapshot?.conceptCount ?? 0" description="概念节点将作为未来图谱的点位基础。" />
      <AdminStatCard label="搜索提供方" :value="snapshot?.searchProvider ?? 'mock'" description="当前默认走 mock 搜索 provider，后续可切换 ES。" />
    </div>

    <div class="two-column">
      <AdminSection title="首期建设重点" eyebrow="Roadmap">
        <el-timeline>
          <el-timeline-item timestamp="阶段 1">Monorepo 骨架、共享类型、MDX 内容模型</el-timeline-item>
          <el-timeline-item timestamp="阶段 2">后台轻管理、前台多栏阅读、搜索抽象</el-timeline-item>
          <el-timeline-item timestamp="阶段 3">知识图谱视图、ES provider、移动端扩展</el-timeline-item>
        </el-timeline>
      </AdminSection>

      <AdminSection title="基架原则" eyebrow="Architecture">
        <el-space direction="vertical" fill>
          <el-alert title="共享层优先" type="success" :closable="false" />
          <el-alert title="模板沉淀先行" type="warning" :closable="false" />
          <el-alert title="内容先 MDX，后台先管元数据" type="info" :closable="false" />
        </el-space>
      </AdminSection>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AdminSection, AdminStatCard } from "@knowledge/ui-vue";
import { createMockAdminMetadataProvider } from "@knowledge/shared";
import { onMounted, ref } from "vue";

const snapshot = ref<Awaited<ReturnType<ReturnType<typeof createMockAdminMetadataProvider>["getSnapshot"]>>>();

onMounted(async () => {
  snapshot.value = await createMockAdminMetadataProvider().getSnapshot();
});
</script>

