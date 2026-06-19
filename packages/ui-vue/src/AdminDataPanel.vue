<template>
  <section class="panel-card">
    <header v-if="title || $slots.header" class="panel-header">
      <div>
        <h3 v-if="title">{{ title }}</h3>
        <p v-if="description">{{ description }}</p>
      </div>
      <slot name="header" />
    </header>
    <div class="panel-body">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
  description?: string;
}>();
</script>

<style scoped>
.panel-card {
  border-radius: 24px;
  padding: 22px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(244, 249, 252, 0.94) 100%);
  border: 1px solid rgba(171, 193, 208, 0.34);
  box-shadow: 0 16px 42px rgba(47, 79, 99, 0.1);
}

.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.panel-header h3 {
  margin: 0;
  font-size: 20px;
  color: #163247;
}

.panel-header p {
  margin: 8px 0 0;
  color: #5e7687;
  line-height: 1.6;
}

.panel-body {
  display: grid;
  gap: 16px;
}
</style>
