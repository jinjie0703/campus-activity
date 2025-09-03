<!-- 管理员页面 -->
<template>
  <div class="admin-container">
    <h1>管理员后台</h1>

    <!-- 数据分析与处理模块 -->
    <div class="dashboard-section">
      <div class="section-header">
        <h2>数据看板</h2>
        <button @click="toggleSection('stats')" class="toggle-btn">
          {{ sectionVisibility.stats ? '收起' : '展开' }}
        </button>
      </div>
      <div v-show="sectionVisibility.stats" class="stats-container">
        <div class="chart-widget">
          <div id="hot-activities-chart" class="chart"></div>
        </div>
        <div class="chart-widget">
          <div id="organizer-stats-chart" class="chart"></div>
        </div>
      </div>
    </div>

    <!-- 活动管理模块 -->
    <div class="dashboard-section">
      <div class="section-header">
        <h2>活动管理</h2>
        <button @click="toggleSection('activities')" class="toggle-btn">
          {{ sectionVisibility.activities ? '收起' : '展开' }}
        </button>
      </div>
      <div v-show="sectionVisibility.activities" class="activity-list">
        <div v-for="activity in activities" :key="activity.id" class="activity-card">
          <span class="activity-info">{{ activity.title }} - {{ activity.organizer }}</span>
          <button @click="deleteActivity(activity.id)" class="delete-btn">删除</button>
        </div>
      </div>
    </div>

    <!-- 用户报名信息模块 -->
    <div class="dashboard-section">
      <div class="section-header">
        <h2>用户报名信息</h2>
        <button @click="toggleSection('registrations')" class="toggle-btn">
          {{ sectionVisibility.registrations ? '收起' : '展开' }}
        </button>
      </div>
      <div v-show="sectionVisibility.registrations" class="activity-list">
        <p v-if="activities.length === 0">暂无活动</p>
        <!-- 遍历活动列表，每个活动都是一个链接 -->
        <router-link
          v-for="activity in activities"
          :key="activity.id"
          :to="`/admin/activity/${activity.id}/registrants`"
          class="activity-link-card"
        >
          <span class="activity-info">{{ activity.title }}</span>
          <span class="registrant-count">
            <strong>{{ getRegistrationCount(activity.id) }}</strong> 人已报名
          </span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, reactive } from 'vue'
import request from '@/utils/request'
import * as echarts from 'echarts'

// --- 状态管理 ---
const sectionVisibility = reactive({
  stats: true,
  activities: true,
  registrations: true,
})
const toggleSection = (sectionKey) => {
  if (sectionVisibility.hasOwnProperty(sectionKey)) {
    sectionVisibility[sectionKey] = !sectionVisibility[sectionKey]
  }
}

// --- 数据获取 ---
const activities = ref([])
const registrations = ref([])

const fetchActivities = async () => {
  try {
    const response = await request.get('/api/activities')
    activities.value = response.data
  } catch (error) {
    console.error('获取活动列表失败:', error)
  }
}

const fetchRegistrations = async () => {
  try {
    const response = await request.get('/api/admin/registrations')
    registrations.value = response.data
  } catch (error) {
    console.error('获取报名信息失败:', error)
  }
}

// 辅助函数，用于计算特定活动的报名人数
const getRegistrationCount = (activityId) => {
  return registrations.value.filter((reg) => reg.activityId === activityId).length
}

const deleteActivity = async (id) => {
  if (confirm('确定要删除这个活动吗？此操作不可恢复。')) {
    try {
      await request.delete(`/api/activities/${id}`)
      alert('删除成功')
      await fetchActivities() // 重新加载活动
      await fetchRegistrations() // 删除活动后报名信息也会变，所以也需要刷新
    } catch (error) {
      alert('删除失败: ' + (error.response?.data?.error || '服务器错误'))
    }
  }
}

// --- ECharts 图表渲染 ---
const renderCharts = async () => {
  try {
    const hotActivitiesRes = await request.get('/api/stats/hot-activities')
    const organizerStatsRes = await request.get('/api/stats/organizer-activity-counts')
    const hotActivitiesData = hotActivitiesRes.data
    const organizerStatsData = organizerStatsRes.data

    const hotChartDom = document.getElementById('hot-activities-chart')
    const organizerChartDom = document.getElementById('organizer-stats-chart')

    // 检查DOM元素是否存在
    if (!hotChartDom || !organizerChartDom) return

    const hotChart = echarts.init(hotChartDom)
    hotChart.setOption({
      title: { text: '热门活动排行榜 (TOP 5)', textStyle: { fontSize: 16 } },
      tooltip: { trigger: 'axis' },
      xAxis: {
        data: hotActivitiesData.map((item) => item.title),
        axisLabel: { interval: 0, rotate: 30 },
      },
      yAxis: { type: 'value' },
      series: [
        {
          name: '报名人数',
          type: 'bar',
          data: hotActivitiesData.map((item) => item.registrationCount),
        },
      ],
      grid: { bottom: '20%' },
    })

    const organizerChart = echarts.init(organizerChartDom)
    organizerChart.setOption({
      title: { text: '各组织方活动数量占比', left: 'center', textStyle: { fontSize: 16 } },
      tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
      series: [
        {
          name: '活动数量',
          type: 'pie',
          radius: '60%',
          data: organizerStatsData.map((item) => ({
            value: item.activityCount,
            name: item.organizer,
          })),
        },
      ],
    })
  } catch (error) {
    console.error('渲染图表失败:', error)
  }
}

onMounted(async () => {
  await Promise.all([fetchActivities(), fetchRegistrations()])
  nextTick(() => {
    renderCharts()
  })
})
</script>

<style scoped>
.admin-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

.dashboard-section {
  background-color: #ffffff;
  padding: 25px;
  margin-bottom: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: -25px -25px 20px -25px;
  padding: 15px 25px;
  background-color: #f7f9fa;
  border-bottom: 1px solid #e0e0e0;
  border-radius: 8px 8px 0 0;
}

.section-header h2 {
  margin: 0;
  padding: 0;
  font-size: 1.25rem;
  color: #34495e;
}

.toggle-btn {
  padding: 4px 12px;
  font-size: 14px;
  color: #555;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    color 0.3s;
}

.toggle-btn:hover {
  background-color: #f0f0f0;
  color: #000;
}

.stats-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.chart-widget {
  flex: 1 1 400px;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
}

.chart {
  width: 100%;
  height: 400px;
}

.activity-list {
  padding-top: 10px;
}

.activity-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  transition: background-color 0.3s;
}

.activity-card:hover {
  background-color: #f9f9f9;
}

.activity-info {
  color: #333;
}

.delete-btn {
  padding: 6px 12px;
  color: white;
  background-color: #e74c3c;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.delete-btn:hover {
  background-color: #c0392b;
}

.activity-link-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
  margin-bottom: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  text-decoration: none;
  color: #333;
  transition:
    background-color 0.3s,
    border-color 0.3s,
    transform 0.2s;
}

.activity-link-card:hover {
  background-color: #f7f9fa;
  border-color: #42b983;
  transform: translateY(-2px);
}

.registrant-count {
  font-size: 0.95rem;
  color: #555;
  background-color: #e9ecef;
  padding: 5px 10px;
  border-radius: 12px;
}

.registrant-count strong {
  color: #2c3e50;
}
</style>
