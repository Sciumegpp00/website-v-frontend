<style scoped>
    .page {
    font-family: 'Playfair Display', serif;
    background: linear-gradient(to bottom, #fff1f5, #ffe4e6);
    min-height: 100vh;
    padding: 40px;
    }

    .title {
    text-align: center;
    font-size: 2.5rem;
    color: #9f1239;
    margin-bottom: 30px;
    }

    .content {
    display: flex;
    gap: 30px;
    align-items: flex-start;
    }

    .map {
    flex: 2;
    height: 600px;
    border-radius: 20px;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
    }

    .form-card {
    flex: 1;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(12px);
    padding: 25px;
    border-radius: 20px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }

    .form-card h2 {
    margin-bottom: 20px;
    color: #be123c;
    }

    input, textarea, select {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border-radius: 12px;
    border: 1px solid #fbcfe8;
    background: #fff;
    }

    button {
    width: 100%;
    padding: 12px;
    background: #be123c;
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.3s;
    }

    button:hover {
    background: #9f1239;
    }
</style>
<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import L from 'leaflet'
    import 'leaflet/dist/leaflet.css'

    const mapElement = ref<HTMLDivElement | null>(null)

    const title = ref('')
    const description = ref('')
    const date = ref('')
    const status = ref('visited')
    const lat = ref<number | null>(null)
    const lng = ref<number | null>(null)

    let map: L.Map
    let tempMarker: L.Marker | null = null

    const iconVisited = L.icon({
    iconUrl: '/icons/heart.png',
    iconSize: [32, 32]
    })

    const iconPlanned = L.icon({
    iconUrl: '/icons/plane.png',
    iconSize: [32, 32]
    })

    async function getLocationName(lat: number, lng: number) {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    )
    const data = await res.json()

    return (
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.display_name
    )
    }

    onMounted(() => {
    if (!mapElement.value) return

    map = L.map(mapElement.value).setView([45, 10], 4)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)

    map.on('click', async (e) => {
        lat.value = Number(e.latlng.lat.toFixed(6))
        lng.value = Number(e.latlng.lng.toFixed(6))

        if (tempMarker) map.removeLayer(tempMarker)

        tempMarker = L.marker([lat.value, lng.value]).addTo(map)

        title.value = await getLocationName(lat.value, lng.value)
    })
    })

    async function saveViaggio() {
    if (!lat.value || !lng.value) return

    const viaggio = {
        title: title.value,
        description: description.value,
        date: date.value,
        status: status.value,
        lat: lat.value,
        lng: lng.value
    }

    await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/viaggi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(viaggio)
    })

    L.marker([lat.value, lng.value], {
        icon: status.value === 'visited' ? iconVisited : iconPlanned
    })
        .addTo(map)
        .bindPopup(`
        <strong>${title.value}</strong><br/>
        ${description.value}<br/>
        ${date.value}
        `)

    map.setView([lat.value, lng.value], 7)

    title.value = ''
    description.value = ''
    date.value = ''
    status.value = 'visited'
    lat.value = null
    lng.value = null

    if (tempMarker) {
        map.removeLayer(tempMarker)
        tempMarker = null
    }
    }

</script>
<template>
  <div class="page">
    <h1 class="title">I Nostri Viaggi 💖</h1>

    <div class="content">
      <div ref="mapElement" class="map"></div>

      <div class="form-card">
        <h2>Aggiungi una nuova tappa ✨</h2>

        <form @submit.prevent="saveViaggio">
          <input v-model="title" placeholder="Nome della località" required />
          <textarea v-model="description" placeholder="Un ricordo speciale..."></textarea>
          <input v-model="date" type="date" />

          <select v-model="status">
            <option value="visited">Già visitato 💖</option>
            <option value="planned">Coming soon ✈️</option>
          </select>

          <button type="submit">Salva il ricordo</button>
        </form>
      </div>
    </div>
  </div>
</template>
