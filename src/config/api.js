import { activateMaintenance } from '../lib/maintenance'

const DEFAULT_API_URL = 'http://127.0.0.1:8000/api'

function normalizeApiBaseUrl(value) {
  const trimmed = String(value || '').trim()

  if (!trimmed) {
    return DEFAULT_API_URL
  }

  return trimmed.replace(/\/+$/, '')
}

export const API_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL)

export function apiUrl(path = '') {
  if (!path) {
    return API_URL
  }

  if (/^https?:\/\//i.test(path)) {
    return path
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_URL}${normalizedPath}`
}

export async function requestJson(pathOrUrl, options = {}, authToken = null) {
  const url = apiUrl(pathOrUrl)
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(options.headers || {}),
    },
  })

  const data = await response.json().catch(() => ({}))

  if (response.status === 503) {
    activateMaintenance(data.message || null)

    const error = new Error(data.message || 'Service unavailable.')
    error.status = 503
    error.isMaintenance = true
    throw error
  }

  if (!response.ok) {
    const error = new Error(
      data.message || Object.values(data.errors || {})?.[0]?.[0] || 'Request failed.',
    )
    error.status = response.status
    error.errors = data.errors || null
    throw error
  }

  return data
}
