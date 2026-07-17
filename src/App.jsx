import { useEffect, useState } from 'react'
import { missingEnvVars } from './lib/supabase'
import { getInitialSession, onAuthStateChange, signOut } from './services/authService'
import AuthForm from './components/auth/AuthForm'
import './App.css'

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
        <h1>환영합니다!</h1>
        <p>로그인이 완료되었습니다. 맛집 기록 기능은 다음 단계에서 제공됩니다.</p>
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
  return <SignedInScreen session={session} />
}

export default App
