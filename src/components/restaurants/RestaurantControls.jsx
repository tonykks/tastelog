import { SORT_OPTIONS, STATUS_FILTERS } from '../../utils/restaurantDashboard'

const FILTER_OPTIONS = [
  { value: STATUS_FILTERS.ALL, label: '전체' },
  { value: STATUS_FILTERS.UNVISITED, label: '미방문' },
  { value: STATUS_FILTERS.VISITED, label: '방문함' },
  { value: STATUS_FILTERS.REVISIT, label: '다시 갈 의향 있음' },
]

const SORT_CHOICES = [
  { value: SORT_OPTIONS.UPDATED, label: '최근 수정순' },
  { value: SORT_OPTIONS.RATING_HIGH, label: '별점 높은순' },
  { value: SORT_OPTIONS.RATING_LOW, label: '별점 낮은순' },
]

function RestaurantControls({ keyword, filter, sort, onKeywordChange, onFilterChange, onSortChange }) {
  return (
    <section className="restaurant-controls" aria-labelledby="restaurant-controls-title">
      <h2 id="restaurant-controls-title" className="dashboard-section-title">
        검색 · 필터 · 정렬
      </h2>

      <div className="restaurant-controls-grid">
        <div className="restaurant-control-field">
          <label className="restaurant-label" htmlFor="restaurant-search-keyword">
            검색
          </label>
          <input
            id="restaurant-search-keyword"
            className="restaurant-input"
            type="search"
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            placeholder="맛집 이름, 지역, 카테고리"
            autoComplete="off"
          />
        </div>

        <div className="restaurant-control-field">
          <p className="restaurant-label" id="restaurant-status-filter-label">
            상태 필터
          </p>
          <div
            className="restaurant-filter-group"
            role="radiogroup"
            aria-labelledby="restaurant-status-filter-label"
          >
            {FILTER_OPTIONS.map((option) => {
              const optionId = `restaurant-filter-${option.value}`
              return (
                <label className="restaurant-filter-option" htmlFor={optionId} key={option.value}>
                  <input
                    id={optionId}
                    type="radio"
                    name="restaurant-status-filter"
                    value={option.value}
                    checked={filter === option.value}
                    onChange={() => onFilterChange(option.value)}
                  />
                  <span>{option.label}</span>
                </label>
              )
            })}
          </div>
        </div>

        <div className="restaurant-control-field">
          <label className="restaurant-label" htmlFor="restaurant-sort">
            정렬
          </label>
          <select
            id="restaurant-sort"
            className="restaurant-input restaurant-sort-select"
            value={sort}
            onChange={(event) => onSortChange(event.target.value)}
          >
            {SORT_CHOICES.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  )
}

export default RestaurantControls
