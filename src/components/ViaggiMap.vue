<script setup lang="ts">
import { onMounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getViaggi } from '../api/viaggi'

const mapElement = ref<HTMLDivElement | null>(null)

onMounted(async () => {
  if (!mapElement.value) return

  // 1️⃣ Creiamo la mappa
  const map = L.map(mapElement.value).setView([45, 10], 4)

  // 2️⃣ Aggiungiamo OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  // 3️⃣ Recuperiamo i viaggi dal backend
  const viaggi = await getViaggi()
  console.log('VIAGGI:', viaggi)

  // 4️⃣ Aggiungiamo marker
  const iconVisited = L.icon({ iconUrl: './assets/heart.svg', iconSize: [25, 41] })
  const iconPlanned = L.icon({ iconUrl: '../assets/plane.svg', iconSize: [25, 41] })
  viaggi.forEach((v: any)=> {
    L.marker([Number(v.lat), Number(v.lng)], {
      icon: v.status === 'visited' ? iconVisited : iconPlanned
    })
    .addTo(map)
    .bindPopup(`<strong>${v.title}</strong>`)
  })
})
</script>

<template>
  <div ref="mapElement" class="map"></div>
</template>

<style scoped>
.map {
  width: 100%;
  height: 500px;
  border-radius: 12px;
}
</style>
