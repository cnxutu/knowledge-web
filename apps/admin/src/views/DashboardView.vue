<template>
  <div style="display: grid; gap: 20px">
    <AdminPageHeader
      eyebrow="Overview"
      title="知识管理控制台"
      description="后台首期聚焦知识目录、专题、概念、关系和搜索配置这几类元数据，先把内容结构稳定下来，再承接更复杂的 CMS 和搜索接入。"
    />

    <div class="stat-grid">
      <AdminStatCard label="文章数量" :value="snapshot?.articleCount ?? 0" description="当前后台维护的是知识正文入口与元数据映射。" />
      <AdminStatCard label="专题数量" :value="snapshot?.topicCount ?? 0" description="专题用于承载学习路径与问题域聚合。" />
      <AdminStatCard label="概念节点" :value="snapshot?.conceptCount ?? 0" description="概念节点将作为未来图谱的点位基础。" />
      <AdminStatCard label="关系边数" :value="snapshot?.relationCount ?? 0" description="关系边是后续知识图谱、推荐跳转和场景串联的基础。" />
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

    <AdminSection title="当前默认搜索设置" eyebrow="Search Baseline">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="Provider">{{ snapshot?.searchProvider ?? "mock" }}</el-descriptions-item>
        <el-descriptions-item label="一级导航">{{ snapshot?.navigationCount ?? 0 }}</el-descriptions-item>
      </el-descriptions>
    </AdminSection>
  </div>
</template>

<script setup lang="ts">
import { AdminPageHeader, AdminSection, AdminStatCard } from "@knowledge/ui-vue";
import { createMockAdminMetadataProvider } from "@knowledge/shared";
import { onMounted, ref } from "vue";

const snapshot = ref<Awaited<ReturnType<ReturnType<typeof createMockAdminMetadataProvider>["getSnapshot"]>>>();

onMounted(async () => {
  snapshot.value = await createMockAdminMetadataProvider().getSnapshot();
});
</script>
