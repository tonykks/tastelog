import { useEffect, useRef, useState } from 'react'
import {
  createMenuReview,
  deleteMenuReview,
  getMenuReviews,
  updateMenuReview,
} from '../../services/menuReviewService'
import RatingStars from '../common/RatingStars'
import MenuReviewForm from './MenuReviewForm'

function sortMenuReviews(menuReviews) {
  return [...menuReviews].sort((left, right) => {
    const updatedDifference =
      new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime()
    return updatedDifference || right.id.localeCompare(left.id)
  })
}

function formatPrice(price) {
  return `${new Intl.NumberFormat('ko-KR').format(price)}원`
}

function MenuReviewPanel({ restaurant, userId, onClose }) {
  const [menuReviews, setMenuReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [loadAttempt, setLoadAttempt] = useState(0)
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null)
  const [deleteErrors, setDeleteErrors] = useState({})
  const [pendingMutations, setPendingMutations] = useState({})
  const isMountedRef = useRef(true)
  const loadRequestIdRef = useRef(0)
  const createRequestIdRef = useRef(0)
  const mutationRequestIdsRef = useRef(new Map())
  const nextMutationRequestIdRef = useRef(0)

  useEffect(() => {
    isMountedRef.current = true
    const requestId = ++loadRequestIdRef.current

    async function load() {
      setLoading(true)
      setLoadError(null)
      const result = await getMenuReviews({ userId, restaurantId: restaurant.id })
      if (!isMountedRef.current || requestId !== loadRequestIdRef.current) return

      setMenuReviews(result.menuReviews)
      setLoadError(result.error)
      setLoading(false)
    }

    load()

    return () => {
      isMountedRef.current = false
      loadRequestIdRef.current += 1
      createRequestIdRef.current += 1
      mutationRequestIdsRef.current.clear()
    }
  }, [restaurant.id, userId, loadAttempt])

  function setPendingMutation(menuReviewId, type) {
    setPendingMutations((current) => ({ ...current, [menuReviewId]: type }))
  }

  function clearPendingMutation(menuReviewId) {
    setPendingMutations((current) => {
      const { [menuReviewId]: _removed, ...remaining } = current
      return remaining
    })
  }

  function clearDeleteError(menuReviewId) {
    setDeleteErrors((current) => {
      const { [menuReviewId]: _removed, ...remaining } = current
      return remaining
    })
  }

  async function handleCreate(values) {
    const requestId = ++createRequestIdRef.current
    setCreating(true)
    const result = await createMenuReview({ userId, restaurantId: restaurant.id, values })
    if (!isMountedRef.current) return { aborted: true }
    if (requestId !== createRequestIdRef.current) {
      setCreating(false)
      return { aborted: true }
    }

    setCreating(false)
    if (result.error) return result.error

    setMenuReviews((current) => sortMenuReviews([result.menuReview, ...current]))
    return null
  }

  async function handleUpdate(menuReviewId, values) {
    const requestId = ++nextMutationRequestIdRef.current
    mutationRequestIdsRef.current.set(menuReviewId, requestId)
    setPendingMutation(menuReviewId, 'updating')

    const result = await updateMenuReview({
      userId,
      restaurantId: restaurant.id,
      menuReviewId,
      values,
    })
    if (!isMountedRef.current) return { aborted: true }
    if (mutationRequestIdsRef.current.get(menuReviewId) !== requestId) {
      clearPendingMutation(menuReviewId)
      return { aborted: true }
    }

    mutationRequestIdsRef.current.delete(menuReviewId)
    clearPendingMutation(menuReviewId)
    if (result.error) return result.error

    setMenuReviews((current) =>
      sortMenuReviews(
        current.map((menuReview) =>
          menuReview.id === result.menuReview.id ? result.menuReview : menuReview,
        ),
      ),
    )
    return null
  }

  async function handleDelete(menuReviewId) {
    const requestId = ++nextMutationRequestIdRef.current
    mutationRequestIdsRef.current.set(menuReviewId, requestId)
    setPendingMutation(menuReviewId, 'deleting')
    clearDeleteError(menuReviewId)

    const result = await deleteMenuReview({
      userId,
      restaurantId: restaurant.id,
      menuReviewId,
    })
    if (!isMountedRef.current || mutationRequestIdsRef.current.get(menuReviewId) !== requestId) {
      return
    }

    mutationRequestIdsRef.current.delete(menuReviewId)
    clearPendingMutation(menuReviewId)
    if (result.error) {
      setDeleteErrors((current) => ({ ...current, [menuReviewId]: result.error }))
      return
    }

    setMenuReviews((current) =>
      current.filter((menuReview) => menuReview.id !== result.menuReviewId),
    )
    setConfirmingDeleteId(null)
  }

  const hasPendingMutation = creating || Object.keys(pendingMutations).length > 0

  return (
    <section className="menu-review-panel" aria-labelledby="menu-review-title">
      <div className="visit-editor-heading">
        <div>
          <h2 id="menu-review-title">{restaurant.display_name} 메뉴 기록</h2>
          <p>메뉴별 가격과 맛 평가를 여러 개 저장할 수 있습니다.</p>
        </div>
        <button
          className="restaurant-action secondary panel-close-button"
          type="button"
          onClick={onClose}
          disabled={hasPendingMutation}
          aria-label="메뉴 기록 닫기"
        >
          ×
        </button>
      </div>

      {loading ? (
        <p className="restaurant-state" role="status">메뉴 기록을 불러오는 중…</p>
      ) : loadError ? (
        <div className="restaurant-state restaurant-state-error" role="alert">
          <p>{loadError}</p>
          <button className="retry-button" type="button" onClick={() => setLoadAttempt((value) => value + 1)}>
            다시 시도
          </button>
        </div>
      ) : (
        <>
          <div className="menu-create-section">
            <h3>메뉴 추가</h3>
            <MenuReviewForm
              idPrefix={`menu-create-${restaurant.id}`}
              pending={creating}
              submitLabel="메뉴 추가"
              onSubmit={handleCreate}
            />
          </div>

          {menuReviews.length === 0 ? (
            <p className="restaurant-state">아직 저장한 메뉴가 없습니다. 이름만으로 첫 메뉴를 추가해 보세요.</p>
          ) : (
            <ul className="menu-review-list">
              {menuReviews.map((menuReview) => {
            const pending = Boolean(pendingMutations[menuReview.id])
            return (
              <li className="menu-review-card" key={menuReview.id}>
                {editingId === menuReview.id ? (
                  <MenuReviewForm
                    key={menuReview.id}
                    idPrefix={`menu-edit-${menuReview.id}`}
                    initialMenuReview={menuReview}
                    pending={pending}
                    submitLabel="변경 저장"
                    onSubmit={(values) => handleUpdate(menuReview.id, values)}
                    onCancel={() => setEditingId(null)}
                    onSuccess={() => setEditingId(null)}
                  />
                ) : (
                  <>
                    <div className="menu-review-heading">
                      <h3>{menuReview.menu_name}</h3>
                      <div className="menu-review-meta">
                        {menuReview.price !== null && <span>{formatPrice(menuReview.price)}</span>}
                        {menuReview.taste_rating !== null && menuReview.taste_rating !== undefined && (
                          <RatingStars value={menuReview.taste_rating} readOnly showNumeric />
                        )}
                      </div>
                    </div>
                    {menuReview.memo && <p className="menu-review-memo">{menuReview.memo}</p>}
                    <div className="restaurant-actions">
                      <button
                        className="restaurant-action"
                        type="button"
                        onClick={() => {
                          setEditingId(menuReview.id)
                          setConfirmingDeleteId(null)
                        }}
                        disabled={pending}
                      >
                        수정
                      </button>
                      <button
                        className="restaurant-action delete"
                        type="button"
                        onClick={() => {
                          setConfirmingDeleteId(menuReview.id)
                          clearDeleteError(menuReview.id)
                        }}
                        disabled={pending}
                      >
                        삭제
                      </button>
                    </div>
                  </>
                )}

                {confirmingDeleteId === menuReview.id && (
                  <div className="delete-confirmation" role="alert">
                    <p><strong>{menuReview.menu_name}</strong> 메뉴 기록만 삭제할까요?</p>
                    <div className="restaurant-actions">
                      <button
                        className="restaurant-action secondary"
                        type="button"
                        onClick={() => {
                          setConfirmingDeleteId(null)
                          clearDeleteError(menuReview.id)
                        }}
                        disabled={pending}
                      >
                        취소
                      </button>
                      <button
                        className="restaurant-action delete"
                        type="button"
                        onClick={() => handleDelete(menuReview.id)}
                        disabled={pending}
                      >
                        {pendingMutations[menuReview.id] === 'deleting' ? '삭제 중…' : '삭제 확인'}
                      </button>
                    </div>
                    {deleteErrors[menuReview.id] && (
                      <p className="auth-message error" role="alert">{deleteErrors[menuReview.id]}</p>
                    )}
                  </div>
                )}
              </li>
            )
              })}
            </ul>
          )}
        </>
      )}
    </section>
  )
}

export default MenuReviewPanel
