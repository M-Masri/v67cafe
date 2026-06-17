let maintenanceState = {
  active: false,
  message: null,
}

const listeners = new Set()

export function getMaintenanceState() {
  return maintenanceState
}

export function activateMaintenance(message = null) {
  if (maintenanceState.active && maintenanceState.message === message) {
    return
  }

  maintenanceState = {
    active: true,
    message: message || null,
  }

  listeners.forEach((listener) => {
    listener(maintenanceState)
  })
}

export function subscribeMaintenance(listener) {
  listeners.add(listener)
  listener(maintenanceState)

  return () => {
    listeners.delete(listener)
  }
}
