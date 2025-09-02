<!-- 管理员页面中的报名信息组件 -->
<template>
  <div class="container">
    <div v-if="activity">
      <router-link to="/admin" class="back-link">&larr; 返回管理员后台</router-link>
      <h1>《{{ activity.title }}》- 报名名单</h1>
      <p class="sub-header">共有 {{ registrants.length }} 人报名</p>

      <div class="table-container">
        <table class="registrants-table">
          <thead>
            <tr>
              <th>用户名</th>
              <th>姓名</th>
              <th>学院</th>
              <th>报名时间</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="registrants.length === 0">
              <td colspan="6">暂无报名记录</td>
            </tr>
            <tr v-for="reg in registrants" :key="reg.userId">
              <td>{{ reg.username }}</td>
              <td>{{ reg.fullName }}</td>
              <td>{{ reg.college }}</td>
              <td>{{ new Date(reg.registrationTime).toLocaleString() }}</td>
              <td>
                <!-- 根据状态显示不同样式 -->
                <span :class="['status', `status-${reg.status}`]">{{
                  formatStatus(reg.status)
                }}</span>
              </td>
              <td class="actions">
                <!-- 操作按钮 -->
                <button
                  @click="updateStatus(reg.registrationId, 'approved')"
                  class="btn btn-approve"
                  :disabled="reg.status === 'approved'"
                >
                  通过
                </button>
                <button
                  @click="updateStatus(reg.registrationId, 'rejected')"
                  class="btn btn-reject"
                  :disabled="reg.status === 'rejected'"
                >
                  拒绝
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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

const props = defineProps({
  id: { type: String, required: true },
})

const activity = ref(null)
const registrants = ref([])

// 获取数据的函数
const fetchData = async () => {
  try {
    const [activityResponse, registrantsResponse] = await Promise.all([
      request.get(`/api/activities/${props.id}`),
      request.get(`/api/activities/${props.id}/registrations`),
    ])
    activity.value = activityResponse.data
    registrants.value = registrantsResponse.data
  } catch (error) {
    console.error('加载报名信息失败:', error)
    alert('加载信息失败: ' + (error.response?.data?.error || '服务器错误'))
  }
}

onMounted(fetchData)

const updateStatus = async (registrationId, newStatus) => {
  try {
    // --- 修改这里 ---
    await request.put(`/api/admin/registrations/${registrationId}/status`, {
      status: newStatus,
    })
    // --- 修改结束 ---
    alert('状态更新成功！')
    // 刷新列表以显示最新状态
    fetchData()
  } catch (error) {
    console.error('更新状态失败:', error)
    alert('操作失败: ' + (error.response?.data?.error || '服务器错误'))
  }
}

// 新增：格式化状态文本的辅助函数
const formatStatus = (status) => {
  const statusMap = {
    approved: '已通过',
    rejected: '已拒绝',
    pending: '待审核',
  }
  // 如果数据库里存的是其他默认值（比如'approved'），也在这里处理
  return statusMap[status] || status
}
</script>

<style scoped>
/* ...之前的样式保持不变... */
.container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
}
.back-link {
  display: inline-block;
  margin-bottom: 20px;
  color: #42b983;
  text-decoration: none;
  font-weight: bold;
}
h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 10px;
}
.sub-header {
  text-align: center;
  color: #5a7388;
  margin-bottom: 30px;
  font-size: 1.1rem;
}
.table-container {
  overflow-x: auto;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.registrants-table {
  width: 100%;
  border-collapse: collapse;
}
.registrants-table th,
.registrants-table td {
  border: 1px solid #e0e0e0;
  padding: 12px 15px;
  text-align: left;
  vertical-align: middle;
}
.registrants-table th {
  background-color: #f2f5f7;
  font-weight: 600;
  color: #34495e;
}

/* 新增：状态和操作按钮的样式 */
.status {
  padding: 4px 8px;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  font-size: 0.85em;
}
.status-approved {
  background-color: #28a745;
} /* 绿色 */
.status-rejected {
  background-color: #dc3545;
} /* 红色 */
.status-pending {
  background-color: #ffc107;
  color: #333;
} /* 黄色 */

.actions .btn {
  padding: 5px 10px;
  margin-right: 5px;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: opacity 0.3s;
}
.actions .btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-approve {
  background-color: #007bff;
}
.btn-approve:hover:not(:disabled) {
  background-color: #0056b3;
}
.btn-reject {
  background-color: #6c757d;
}
.btn-reject:hover:not(:disabled) {
  background-color: #545b62;
}
</style>
