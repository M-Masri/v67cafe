export default function CheckoutComplete({ title, body }) {
  return (
    <section className="checkout-complete-page" aria-live="polite">
      <div className="checkout-complete-card">
        <span className="order-payment-spinner checkout-complete-spinner" aria-hidden="true" />
        <h1>{title}</h1>
        <p>{body}</p>
      </div>
    </section>
  )
}
