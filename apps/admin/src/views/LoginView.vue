<template>
  <main class="login-page">
    <section class="login-panel">
      <p class="eyebrow">Knowledge Admin</p>
      <h1>个人知识库后台</h1>
      <p class="description">
        首期后台以管理导航、概念关系、专题组织和搜索配置为主，不做重 CMS。
      </p>
      <el-form @submit.prevent="onSubmit">
        <el-form-item>
          <el-input v-model="username" placeholder="admin" size="large" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="password" type="password" placeholder="123456" size="large" show-password />
        </el-form-item>
        <el-button type="warning" size="large" style="width: 100%" @click="onSubmit">登录控制台</el-button>
      </el-form>
      <el-alert v-if="error" :title="error" type="error" show-icon :closable="false" style="margin-top: 16px" />
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";

const router = useRouter();
const authStore = useAuthStore();
const username = ref("admin");
const password = ref("123456");
const error = ref("");

function onSubmit() {
  const success = authStore.login(username.value, password.value);
  if (success) {
    router.push("/overview");
    return;
  }
  error.value = "用户名或密码错误";
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    radial-gradient(circle at top right, rgba(244, 210, 147, 0.5), transparent 30%),
    linear-gradient(135deg, #1f1a16 0%, #5d4630 100%);
}

.login-panel {
  width: min(480px, 100%);
  padding: 36px;
  border-radius: 28px;
  background: rgba(255, 249, 238, 0.96);
  box-shadow: 0 22px 40px rgba(17, 13, 9, 0.28);
}

.eyebrow {
  margin: 0;
  color: #95774f;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 12px;
}

h1 {
  margin: 10px 0 12px;
  font-size: 34px;
  color: #241d14;
}

.description {
  margin: 0 0 24px;
  line-height: 1.7;
  color: #5f5548;
}
</style>

