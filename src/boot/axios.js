import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { getTokenFromCache } from 'src/utils/auth'
import { Notify, LocalStorage } from 'quasar'
import { getServerError } from 'src/utils/helpers'
import { useAuthStore } from 'src/stores/auth'
const api = axios.create({ baseURL: process.env.BASE_URL })

export default boot(({ app }) => {
  const authStore = useAuthStore()

  api.interceptors.request.use(
    (config) => {
      const token = getTokenFromCache()
      if (token) config.headers.Authorization = 'Bearer ' + token

      return config
    },
    (error) => Promise.reject(error),
  )

  api.interceptors.response.use(
    (response) => {
      return response?.data
    },
    async (error) => {
      let message = getServerError(error, 'message')
      const status = error?.response?.status
      console.log('error', error)
      if ('pass' in error?.config) {
        return Promise.reject(error)
      }

      if (status === 401) {
        authStore.removeToken()
        return { data: { result: null, error: true } }
      } else if (status?.toString()?.slice(0, 1) === 5) {
        message = 'Internal Server Error'
      } else if (status === 405) {
        message = 'Method Not Allowed'
      } else if (status === 404) {
        message = 'Not Found'
      } else if (status === 403) {
        message = `Sizda ruxsat yo'q`
      } else {
        message = message ?? `Error 500. Noma'lum xatolik yuz berdi!`
      }

      if (message) {
        Notify.create({
          progress: true,
          position: 'top',
          message,
          type: 'info',
          color: 'negative',
          timeout: 4000,
        })
      }
      return { data: { result: null, error: true } }
    },
  )

  return { api }
})

export { api }
