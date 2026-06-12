export const PENDING_CHECKOUT_STORAGE_KEY = 'cafe67_pending_checkout'

export function persistPendingCheckout(pendingCheckout) {
  if (!pendingCheckout?.order?.id) {
    return
  }

  sessionStorage.setItem(
    PENDING_CHECKOUT_STORAGE_KEY,
    JSON.stringify({
      orderId: pendingCheckout.order.id,
      mobileNumber: pendingCheckout.order.mobile_number || null,
      checkoutData: pendingCheckout,
      sessionId: pendingCheckout.payment?.session_id || null,
    }),
  )
}

export function readPendingCheckout() {
  try {
    return JSON.parse(sessionStorage.getItem(PENDING_CHECKOUT_STORAGE_KEY) || 'null')
  } catch {
    return null
  }
}

export function clearPendingCheckout() {
  sessionStorage.removeItem(PENDING_CHECKOUT_STORAGE_KEY)
}
