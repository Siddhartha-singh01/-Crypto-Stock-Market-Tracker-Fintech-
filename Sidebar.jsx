import React from 'react'
import { Menu, X } from 'lucide-react'

export default function Sidebar({ active, setActive }) {
  const [open, setOpen] = React.useState(false)
  const links = [
    { id: 'charts', label: 'Charts', icon: '📈' },
    { id: 'portfolio', label: 'Portfolio', icon: '📊' },
    { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
    { id: 'sentiment', label: 'Sentiment', icon: '🧠' }
  ]
  return (
    <>
      <button
        className="menu-toggle"
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle menu"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="flex" style={{ justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Tracker</h2>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {links.map(l => (
            <a key={l.id} href="#" className={active === l.id ? 'active' : ''} onClick={e => { e.preventDefault(); setActive(l.id); setOpen(false) }}>
              <span>{l.icon}</span>
              <span>{l.label}</span>
            </a>
          ))}
        </nav>
      </aside>
    </>
  )
}
