<template>
  <article class="stat-card">
    <div class="stat-label">{{ label }}</div>
    <div class="stat-value">{{ value }}</div>
    <p class="stat-description">{{ description }}</p>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: string | number;
  description: string;
}>();
</script>

<style scoped>
.stat-card {
  padding: 18px;
  border-radius: 18px;
  background: #f3ead8;
  border: 1px solid #e0d0b2;
}

.stat-label {
  font-size: 12px;
  color: #8b7959;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.stat-value {
  margin-top: 10px;
  font-size: 32px;
  font-weight: 700;
  color: #292319;
}

.stat-description {
  margin: 10px 0 0;
  color: #655949;
  line-height: 1.5;
}
</style>

