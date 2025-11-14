import { create } from 'zustand'
import { getCryptoPrices, getStockIntraday } from '../services/api.js'
import { auth } from '../services/firebase.js'
import { savePortfolio, loadPortfolio } from '../services/firebase.js'

export const usePortfolioStore = create((set, get) => ({
  positions: [],
  value: 0,
  addPosition: async ({ type, symbol, qty }) => {
    const positions = [...get().positions]
    const idx = positions.findIndex(p => p.type === type && p.symbol.toLowerCase() === symbol.toLowerCase())
    if (idx >= 0) positions[idx].qty += qty
    else positions.push({ type, symbol, qty })
    set({ positions })
    await get().refreshValue()
    if (auth.currentUser) await savePortfolio(auth.currentUser.uid, { positions })
  },
  removePosition: async (type, symbol) => {
    const positions = get().positions.filter(p => !(p.type === type && p.symbol.toLowerCase() === symbol.toLowerCase()))
    set({ positions })
    await get().refreshValue()
    if (auth.currentUser) await savePortfolio(auth.currentUser.uid, { positions })
  },
  refreshValue: async () => {
    const positions = get().positions
    let total = 0
    const cryptoSymbols = positions.filter(p => p.type === 'crypto').map(p => p.symbol.toLowerCase())
    if (cryptoSymbols.length) {
      const prices = await getCryptoPrices(cryptoSymbols.join(','), 'usd')
      positions.filter(p => p.type === 'crypto').forEach(p => { total += (prices[p.symbol.toLowerCase()].usd || 0) * p.qty })
    }
    for (const p of positions.filter(p => p.type === 'stock')) {
      try {
        const series = await getStockIntraday(p.symbol, '5min')
        const latest = Object.values(series)[0]
        if (latest && latest['4. close']) {
          total += parseFloat(latest['4. close']) * p.qty
        }
      } catch {}
    }
    set({ value: total })
  },
  loadUserPortfolio: async () => {
    if (!auth.currentUser) return
    const data = await loadPortfolio(auth.currentUser.uid)
    set({ positions: data.positions || [] })
    await get().refreshValue()
  }
}))
