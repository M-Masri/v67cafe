import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, Minus, Plus, Trash2, X } from 'lucide-react'

const carTypes = [
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Porsche',
  'Range Rover',
  'Lexus',
  'Toyota',
  'Nissan',
  'Tesla',
  'Other',
]

function OrderNowModal({
  isOpen,
  onClose,
  initialStep,
  products,
  fallbackImages,
  cartItems,
  cartCups,
  cartTotal,
  soldOut,
  money,
  addToCart,
  setQuantity,
  checkoutForm,
  setCheckoutForm,
  userAddresses,
  selectedCheckoutAddressId,
  applyCheckoutAddress,
  onSubmitOrder,
}) {
  const [step, setStep] = useState(initialStep)

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    setStep(initialStep)

    return undefined
  }, [initialStep, isOpen])

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const hasSavedAddresses = useMemo(
    () => userAddresses.some((address) => address.address || address.phone || address.town_city || address.villa_floor),
    [userAddresses],
  )
  const canContinueFromProducts = cartCups > 0 && !soldOut
  const canContinueFromCheckout = Boolean(checkoutForm.car_type)
    && Boolean(checkoutForm.car_number.trim())
  const stepLabels = ['Products', 'Checkout', 'Payment']

  if (!isOpen) {
    return null
  }

  return (
    <div className="order-modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="order-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="order-modal-header">
          <div>
            <p className="order-modal-kicker">Order now</p>
            <h2 id="order-modal-title">Build your order in 3 steps</h2>
          </div>
          <button type="button" className="order-modal-close" onClick={onClose} aria-label="Close order popup">
            <X size={18} />
          </button>
        </header>

        <div className="order-modal-steps" aria-label="Order steps">
          {stepLabels.map((label, index) => (
            <div key={label} className={`order-step-pill ${step === index + 1 ? 'active' : ''} ${step > index + 1 ? 'done' : ''}`}>
              <div className="order-step-line" aria-hidden="true" />
              <span className="order-step-count">{index + 1}</span>
              <strong>{label}</strong>
            </div>
          ))}
        </div>

        <div className="order-modal-body">
          {step === 1 ? (
            <div className="order-modal-panel">
              <div className="order-modal-section-heading">
                <div>
                  <p>Select products</p>
                  <h3>Choose from the current menu</h3>
                </div>
                <div className="order-modal-summary-chip">
                  <span>{cartCups} cups</span>
                  <strong>{money(cartTotal)}</strong>
                </div>
              </div>

              <div className="order-product-list">
                {products.map((product, index) => {
                  const cartItem = cartItems.find((item) => item.product_id === product.id)
                  const quantity = cartItem?.quantity || 0

                  return (
                    <article className="order-product-card" key={product.id}>
                      <img
                        src={product.image_url || fallbackImages[index % fallbackImages.length]}
                        alt={product.name}
                      />
                      <div className="order-product-copy">
                        <span>{product.category?.name || 'Drink'}</span>
                        <strong>{product.name}</strong>
                        <p>{money(product.price)}</p>
                      </div>
                      <div className="order-product-actions">
                        {quantity > 0 ? (
                          <div className="quantity-controls">
                            <button
                              type="button"
                              onClick={() => setQuantity(product.id, quantity - 1)}
                              aria-label={`Decrease ${product.name}`}
                            >
                              <Minus size={14} />
                            </button>
                            <span>{quantity}</span>
                            <button
                              type="button"
                              onClick={() => setQuantity(product.id, quantity + 1)}
                              aria-label={`Increase ${product.name}`}
                            >
                              <Plus size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setQuantity(product.id, 0)}
                              aria-label={`Remove ${product.name}`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="order-product-add"
                            disabled={soldOut || !product.is_available}
                            onClick={() => addToCart(product)}
                          >
                            {product.is_available ? 'Add' : 'Unavailable'}
                          </button>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="order-modal-panel order-modal-checkout-panel">
              <div className="order-modal-section-heading">
                <div>
                  <p>Checkout details</p>
                  <h3>Set your car details</h3>
                </div>
              </div>

              {hasSavedAddresses ? (
                <div className="saved-address-picker order-modal-address-picker">
                  <span>Saved addresses</span>
                  <div>
                    {userAddresses.map((address, index) => {
                      const addressKey = address.id || `local-${index}`
                      const addressLabel = [address.address, address.villa_floor, address.town_city].filter(Boolean).join(', ') || `Address ${index + 1}`

                      return (
                        <button
                          key={addressKey}
                          type="button"
                          className={selectedCheckoutAddressId === addressKey ? 'active' : ''}
                          onClick={() => applyCheckoutAddress(address, addressKey)}
                        >
                          {addressLabel}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : null}

              <div className="order-checkout-grid">
                <div className="order-car-row">
                  <label>
                    Car brand
                    <select
                      value={checkoutForm.car_type}
                      onChange={(event) =>
                        setCheckoutForm({ ...checkoutForm, car_type: event.target.value })
                      }
                    >
                      <option value="">Select car brand</option>
                      {carTypes.map((carType) => (
                        <option key={carType} value={carType}>{carType}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Car number
                    <input
                      required
                      value={checkoutForm.car_number}
                      onChange={(event) =>
                        setCheckoutForm({ ...checkoutForm, car_number: event.target.value })
                      }
                    />
                  </label>
                </div>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="order-modal-panel order-modal-payment-panel">
              <div className="order-modal-section-heading">
                <div>
                  <p>Payment</p>
                  <h3>Payment wiring comes next</h3>
                </div>
              </div>

              <div className="order-payment-placeholder">
                <strong>Payment component placeholder</strong>
                <p>
                  This step is ready in the popup flow. We can connect card, Apple Pay,
                  or any gateway here in the next pass.
                </p>
              </div>

              <div className="order-payment-summary">
                <div>
                  <span>Total cups</span>
                  <strong>{cartCups}</strong>
                </div>
                <div>
                  <span>Total amount</span>
                  <strong>{money(cartTotal)}</strong>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <footer className="order-modal-footer">
          <button
            type="button"
            className="order-modal-secondary"
            onClick={step === 1 ? onClose : () => setStep((current) => current - 1)}
          >
            {step === 1 ? 'Close' : (
              <>
                <ChevronLeft size={16} />
                Back
              </>
            )}
          </button>

          {step < 3 ? (
            <button
              type="button"
              className="order-modal-primary"
              disabled={step === 1 ? !canContinueFromProducts : !canContinueFromCheckout}
              onClick={() => setStep((current) => current + 1)}
            >
              {step === 1 ? 'Continue to checkout' : 'Continue to payment'}
            </button>
          ) : (
            <button
              type="button"
              className="order-modal-primary"
              disabled={cartCups === 0 || soldOut}
              onClick={onSubmitOrder}
            >
              Place order
            </button>
          )}
        </footer>
      </section>
    </div>
  )
}

export default OrderNowModal