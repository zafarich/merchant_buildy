import { useAuthStore } from 'src/stores/auth'
export default async function auth({ next, to }) {
  const authStore = useAuthStore()

  if (authStore.isAuth) {
    if (to.name === 'login') {
      return next({ name: 'dashboard.page' })
    }
    return next()
  }

  next({ name: 'login' })
}
