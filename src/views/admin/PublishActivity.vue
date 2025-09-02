<!-- src/views/PublishActivity.vue -->
<template>
  <div class="publish-container">
    <h1>发布新活动</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">活动标题</label>
        <input id="title" v-model="activity.title" type="text" required />
      </div>

      <div class="form-group">
        <label for="description">活动描述</label>
        <textarea id="description" v-model="activity.description" rows="5" required></textarea>
      </div>

      <div class="form-group">
        <label for="category">活动分类</label>
        <select id="category" v-model="activity.category" required>
          <option disabled value="">请选择分类</option>
          <option>学术讲座</option>
          <option>文体竞赛</option>
          <option>社团招新</option>
          <option>其他</option>
        </select>
      </div>

      <div class="form-group">
        <label for="organizer">主办方</label>
        <input id="organizer" v-model="activity.organizer" type="text" required />
      </div>

      <div class="form-group">
        <label for="location">活动地点</label>
        <input id="location" v-model="activity.location" type="text" required />
      </div>

      <div class="form-group">
        <label for="startTime">开始时间</label>
        <input id="startTime" v-model="activity.startTime" type="datetime-local" required />
      </div>

      <div class="form-group">
        <label for="endTime">结束时间</label>
        <input id="endTime" v-model="activity.endTime" type="datetime-local" required />
      </div>

      <div class="form-group">
        <label for="capacity">人数容量</label>
        <input id="capacity" v-model.number="activity.capacity" type="number" min="0" required />
      </div>

      <button type="submit" class="submit-btn">确认发布</button>
    </form>

    <p v-if="successMsg" class="success-message">{{ successMsg }}</p>
    <p v-if="errorMsg" class="error-message">{{ errorMsg }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import request from '@/utils/request'
import { useRouter } from 'vue-router'

const router = useRouter()

const activity = ref({
  title: '',
  description: '',
  category: '',
  organizer: '',
  location: '',
  startTime: '',
  endTime: '',
  capacity: 0,
})

const successMsg = ref('')
const errorMsg = ref('')

const handleSubmit = async () => {
  successMsg.value = ''
  errorMsg.value = ''

  // 简单验证
  if (new Date(activity.value.endTime) <= new Date(activity.value.startTime)) {
    errorMsg.value = '结束时间必须晚于开始时间。'
    return
  }

  try {
    // 注意：在实际应用中，你需要发送认证 Token
    // const token = localStorage.getItem('authToken'); // 假设你的 token 存储在这里
    // const headers = { Authorization: `Bearer ${token}` };

    const response = await request.post(
      '/api/activities',
      activity.value,
      // { headers } // 附加 headers
    )

    successMsg.value = '活动发布成功！正在跳转到活动广场...'

    // 清空表单
    activity.value = {
      title: '',
      description: '',
      category: '',
      organizer: '',
      location: '',
      startTime: '',
      endTime: '',
      capacity: 0,
    }

    // 2秒后跳转
    setTimeout(() => {
      router.push('/activities')
    }, 2000)
  } catch (error) {
    errorMsg.value = '发布失败：' + (error.response?.data?.error || '服务器错误，请稍后再试。')
  }
}
</script>

<style scoped>
.publish-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
}

.submit-btn {
  width: 100%;
  padding: 15px;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  background-color: #42b983;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #36a46f;
}

.success-message,
.error-message {
  text-align: center;
  margin-top: 20px;
  padding: 10px;
  border-radius: 6px;
}

.success-message {
  color: #2a9d8f;
  background-color: #e9f5f4;
}

.error-message {
  color: #e76f51;
  background-color: #fcece8;
}
</style>
