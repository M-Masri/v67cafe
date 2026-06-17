function stripDigits(value) {
  return String(value || '').replace(/\D/g, '')
}

function fixMistakenUaeLeadingZero(digits) {
  if (!digits) {
    return digits
  }

  // +971 05XXXXXXXX -> +971 5XXXXXXXX
  if (digits.startsWith('97105') && digits.length === 13) {
    return `971${digits.slice(4)}`
  }

  // 05XXXXXXXX (local UAE) -> 9715XXXXXXXX
  if (digits.startsWith('05') && digits.length === 10) {
    return `971${digits.slice(1)}`
  }

  return digits
}

export function normalizePhoneForStorage(value) {
  const digits = fixMistakenUaeLeadingZero(stripDigits(value))

  return digits ? `+${digits}` : ''
}

export function normalizePhoneForInput(value) {
  return stripDigits(value)
}

export function isValidUaePhone(value) {
  return /^\+971[0-9]{9}$/.test(String(value || ''))
}

export function normalizePhoneOnComplete(value) {
  return normalizePhoneForStorage(normalizePhoneForInput(value))
}
