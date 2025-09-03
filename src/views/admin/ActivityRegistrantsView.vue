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
            <!-- 注意：key 最好使用唯一的 registrationId -->
            <tr v-for="reg in registrants" :key="reg.registrationId">
              <td>{{ reg.username }}</td>
              <td>{{ reg.fullName }}</td>
              <td>{{ reg.college }}</td>
              <td>{{ new Date(reg.registrationTime).toLocaleString() }}</td>
              <td>
                <span :class="['status', `status-${reg.status}`]">{{
                  formatStatus(reg.status)
                }}</span>
              </td>
              <td class="actions">
                <!-- 1. “通过”按钮保持不变 -->
                <button
                  @click="updateStatus(reg.registrationId, 'approved')"
                  class="btn btn-approve"
                  :disabled="reg.status === 'approved'"
                >
                  通过
                </button>
                <!-- 2. “拒绝”按钮已改为“删除”按钮 -->
                <button @click="deleteRegistration(reg.registrationId)" class="btn btn-delete">
                  删除
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

// 获取数据的函数 (保持不变)
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

// "通过" 报名申请的函数
const updateStatus = async (registrationId, newStatus) => {
  try {
    // 这个函数现在只处理 "approved" 状态
    await request.put(`/api/admin/registrations/${registrationId}/status`, {
      status: newStatus,
    })
    alert('状态更新成功！')
    fetchData()
  } catch (error) {
    console.error('更新状态失败:', error)
    alert('操作失败: ' + (error.response?.data?.error || '服务器错误'))
  }
}

// 新增：“删除”报名记录的函数
const deleteRegistration = async (registrationId) => {
  // 增加一个确认弹窗，防止误操作
  if (!confirm('您确定要永久删除这条报名记录吗？此操作不可撤销。')) {
    return
  }

  try {
    // 调用管理员专用的删除 API
    await request.delete(`/api/admin/registrations/${registrationId}`)
    alert('报名记录已成功删除！')
    fetchData() // 刷新列表
  } catch (error) {
    console.error('删除报名记录失败:', error)
    alert('删除失败: ' + (error.response?.data?.error || '服务器错误'))
  }
}

// 格式化状态文本的辅助函数
const formatStatus = (status) => {
  const statusMap = {
    approved: '已通过',
    // "rejected" 状态虽然不会在界面上操作产生，但可能历史数据里有，所以保留
    rejected: '已拒绝',
    pending: '待审核',
  }
  return statusMap[status] || status
}
</script>

<style scoped>
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

/* 状态和操作按钮的样式 */
.status {
  padding: 4px 8px;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  font-size: 0.85em;
}
.status-approved {
  background-color: #28a745; /* 绿色 */
}
.status-rejected {
  background-color: #dc3545; /* 红色 */
}
.status-pending {
  background-color: #ffc107;
  color: #333; /* 黄色背景配深色文字更清晰 */
}

.actions .btn {
  padding: 6px 12px; /* 稍微增大按钮，方便点击 */
  margin-right: 8px; /* 增加按钮间距 */
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition:
    background-color 0.2s,
    opacity 0.3s; /* 过渡效果更平滑 */
  font-weight: 500;
}

.actions .btn:last-child {
  margin-right: 0; /* 最后一个按钮不需要右边距 */
}

.actions .btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-approve {
  background-color: #007bff; /* 蓝色 */
}
.btn-approve:hover:not(:disabled) {
  background-color: #0056b3;
}

/* --- 这里是核心修改 --- */
/* 将原来的 .btn-reject 改为 .btn-delete，并使用醒目的红色 */
.btn-delete {
  background-color: #dc3545; /* 醒目的红色 */
}
.btn-delete:hover:not(:disabled) {
  background-color: #c82333; /* 鼠标悬浮时颜色加深 */
}
</style>
