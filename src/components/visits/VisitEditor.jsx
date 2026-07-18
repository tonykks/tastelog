import { useEffect, useRef, useState } from 'react'
import { getRepresentativeVisit, saveVisitState } from '../../services/visitService'

function toFormValues(visit) {
  return {
    visitedAt: visit?.visited_at ?? '',
    overallRating: visit?.overall_rating?.toString() ?? '',
    visitNote: visit?.visit_note ?? '',
    revisitIntention: Boolean(visit?.revisit_intention),
    revisitNote: visit?.revisit_note ?? '',
  }
}

function VisitEditor({ restaurant, userId, onSaved, onCancel }) {
  const [visited, setVisited] = useState(restaurant.status === 'visited')
  const [representativeVisit, setRepresentativeVisit] = useState(null)
  const [values, setValues] = useState(() => toFormValues(null))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [loadAttempt, setLoadAttempt] = useState(0)
  const isMountedRef = useRef(true)
  const loadRequestIdRef = useRef(0)
  const saveRequestIdRef = useRef(0)

  useEffect(() => {
    isMountedRef.current = true
    const requestId = ++loadRequestIdRef.current

    async function load() {
      setLoading(true)
      setLoadError(null)
      setErrorMessage(null)
      const { visit, error } = await getRepresentativeVisit({ userId, restaurantId: restaurant.id })
      if (!isMountedRef.current || requestId !== loadRequestIdRef.current) return

      setRepresentativeVisit(visit)
      setValues(toFormValues(visit))
      setLoadError(error)
      setLoading(false)
    }

    load()

    return () => {
      isMountedRef.current = false
      loadRequestIdRef.current += 1
      saveRequestIdRef.current += 1
    }
  }, [restaurant.id, userId, loadAttempt])

  function updateValue(name, value) {
    setValues((currentValues) => ({ ...currentValues, [name]: value }))
  }

  function handleVisitedChange(nextVisited) {
    setVisited(nextVisited)
    setErrorMessage(null)
    if (nextVisited && representativeVisit) setValues(toFormValues(representativeVisit))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const requestId = ++saveRequestIdRef.current
    setSaving(true)
    setErrorMessage(null)

    const result = await saveVisitState({
      userId,
      restaurantId: restaurant.id,
      visitId: visited ? representativeVisit?.id : null,
      values: { visited, ...values },
    })
    if (!isMountedRef.current || requestId !== saveRequestIdRef.current) return

    setSaving(false)
    if (result.error) {
      if (result.visit) setRepresentativeVisit(result.visit)
      setErrorMessage(result.error)
      return
    }

    setRepresentativeVisit(result.visit ?? representativeVisit)
    onSaved(result.restaurant, result.visit)
  }

  if (loading) {
    return (
      <section className="visit-editor" aria-labelledby="visit-editor-title">
        <p className="restaurant-state" role="status">방문 기록을 불러오는 중…</p>
      </section>
    )
  }

  if (loadError) {
    return (
      <section className="visit-editor" aria-labelledby="visit-editor-title">
        <h2 id="visit-editor-title">{restaurant.display_name} 방문 기록</h2>
        <div className="restaurant-state restaurant-state-error" role="alert">
          <p>{loadError}</p>
          <button className="retry-button" type="button" onClick={() => setLoadAttempt((value) => value + 1)}>
            다시 시도
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="visit-editor" aria-labelledby="visit-editor-title">
      <div className="visit-editor-heading">
        <div>
          <h2 id="visit-editor-title">{restaurant.display_name} 방문 기록</h2>
          <p>대표 방문 1건을 기준으로 기록합니다.</p>
        </div>
        <button className="restaurant-action secondary" type="button" onClick={onCancel} disabled={saving}>
          닫기
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <fieldset className="visit-status-fieldset" disabled={saving}>
          <legend>방문 여부</legend>
          <label className="visit-choice">
            <input
              type="radio"
              name={`visit-status-${restaurant.id}`}
              checked={!visited}
              onChange={() => handleVisitedChange(false)}
            />
            미방문
          </label>
          <label className="visit-choice">
            <input
              type="radio"
              name={`visit-status-${restaurant.id}`}
              checked={visited}
              onChange={() => handleVisitedChange(true)}
            />
            방문함
          </label>
        </fieldset>

        {visited ? (
          <div className="visit-fields">
            <label className="restaurant-label" htmlFor={`visit-date-${restaurant.id}`}>방문일</label>
            <input
              id={`visit-date-${restaurant.id}`}
              className="restaurant-input"
              type="date"
              value={values.visitedAt}
              onChange={(event) => updateValue('visitedAt', event.target.value)}
              disabled={saving}
            />

            <label className="restaurant-label" htmlFor={`visit-rating-${restaurant.id}`}>전체 별점 (선택)</label>
            <input
              id={`visit-rating-${restaurant.id}`}
              className="restaurant-input"
              type="number"
              min="1"
              max="5"
              step="1"
              inputMode="numeric"
              value={values.overallRating}
              onChange={(event) => updateValue('overallRating', event.target.value)}
              disabled={saving}
            />

            <label className="restaurant-label" htmlFor={`visit-note-${restaurant.id}`}>방문 메모</label>
            <textarea
              id={`visit-note-${restaurant.id}`}
              className="restaurant-input visit-textarea"
              value={values.visitNote}
              onChange={(event) => updateValue('visitNote', event.target.value)}
              disabled={saving}
            />

            <label className="visit-choice" htmlFor={`revisit-intention-${restaurant.id}`}>
              <input
                id={`revisit-intention-${restaurant.id}`}
                type="checkbox"
                checked={values.revisitIntention}
                onChange={(event) => updateValue('revisitIntention', event.target.checked)}
                disabled={saving}
              />
              다시 방문하고 싶어요
            </label>

            <label className="restaurant-label" htmlFor={`revisit-note-${restaurant.id}`}>재방문 메모</label>
            <textarea
              id={`revisit-note-${restaurant.id}`}
              className="restaurant-input visit-textarea"
              value={values.revisitNote}
              onChange={(event) => updateValue('revisitNote', event.target.value)}
              disabled={saving || !values.revisitIntention}
            />
          </div>
        ) : (
          <p className="visit-empty-message">
            아직 방문하지 않았습니다. 기존 방문 기록은 삭제하지 않고, 다시 방문함으로 바꾸면 대표 기록을
            이어서 수정할 수 있습니다.
          </p>
        )}

        {errorMessage && <p className="auth-message error" role="alert">{errorMessage}</p>}
        <div className="restaurant-actions visit-editor-actions">
          <button className="restaurant-action" type="submit" disabled={saving}>
            {saving ? '저장 중…' : '방문 기록 저장'}
          </button>
          <button className="restaurant-action secondary" type="button" onClick={onCancel} disabled={saving}>
            취소
          </button>
        </div>
      </form>
    </section>
  )
}

export default VisitEditor
