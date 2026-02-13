<script setup lang="ts">
import { ref } from 'vue'

const title = ref('')
const lat = ref(0)
const lng = ref(0)
const status = ref<'visited' | 'planned'>('visited')
const description = ref('')
const date = ref('')

const handleSubmit = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/viaggi`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: title.value,
      lat: lat.value,
      lng: lng.value,
      status: status.value,
      description: description.value,
      date: date.value
    })
  })

  if (!res.ok) {
    alert('Errore durante il salvataggio')
    return
  }

  alert('Viaggio aggiunto!')
  window.location.reload() // per refresh mappa, oppure aggiorna lo stato globalmente
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input v-model.number="lat" type="number" step="any" />
    <input v-model.number="lng" type="number" step="any" />
    <select v-model="status">
      <option value="visited">Visitato</option>
      <option value="planned">Pianificato</option>
    </select>
    <input v-model="date" type="date" />
    <textarea v-model="description" placeholder="Descrizione"></textarea>
    <button type="submit">Aggiungi viaggio</button>
  </form>
</template>
