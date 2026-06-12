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

export function getCheckoutReturnUrl(paymentConfig) {
  const template = paymentConfig?.return_url
    || `${window.location.origin}/checkout/complete?session_id={CHECKOUT_SESSION_ID}`

  try {
    const url = new URL(template)
    url.protocol = window.location.protocol
    url.host = window.location.host
    return url.toString()
  } catch {
    return template
  }
}
