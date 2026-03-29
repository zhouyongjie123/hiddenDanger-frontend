import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo } from '@/types/api'

// 用户状态管理
export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const tokenName = ref<string>(localStorage.getItem('tokenName') || '')
  const userInfo = ref<UserInfo | null>(null)

  const isLoggedIn = computed(() => !!token.value)

  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const setTokenName = (name: string) => {
    tokenName.value = name
    localStorage.setItem('tokenName', name)
  }

  const clearToken = () => {
    token.value = ''
    tokenName.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('tokenName')
  }

  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
    setToken(info.tokenValue)
    setTokenName(info.tokenName)
  }

  return {
    token,
    tokenName,
    userInfo,
    isLoggedIn,
    setToken,
    setTokenName,
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
