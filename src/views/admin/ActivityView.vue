<!-- 活动显示列表 -->
<template>
  <div class="container">
    <div class="header">
      <h1>活动广场</h1>
      <!-- 仅当 isAdmin 为 true 时显示此按钮 -->
      <button v-if="isAdmin" @click="goToPublish" class="publish-btn">发布活动</button>
    </div>
    <div class="filters">
      <input v-model="searchQuery" placeholder="搜索活动标题..." @input="fetchActivities" />
      <select v-model="selectedCategory" @change="fetchActivities">
        <option value="">所有分类</option>
        <option value="学术讲座">学术讲座</option>
        <option value="文体竞赛">文体竞赛</option>
        <option value="社团招新">社团招新</option>
      </select>
    </div>
    <div v-for="activity in activities" :key="activity.id" class="activity-card">
      <router-link :to="`/activity/${activity.id}`">
        <h3>{{ activity.title }} ({{ activity.organizer }})</h3>
      </router-link>
      <p>时间: {{ new Date(activity.startTime).toLocaleString() }}</p>
      <p>地点: {{ activity.location }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import request from '@/utils/request'
import { useRouter } from 'vue-router'

const activities = ref([])
const searchQuery = ref('')
const selectedCategory = ref('')
const router = useRouter()

// 从 localStorage 获取用户角色
const userRole = ref(localStorage.getItem('userRole') || 'user')

// 计算属性，用于判断当前用户是否为管理员
const isAdmin = computed(() => userRole.value === 'admin')

const fetchActivities = async () => {
  try {
    const params = new URLSearchParams()
    if (searchQuery.value) {
      params.append('search', searchQuery.value)
    }
    if (selectedCategory.value) {
      params.append('category', selectedCategory.value)
    }
    const response = await request.get(`/api/activities`, { params })
    activities.value = response.data
  } catch (error) {
    console.error('获取活动失败:', error)
  }
}

// 点击发布活动按钮后的跳转逻辑
const goToPublish = () => {
  router.push('/publish-activity')
}

onMounted(() => {
  fetchActivities()
})
</script>

<style scoped>
/* 整体容器 */
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

/* 页面头部，包含标题和按钮 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap; /* 确保在小屏幕上也能良好显示 */
}

h1 {
  text-align: center;
  color: #2c3e50; /* 深色文本 */
  margin: 0; /* 移除默认的 margin */
}

/* 发布活动按钮 */
.publish-btn {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #42b983; /* 主题绿 */
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    transform 0.3s;
}

.publish-btn:hover {
  background-color: #36a46f;
  transform: scale(1.05); /* 轻微放大效果 */
}

/* 筛选区域 */
.filters {
  display: flex;
  gap: 15px; /* 控件之间的间距 */
  margin-bottom: 30px;
  flex-wrap: wrap; /* 在小屏幕上换行 */
}

.filters input,
.filters select {
  padding: 10px 15px;
  font-size: 16px;
  border: 1px solid #e0e0e0; /* 边框颜色 */
  border-radius: 6px;
  outline: none;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
  flex-grow: 1; /* 让输入框和选择框尽可能填充空间 */
}

.filters input:focus,
.filters select:focus {
  border-color: #42b983; /* 主题绿 */
  box-shadow: 0 0 5px rgba(66, 185, 131, 0.5);
}

/* 活动卡片 */
.activity-card {
  background-color: #ffffff; /* 卡片背景色 */
  border: 1px solid #e0e0e0; /* 边框颜色 */
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease; /* 添加平滑过渡效果 */
}

/* 鼠标悬停在卡片上的效果 */
.activity-card:hover {
  transform: translateY(-5px); /* 轻微上浮 */
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1); /* 增加阴影 */
}

.activity-card a {
  text-decoration: none;
  color: inherit; /* 继承父元素颜色 */
}

/* 卡片内标题 */
.activity-card h3 {
  margin: 0 0 10px 0;
  color: #2c3e50; /* 深色文本 */
  font-size: 1.25rem;
}

/* 卡片内段落文本 */
.activity-card p {
  margin: 5px 0 0 0;
  color: #5a7388; /* 浅色文本 */
  font-size: 0.95rem;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .header {
    flex-direction: column;
    gap: 20px;
  }
  .filters {
    flex-direction: column; /* 在小屏幕上垂直排列筛选控件 */
  }

  h1 {
    font-size: 1.8rem;
  }
}
</style>
