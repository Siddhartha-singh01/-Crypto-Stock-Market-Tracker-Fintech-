import { useEffect, useState } from 'react'
import { getCryptoPrices } from '../services/api.js'

export default function Ticker() {
  const [items, setItems] = useState([])
  useEffect(() => {
    let mounted = true
    const ids = 'bitcoin,ethereum,solana'
    const load = async () => {
      try {
        const data = await getCryptoPrices(ids, 'usd')
        const rows = Object.entries(data).map(([k, v]) => ({ k, p: v.usd, ch: v.usd_24h_change }))
        if (mounted) setItems(rows)
      } catch {}
    }
    load()
    const id = setInterval(load, 10000)
    return () => { mounted = false; clearInterval(id) }
  }, [])
  return (
    <div className="ticker">
      <div className="track">
        {[...items, ...items].map((it, i) => (
          <span key={i} className="tick">
            {it.k.toUpperCase()} ${Number(it.p).toFixed(2)}
            <b style={{ color: (it.ch || 0) >= 0 ? '#16a34a' : '#ef4444', marginLeft: 6 }}>{(it.ch || 0).toFixed(2)}%</b>
          </span>
        ))}
      </div>
    </div>
  )
}
