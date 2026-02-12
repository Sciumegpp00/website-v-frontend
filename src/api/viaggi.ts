const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getViaggi() {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/viaggi`)

    if (!res.ok) {
      const text = await res.text()
      throw new Error(text)
    }

    return await res.json()

  } catch (error) {
    console.error(error)
    return []
  }
}

