import { API_URL } from '../config/api'

function getApiOrigin() {
  return API_URL.replace(/\/api\/?$/, '')
}

export function resolveMediaUrl(path) {
  const value = String(path || '').trim()

  if (!value) {
    return null
  }

  if (/^https?:\/\//i.test(value)) {
    return value
  }

  if (value.startsWith('//')) {
    return `https:${value}`
  }

  const origin = getApiOrigin()

  return value.startsWith('/') ? `${origin}${value}` : `${origin}/${value}`
}

export function getProductImageUrl(product, fallback = null) {
  return resolveMediaUrl(product?.image_path)
    || resolveMediaUrl(product?.image_url)
    || fallback
}
