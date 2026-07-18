import { supabase } from '../lib/supabase'

const restaurantColumns =
  'id, display_name, area_hint, category, recommendation_note, status, created_at, updated_at'

function toSafeRestaurantMessage(error) {
  const raw = String(error?.message || '')

  if (/fetch|network|failed to fetch|load failed/i.test(raw)) {
    return '네트워크 연결에 문제가 있습니다. 연결을 확인한 뒤 다시 시도해 주세요.'
  }

  return '맛집 정보를 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.'
}

export async function getRestaurants(userId) {
  const { data, error } = await supabase
    .from('user_restaurants')
    .select(restaurantColumns)
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) return { restaurants: [], error: toSafeRestaurantMessage(error) }
  return { restaurants: data, error: null }
}

export async function createRestaurant({ userId, displayName }) {
  const normalizedDisplayName = String(displayName ?? '').trim()
  if (!normalizedDisplayName) {
    return { restaurant: null, error: '맛집 이름을 입력해 주세요.' }
  }

  const { data, error } = await supabase
    .from('user_restaurants')
    .insert({ user_id: userId, display_name: normalizedDisplayName })
    .select(restaurantColumns)
    .single()

  if (error) return { restaurant: null, error: toSafeRestaurantMessage(error) }
  return { restaurant: data, error: null }
}

export async function updateRestaurant({ userId, restaurantId, displayName }) {
  const normalizedDisplayName = String(displayName ?? '').trim()
  if (!normalizedDisplayName) {
    return { restaurant: null, error: '맛집 이름을 입력해 주세요.' }
  }

  const { data, error } = await supabase
    .from('user_restaurants')
    .update({ display_name: normalizedDisplayName })
    .eq('id', restaurantId)
    .eq('user_id', userId)
    .select(restaurantColumns)
    .maybeSingle()

  if (error || !data) return { restaurant: null, error: toSafeRestaurantMessage(error) }
  return { restaurant: data, error: null }
}

export async function deleteRestaurant({ userId, restaurantId }) {
  const { data, error } = await supabase
    .from('user_restaurants')
    .delete()
    .eq('id', restaurantId)
    .eq('user_id', userId)
    .select('id')
    .maybeSingle()

  if (error || !data) return { restaurantId: null, error: toSafeRestaurantMessage(error) }
  return { restaurantId: data.id, error: null }
}
