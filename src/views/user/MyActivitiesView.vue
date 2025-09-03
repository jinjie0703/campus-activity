<!-- 用户报名活动显示页面 -->
<template>
  <div class="container">
    <h1>我报名的活动</h1>
    <div v-if="registrations.length > 0" class="cards-grid">
      <div v-for="reg in registrations" :key="reg.registrationId" class="activity-card">
        <div class="card-content">
          <!-- 将标题用 router-link 包裹 -->
          <router-link :to="`/activity/${reg.activityId}`">
            <h4>{{ reg.title }} ({{ reg.organizer }})</h4>
          </router-link>
          <p>时间: {{ new Date(reg.startTime).toLocaleString() }}</p>
          <p>地点: {{ reg.location }}</p>
        </div>
        <div class="card-actions">
          <button @click="cancel(reg.registrationId)" class="cancel-btn">取消报名</button>
        </div>
      </div>
    </div>
    <div v-else class="no-activity-message">
      <p>你还没有报名任何活动。</p>
      <router-link to="/activities" class="go-to-activities-link">去活动广场看看</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'

const registrations = ref([])
const user = JSON.parse(localStorage.getItem('user'))

const fetchMyActivities = async () => {
  if (!user) return
  try {
    const response = await request.get(`/api/users/${user.id}/registrations`)
    registrations.value = response.data
  } catch (error) {
    console.error('获取我报名的活动失败:', error)
    registrations.value = []
  }
}

const cancel = async (registrationId) => {
  if (confirm('确定要取消报名吗？')) {
    try {
      const response = await request.delete(`/api/registrations/${registrationId}`)
      alert(response.data.message)
      fetchMyActivities() // 刷新列表
    } catch (error) {
      alert('取消失败: ' + (error.response?.data?.error || '服务器错误'))
    }
  }
}

onMounted(fetchMyActivities)
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

.activity-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.activity-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.activity-card a {
  text-decoration: none;
  color: inherit;
}

.card-content {
  flex-grow: 1;
}

.card-actions {
  margin-left: 20px;
}

.activity-card h4 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.activity-card p {
  margin: 5px 0 0 0;
  color: #5a7388;
  font-size: 0.95rem;
  line-height: 1.5;
}

.cancel-btn {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  background-color: #d9534f;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cancel-btn:hover {
  background-color: #c9302c;
}

.no-activity-message {
  text-align: center;
  margin-top: 50px;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.no-activity-message p {
  font-size: 1.1rem;
  color: #5a7388;
  margin-bottom: 20px;
}

.go-to-activities-link {
  display: inline-block;
  padding: 10px 20px;
  color: #fff;
  background-color: #42b983;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.go-to-activities-link:hover {
  background-color: #36a46e;
}
</style>
