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
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(238, 246, 250, 0.9) 100%);
  border: 1px solid rgba(171, 193, 208, 0.32);
  box-shadow: 0 12px 26px rgba(49, 86, 109, 0.08);
}

.stat-label {
  font-size: 12px;
  color: #6a8395;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.stat-value {
  margin-top: 10px;
  font-size: 32px;
  font-weight: 700;
  color: #163247;
}

.stat-description {
  margin: 10px 0 0;
  color: #5f7787;
  line-height: 1.5;
}
</style>
