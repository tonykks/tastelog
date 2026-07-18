import { useState } from 'react'
import { signIn, signUp } from '../../services/authService'

const MIN_PASSWORD_LENGTH = 6

function AuthForm() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [infoMessage, setInfoMessage] = useState(null)

  const isLogin = mode === 'login'

  function switchMode(nextMode) {
    setMode(nextMode)
    setErrorMessage(null)
    setInfoMessage(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage(null)
    setInfoMessage(null)

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setErrorMessage('이메일을 입력해 주세요.')
      return
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setErrorMessage(`비밀번호는 최소 ${MIN_PASSWORD_LENGTH}자 이상이어야 합니다.`)
      return
    }

    setSubmitting(true)
    try {
      if (isLogin) {
        const { error } = await signIn(trimmedEmail, password)
        if (error) setErrorMessage(error)
        // On success, onAuthStateChange in App updates the session and screen.
      } else {
        const { needsEmailConfirm, error } = await signUp(trimmedEmail, password)
        if (error) {
          setErrorMessage(error)
        } else if (needsEmailConfirm) {
          setInfoMessage(
            '가입 확인 메일을 보냈습니다. 받은 편지함에서 인증을 완료한 뒤 로그인해 주세요.',
          )
          setMode('login')
        }
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-card">
      <h1 className="auth-title">다시갈집</h1>
      <p className="auth-brand-secondary">TasteLog</p>
      <p className="auth-subtitle">기억나는 맛집 이름부터 기록해 보세요.</p>

      <div className="auth-tabs" aria-label="로그인 또는 회원가입 선택">
        <button
          type="button"
          aria-pressed={isLogin}
          className={isLogin ? 'auth-tab active' : 'auth-tab'}
          onClick={() => switchMode('login')}
          disabled={submitting}
        >
          로그인
        </button>
        <button
          type="button"
          aria-pressed={!isLogin}
          className={!isLogin ? 'auth-tab active' : 'auth-tab'}
          onClick={() => switchMode('signup')}
          disabled={submitting}
        >
          회원가입
        </button>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <label className="auth-label" htmlFor="auth-email">
          이메일
        </label>
        <input
          id="auth-email"
          className="auth-input"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={submitting}
          required
        />

        <label className="auth-label" htmlFor="auth-password">
          비밀번호
        </label>
        <input
          id="auth-password"
          className="auth-input"
          type="password"
          autoComplete={isLogin ? 'current-password' : 'new-password'}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={submitting}
          minLength={MIN_PASSWORD_LENGTH}
          required
        />

        {errorMessage && (
          <p className="auth-message error" role="alert">
            {errorMessage}
          </p>
        )}
        {infoMessage && (
          <p className="auth-message info" role="status">
            {infoMessage}
          </p>
        )}

        <button className="auth-submit" type="submit" disabled={submitting}>
          {submitting ? '처리 중…' : isLogin ? '로그인' : '회원가입'}
        </button>
      </form>
    </div>
  )
}

export default AuthForm
