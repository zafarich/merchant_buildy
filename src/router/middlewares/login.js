import { useAuthStore } from 'src/stores/auth'
export default async function auth({ next, to }) {
  const authStore = useAuthStore()

  if (authStore.isAuth && to.name === 'login') {
    if (to.name === 'login') {
      return next({ name: 'dashboard.page' })
    }
  }
  next()
}
