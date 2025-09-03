// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import ActivityView from '@/views/common/ActivityView.vue'
import AdminView from '@/views/admin/AdminView.vue'
import ActivityDetailView from '@/views/common/ActivityDetailView.vue'
import MyActivitiesView from '@/views/user/MyActivitiesView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import ActivityRegistrantsView from '@/views/admin/ActivityRegistrantsView.vue'
import PublishActivity from '@/views/admin/PublishActivity.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    { path: '/register', name: 'register', component: RegisterView },
    { path: '/activities', name: 'activities', component: ActivityView },
    { path: '/activity/:id', name: 'activity-detail', component: ActivityDetailView, props: true },
    { path: '/my-activities', name: 'my-activities', component: MyActivitiesView },
    { path: '/admin', name: 'admin', component: AdminView },
    {
      path: '/admin/activity/:id/registrants',
      name: 'ActivityRegistrants',
      component: ActivityRegistrantsView,
      props: true,
    },
    {
      path: '/publish-activity', // 这是我们新页面的路径
      name: 'PublishActivity',
      component: PublishActivity,
      // 【推荐】添加路由元信息，用于导航守卫，确保只有管理员能访问
      meta: { requiresAuth: true, requiresAdmin: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const isAdmin = localStorage.getItem('userRole') === 'admin'

  if (to.meta.requiresAdmin && !isAdmin) {
    // 如果路由需要管理员权限但用户不是，则重定向
    next({ path: '/activities' }) // 或者跳转到无权限页面
  } else {
    next() // 否则正常放行
  }
})

export default router
