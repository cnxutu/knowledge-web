<template>
  <section class="snapshot-card">
    <header class="snapshot-header">
      <div>
        <p v-if="eyebrow" class="snapshot-eyebrow">{{ eyebrow }}</p>
        <h3>{{ title }}</h3>
        <p v-if="description" class="snapshot-description">{{ description }}</p>
      </div>
      <el-tag :type="status === 'published' ? 'success' : 'info'" effect="plain">
        {{ status === "published" ? "已发布" : "草稿" }}
      </el-tag>
    </header>

    <div class="snapshot-meta">
      <div class="snapshot-meta-item">
        <span>发布时间</span>
        <strong>{{ publishedAt || "未发布" }}</strong>
      </div>
      <div class="snapshot-meta-item">
        <span>变化摘要</span>
        <strong>{{ changedFields.length ? `${changedFields.length} 项已修改` : "与已发布一致" }}</strong>
      </div>
    </div>

    <div v-if="changedFields.length" class="snapshot-summary">
      <el-tag v-for="field in changedFields" :key="field" size="small" effect="plain">{{ field }}</el-tag>
    </div>

    <div class="snapshot-columns">
      <section class="snapshot-column">
        <p class="snapshot-column-title">当前草稿</p>
        <dl class="snapshot-list">
          <div v-for="field in draftFields" :key="field.label" class="snapshot-row">
            <dt>{{ field.label }}</dt>
            <dd>{{ field.value }}</dd>
          </div>
        </dl>
      </section>

      <section class="snapshot-column">
        <p class="snapshot-column-title">已发布快照</p>
        <dl class="snapshot-list">
          <div v-for="field in snapshotFields" :key="field.label" class="snapshot-row">
            <dt>{{ field.label }}</dt>
            <dd>{{ field.value }}</dd>
          </div>
        </dl>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
export interface SnapshotField {
  label: string;
  value: string;
}

defineProps<{
  title: string;
  status: "draft" | "published";
  publishedAt: string | null;
  draftFields: SnapshotField[];
  snapshotFields: SnapshotField[];
  changedFields: string[];
  eyebrow?: string;
  description?: string;
}>();
</script>

<style scoped>
.snapshot-card {
  border-radius: 24px;
  padding: 22px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(244, 249, 252, 0.94) 100%);
  border: 1px solid rgba(171, 193, 208, 0.34);
  box-shadow: 0 16px 42px rgba(47, 79, 99, 0.1);
  display: grid;
  gap: 18px;
}

.snapshot-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.snapshot-eyebrow {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #5d7b8f;
}

.snapshot-header h3 {
  margin: 8px 0 0;
  font-size: 22px;
  color: #163247;
}

.snapshot-description {
  margin: 10px 0 0;
  line-height: 1.7;
  color: #5e7687;
}

.snapshot-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.snapshot-meta-item {
  padding: 14px 16px;
  border-radius: 16px;
  background: rgba(239, 246, 250, 0.86);
  border: 1px solid rgba(171, 193, 208, 0.28);
  display: grid;
  gap: 8px;
}

.snapshot-meta-item span {
  font-size: 12px;
  color: #678295;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.snapshot-meta-item strong {
  font-size: 15px;
  color: #163247;
}

.snapshot-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.snapshot-columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.snapshot-column {
  padding: 16px;
  border-radius: 18px;
  background: rgba(248, 251, 253, 0.92);
  border: 1px solid rgba(182, 201, 214, 0.32);
}

.snapshot-column-title {
  margin: 0 0 14px;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #6d8798;
}

.snapshot-list {
  display: grid;
  gap: 12px;
  margin: 0;
}

.snapshot-row {
  display: grid;
  gap: 6px;
}

.snapshot-row dt {
  font-size: 12px;
  color: #6a8294;
}

.snapshot-row dd {
  margin: 0;
  color: #1d394d;
  line-height: 1.65;
  word-break: break-word;
}
</style>
