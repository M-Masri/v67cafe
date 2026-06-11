function renderMarqueeItems(items, itemKeyPrefix, suffix, hidden = false) {
  return items.map((item) => (
    <div className="marquee__item" key={`${itemKeyPrefix}${item.id}${suffix}`}>
      <span
        className="marquee__icon marquee__icon-mask"
        style={{ '--icon-url': `url(${item.iconSrc})` }}
        {...(hidden
          ? { 'aria-hidden': true }
          : { role: 'img', 'aria-label': item.label })}
      />
    </div>
  ))
}

export default function HeroIconMarquee({
  items,
  className = '',
  ariaLabel,
  itemKeyPrefix = '',
}) {
  return (
    <div className={['marquee__wrapper', className].filter(Boolean).join(' ')} aria-label={ariaLabel}>
      <div className="marquee__track marquee__track--primary">
        <div className="marquee__repeated-items">
          {renderMarqueeItems(items, itemKeyPrefix, '')}
        </div>
      </div>
      <div className="marquee__track marquee__track--clone" aria-hidden="true">
        <div className="marquee__repeated-items">
          {renderMarqueeItems(items, itemKeyPrefix, '-duplicate', true)}
        </div>
      </div>
    </div>
  )
}
