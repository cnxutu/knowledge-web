<template>
  <section class="section-card">
    <header class="section-header">
      <div>
        <p class="section-eyebrow">{{ eyebrow }}</p>
        <h2>{{ title }}</h2>
      </div>
      <slot name="actions" />
    </header>
    <div class="section-body">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  eyebrow?: string;
}>();
</script>

<style scoped>
.section-card {
  border-radius: 20px;
  padding: 20px;
  background: linear-gradient(180deg, #ffffff 0%, #fbf6ee 100%);
  border: 1px solid #e5d8c5;
  box-shadow: 0 12px 24px rgba(91, 70, 34, 0.08);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.section-header h2 {
  margin: 6px 0 0;
  font-size: 22px;
  color: #2d261d;
}

.section-eyebrow {
  margin: 0;
  color: #8d7755;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

.section-body {
  display: grid;
  gap: 16px;
}
</style>

