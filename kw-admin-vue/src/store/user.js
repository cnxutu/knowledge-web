import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    username: '',
  }),
  actions: {
    login(username, password) {
      // 模拟登录，实际可用 axios 请求后端
      if (username === 'admin' && password === '123456') {
        this.token = 'mock-token'
        this.username = username
        return true
      }
      return false
    },
    logout() {
      this.token = ''
      this.username = ''
    },
  },
})
