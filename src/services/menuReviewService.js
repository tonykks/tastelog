import { supabase } from '../lib/supabase'

const menuReviewColumns =
  'id, visit_id, restaurant_id, user_id, menu_name, price, taste_rating, memo, created_at, updated_at'

function toSafeMenuReviewMessage(error) {
  const raw = String(error?.message || '')

  if (/fetch|network|failed to fetch|load failed/i.test(raw)) {
    return '네트워크 연결에 문제가 있습니다. 연결을 확인한 뒤 다시 시도해 주세요.'
  }

  return '메뉴 기록을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.'
}

function normalizeOptionalInteger(value, { invalidMessage, min, max = null }) {
  const text = String(value ?? '').trim()
  if (!text) {
    return { value: null, error: null }
  }

  const normalized = Number(text)
  const outsideRange = normalized < min || (max !== null && normalized > max)
  if (!Number.isInteger(normalized) || outsideRange) {
    return { value: null, error: invalidMessage }
  }

  return { value: normalized, error: null }
}

function normalizeMenuReviewValues(values) {
  const menuName = String(values.menuName ?? '').trim()
  if (!menuName) return { values: null, error: '메뉴 이름을 입력해 주세요.' }

  const priceResult = normalizeOptionalInteger(values.price, {
    invalidMessage: '가격은 0 이상의 정수로 입력해 주세요.',
    min: 0,
  })
  if (priceResult.error) return { values: null, error: priceResult.error }

  const tasteResult = normalizeOptionalInteger(values.tasteRating, {
    invalidMessage: '맛 평가는 1에서 5 사이의 정수로 입력해 주세요.',
    min: 1,
    max: 5,
  })
  if (tasteResult.error) return { values: null, error: tasteResult.error }

  const memo = String(values.memo ?? '').trim()
  return {
    values: {
      menu_name: menuName,
      price: priceResult.value,
      taste_rating: tasteResult.value,
      memo: memo || null,
    },
    error: null,
  }
}

export async function getMenuReviews({ userId, restaurantId }) {
  const { data, error } = await supabase
    .from('menu_reviews')
    .select(menuReviewColumns)
    .eq('user_id', userId)
    .eq('restaurant_id', restaurantId)
    .order('updated_at', { ascending: false })
    .order('id', { ascending: false })

  if (error) return { menuReviews: [], error: toSafeMenuReviewMessage(error) }
  return { menuReviews: data, error: null }
}

export async function createMenuReview({ userId, restaurantId, values }) {
  const normalized = normalizeMenuReviewValues(values)
  if (normalized.error) return { menuReview: null, error: normalized.error }

  const { data, error } = await supabase
    .from('menu_reviews')
    .insert({ ...normalized.values, user_id: userId, restaurant_id: restaurantId })
    .select(menuReviewColumns)
    .maybeSingle()

  if (error || !data) return { menuReview: null, error: toSafeMenuReviewMessage(error) }
  return { menuReview: data, error: null }
}

export async function updateMenuReview({ userId, restaurantId, menuReviewId, values }) {
  const normalized = normalizeMenuReviewValues(values)
  if (normalized.error) return { menuReview: null, error: normalized.error }

  const { data, error } = await supabase
    .from('menu_reviews')
    .update(normalized.values)
    .eq('id', menuReviewId)
    .eq('user_id', userId)
    .eq('restaurant_id', restaurantId)
    .select(menuReviewColumns)
    .maybeSingle()

  if (error || !data) return { menuReview: null, error: toSafeMenuReviewMessage(error) }
  return { menuReview: data, error: null }
}

export async function deleteMenuReview({ userId, restaurantId, menuReviewId }) {
  const { data, error } = await supabase
    .from('menu_reviews')
    .delete()
    .eq('id', menuReviewId)
    .eq('user_id', userId)
    .eq('restaurant_id', restaurantId)
    .select('id')
    .maybeSingle()

  if (error || !data) return { menuReviewId: null, error: toSafeMenuReviewMessage(error) }
  return { menuReviewId: data.id, error: null }
}
