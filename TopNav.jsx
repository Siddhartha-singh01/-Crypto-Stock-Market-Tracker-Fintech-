export default function TopNav({ active, setActive }) {
  const tabs = [
    { id: 'charts', label: 'Charts' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'sentiment', label: 'Sentiment' }
  ]
  return (
    <nav className="topnav">
      {tabs.map(t => (
        <button
          key={t.id}
          className={`tab ${active === t.id ? 'active' : ''}`}
          onClick={() => setActive(t.id)}
        >
          {t.label}
        </button>
      ))}
    </nav>
  )
}
