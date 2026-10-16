import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/',
      component: () => import('@/layout/AppLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
        },
        {
          path: 'orders/collect',
          name: 'collect-orders',
          component: () => import('@/views/order/CollectOrderView.vue'),
        },
        {
          path: 'orders/pay',
          name: 'pay-orders',
          component: () => import('@/views/order/PayOrderView.vue'),
        },
        {
          path: 'funds',
          name: 'funds',
          component: () => import('@/views/fund/FundView.vue'),
        },
      ],
    },
  ],
})

export default router
