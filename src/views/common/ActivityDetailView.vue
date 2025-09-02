<!-- 活动详情页面 -->
<template>
  <div class="detail-container">
    <div v-if="activity" class="activity-content">
      <h1 class="activity-title">{{ activity.title }}</h1>

      <div class="info-grid">
        <p><strong>举办方:</strong> {{ activity.organizer }}</p>
        <p><strong>分类:</strong> {{ activity.category }}</p>
        <p>
          <strong>时间:</strong> {{ new Date(activity.startTime).toLocaleString() }} -
          {{ new Date(activity.endTime).toLocaleString() }}
        </p>
        <p><strong>地点:</strong> {{ activity.location }}</p>
        <p>
          <strong>容量:</strong> {{ activity.capacity > 0 ? activity.capacity + '人' : '不限' }}
        </p>
      </div>

      <hr class="separator" />

      <div class="description">
        <h3>活动详情</h3>
        <p class="description-text">{{ activity.description }}</p>
      </div>

      <div class="actions">
        <button @click="register" v-if="user && user.role === 'student'" class="register-btn">
          立即报名
        </button>
      </div>
    </div>
    <div v-else class="loading-state">
      <p>加载中...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'
import { useRoute } from 'vue-router'

const props = defineProps({ id: String })
const route = useRoute()
const activity = ref(null)
const user = JSON.parse(localStorage.getItem('user'))

onMounted(async () => {
  // 从 props 获取 ID 是更推荐的做法
  const activityId = props.id || route.params.id
  if (!activityId) {
    alert('未找到活动ID')
    return
  }
  try {
    const response = await request.get(`/api/activities/${activityId}`)
    activity.value = response.data
  } catch (error) {
    console.error('加载活动详情失败:', error)
    alert('加载活动详情失败: ' + (error.response?.data?.error || error.message))
  }
})

const register = async () => {
  if (!user) {
    alert('请先登录！')
    return
  }
  try {
    const response = await request.post(`/api/activities/${props.id}/register`, {
      userId: user.id,
    })
    alert(response.data.message)
  } catch (error) {
    alert('报名失败: ' + (error.response?.data?.error || '未知错误'))
  }
}
</script>

<style scoped>
.detail-container {
  max-width: 1000px;
  margin: 20px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.activity-title {
  color: #2c3e50;
  margin-bottom: 25px;
  text-align: center;
  font-size: 2.2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  margin-bottom: 20px;
}

.info-grid p {
  font-size: 1.05rem;
  color: #5a7388;
  margin: 0;
}

.info-grid p strong {
  color: #2c3e50;
  min-width: 80px;
  display: inline-block;
}

.separator {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 30px 0;
}

.description h3 {
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.description-text {
  color: #333;
  line-height: 1.8;
  white-space: pre-wrap;
  font-size: 1rem;
}

.actions {
  text-align: center;
  margin-top: 30px;
}

.register-btn {
  padding: 12px 30px;
  font-size: 1.1rem;
  font-weight: bold;
  color: #fff;
  background-color: #42b983;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
}

.register-btn:hover {
  background-color: #36a46e;
  transform: translateY(-2px);
}

.loading-state {
  text-align: center;
  padding: 50px;
  color: #5a7388;
  font-size: 1.2rem;
}

/* 响应式设计 */
@media (min-width: 600px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px 20px;
  }
}
</style>
