<template>
  <el-drawer
    :model-value="modelValue"
    :title="title"
    size="520px"
    destroy-on-close
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="drawer-body">
      <p v-if="description" class="drawer-description">{{ description }}</p>
      <slot />
    </div>

    <template #footer>
      <div class="drawer-footer">
        <slot name="footer">
          <el-button @click="emit('update:modelValue', false)">{{ cancelText }}</el-button>
          <el-button type="primary" @click="emit('submit')">{{ submitText }}</el-button>
        </slot>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (event: "update:modelValue", value: boolean): void;
  (event: "submit"): void;
}>();

withDefaults(
  defineProps<{
    modelValue: boolean;
    title: string;
    description?: string;
    submitText?: string;
    cancelText?: string;
  }>(),
  {
    description: "",
    submitText: "保存",
    cancelText: "取消"
  }
);
</script>

<style scoped>
.drawer-body {
  display: grid;
  gap: 16px;
}

.drawer-description {
  margin: 0;
  color: #5e7687;
  line-height: 1.7;
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
