<template>
  <div>
    <h1>欢迎进入后台管理</h1>
    <p>当前用户：{{ userStore.username }}</p>
    <button @click="logout">退出登录</button>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

const logout = () => {
  userStore.logout()
  router.push('/login')
}
</script>
