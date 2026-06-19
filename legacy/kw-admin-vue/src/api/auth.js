import axios from 'axios'

const request = axios.create({
  baseURL: 'http://localhost:8080', // 你的后端地址
  timeout: 5000,
})

// 登录接口
export function loginApi(data) {
  return request.post('/api/login', data).then(res => res.data)
}
