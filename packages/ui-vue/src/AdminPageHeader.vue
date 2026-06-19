<template>
  <section class="page-header">
    <div class="page-copy">
      <p v-if="eyebrow" class="page-eyebrow">{{ eyebrow }}</p>
      <h2 class="page-title">{{ title }}</h2>
      <p v-if="description" class="page-description">{{ description }}</p>
    </div>
    <div v-if="$slots.actions" class="page-actions">
      <slot name="actions" />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  eyebrow?: string;
  description?: string;
}>();
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.page-copy {
  max-width: 760px;
}

.page-eyebrow {
  margin: 0;
  color: #5d7b8f;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

.page-title {
  margin: 8px 0 0;
  font-size: 28px;
  color: #163247;
}

.page-description {
  margin: 12px 0 0;
  color: #5e7687;
  line-height: 1.7;
}

.page-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
