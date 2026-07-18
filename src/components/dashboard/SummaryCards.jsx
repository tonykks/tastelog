function SummaryCards({ summary, loading }) {
  if (loading) {
    return (
      <section className="dashboard-summary" aria-labelledby="dashboard-summary-title">
        <h2 id="dashboard-summary-title" className="dashboard-section-title">
          요약
        </h2>
        <p className="restaurant-state" role="status">
          요약을 준비하는 중…
        </p>
      </section>
    )
  }

  const cards = [
    { key: 'total', label: '전체 맛집', value: summary.total },
    { key: 'unvisited', label: '미방문', value: summary.unvisited },
    { key: 'visited', label: '방문함', value: summary.visited },
    { key: 'revisit', label: '다시 갈 의향 있음', value: summary.revisit },
  ]

  return (
    <section className="dashboard-summary" aria-labelledby="dashboard-summary-title">
      <h2 id="dashboard-summary-title" className="dashboard-section-title">
        요약
      </h2>
      <ul className="summary-card-list">
        {cards.map((card) => (
          <li className="summary-card" key={card.key}>
            <p className="summary-card-label">{card.label}</p>
            <p className="summary-card-value" aria-label={`${card.label} ${card.value}개`}>
              {card.value}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default SummaryCards
