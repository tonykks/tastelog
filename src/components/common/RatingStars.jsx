const STAR_VALUES = [1, 2, 3, 4, 5]

/** Accept only integer 1–5; anything else becomes null. */
export function normalizeStarRating(value) {
  if (!Number.isInteger(value) || value < 1 || value > 5) return null
  return value
}

function RatingStars({
  id,
  name,
  label,
  value,
  onChange = null,
  readOnly = false,
  disabled = false,
  allowClear = true,
  showNumeric = true,
}) {
  const rating = normalizeStarRating(value)
  const groupId = id || name || 'rating-stars'

  if (readOnly) {
    if (rating === null) {
      return (
        <span className="rating-stars rating-stars-readonly rating-stars-empty" aria-label="평가 없음">
          평가 없음
        </span>
      )
    }

    return (
      <span
        className="rating-stars rating-stars-readonly"
        aria-label={`5점 만점에 ${rating}점`}
      >
        <span className="rating-stars-glyphs" aria-hidden="true">
          {STAR_VALUES.map((star) => (
            <span
              key={star}
              className={star <= rating ? 'rating-star is-filled' : 'rating-star'}
            >
              {star <= rating ? '★' : '☆'}
            </span>
          ))}
        </span>
        {showNumeric && <span className="rating-stars-numeric">{rating}/5</span>}
      </span>
    )
  }

  return (
    <div className="rating-stars rating-stars-input">
      {label && (
        <p className="restaurant-label" id={`${groupId}-label`}>
          {label}
        </p>
      )}
      <div
        className="rating-stars-group"
        role="radiogroup"
        aria-labelledby={label ? `${groupId}-label` : undefined}
        aria-label={label ? undefined : '별점'}
      >
        {STAR_VALUES.map((star) => {
          const inputId = `${groupId}-star-${star}`
          const filled = rating !== null && star <= rating
          return (
            <label
              key={star}
              className={filled ? 'rating-star-option is-filled' : 'rating-star-option'}
              htmlFor={inputId}
            >
              <input
                id={inputId}
                type="radio"
                name={name || groupId}
                value={star}
                checked={rating === star}
                disabled={disabled}
                onChange={() => onChange?.(star)}
              />
              <span className="rating-star" aria-hidden="true">
                {filled ? '★' : '☆'}
              </span>
              <span className="visually-hidden">{star}점</span>
            </label>
          )
        })}
      </div>
      {allowClear && (
        <button
          className="rating-clear-button"
          type="button"
          onClick={() => onChange?.(null)}
          disabled={disabled || rating === null}
        >
          평가하지 않음
        </button>
      )}
      <p className="rating-stars-current visually-hidden" aria-live="polite">
        {rating === null ? '평가하지 않음' : `현재 ${rating}점`}
      </p>
    </div>
  )
}

export default RatingStars
