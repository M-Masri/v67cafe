import { useMemo, useState } from 'react'
import {
  CheckoutElementsProvider,
  ExpressCheckoutElement,
  PaymentElement,
  useCheckoutElements,
} from '@stripe/react-stripe-js/checkout'
import { persistPendingCheckout } from '../lib/checkout'

const DEFAULT_EXPRESS_CHECKOUT_OPTIONS = {
  paymentMethods: {
    applePay: 'always',
    googlePay: 'always',
  },
  layout: {
    maxColumns: 2,
  },
}

const DEFAULT_PAYMENT_ELEMENT_OPTIONS = {
  wallets: {
    applePay: 'never',
    googlePay: 'never',
  },
}

function getExpressCheckoutOptions(paymentConfig) {
  const expressCheckout = paymentConfig?.payment_element?.express_checkout

  if (!expressCheckout) {
    return DEFAULT_EXPRESS_CHECKOUT_OPTIONS
  }

  return expressCheckout
}

function getPaymentElementOptions(paymentConfig) {
  const paymentElement = paymentConfig?.payment_element

  if (!paymentElement) {
    return DEFAULT_PAYMENT_ELEMENT_OPTIONS
  }

  return {
    ...paymentElement,
    wallets: paymentElement.wallets || DEFAULT_PAYMENT_ELEMENT_OPTIONS.wallets,
  }
}

function PaymentForm({
  expressCheckoutOptions,
  paymentElementOptions,
  checkoutContact,
  pendingCheckout,
  emailRequiredMessage,
  payLabel,
  isPaying,
  onPayStart,
  onPaySuccess,
  onPayError,
}) {
  const checkoutState = useCheckoutElements()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasExpressCheckout, setHasExpressCheckout] = useState(false)
  const isBusy = isPaying || isSubmitting

  const handlePay = async () => {
    if (checkoutState.type !== 'success' || isBusy) {
      return
    }

    const { checkout } = checkoutState
    const email = checkoutContact?.email

    if (!email) {
      onPayError(emailRequiredMessage)
      return
    }

    setIsSubmitting(true)
    onPayStart?.()
    persistPendingCheckout(pendingCheckout)

    try {
      if (typeof checkout.updateEmail === 'function') {
        const emailUpdate = await checkout.updateEmail(email)

        if (emailUpdate.type === 'error') {
          onPayError(emailUpdate.error.message)
          return
        }
      }

      const result = await checkout.confirm({
        redirect: 'if_required',
        email,
      })

      if (result.type === 'error') {
        onPayError(result.error.message)
        return
      }

      await onPaySuccess?.()
    } catch (error) {
      onPayError(error?.message || 'Payment failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmExpressCheckout = async (event) => {
    if (checkoutState.type !== 'success' || isBusy) {
      return
    }

    setIsSubmitting(true)
    onPayStart?.()
    persistPendingCheckout(pendingCheckout)

    try {
      const result = await checkoutState.checkout.confirm({
        expressCheckoutConfirmEvent: event,
        redirect: 'if_required',
      })

      if (result.type === 'error') {
        onPayError(result.error.message)
        return
      }

      await onPaySuccess?.()
    } catch (error) {
      onPayError(error?.message || 'Payment failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleExpressCheckoutReady = ({ availablePaymentMethods }) => {
    setHasExpressCheckout(Boolean(availablePaymentMethods))
  }

  if (checkoutState.type === 'loading') {
    return <p className="order-modal-loading-copy">Loading payment...</p>
  }

  if (checkoutState.type === 'error') {
    return <p className="field-hint error order-payment-error">{checkoutState.error.message}</p>
  }

  return (
    <div className="stripe-payment-form">
      <div className="stripe-express-checkout">
        <ExpressCheckoutElement
          options={expressCheckoutOptions}
          onConfirm={handleConfirmExpressCheckout}
          onReady={handleExpressCheckoutReady}
        />
      </div>

      {hasExpressCheckout ? (
        <div className="stripe-payment-divider" aria-hidden="true">
          <span>OR</span>
        </div>
      ) : null}

      <PaymentElement options={paymentElementOptions} />
      <button
        type="button"
        className={`order-modal-primary stripe-pay-button${isBusy ? ' is-loading' : ''}`}
        disabled={isBusy}
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
  checkoutContact,
  pendingCheckout,
  emailRequiredMessage = 'An email address is required to complete payment.',
  payLabel,
  isPaying,
  onPayStart,
  onPaySuccess,
  onPayError,
}) {
  const expressCheckoutOptions = useMemo(
    () => getExpressCheckoutOptions(paymentConfig),
    [paymentConfig],
  )
  const paymentElementOptions = useMemo(
    () => getPaymentElementOptions(paymentConfig),
    [paymentConfig],
  )
  const checkoutOptions = useMemo(
    () => ({
      clientSecret,
      defaultValues: {
        email: checkoutContact?.email || undefined,
      },
    }),
    [checkoutContact?.email, clientSecret],
  )

  if (!clientSecret || !stripePromise) {
    return null
  }

  return (
    <CheckoutElementsProvider stripe={stripePromise} options={checkoutOptions}>
      <PaymentForm
        expressCheckoutOptions={expressCheckoutOptions}
        paymentElementOptions={paymentElementOptions}
        checkoutContact={checkoutContact}
        pendingCheckout={pendingCheckout}
        emailRequiredMessage={emailRequiredMessage}
        payLabel={payLabel}
        isPaying={isPaying}
        onPayStart={onPayStart}
        onPaySuccess={onPaySuccess}
        onPayError={onPayError}
      />
    </CheckoutElementsProvider>
  )
}
