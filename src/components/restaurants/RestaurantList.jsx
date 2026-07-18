import { useState } from 'react'

function formatUpdatedAt(value) {
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function RestaurantList({
  restaurants,
  loading,
  errorMessage,
  onRetry,
  pendingMutations,
  onUpdate,
  onDelete,
  onOpenVisit,
  visitSummaries,
}) {
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [editError, setEditError] = useState(null)
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null)
  const [deleteError, setDeleteError] = useState(null)

  function beginEdit(restaurant) {
    setEditingId(restaurant.id)
    setEditingName(restaurant.display_name)
    setEditError(null)
    setConfirmingDeleteId(null)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditingName('')
    setEditError(null)
  }

  async function handleUpdate(event, restaurantId) {
    event.preventDefault()

    const trimmedName = editingName.trim()
    if (!trimmedName) {
      setEditError('맛집 이름을 입력해 주세요.')
      return
    }

    setEditError(null)
    const error = await onUpdate(restaurantId, trimmedName)
    if (error) {
      setEditError(error)
      return
    }

    cancelEdit()
  }

  function beginDelete(restaurantId) {
    setConfirmingDeleteId(restaurantId)
    setDeleteError(null)
    cancelEdit()
  }

  function cancelDelete() {
    setConfirmingDeleteId(null)
    setDeleteError(null)
  }

  async function handleDelete(restaurantId) {
    setDeleteError(null)
    const error = await onDelete(restaurantId)
    if (error) {
      setDeleteError(error)
      return
    }

    cancelDelete()
  }

  if (loading) {
    return (
      <p className="restaurant-state" role="status">
        맛집 목록을 불러오는 중…
      </p>
    )
  }

  if (errorMessage) {
    return (
      <div className="restaurant-state restaurant-state-error" role="alert">
        <p>{errorMessage}</p>
        <button className="retry-button" type="button" onClick={onRetry}>
          다시 시도
        </button>
      </div>
    )
  }

  if (restaurants.length === 0) {
    return (
      <p className="restaurant-state">
        아직 저장한 맛집이 없습니다. 기억나는 곳부터 이름만 빠르게 저장해 보세요.
      </p>
    )
  }

  return (
    <ul className="restaurant-list">
      {restaurants.map((restaurant) => (
        <li className="restaurant-card" key={restaurant.id}>
          <div>
            {editingId === restaurant.id ? (
              <form
                className="restaurant-edit-form"
                onSubmit={(event) => handleUpdate(event, restaurant.id)}
              >
                <label className="restaurant-label" htmlFor={`restaurant-edit-name-${restaurant.id}`}>
                  맛집 이름
                </label>
                <input
                  id={`restaurant-edit-name-${restaurant.id}`}
                  className="restaurant-input"
                  type="text"
                  value={editingName}
                  onChange={(event) => setEditingName(event.target.value)}
                  disabled={Boolean(pendingMutations[restaurant.id])}
                  autoComplete="off"
                />
                <div className="restaurant-actions">
                  <button
                    className="restaurant-action"
                    type="submit"
                    disabled={Boolean(pendingMutations[restaurant.id])}
                  >
                    {pendingMutations[restaurant.id] === 'updating' ? '저장 중…' : '저장'}
                  </button>
                  <button
                    className="restaurant-action secondary"
                    type="button"
                    onClick={cancelEdit}
                    disabled={Boolean(pendingMutations[restaurant.id])}
                  >
                    취소
                  </button>
                </div>
                {editError && (
                  <p className="auth-message error" role="alert">
                    {editError}
                  </p>
                )}
              </form>
            ) : (
              <h2 className="restaurant-name">{restaurant.display_name}</h2>
            )}
            {restaurant.area_hint && <p className="restaurant-meta">{restaurant.area_hint}</p>}
          </div>
          <div className="restaurant-card-footer">
            <span className="restaurant-status">
              {restaurant.status === 'visited' ? '방문함' : '미방문'}
            </span>
            {restaurant.status === 'visited' && visitSummaries[restaurant.id] && (
              <div className="restaurant-visit-summary">
                {visitSummaries[restaurant.id].overall_rating !== null && (
                  <span>대표 별점 {visitSummaries[restaurant.id].overall_rating}</span>
                )}
                <span>
                  다시 갈 의향 {visitSummaries[restaurant.id].revisit_intention ? '있음' : '없음'}
                </span>
              </div>
            )}
            <time className="restaurant-updated" dateTime={restaurant.updated_at}>
              최근 수정 {formatUpdatedAt(restaurant.updated_at)}
            </time>
            <div className="restaurant-actions">
              {editingId !== restaurant.id && (
                <button
                  className="restaurant-action"
                  type="button"
                  onClick={() => beginEdit(restaurant)}
                  disabled={Boolean(pendingMutations[restaurant.id])}
                >
                  수정
                </button>
              )}
              <button
                className="restaurant-action secondary"
                type="button"
                onClick={() => onOpenVisit(restaurant.id)}
                disabled={Boolean(pendingMutations[restaurant.id])}
              >
                방문 기록
              </button>
              <button
                className="restaurant-action delete"
                type="button"
                onClick={() => beginDelete(restaurant.id)}
                disabled={Boolean(pendingMutations[restaurant.id])}
              >
                삭제
              </button>
            </div>
            {confirmingDeleteId === restaurant.id && (
              <div className="delete-confirmation" role="alert">
                <p>
                  <strong>{restaurant.display_name}</strong>을(를) 삭제할까요? 연관 기록도 함께
                  삭제됩니다.
                </p>
                <div className="restaurant-actions">
                  <button
                    className="restaurant-action secondary"
                    type="button"
                    onClick={cancelDelete}
                    disabled={Boolean(pendingMutations[restaurant.id])}
                  >
                    취소
                  </button>
                  <button
                    className="restaurant-action delete"
                    type="button"
                    onClick={() => handleDelete(restaurant.id)}
                    disabled={Boolean(pendingMutations[restaurant.id])}
                  >
                    {pendingMutations[restaurant.id] === 'deleting' ? '삭제 중…' : '삭제 확인'}
                  </button>
                </div>
                {deleteError && <p className="auth-message error">{deleteError}</p>}
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}

export default RestaurantList
