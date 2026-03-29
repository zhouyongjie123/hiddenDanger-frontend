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

  if (to.meta.public) {
    next()
    return
  }

  if (!userStore.isLoggedIn && to.name !== 'login') {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
