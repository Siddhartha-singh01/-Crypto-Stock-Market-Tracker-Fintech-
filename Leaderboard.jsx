import { useEffect, useState } from 'react'
import { listPortfolios } from '../services/firebase.js'
import { getCryptoPrices, getStockIntraday } from '../services/api.js'

export default function Leaderboard() {
  const [rows, setRows] = useState([])
  const [sortBy, setSortBy] = useState('value')
  const [expanded, setExpanded] = useState(null)
  const [breakdown, setBreakdown] = useState({})

  useEffect(() => {
    const load = async () => {
      const items = await listPortfolios()
      const out = []
      for (const it of items) {
        let total = 0
        let changeDollar = 0
        const crypto = (it.positions || []).filter(p => p.type === 'crypto')
        if (crypto.length) {
          const ids = crypto.map(p => p.symbol.toLowerCase()).join(',')
          const prices = await getCryptoPrices(ids, 'usd')
          for (const p of crypto) {
            const v = (prices[p.symbol.toLowerCase()]?.usd || 0) * p.qty
            total += v
            const ch = prices[p.symbol.toLowerCase()]?.usd_24h_change || 0
            changeDollar += v * (ch / 100)
          }
        }
        const stocks = (it.positions || []).filter(p => p.type === 'stock')
        for (const p of stocks) {
          const series = await getStockIntraday(p.symbol, '5min')
          const entries = Object.entries(series).sort((a, b) => new Date(b[0]) - new Date(a[0]))
          const latest = entries[0]?.[1]
          const prev = entries[1]?.[1]
          if (latest && latest['4. close']) {
            const lv = parseFloat(latest['4. close']) * p.qty
            total += lv
            if (prev && prev['4. close']) {
              const pv = parseFloat(prev['4. close'])
              changeDollar += (parseFloat(latest['4. close']) - pv) * p.qty
            }
          }
        }
        const changePct = total ? (changeDollar / total) * 100 : 0
        out.push({ id: it.id, value: total, positions: it.positions || [], changePct })
      }
      out.sort((a, b) => b.value - a.value)
      setRows(out.slice(0, 10))
    }
    load()
  }, [])

  const onExpand = async (id) => {
    if (expanded === id) { setExpanded(null); return }
    setExpanded(id)
    if (breakdown[id]) return
    const user = rows.find(r => r.id === id)
    if (!user) return
    const items = []
    const crypto = user.positions.filter(p => p.type === 'crypto')
    if (crypto.length) {
      const ids = crypto.map(p => p.symbol.toLowerCase()).join(',')
      const prices = await getCryptoPrices(ids, 'usd')
      for (const p of crypto) {
        const v = (prices[p.symbol.toLowerCase()]?.usd || 0) * p.qty
        const ch = prices[p.symbol.toLowerCase()]?.usd_24h_change || 0
        items.push({ label: p.symbol.toUpperCase(), value: v, changePct: ch })
      }
    }
    const stocks = user.positions.filter(p => p.type === 'stock')
    for (const p of stocks) {
      const series = await getStockIntraday(p.symbol, '5min')
      const entries = Object.entries(series).sort((a, b) => new Date(b[0]) - new Date(a[0]))
      const latest = entries[0]?.[1]
      const prev = entries[1]?.[1]
      if (latest && latest['4. close']) {
        const lv = parseFloat(latest['4. close']) * p.qty
        let cpct
        if (prev && prev['4. close']) {
          const pv = parseFloat(prev['4. close'])
          cpct = ((parseFloat(latest['4. close']) - pv) / parseFloat(latest['4. close'])) * 100
        }
        items.push({ label: p.symbol.toUpperCase(), value: lv, changePct: typeof cpct === 'number' ? cpct : undefined })
      }
    }
    setBreakdown(prev => ({ ...prev, [id]: items.sort((a, b) => b.value - a.value) }))
  }

  const sorted = [...rows].sort((a, b) => sortBy === 'positions' ? (b.positions.length - a.positions.length) : (b.value - a.value))

  return (
    <div className="leaderboard">
      <div className="flex" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
        <h3>Leaderboard</h3>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="value">By Value</option>
          <option value="positions">By Positions</option>
        </select>
      </div>
      <ul className="lb-list">
        {sorted.map((r, i) => (
          <li key={r.id} className={`lb-row ${expanded === r.id ? 'open' : ''}`} onClick={() => onExpand(r.id)}>
            <span className={`rank r${i+1}`}>{i+1}</span>
            <span className="user">{r.id}</span>
            <span className="val">${r.value.toFixed(2)}</span>
            <span className="chg" style={{ color: (r.changePct || 0) >= 0 ? '#16a34a' : '#ef4444' }}>{(r.changePct || 0).toFixed(2)}%</span>
            <span className="count">{r.positions.length} assets</span>
            {expanded === r.id && (
              <div className="detail">
                {(breakdown[r.id] || []).map((b, bi) => (
                  <div key={bi} className="asset">
                    <span>{b.label}</span>
                    <b>${b.value.toFixed(2)}</b>
                    {typeof b.changePct === 'number' && (
                      <em style={{ color: b.changePct >= 0 ? '#16a34a' : '#ef4444' }}>{b.changePct.toFixed(2)}%</em>
                    )}
                  </div>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
