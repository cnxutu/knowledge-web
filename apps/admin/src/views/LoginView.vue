<template>
  <main class="login-page">
    <section class="login-shell">
      <article class="login-intro">
        <p class="eyebrow">Knowledge Admin</p>
        <h1>Light Lab Console</h1>
        <p class="description">
          用更清爽的工程控制台方式，管理知识目录、专题结构、概念关联和发布快照。
        </p>

        <div class="intro-grid">
          <section class="intro-card">
            <p class="intro-label">Workspace</p>
            <h2>草稿与发布双轨</h2>
            <p>左侧维护当前草稿，右侧保留已发布快照，适合一边整理知识，一边做内容沉淀。</p>
          </section>

          <section class="intro-card">
            <p class="intro-label">Modules</p>
            <ul class="intro-list">
              <li>目录与导航规则</li>
              <li>专题与概念组织</li>
              <li>关系边与推荐跳转</li>
              <li>搜索配置与索引占位</li>
            </ul>
          </section>
        </div>
      </article>

      <section class="login-panel">
        <div class="panel-head">
          <p class="panel-label">Console Access</p>
          <h2>登录控制台</h2>
          <p>默认演示账号已经预填，你可以直接进入后台继续完善结构。</p>
        </div>

        <el-form class="login-form" @submit.prevent="onSubmit">
          <el-form-item>
            <el-input v-model="username" placeholder="admin" size="large" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="password" type="password" placeholder="123456" size="large" show-password />
          </el-form-item>
          <el-button class="login-button" type="primary" size="large" @click="onSubmit">进入后台工作台</el-button>
        </el-form>

        <div class="panel-foot">
          <span>默认账号：admin</span>
          <span>默认密码：123456</span>
        </div>

        <el-alert v-if="error" :title="error" type="error" show-icon :closable="false" />
      </section>
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
.login-shell {
  width: min(1120px, 100%);
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(380px, 0.85fr);
  gap: 24px;
  align-items: stretch;
}

.login-intro {
  padding: 40px 8px 28px;
  display: grid;
  align-content: center;
  gap: 18px;
}

.eyebrow {
  margin: 0;
  color: #5c7d90;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 12px;
}

h1 {
  margin: 0;
  font-size: 52px;
  line-height: 1.05;
  color: #163247;
}

.description {
  margin: 0;
  line-height: 1.7;
  color: #607b8c;
  max-width: 620px;
  font-size: 16px;
}

.intro-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.intro-card {
  padding: 20px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(171, 193, 208, 0.3);
  box-shadow: 0 14px 36px rgba(53, 87, 108, 0.08);
  backdrop-filter: blur(10px);
}

.intro-label,
.panel-label {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #6b8798;
}

.intro-card h2,
.panel-head h2 {
  margin: 10px 0 10px;
  font-size: 24px;
  color: #173347;
}

.intro-card p,
.panel-head p {
  margin: 0;
  color: #5e7788;
  line-height: 1.7;
}

.intro-list {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 10px;
  color: #49677b;
}

.login-panel {
  display: grid;
  align-content: center;
  gap: 22px;
}

.panel-head {
  display: grid;
  gap: 0;
}

.login-form {
  display: grid;
  gap: 4px;
}

.login-button {
  width: 100%;
}

.panel-foot {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 18px;
  color: #6b8596;
  font-size: 13px;
}

@media (max-width: 980px) {
  .login-shell {
    grid-template-columns: 1fr;
  }

  .login-intro {
    padding: 8px 0 0;
  }

  .intro-grid {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 42px;
  }
}
</style>
