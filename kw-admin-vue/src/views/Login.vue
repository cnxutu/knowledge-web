<template>
  <div class="login">
    <h2>后台管理登录</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="username" placeholder="用户名" />
      <input v-model="password" type="password" placeholder="密码" />
      <button type="submit">登录</button>
    </form>
    <p v-if="error" style="color:red">{{ error }}</p>
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

<style>
.login {
  max-width: 300px;
  margin: 100px auto;
  display: flex;
  flex-direction: column;
}
input {
  margin-bottom: 10px;
  padding: 5px;
}
button {
  padding: 5px;
}
</style>
