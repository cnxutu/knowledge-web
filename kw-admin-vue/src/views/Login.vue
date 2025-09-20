<template>
  <div class="login-wrapper">
    <div class="login-card">
      <div class="logo">XUTU</div>
      <h2>知识库管理系统</h2>
      <form @submit.prevent="handleLogin">
        <input v-model="username" placeholder="用户名" />
        <input v-model="password" type="password" placeholder="密码" />
        <button type="submit">登录</button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()
const username = ref('')
const password = ref('')
const error = ref('')

const handleLogin = () => {
  const success = userStore.login(username.value, password.value)
  if (success) {
    router.push('/')
  } else {
    error.value = '用户名或密码错误'
  }
}
</script>

<style scoped>
.login-wrapper {
  width: 100vw;
  height: 100vh;
  background: url('https://images.unsplash.com/photo-1581091215362-0b8d8f0d8f16?auto=format&fit=crop&w=1950&q=80') no-repeat center center/cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  transition: transform 0.3s;
}

.login-card:hover {
  transform: translateY(-5px);
}

.logo {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #4b6cb7;
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
}

.login-card h2 {
  margin-bottom: 20px;
  color: #333;
}

input {
  width: 100%;
  padding: 12px 10px;
  margin-bottom: 15px;
  border-radius: 6px;
  border: 1px solid #ccc;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #4b6cb7;
}

button {
  width: 100%;
  padding: 12px;
  background: #4b6cb7;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
}

button:hover {
  background: #3a54a0;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
