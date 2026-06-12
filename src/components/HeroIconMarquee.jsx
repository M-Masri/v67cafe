const MARQUEE_SEGMENT_REPEATS = 3

function renderMarqueeItems(items, itemKeyPrefix, suffix, hidden = false) {
  const nodes = []

  for (let repeat = 0; repeat < MARQUEE_SEGMENT_REPEATS; repeat += 1) {
    items.forEach((item) => {
      nodes.push(
        <div className="marquee__item" key={`${itemKeyPrefix}${suffix}-${repeat}-${item.id}`}>
          <span
            className="marquee__icon marquee__icon-mask"
            style={{ '--icon-url': `url(${item.iconSrc})` }}
            {...(hidden
              ? { 'aria-hidden': true }
              : { role: 'img', 'aria-label': item.label })}
          />
        </div>,
      )
    })
  }

  return nodes
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
        <div className="marquee__segment">
          {renderMarqueeItems(items, itemKeyPrefix, 'primary')}
        </div>
      </div>
      <div className="marquee__track marquee__track--clone" aria-hidden="true">
        <div className="marquee__segment">
          {renderMarqueeItems(items, itemKeyPrefix, 'clone', true)}
        </div>
      </div>
    </div>
  )
}
