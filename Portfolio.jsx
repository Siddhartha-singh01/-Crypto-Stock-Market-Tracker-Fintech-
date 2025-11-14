import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

export default function Portfolio({ positions, value, onAdd, onRemove }) {
  const [form, setForm] = useState({ symbol: '', qty: 0, type: 'stock' })
  return (
    <div>
      <div className="flex" style={{ marginBottom: 16 }}>
        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
          <option value="stock">Stock</option>
          <option value="crypto">Crypto</option>
        </select>
        <input placeholder={form.type === 'stock' ? 'AAPL' : 'bitcoin'} value={form.symbol} onChange={e => setForm({ ...form, symbol: e.target.value })} />
        <input type="number" placeholder="Qty" value={form.qty} onChange={e => setForm({ ...form, qty: Number(e.target.value) })} />
        <button onClick={() => onAdd(form)} className="flex" style={{ alignItems: 'center', gap: 6, height: 40 }}>
          <Plus size={16} />
          Add
        </button>
      </div>
      <div style={{ marginBottom: 12, fontSize: 18, fontWeight: 600 }}>
        Portfolio Value: ${value.toFixed(2)}
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {positions.map(p => (
          <li key={`${p.type}-${p.symbol}`} className="flex" style={{ justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <span>{p.type.toUpperCase()} {p.symbol} x {p.qty}</span>
            <button onClick={() => onRemove(p.type, p.symbol)} className="flex" style={{ background: 'var(--accent)', padding: '6px 10px', height: 32 }}>
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
