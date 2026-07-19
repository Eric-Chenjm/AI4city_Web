import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/above'
  },
  {
    path: '/above',
    name: 'Above',
    component: () => import('../views/AbovePage.vue')
  },
  {
    path: '/generate',
    name: 'Generate',
    component: () => import('../views/GeneratePage.vue')
  },
  {
    path: '/analysis',
    name: 'Analysis',
    component: () => import('../views/AnalysisPage.vue')
  },
  {
    path: '/method',
    name: 'Method',
    component: () => import('../views/MethodPage.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
