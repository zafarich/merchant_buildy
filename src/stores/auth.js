import { defineStore } from 'pinia'
import * as api from 'src/api/auth'
import { computed, ref } from 'vue-demi'

import { getTokenFromCache, removeTokenFromCache, setTokenToCache } from 'src/utils/auth'
export const useAuthStore = defineStore('auth', () => {
  const token = ref(getTokenFromCache())
  const isAuth = computed(() => !!token.value)
  const user = ref({
    role: 'admin',
  })
  async function login(payload) {
    const res = await api.login(payload)
    const token = res?.data?.token
    if (token) {
      setToken(token)
    }
    return res
  }
  async function me() {
    if (token.value) {
      const res = await api.me()
      user.value = res.data
      return res?.data
    }
  }

  function setToken(payload) {
    token.value = payload
    setTokenToCache(payload)
  }
  function removeToken() {
    token.value = null
    removeTokenFromCache()
  }

  async function logout() {
    await api.logOut()
  }

  return {
    login,
    logout,
    isAuth,
    me,
    user,
    removeToken,
  }
})
