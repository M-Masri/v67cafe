import { requestJson } from '../config/api'

let catalogPromise = null

export function loadCatalog({ force = false } = {}) {
  if (!catalogPromise || force) {
    catalogPromise = requestJson('/catalog', {}, null).catch((error) => {
      catalogPromise = null
      throw error
    })
  }

  return catalogPromise
}
