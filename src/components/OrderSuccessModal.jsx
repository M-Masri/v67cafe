import { CheckCircle2, MapPin } from 'lucide-react'

export default function OrderSuccessModal({
  isOpen = false,
  orderNumber = null,
  cafeName = 'Cafe 67',
  locationUrl = null,
  labels = {},
  onClose,
}) {
  if (!isOpen) {
    return null
  }

  const hasLocation = Boolean(locationUrl && locationUrl !== '#')

  return (
    <div className="order-success-modal-backdrop" role="presentation">
      <section
        className="order-success-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-success-title"
        aria-describedby="order-success-body"
      >
        <div className="order-success-modal__icon" aria-hidden="true">
          <CheckCircle2 size={34} strokeWidth={2.2} />
        </div>

        <p className="order-success-modal__kicker">{labels.kicker}</p>
        <h2 id="order-success-title" className="order-success-modal__title">
          {labels.title}
        </h2>
        <p id="order-success-body" className="order-success-modal__body">
          {labels.body}
        </p>

        <div className="order-success-modal__status">
          <span className="order-success-modal__status-dot" aria-hidden="true" />
          <span>{labels.processingLabel}</span>
        </div>

        {orderNumber ? (
          <div className="order-success-modal__order">
            <span className="order-success-modal__order-label">{labels.orderNumberLabel}</span>
            <strong className="order-success-modal__order-number">{orderNumber}</strong>
          </div>
        ) : null}

        <div className="order-success-modal__actions">
          {hasLocation ? (
            <a
              className="order-success-modal__location"
              href={locationUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MapPin size={18} aria-hidden="true" />
              <span>{labels.locationCta}</span>
            </a>
          ) : null}

          <button type="button" className="order-success-modal__done" onClick={onClose}>
            {labels.doneCta}
          </button>
        </div>

        <p className="order-success-modal__cafe">{cafeName}</p>
      </section>
    </div>
  )
}
