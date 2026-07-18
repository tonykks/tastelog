import { useCallback, useEffect, useRef, useState } from 'react'
import { missingEnvVars } from './lib/supabase'
import { getInitialSession, onAuthStateChange, signOut } from './services/authService'
import AuthForm from './components/auth/AuthForm'
import RestaurantForm from './components/restaurants/RestaurantForm'
import RestaurantList from './components/restaurants/RestaurantList'
import VisitEditor from './components/visits/VisitEditor'
import {
  createRestaurant,
  deleteRestaurant,
  getRestaurants,
  updateRestaurant,
} from './services/restaurantService'
import { getRepresentativeVisitSummaries } from './services/visitService'
import './App.css'

function sortRestaurantsByUpdatedAt(restaurants) {
  return [...restaurants].sort(
    (left, right) => new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime(),
  )
}

function EnvErrorScreen() {
  return (
    <main className="screen center">
      <div className="auth-card">
        <h1 className="auth-title">TasteLog</h1>
        <p className="auth-message error" role="alert">
          앱 환경설정이 완료되지 않아 시작할 수 없습니다.
        </p>
        <p className="env-hint">
          다음 환경변수를 <code>.env.local</code>에 설정한 뒤 앱을 다시 시작해 주세요.
        </p>
        <ul className="env-list">
          {missingEnvVars.map((name) => (
            <li key={name}>
              <code>{name}</code>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}

function LoadingScreen() {
  return (
    <main className="screen center">
      <p className="loading-text" role="status">
        세션을 확인하는 중…
      </p>
    </main>
  )
}

function SessionErrorScreen({ message }) {
  return (
    <main className="screen center">
      <div className="auth-card">
        <h1 className="auth-title">TasteLog</h1>
        <p className="auth-message error" role="alert">
          {message}
        </p>
        <p className="env-hint">페이지를 새로고침해 다시 시도해 주세요.</p>
        <button className="auth-submit" type="button" onClick={() => window.location.reload()}>
          새로고침
        </button>
      </div>
    </main>
  )
}

function SignedInScreen({ session }) {
  const [signingOut, setSigningOut] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [restaurants, setRestaurants] = useState([])
  const [restaurantsLoading, setRestaurantsLoading] = useState(true)
  const [restaurantError, setRestaurantError] = useState(null)
  const [creating, setCreating] = useState(false)
  const userId = session.user.id
  const isMountedRef = useRef(true)
  const listRequestIdRef = useRef(0)
  const createRequestIdRef = useRef(0)
  const mutationRequestIdsRef = useRef(new Map())
  const nextMutationRequestIdRef = useRef(0)
  const [pendingMutations, setPendingMutations] = useState({})
  const [activeVisitRestaurantId, setActiveVisitRestaurantId] = useState(null)
  const [visitSummaries, setVisitSummaries] = useState({})

  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
      listRequestIdRef.current += 1
      createRequestIdRef.current += 1
      mutationRequestIdsRef.current.clear()
    }
  }, [])

  const loadRestaurants = useCallback(async () => {
    const requestId = ++listRequestIdRef.current
    setRestaurantsLoading(true)
    setRestaurantError(null)

    const { restaurants: nextRestaurants, error } = await getRestaurants(userId)
    if (!isMountedRef.current || requestId !== listRequestIdRef.current) return

    if (error) {
      setRestaurants(nextRestaurants)
      setVisitSummaries({})
      setRestaurantError(error)
      setRestaurantsLoading(false)
      return
    }

    const summaryResult = await getRepresentativeVisitSummaries({
      userId,
      restaurantIds: nextRestaurants.map((restaurant) => restaurant.id),
    })
    if (!isMountedRef.current || requestId !== listRequestIdRef.current) return

    setRestaurants(nextRestaurants)
    setVisitSummaries(summaryResult.error ? {} : summaryResult.visitsByRestaurantId)
    setRestaurantError(null)
    setRestaurantsLoading(false)
  }, [userId])

  useEffect(() => {
    loadRestaurants()
    return () => {
      listRequestIdRef.current += 1
    }
  }, [loadRestaurants])

  async function handleCreate(displayName) {
    const requestId = ++createRequestIdRef.current
    setCreating(true)
    const { restaurant, error } = await createRestaurant({ userId, displayName })
    if (!isMountedRef.current || requestId !== createRequestIdRef.current) return null

    setCreating(false)

    if (error) return error

    setRestaurants((currentRestaurants) => [restaurant, ...currentRestaurants])
    setRestaurantError(null)
    return null
  }

  function setPendingMutation(restaurantId, type) {
    setPendingMutations((currentMutations) => ({
      ...currentMutations,
      [restaurantId]: type,
    }))
  }

  function clearPendingMutation(restaurantId) {
    setPendingMutations((currentMutations) => {
      const { [restaurantId]: _removedMutation, ...remainingMutations } = currentMutations
      return remainingMutations
    })
  }

  async function handleUpdate(restaurantId, displayName) {
    const requestId = ++nextMutationRequestIdRef.current
    mutationRequestIdsRef.current.set(restaurantId, requestId)
    setPendingMutation(restaurantId, 'updating')

    const { restaurant, error } = await updateRestaurant({ userId, restaurantId, displayName })
    if (!isMountedRef.current || mutationRequestIdsRef.current.get(restaurantId) !== requestId) {
      return null
    }

    mutationRequestIdsRef.current.delete(restaurantId)
    clearPendingMutation(restaurantId)
    if (error) return error

    setRestaurants((currentRestaurants) =>
      sortRestaurantsByUpdatedAt(
        currentRestaurants.map((currentRestaurant) =>
          currentRestaurant.id === restaurant.id ? restaurant : currentRestaurant,
        ),
      ),
    )
    return null
  }

  async function handleDelete(restaurantId) {
    const requestId = ++nextMutationRequestIdRef.current
    mutationRequestIdsRef.current.set(restaurantId, requestId)
    setPendingMutation(restaurantId, 'deleting')

    const { restaurantId: deletedRestaurantId, error } = await deleteRestaurant({
      userId,
      restaurantId,
    })
    if (!isMountedRef.current || mutationRequestIdsRef.current.get(restaurantId) !== requestId) {
      return null
    }

    mutationRequestIdsRef.current.delete(restaurantId)
    clearPendingMutation(restaurantId)
    if (error) return error

    setRestaurants((currentRestaurants) =>
      currentRestaurants.filter((restaurant) => restaurant.id !== deletedRestaurantId),
    )
    setVisitSummaries((currentSummaries) => {
      const { [deletedRestaurantId]: _deletedSummary, ...remainingSummaries } = currentSummaries
      return remainingSummaries
    })
    if (activeVisitRestaurantId === deletedRestaurantId) setActiveVisitRestaurantId(null)
    return null
  }

  function handleVisitSaved(updatedRestaurant, representativeVisit) {
    setRestaurants((currentRestaurants) =>
      sortRestaurantsByUpdatedAt(
        currentRestaurants.map((restaurant) =>
          restaurant.id === updatedRestaurant.id ? { ...restaurant, ...updatedRestaurant } : restaurant,
        ),
      ),
    )
    setVisitSummaries((currentSummaries) => {
      if (updatedRestaurant.status === 'visited' && representativeVisit) {
        return { ...currentSummaries, [updatedRestaurant.id]: representativeVisit }
      }

      const { [updatedRestaurant.id]: _hiddenSummary, ...remainingSummaries } = currentSummaries
      return remainingSummaries
    })
    setActiveVisitRestaurantId(null)
  }

  const activeVisitRestaurant = restaurants.find(
    (restaurant) => restaurant.id === activeVisitRestaurantId,
  )

  async function handleSignOut() {
    setSigningOut(true)
    setErrorMessage(null)
    const { error } = await signOut()
    if (error) {
      setErrorMessage(error)
      setSigningOut(false)
    }
    // On success, onAuthStateChange clears the session and returns to the Auth screen.
  }

  return (
    <div className="screen">
      <header className="app-header">
        <span className="app-brand">TasteLog</span>
        <div className="app-header-user">
          <span className="app-user-email">{session.user?.email}</span>
          <button
            type="button"
            className="signout-button"
            onClick={handleSignOut}
            disabled={signingOut}
          >
            {signingOut ? '로그아웃 중…' : '로그아웃'}
          </button>
        </div>
      </header>
      <main className="app-main">
        <div className="restaurant-page-heading">
          <h1>내 맛집 기록</h1>
          <p>기억나는 맛집 이름부터 저장해 보세요.</p>
        </div>
        <RestaurantForm creating={creating} onCreate={handleCreate} />
        <RestaurantList
          restaurants={restaurants}
          loading={restaurantsLoading}
          errorMessage={restaurantError}
          onRetry={loadRestaurants}
          pendingMutations={pendingMutations}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onOpenVisit={setActiveVisitRestaurantId}
          visitSummaries={visitSummaries}
        />
        {activeVisitRestaurant && (
          <VisitEditor
            restaurant={activeVisitRestaurant}
            userId={userId}
            onSaved={handleVisitSaved}
            onCancel={() => setActiveVisitRestaurantId(null)}
          />
        )}
        {errorMessage && (
          <p className="auth-message error" role="alert">
            {errorMessage}
          </p>
        )}
      </main>
    </div>
  )
}

function App() {
  const [session, setSession] = useState(null)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [initializationError, setInitializationError] = useState(null)

  useEffect(() => {
    if (missingEnvVars.length > 0) return undefined

    let active = true

    getInitialSession().then(({ session: initialSession, error }) => {
      if (!active) return
      setInitializationError(error)
      setSession(initialSession)
      setSessionLoading(false)
    })

    const unsubscribe = onAuthStateChange((nextSession) => {
      if (!active) return
      setSession(nextSession)
      setSessionLoading(false)
    })

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  if (missingEnvVars.length > 0) return <EnvErrorScreen />
  if (sessionLoading) return <LoadingScreen />
  if (initializationError) return <SessionErrorScreen message={initializationError} />
  if (!session) {
    return (
      <main className="screen center">
        <AuthForm />
      </main>
    )
  }
  return <SignedInScreen key={session.user.id} session={session} />
}

export default App
