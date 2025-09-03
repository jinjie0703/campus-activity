import axios from 'axios'

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000, // 请求超时时间
})

// 可以在这里添加请求拦截器和响应拦截器
// request.interceptors.request.use(...)
// request.interceptors.response.use(...)
// --- 核心在这里：请求拦截器 ---
request.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('token') // 从 localStorage 获取 token
    if (token) {
      // 让每个请求都携带自定义 token
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    console.log(error) // for debug
    return Promise.reject(error)
  },
)

export default request
