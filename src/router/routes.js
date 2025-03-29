import LoginMiddleware from 'src/router/middlewares/login'
import AuthMiddleware from 'src/router/middlewares/auth'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { middlewares: [AuthMiddleware] },

    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('pages/dashboard/IndexPage.vue'),
      },
      {
        path: 'finance',
        name: 'finance',
        component: () => import('pages/finance/IndexPage.vue'),
      },
      {
        path: 'categories',
        name: 'categories',
        component: () => import('pages/categories/IndexPage.vue'),
      },

      {
        path: 'employees',
        name: 'employees',
        component: () => import('pages/users/IndexPage.vue'),
      },
      {
        path: 'contracts',
        name: 'contracts',
        component: () => import('pages/contracts/IndexPage.vue'),
      },
    ],
  },

  {
    path: '/auth/',
    component: () => import('layouts/AuthLayout.vue'),
    meta: { middlewares: [LoginMiddleware] },
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/auth/LoginPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
