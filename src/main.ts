import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import 'leaflet/dist/leaflet.css'
import router from './router/index'


createApp(App)
  .use(router)
  .mount('#app')

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getMap() {
  const res = await fetch(`${BASE_URL}/viaggi`)
  return res.json()
}

