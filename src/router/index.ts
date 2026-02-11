import { createRouter, createWebHistory } from 'vue-router'
import MappaPage from '../pages/mappa.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'mappa',
      component: MappaPage
    }
  ]
})

export default router
