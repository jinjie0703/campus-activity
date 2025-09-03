<!-- 登录页面 -->
<template>
  <div class="login-container">
    <h2>校园活动平台登录</h2>
    <input v-model="username" placeholder="用户名" />
    <input v-model="password" type="password" placeholder="密码" />
    <button @click="handleLogin">登录</button>
    <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    <p class="switch-link">还没有账号？ <router-link to="/register">立即注册</router-link></p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import request from '@/utils/request'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const errorMsg = ref('')
const router = useRouter()

const handleLogin = async () => {
  try {
    errorMsg.value = ''
    const response = await request.post('/api/login', {
      username: username.value,
      password: password.value,
    })
    const { user, token } = response.data // 从响应中解构 user 和 token
    if (token) {
      // 将 token 存入 localStorage，后续请求需要用到
      localStorage.setItem('token', token)
    }

    // 将用户信息存入localStorage，简单实现会话保持
    localStorage.setItem('user', JSON.stringify(user))

    // 存储用户角色，用于显示发布活动按钮
    localStorage.setItem('userRole', user.role)

    if (user.role === 'admin') {
      router.push('/admin')
    } else {
      router.push('/activities')
    }
  } catch (error) {
    errorMsg.value = '登录失败: ' + (error.response?.data?.error || '服务器错误')
  }
}
</script>

<style scoped>
.login-container {
  max-width: 380px;
  margin: 80px auto;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  box-sizing: border-box;
}

h2 {
  color: #555;
  margin-bottom: 25px;
  font-weight: 600;
}

input {
  display: block;
  width: 100%;
  margin-bottom: 15px;
  padding: 12px 15px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 5px rgba(66, 185, 131, 0.5);
}

button {
  width: 50%;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  color: #555;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
  margin-top: 10px;
}

button:hover {
  background-color: #36a46e;
  color: #f5f5f5;
}

.error {
  color: #d9534f;
  margin-top: 15px;
  font-size: 14px;
}

.switch-link {
  margin-top: 20px;
  color: #555;
  font-size: 14px;
}

.switch-link a {
  color: #42b983;
  text-decoration: none;
  font-weight: bold;
}

.switch-link a:hover {
  text-decoration: underline;
}
</style>
