<script setup lang="ts">
import { onMounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getViaggi } from '../api/viaggi'
import heartIcon from '../assets/icons/heart.jpg'
import planeIcon from '../assets/icons/plane.jpg'

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
  
  const iconVisited = L.icon({
    iconUrl: heartIcon,
    iconSize: [40, 40],       // dimensione dell’icona in px
    iconAnchor: [20, 40],     // punto della base dell’icona che corrisponde al marker
    popupAnchor: [0, -40]     // posizione del popup rispetto al marker
  })

  const iconPlanned = L.icon({
    iconUrl: planeIcon,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  })
  
  viaggi.forEach((v: any)=> {
    L.marker([Number(v.lat), Number(v.lng)], {
      icon: v.status === 'visited' ? iconVisited : iconPlanned
    })
    .addTo(map)
    .bindPopup(`<div style="min-width: 200px;">
        <h3 style="margin: 0 0 5px 0;">${v.title}</h3>
        <p style="margin: 0 0 5px 0;">
          ${v.description ?? 'Nessuna descrizione'}
        </p>
        <small>
          📅 ${v.date ?? 'Data non specificata'}
        </small>
      </div>`)
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
