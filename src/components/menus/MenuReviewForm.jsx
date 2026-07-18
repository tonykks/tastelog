import { useState } from 'react'

const emptyValues = {
  menuName: '',
  price: '',
  tasteRating: '',
  memo: '',
}

function toFormValues(menuReview) {
  if (!menuReview) return emptyValues

  return {
    menuName: menuReview.menu_name,
    price: menuReview.price?.toString() ?? '',
    tasteRating: menuReview.taste_rating?.toString() ?? '',
    memo: menuReview.memo ?? '',
  }
}

function validateValues(values) {
  if (!values.menuName.trim()) return '메뉴 이름을 입력해 주세요.'

  if (values.price !== '') {
    const price = Number(values.price)
    if (!Number.isInteger(price) || price < 0) return '가격은 0 이상의 정수로 입력해 주세요.'
  }

  if (values.tasteRating !== '') {
    const tasteRating = Number(values.tasteRating)
    if (!Number.isInteger(tasteRating) || tasteRating < 1 || tasteRating > 5) {
      return '맛 평가는 1에서 5 사이의 정수로 입력해 주세요.'
    }
  }

  return null
}

function MenuReviewForm({
  idPrefix,
  initialMenuReview = null,
  pending,
  submitLabel,
  onSubmit,
  onCancel = null,
  onSuccess = null,
}) {
  const [values, setValues] = useState(() => toFormValues(initialMenuReview))
  const [errorMessage, setErrorMessage] = useState(null)

  function updateValue(name, value) {
    setValues((currentValues) => ({ ...currentValues, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const validationError = validateValues(values)
    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    setErrorMessage(null)
    const error = await onSubmit({ ...values, menuName: values.menuName.trim() })
    if (error) {
      setErrorMessage(error)
      return
    }

    if (!initialMenuReview) setValues(emptyValues)
    onSuccess?.()
  }

  return (
    <form className="menu-review-form" onSubmit={handleSubmit} noValidate>
      <label className="restaurant-label" htmlFor={`${idPrefix}-name`}>메뉴 이름</label>
      <input
        id={`${idPrefix}-name`}
        className="restaurant-input"
        type="text"
        value={values.menuName}
        onChange={(event) => updateValue('menuName', event.target.value)}
        disabled={pending}
        autoComplete="off"
      />

      <div className="menu-review-grid">
        <div>
          <label className="restaurant-label" htmlFor={`${idPrefix}-price`}>가격 (선택)</label>
          <input
            id={`${idPrefix}-price`}
            className="restaurant-input"
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            value={values.price}
            onChange={(event) => updateValue('price', event.target.value)}
            disabled={pending}
          />
        </div>
        <div>
          <label className="restaurant-label" htmlFor={`${idPrefix}-taste`}>맛 평가 (선택, 1–5)</label>
          <input
            id={`${idPrefix}-taste`}
            className="restaurant-input"
            type="number"
            min="1"
            max="5"
            step="1"
            inputMode="numeric"
            value={values.tasteRating}
            onChange={(event) => updateValue('tasteRating', event.target.value)}
            disabled={pending}
          />
        </div>
      </div>

      <label className="restaurant-label" htmlFor={`${idPrefix}-memo`}>메모 (선택)</label>
      <textarea
        id={`${idPrefix}-memo`}
        className="restaurant-input visit-textarea"
        value={values.memo}
        onChange={(event) => updateValue('memo', event.target.value)}
        disabled={pending}
      />

      {errorMessage && <p className="auth-message error" role="alert">{errorMessage}</p>}
      <div className="restaurant-actions">
        <button className="restaurant-action" type="submit" disabled={pending}>
          {pending ? '저장 중…' : submitLabel}
        </button>
        {onCancel && (
          <button className="restaurant-action secondary" type="button" onClick={onCancel} disabled={pending}>
            취소
          </button>
        )}
      </div>
    </form>
  )
}

export default MenuReviewForm
