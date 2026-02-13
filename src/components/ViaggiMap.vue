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
    display: flex;
    flex-direction: column;
    gap: 15px;
    max-width: 420px;
    margin: auto;
    }

    .form-card h2 {
    margin-bottom: 20px;
    color: #be123c;
    }
    
    .form-card input,
    .form-card textarea,
    .form-card select {
    width: 100%;
    padding: 12px;
    border-radius: 12px;
    border: 1px solid #fbcfe8;
    font-family: inherit;
    font-size: 1rem;
    box-sizing: border-box; /* fondamentale */
    }

    .form-card textarea {
    min-height: 100px;
    resize: vertical;
    }
    .form-card button {
    width: 100%;
    padding: 12px;
    border-radius: 12px;
    background: #be123c;
    color: white;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: 0.3s ease;
    }

    .form-card button:hover {
    background: #9f1239;
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
    import { getViaggi } from '../api/viaggi'
    import { watch } from 'vue'
    import heartIcon from '../assets/icons/heart.png'
    import planeIcon from '../assets/icons/plane.png'
    import tmpIcon from '../assets/icons/tmp.png'

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

    function clearSelection() {
        lat.value = null
        lng.value = null
        title.value = ''
        description.value = ''
        date.value = ''
        status.value = 'visited'

        if (tempMarker) {
            map.removeLayer(tempMarker)
            tempMarker = null
        }
    }


    function handleEscape(e: KeyboardEvent) {
        if (e.key === 'Escape') {
            clearSelection()
        }
    }

    function updateTempMarker() {
        if (!lat.value || !lng.value) return

        const icon = status.value === 'visited'
            ? iconVisited
            : iconPlanned

        if (tempMarker) {
            tempMarker.setLatLng([lat.value, lng.value])
            tempMarker.setIcon(icon)
        } else {
            tempMarker = L.marker([lat.value, lng.value], { icon }).addTo(map)
        }
    }
    
    watch(status, () => {
        if (tempMarker) {
            updateTempMarker()
        }
    })
    
    onMounted(async () => {
        window.removeEventListener('keydown', handleEscape)

        if (!mapElement.value) return

        map = L.map(mapElement.value).setView([45, 10], 4)

        const viaggi = await getViaggi()

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            updateWhenIdle: true,
            keepBuffer: 2,
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map)

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

        const iconTmp = L.icon({
            iconUrl: tmpIcon,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
        })
        
        const markersLayer = L.layerGroup().addTo(map)

        viaggi.forEach((v: any)=> {
        L.marker([Number(v.lat), Number(v.lng)], {
        icon: v.status === 'visited' ? iconVisited : iconPlanned
        })
        .bindPopup(`<div style="min-width: 200px;">
            <h3 style="margin: 0 0 5px 0;">${v.title}</h3>
            <p style="margin: 0 0 5px 0;">
            ${v.description ?? 'Nessuna descrizione'}
            </p>
            <small>
            📅 ${v.date ?? 'Data non specificata'}
            </small>
        </div>`)
        .addTo(markersLayer)
    })

        map.on('click', async (e) => {
            lat.value = Number(e.latlng.lat.toFixed(6))
            lng.value = Number(e.latlng.lng.toFixed(6))

            if (tempMarker) map.removeLayer(tempMarker)

            tempMarker = L.marker([lat.value, lng.value], { icon: iconTmp }).addTo(map)

            title.value = await getLocationName(lat.value, lng.value)
        })
        // 👇 ESC listener
        window.addEventListener('keydown', handleEscape)
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
    <h1 class="title">Le nostre avventure ​ ✈️💘</h1>

    <div class="content">
      <div ref="mapElement" class="map"></div>

      <div class="form-card">
        <h2>Aggiungi una nuova tappa</h2>
        <h4>(clicca sulla mappa il luogo e inserisci qui i dati)</h4>

        <form @submit.prevent="saveViaggio">
          <input v-model="title" placeholder="Nome della località" required />
          <textarea  v-model="description" placeholder="Un ricordo speciale..."></textarea>
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
