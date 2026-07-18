export const STATUS_FILTERS = {
  ALL: 'all',
  UNVISITED: 'unvisited',
  VISITED: 'visited',
  REVISIT: 'revisit',
}

export const SORT_OPTIONS = {
  UPDATED: 'updated',
  RATING_HIGH: 'rating_high',
  RATING_LOW: 'rating_low',
}

/** Representative overall_rating only when currently visited and integer 1–5; otherwise null. */
export function getRepresentativeRating(restaurant, visitSummaries) {
  if (restaurant.status !== 'visited') return null
  const summary = visitSummaries[restaurant.id]
  if (!summary) return null

  const rating = summary.overall_rating
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return null
  return rating
}

export function matchesStatusFilter(restaurant, visitSummaries, filter) {
  switch (filter) {
    case STATUS_FILTERS.UNVISITED:
      return restaurant.status === 'unvisited'
    case STATUS_FILTERS.VISITED:
      return restaurant.status === 'visited'
    case STATUS_FILTERS.REVISIT:
      return (
        restaurant.status === 'visited' &&
        visitSummaries[restaurant.id]?.revisit_intention === true
      )
    case STATUS_FILTERS.ALL:
    default:
      return true
  }
}

/**
 * Keyword search: trim, case-insensitive.
 * Fields: display_name, area_hint, category (recommendation_note and menu excluded).
 */
export function matchesKeyword(restaurant, keyword) {
  const query = String(keyword ?? '').trim().toLowerCase()
  if (!query) return true

  const fields = [restaurant.display_name, restaurant.area_hint, restaurant.category]
  return fields.some((field) => field && String(field).toLowerCase().includes(query))
}

function compareIdDesc(left, right) {
  return String(right.id).localeCompare(String(left.id))
}

function compareUpdatedDesc(left, right) {
  const updatedDifference =
    new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime()
  return updatedDifference || compareIdDesc(left, right)
}

export function filterAndSortRestaurants(
  restaurants,
  visitSummaries,
  { keyword = '', filter = STATUS_FILTERS.ALL, sort = SORT_OPTIONS.UPDATED } = {},
) {
  const filtered = restaurants.filter(
    (restaurant) =>
      matchesKeyword(restaurant, keyword) &&
      matchesStatusFilter(restaurant, visitSummaries, filter),
  )

  return [...filtered].sort((left, right) => {
    if (sort === SORT_OPTIONS.UPDATED) {
      return compareUpdatedDesc(left, right)
    }

    const leftRating = getRepresentativeRating(left, visitSummaries)
    const rightRating = getRepresentativeRating(right, visitSummaries)
    const leftRated = leftRating !== null
    const rightRated = rightRating !== null

    if (leftRated && !rightRated) return -1
    if (!leftRated && rightRated) return 1
    if (!leftRated && !rightRated) return compareUpdatedDesc(left, right)

    if (sort === SORT_OPTIONS.RATING_HIGH) {
      const ratingDifference = rightRating - leftRating
      return ratingDifference || compareUpdatedDesc(left, right)
    }

    const ratingDifference = leftRating - rightRating
    return ratingDifference || compareUpdatedDesc(left, right)
  })
}

export function computeDashboardSummary(restaurants, visitSummaries) {
  let unvisited = 0
  let visited = 0
  let revisit = 0

  for (const restaurant of restaurants) {
    if (restaurant.status === 'unvisited') {
      unvisited += 1
      continue
    }

    if (restaurant.status === 'visited') {
      visited += 1
      if (visitSummaries[restaurant.id]?.revisit_intention === true) {
        revisit += 1
      }
    }
  }

  return {
    total: restaurants.length,
    unvisited,
    visited,
    revisit,
  }
}

/** Top N visited restaurants with non-null representative rating. */
export function computeTopRated(restaurants, visitSummaries, limit = 5) {
  return restaurants
    .filter((restaurant) => getRepresentativeRating(restaurant, visitSummaries) !== null)
    .map((restaurant) => ({
      id: restaurant.id,
      displayName: restaurant.display_name,
      rating: getRepresentativeRating(restaurant, visitSummaries),
      updatedAt: restaurant.updated_at,
    }))
    .sort((left, right) => {
      const ratingDifference = right.rating - left.rating
      if (ratingDifference) return ratingDifference

      const updatedDifference =
        new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
      return updatedDifference || String(right.id).localeCompare(String(left.id))
    })
    .slice(0, limit)
}
