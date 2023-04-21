import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../pages/AboutPage.vue')
    },
    {
      path: '/my-lists',
      name: 'my-lists',
      component: () => import('../pages/MyListsPage.vue')
    }
  ]
})

export default router
