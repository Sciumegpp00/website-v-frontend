import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import MappaPage from './pages/mappa.vue'

createApp(App).mount('#app')

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getMap() {
  const res = await fetch(`${BASE_URL}/viaggi`)
  return res.json()
}

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

