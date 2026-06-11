import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'

function PaymentForm({ payLabel, isPaying, onPaySuccess, onPayError }) {
  const stripe = useStripe()
  const elements = useElements()

  const handlePay = async () => {
    if (!stripe || !elements || isPaying) {
      return
    }

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

    onPaySuccess()
  }

  return (
    <div className="stripe-payment-form">
      <PaymentElement />
      <button
        type="button"
        className="order-modal-primary stripe-pay-button"
        disabled={!stripe || !elements || isPaying}
        onClick={handlePay}
      >
        {payLabel}
      </button>
    </div>
  )
}

export default function StripePaymentStep({
  clientSecret,
  stripePromise,
  payLabel,
  isPaying,
  onPaySuccess,
  onPayError,
}) {
  if (!clientSecret || !stripePromise) {
    return null
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentForm
        payLabel={payLabel}
        isPaying={isPaying}
        onPaySuccess={onPaySuccess}
        onPayError={onPayError}
      />
    </Elements>
  )
}
