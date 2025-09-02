import axios from 'axios'

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000, // 请求超时时间
})

// 可以在这里添加请求拦截器和响应拦截器
// request.interceptors.request.use(...)
// request.interceptors.response.use(...)

export default request
