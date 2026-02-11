const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getViaggi() {
  const res = await fetch(`${BASE_URL}/viaggi`)
  if (!res.ok) {
    throw new Error('Errore API')
  }
  return res.json()
}
