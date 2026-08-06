const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export async function request(path, options = {}) {
  const token = sessionStorage.getItem('second-opinion-token')
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...options,
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.error || 'Something went wrong. Please try again.')
  return body
}
