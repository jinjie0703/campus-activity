<!-- 注册页面 -->
<template>
  <div class="form-container">
    <h2>注册新账号</h2>
    <input v-model="username" placeholder="用户名 (至少4位)" />
    <input v-model="fullName" placeholder="真实姓名" />
    <input v-model="college" placeholder="所属学院" />
    <input v-model="password" type="password" placeholder="密码 (至少6位)" />
    <input v-model="confirmPassword" type="password" placeholder="确认密码" />
    <button @click="handleRegister">注册</button>
    <p v-if="message" :class="isError ? 'error' : 'success'">{{ message }}</p>
    <p class="switch-link">已有账号？ <router-link to="/">返回登录</router-link></p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import request from '@/utils/request'
import { useRouter } from 'vue-router'

// --- 数据绑定 ---
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const fullName = ref('')
const college = ref('')

// --- 状态管理 ---
const message = ref('')
const isError = ref(false)
const router = useRouter()

// --- 注册处理函数 ---
const handleRegister = async () => {
  // 清空之前的消息
  message.value = ''
  isError.value = false

  // --- 核心修改：前端验证逻辑 ---

  // 1. 检查所有字段是否都已填写
  if (
    !username.value ||
    !password.value ||
    !confirmPassword.value ||
    !fullName.value ||
    !college.value
  ) {
    isError.value = true
    message.value = '请填写所有必填项'
    return // 中断执行
  }

  // 2. 检查密码和确认密码是否一致
  if (password.value !== confirmPassword.value) {
    isError.value = true
    message.value = '两次输入的密码不一致'
    return // 中断执行
  }

  // 3. （可选）可以保留原有的长度验证
  if (username.value.length < 4 || password.value.length < 6) {
    isError.value = true
    message.value = '用户名至少4位，密码至少6位'
    return
  }

  // --- 发送请求 ---
  try {
    const response = await request.post('/api/register', {
      username: username.value,
      password: password.value,
      fullName: fullName.value,
      college: college.value,
    })

    // 注册成功后的逻辑
    message.value = response.data.message + ' 即将跳转到登录页...'
    setTimeout(() => {
      router.push('/')
    }, 2000)
  } catch (error) {
    // 注册失败后的逻辑
    isError.value = true
    message.value = '注册失败: ' + (error.response?.data?.error || '服务器错误')
  }
}
</script>

<style scoped>
.form-container {
  max-width: 380px;
  margin: 80px auto;
  padding: 30px;
  background-color: #fff;
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

.success {
  color: #42b983;
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
