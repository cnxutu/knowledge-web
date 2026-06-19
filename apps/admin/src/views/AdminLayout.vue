<template>
  <el-container class="admin-shell">
    <el-aside width="272px" class="admin-aside">
      <div class="admin-brand">
        <p class="admin-brand-eyebrow">
          Knowledge Console
        </p>
        <h2>项目B 后台</h2>
        <p class="admin-brand-copy">Light Lab Console for knowledge mapping, structure drafting and publication control.</p>
      </div>
      <el-menu
        class="admin-menu"
        :default-active="activePath"
        router
      >
        <el-menu-item index="/overview">总览</el-menu-item>
        <el-menu-item index="/navigation">目录管理</el-menu-item>
        <el-menu-item index="/taxonomy">专题与概念</el-menu-item>
        <el-menu-item index="/relations">关系管理</el-menu-item>
        <el-menu-item index="/search">搜索配置</el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="admin-header">
        <div>
          <p class="admin-header-eyebrow">
            Metadata Workspace
          </p>
          <h1>{{ pageTitle }}</h1>
        </div>
        <div class="admin-header-actions">
          <el-tag type="info" effect="plain">{{ authStore.username || "guest" }}</el-tag>
          <el-button round plain @click="handleLogout">退出</el-button>
        </div>
      </el-header>
      <el-main class="admin-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const activePath = computed(() => route.path);
const pageTitle = computed(() => {
  if (route.path.includes("navigation")) return "知识目录与专题";
  if (route.path.includes("taxonomy")) return "专题、标签与概念";
  if (route.path.includes("relations")) return "关系边与概念";
  if (route.path.includes("search")) return "搜索与索引配置";
  return "知识台总览";
});

function handleLogout() {
  authStore.logout();
  router.push("/login");
}
</script>

<style scoped>
.admin-aside {
  padding: 22px 18px;
  background:
    linear-gradient(180deg, rgba(243, 249, 252, 0.98) 0%, rgba(232, 242, 248, 0.96) 100%);
  border-right: 1px solid rgba(171, 193, 208, 0.32);
}

.admin-brand {
  padding: 14px 12px 22px;
}

.admin-brand-eyebrow {
  margin: 0;
  color: #5b7b8f;
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.admin-brand h2 {
  margin: 12px 0 8px;
  font-size: 30px;
  color: #163247;
}

.admin-brand-copy {
  margin: 0;
  color: #627b8c;
  line-height: 1.7;
  font-size: 13px;
}

.admin-menu {
  border-right: none;
  background: transparent;
  --el-menu-bg-color: transparent;
  --el-menu-text-color: #37576d;
  --el-menu-hover-bg-color: rgba(205, 227, 237, 0.52);
  --el-menu-active-color: #0d7b7d;
}

.admin-menu :deep(.el-menu-item) {
  margin-bottom: 8px;
  border-radius: 14px;
}

.admin-menu :deep(.el-menu-item.is-active) {
  background: linear-gradient(90deg, rgba(202, 241, 232, 0.82) 0%, rgba(225, 244, 250, 0.92) 100%);
  box-shadow: inset 0 0 0 1px rgba(96, 168, 164, 0.22);
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 22px 28px 0;
  padding: 20px 24px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(171, 193, 208, 0.3);
  box-shadow: 0 16px 36px rgba(47, 79, 99, 0.08);
}

.admin-header-eyebrow {
  margin: 0;
  font-size: 12px;
  color: #607d90;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.admin-header h1 {
  margin: 8px 0 0;
  font-size: 32px;
  color: #163247;
}

.admin-header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
