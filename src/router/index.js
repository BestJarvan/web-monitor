import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/components/Layout/index.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Layout,
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/index.vue'),
          meta: { title: '工作台' },
        },
        {
          path: 'information',
          name: 'Information',
          component: () => import('@/views/info/index.vue'),
          meta: { title: '错误日志' },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/404.vue'),
      hidden: true,
    },
  ]
})

export default router
