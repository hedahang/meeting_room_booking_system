import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/home' },

    {
      path: '/home',
      component: Layout,
      redirect: '/home/index',
      children: [
        { path: 'index', name: 'Home', component: () => import('@/views/Home.vue') },
        {
          path: 'history',
          name: 'BookingHistory',
          component: () => import('@/views/BookingHistory.vue'),
        },
        {
          path: 'profile',
          name: 'ProfileEdit',
          component: () => import('@/views/ProfileEdit.vue'),
        },
        {
          path: 'users',
          name: 'UserList',
          component: () => import('@/views/UserList.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/Register.vue'),
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: () => import('@/views/ForgotPassword.vue'),
    },
  ],
})

export default router
