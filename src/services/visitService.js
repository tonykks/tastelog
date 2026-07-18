import { supabase } from '../lib/supabase'

const visitColumns =
  'id, restaurant_id, user_id, visited_at, overall_rating, visit_note, revisit_intention, revisit_note, created_at, updated_at'

const restaurantStatusColumns = 'id, status, updated_at'

function toSafeVisitMessage(error) {
  const raw = String(error?.message || '')

  if (/fetch|network|failed to fetch|load failed/i.test(raw)) {
    return '네트워크 연결에 문제가 있습니다. 연결을 확인한 뒤 다시 시도해 주세요.'
  }

  return '방문 기록을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.'
}

function normalizeOptionalText(value) {
  const normalized = String(value ?? '').trim()
  return normalized || null
}

function normalizeRating(value) {
  if (value === '' || value === null || value === undefined) return { rating: null, error: null }

  const rating = Number(value)
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { rating: null, error: '전체 별점은 1에서 5 사이의 정수로 입력해 주세요.' }
  }

  return { rating, error: null }
}

export async function getRepresentativeVisit({ userId, restaurantId }) {
  const { data, error } = await supabase
    .from('visits')
    .select(visitColumns)
    .eq('user_id', userId)
    .eq('restaurant_id', restaurantId)
    .order('visited_at', { ascending: false, nullsFirst: false })
    .order('updated_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) return { visit: null, error: toSafeVisitMessage(error) }
  return { visit: data, error: null }
}

export async function getRepresentativeVisitSummaries({ userId, restaurantIds }) {
  if (restaurantIds.length === 0) return { visitsByRestaurantId: {}, error: null }

  const { data, error } = await supabase
    .from('visits')
    .select(visitColumns)
    .eq('user_id', userId)
    .in('restaurant_id', restaurantIds)
    .order('visited_at', { ascending: false, nullsFirst: false })
    .order('updated_at', { ascending: false })
    .order('id', { ascending: false })

  if (error) return { visitsByRestaurantId: {}, error: toSafeVisitMessage(error) }

  const visitsByRestaurantId = {}
  for (const visit of data) {
    if (!visitsByRestaurantId[visit.restaurant_id]) {
      visitsByRestaurantId[visit.restaurant_id] = visit
    }
  }

  return { visitsByRestaurantId, error: null }
}

export async function saveVisitState({ userId, restaurantId, visitId, values }) {
  const { rating: overallRating, error: ratingError } = normalizeRating(values.overallRating)
  if (ratingError) return { visit: null, restaurant: null, error: ratingError }

  if (!values.visited) {
    return updateRestaurantVisitStatus({ userId, restaurantId, status: 'unvisited' })
  }

  const payload = {
    visited_at: values.visitedAt || null,
    overall_rating: overallRating,
    visit_note: normalizeOptionalText(values.visitNote),
    revisit_intention: Boolean(values.revisitIntention),
    revisit_note: values.revisitIntention ? normalizeOptionalText(values.revisitNote) : null,
  }

  const query = visitId
    ? supabase
        .from('visits')
        .update(payload)
        .eq('id', visitId)
        .eq('user_id', userId)
        .eq('restaurant_id', restaurantId)
    : supabase.from('visits').insert({ ...payload, user_id: userId, restaurant_id: restaurantId })

  const { data: visit, error: visitError } = await query.select(visitColumns).maybeSingle()
  if (visitError || !visit) {
    return { visit: null, restaurant: null, error: toSafeVisitMessage(visitError) }
  }

  const statusResult = await updateRestaurantVisitStatus({ userId, restaurantId, status: 'visited' })
  if (statusResult.error) return { visit, restaurant: null, error: statusResult.error }

  return { visit, restaurant: statusResult.restaurant, error: null }
}

async function updateRestaurantVisitStatus({ userId, restaurantId, status }) {
  const { data, error } = await supabase
    .from('user_restaurants')
    .update({ status })
    .eq('id', restaurantId)
    .eq('user_id', userId)
    .select(restaurantStatusColumns)
    .maybeSingle()

  if (error || !data) {
    return { visit: null, restaurant: null, error: toSafeVisitMessage(error) }
  }

  return { visit: null, restaurant: data, error: null }
}
