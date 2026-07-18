function TopRatedList({ items, loading }) {
  if (loading) {
    return (
      <section className="dashboard-top-rated" aria-labelledby="top-rated-title">
        <h2 id="top-rated-title" className="dashboard-section-title">
          별점 Top 5
        </h2>
        <p className="restaurant-state" role="status">
          순위를 준비하는 중…
        </p>
      </section>
    )
  }

  return (
    <section className="dashboard-top-rated" aria-labelledby="top-rated-title">
      <h2 id="top-rated-title" className="dashboard-section-title">
        별점 Top 5
      </h2>
      {items.length === 0 ? (
        <p className="restaurant-state">아직 별점이 있는 방문 맛집이 없습니다.</p>
      ) : (
        <ol className="top-rated-list">
          {items.map((item, index) => (
            <li className="top-rated-item" key={item.id}>
              <span className="top-rated-rank" aria-hidden="true">
                {index + 1}
              </span>
              <span className="top-rated-name">{item.displayName}</span>
              <span className="top-rated-rating">대표 별점 {item.rating}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

export default TopRatedList
