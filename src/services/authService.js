import { supabase } from '../lib/supabase'

// Maps raw Supabase/network errors to safe Korean user-facing messages
// without exposing technical details, URLs, or keys.
function toSafeMessage(error) {
  if (!error) return null
  const raw = String(error.message || '')
  if (/invalid login credentials/i.test(raw)) {
    return '이메일 또는 비밀번호가 올바르지 않습니다.'
  }
  if (/email not confirmed/i.test(raw)) {
    return '이메일 인증이 완료되지 않았습니다. 받은 편지함에서 확인 메일을 열어주세요.'
  }
  if (/user already registered/i.test(raw)) {
    return '이미 가입된 이메일입니다. 로그인해 주세요.'
  }
  if (/password should be at least/i.test(raw)) {
    return '비밀번호는 최소 6자 이상이어야 합니다.'
  }
  if (/unable to validate email|invalid email|invalid format/i.test(raw)) {
    return '이메일 주소 형식이 올바르지 않습니다.'
  }
  if (/rate limit|too many requests/i.test(raw)) {
    return '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.'
  }
  if (/fetch|network|failed to fetch|load failed/i.test(raw)) {
    return '네트워크 연결에 문제가 있습니다. 연결을 확인한 뒤 다시 시도해 주세요.'
  }
  return '요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.'
}

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) return { user: null, needsEmailConfirm: false, error: toSafeMessage(error) }
  // With email confirmation enabled, a session is not returned until the user confirms.
  const needsEmailConfirm = !data.session
  return { user: data.user, needsEmailConfirm, error: null }
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { session: null, error: toSafeMessage(error) }
  return { session: data.session, error: null }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut({ scope: 'local' })
  return { error: toSafeMessage(error) }
}

export async function getInitialSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) return { session: null, error: toSafeMessage(error) }
  return { session: data.session, error: null }
}

export function onAuthStateChange(callback) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session)
  })
  return () => data.subscription.unsubscribe()
}
