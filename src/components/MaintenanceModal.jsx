const copy = {
  en: {
    title: 'We\'ll be right back',
    body: 'The cafe is temporarily unavailable for maintenance. Please check again soon.',
  },
  ar: {
    title: 'نرجع لكم قريب',
    body: 'المقهى غير متاح مؤقتاً للصيانة. حاول مرة ثانية بعد شوي.',
  },
}

export default function MaintenanceModal({ isArabic = false, message = null }) {
  const locale = isArabic ? 'ar' : 'en'
  const strings = copy[locale]

  return (
    <div className="maintenance-modal" role="alertdialog" aria-modal="true" aria-labelledby="maintenance-title">
      <div className="maintenance-modal__card">
        <img
          className="maintenance-modal__logo"
          src="/v67_logo_C64429.webp"
          alt=""
          aria-hidden="true"
        />
        <h1 id="maintenance-title" className="maintenance-modal__title">
          {strings.title}
        </h1>
        <p className="maintenance-modal__body">
          {message || strings.body}
        </p>
      </div>
    </div>
  )
}
