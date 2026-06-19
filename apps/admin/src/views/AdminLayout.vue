<template>
  <el-container class="admin-shell">
    <el-aside width="260px" style="background: #1f1b16; color: #f6e6c9; padding: 20px 16px">
      <div style="padding: 12px 10px 20px">
        <p style="margin: 0; color: #bda989; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase">
          Knowledge Console
        </p>
        <h2 style="margin: 10px 0 0; font-size: 28px">项目B 后台</h2>
      </div>
      <el-menu
        :default-active="activePath"
        background-color="#1f1b16"
        text-color="#f6e6c9"
        active-text-color="#f2c879"
        router
      >
        <el-menu-item index="/overview">总览</el-menu-item>
        <el-menu-item index="/navigation">目录管理</el-menu-item>
        <el-menu-item index="/relations">关系管理</el-menu-item>
        <el-menu-item index="/search">搜索配置</el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header
        style="display: flex; align-items: center; justify-content: space-between; background: transparent; padding: 20px 28px 0"
      >
        <div>
          <p style="margin: 0; font-size: 12px; color: #8b7d66; letter-spacing: 0.12em; text-transform: uppercase">
            Metadata Workspace
          </p>
          <h1 style="margin: 8px 0 0; font-size: 30px; color: #2c251a">{{ pageTitle }}</h1>
        </div>
        <div style="display: flex; align-items: center; gap: 12px">
          <el-tag type="warning" effect="dark">{{ authStore.username || "guest" }}</el-tag>
          <el-button round @click="handleLogout">退出</el-button>
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
  if (route.path.includes("relations")) return "关系边与概念";
  if (route.path.includes("search")) return "搜索与索引配置";
  return "知识台总览";
});

function handleLogout() {
  authStore.logout();
  router.push("/login");
}
</script>

