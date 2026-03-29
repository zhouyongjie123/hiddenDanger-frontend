import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 用户状态管理
export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const userInfo = ref<any>(null)

  const isLoggedIn = computed(() => !!token.value)

  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const clearToken = () => {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
  }

  const setUserInfo = (info: any) => {
    userInfo.value = info
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    setToken,
    clearToken,
    setUserInfo,
  }
})

// 应用状态管理
export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = ref(false)
  const theme = ref<'light' | 'dark'>('light')

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme
  }

  return {
    sidebarCollapsed,
    theme,
    toggleSidebar,
    setTheme,
  }
})

// 导出默认的 counter store
export { useCounterStore } from './counter'
