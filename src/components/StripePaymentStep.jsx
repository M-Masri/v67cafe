import { useMemo, useState } from 'react'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'

const DEFAULT_PAYMENT_ELEMENT_OPTIONS = {
  wallets: {
    applePay: 'auto',
    googlePay: 'auto',
  },
}

function getPaymentElementOptions(paymentConfig) {
  const wallets = paymentConfig?.payment_element?.wallets

  if (!wallets) {
    return DEFAULT_PAYMENT_ELEMENT_OPTIONS
  }

  return { wallets }
}

function PaymentForm({
  paymentElementOptions,
  payLabel,
  isPaying,
  onPayStart,
  onPaySuccess,
  onPayError,
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isBusy = isPaying || isSubmitting

  const handlePay = async () => {
    if (!stripe || !elements || isBusy) {
      return
    }

    setIsSubmitting(true)
    onPayStart?.()

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order/complete`,
        },
        redirect: 'if_required',
      })

      if (error) {
        onPayError(error.message)
        return
      }

      await onPaySuccess?.()
    } catch (error) {
      onPayError(error?.message || 'Payment failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="stripe-payment-form">
      <PaymentElement options={paymentElementOptions} />
      <button
        type="button"
        className={`order-modal-primary stripe-pay-button${isBusy ? ' is-loading' : ''}`}
        disabled={!stripe || !elements || isBusy}
        aria-busy={isBusy}
        onClick={handlePay}
      >
        {isBusy ? <span className="order-payment-spinner order-payment-spinner-inline" aria-hidden="true" /> : null}
        <span>{payLabel}</span>
      </button>
    </div>
  )
}

export default function StripePaymentStep({
  clientSecret,
  stripePromise,
  paymentConfig,
  payLabel,
  isPaying,
  onPayStart,
  onPaySuccess,
  onPayError,
}) {
  const paymentElementOptions = useMemo(
    () => getPaymentElementOptions(paymentConfig),
    [paymentConfig],
  )

  if (!clientSecret || !stripePromise) {
    return null
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentForm
        paymentElementOptions={paymentElementOptions}
        payLabel={payLabel}
        isPaying={isPaying}
        onPayStart={onPayStart}
        onPaySuccess={onPaySuccess}
        onPayError={onPayError}
      />
    </Elements>
  )
}
