<template>
  <div class="toolbar-card">
    <div class="toolbar-left">
      <slot />
    </div>
    <div class="toolbar-right">
      <span v-if="summary" class="toolbar-summary">{{ summary }}</span>
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  summary?: string;
}>();
</script>

<style scoped>
.toolbar-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(245, 250, 253, 0.94);
  border: 1px solid rgba(171, 193, 208, 0.32);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.toolbar-summary {
  color: #647f90;
  font-size: 13px;
}
</style>
