import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
      meta: { public: true },
    },
    {
      path: '/',
      name: 'layout',
      component: () => import('@/layouts/MainLayout.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('@/views/home/index.vue'),
          meta: { title: '首页', icon: 'HomeFilled' },
        },
        {
          path: '/danger',
          name: 'danger',
          component: () => import('@/views/danger/list.vue'),
          meta: { title: '隐患列表', icon: 'Warning' },
        },
        {
          path: '/danger/report',
          name: 'danger-report',
          component: () => import('@/views/danger/report.vue'),
          meta: { title: '隐患上报', icon: 'DocumentAdd' },
        },
        {
          path: '/danger/track',
          name: 'danger-track',
          component: () => import('@/views/danger/track.vue'),
          meta: { title: '整改跟踪', icon: 'Refresh' },
        },
        {
          path: '/user',
          name: 'user',
          component: () => import('@/views/user/list.vue'),
          meta: { title: '用户管理', icon: 'User' },
        },
        {
          path: '/dept',
          name: 'dept',
          component: () => import('@/views/dept/list.vue'),
          meta: { title: '部门管理', icon: 'OfficeBuilding' },
        },
        {
          path: '/role',
          name: 'role',
          component: () => import('@/views/role/list.vue'),
          meta: { title: '角色管理', icon: 'Position' },
        },
        {
          path: '/about',
          name: 'about',
          component: () => import('@/views/about/index.vue'),
          meta: { title: '关于', icon: 'InfoFilled' },
        },
        {
          path: '/profile',
          name: 'profile',
          component: () => import('@/views/profile/index.vue'),
          meta: { title: '个人中心', icon: 'UserFilled' },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/error/404.vue'),
    },
  ],
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 公共路由（如登录页）无需登录
  if (to.meta.public) {
    next()
    return
  }

  // 检查是否已登录（有token）
  if (!userStore.isLoggedIn) {
    // 未登录，重定向到登录页
    next({ name: 'login' })
  } else {
    // 已登录，允许访问
    next()
  }
})

export default router
