<!-- 导航栏 -->
<template>
  <div id="app">
    <nav v-if="user && route.name !== 'login' && route.name !== 'register'">
      <router-link to="/activities">活动广场</router-link>
      <router-link v-if="user.role === 'student'" to="/my-activities">我的活动</router-link>
      <router-link v-if="user.role === 'admin'" to="/admin">管理后台</router-link>
      <a href="#" @click="logout">退出登录</a>
    </nav>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const user = ref(JSON.parse(localStorage.getItem('user')))

// 监听路由变化，以更新user状态
watch(route, () => {
  user.value = JSON.parse(localStorage.getItem('user'))
})

const logout = () => {
  localStorage.removeItem('user')
  user.value = null
  router.push('/')
}
</script>

<style>
/* 固定视口大小，不采用适配 */
#app {
  min-width: 1200px;
  margin: 0 auto;
}
nav {
  padding: 20px;
  background-color: #f5f5f5;
  text-align: center;
}
nav a {
  font-size: 20px;
  font-weight: bold;
  color: #2c3e50;
  margin: 0 10px;
  text-decoration: none;
  transition: color 0.3s;
}
nav a:hover {
  color: #42b983;
}
nav a.router-link-exact-active {
  color: #42b983;
}
main {
  padding: 20px;
}
</style>
