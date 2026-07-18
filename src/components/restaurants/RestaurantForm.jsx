import { useState } from 'react'

function RestaurantForm({ creating, onCreate }) {
  const [displayName, setDisplayName] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()

    const trimmedName = displayName.trim()
    if (!trimmedName) {
      setErrorMessage('맛집 이름을 입력해 주세요.')
      return
    }

    setErrorMessage(null)
    const error = await onCreate(trimmedName)
    if (error) {
      setErrorMessage(error)
      return
    }

    setDisplayName('')
  }

  return (
    <form className="restaurant-form" onSubmit={handleSubmit}>
      <label className="restaurant-label" htmlFor="restaurant-display-name">
        맛집 이름
      </label>
      <div className="restaurant-form-row">
        <input
          id="restaurant-display-name"
          className="restaurant-input"
          type="text"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          placeholder="기억나는 맛집 이름을 입력하세요"
          disabled={creating}
          autoComplete="off"
        />
        <button className="restaurant-submit" type="submit" disabled={creating}>
          {creating ? '저장 중…' : '저장'}
        </button>
      </div>
      <p className="restaurant-form-hint">이름만 입력해도 저장할 수 있습니다.</p>
      {errorMessage && (
        <p className="auth-message error" role="alert">
          {errorMessage}
        </p>
      )}
    </form>
  )
}

export default RestaurantForm
