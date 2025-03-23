import { defineStore } from 'pinia'
import * as api from 'src/api/auth'
import { computed, ref } from 'vue-demi'

import { getTokenFromCache, removeTokenFromCache, setTokenToCache } from 'src/utils/auth'
export const useAuthStore = defineStore(
  'auth',
  () => {
    const token = ref(getTokenFromCache())
    const isAuth = computed(() => !!token.value)
    const user = ref(null)
    async function login(payload) {
      const res = await api.login(payload)
      console.log('res', res)

      const token = res?.data?.token
      if (token) {
        setToken(token)
        setUser(res.data?.user)
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

    function setUser(data) {
      user.value = data
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
  },
  {
    persist: true,
  },
)
