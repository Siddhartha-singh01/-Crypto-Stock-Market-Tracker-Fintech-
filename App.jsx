import { useEffect, useMemo, useState } from 'react'
import { getCryptoPrices, getCryptoMarketChart, getStockIntraday } from './services/api.js'
import Chart from './components/Chart.jsx'
import Portfolio from './components/Portfolio.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Sidebar from './components/Sidebar.jsx'
import Background3D from './components/Background3D.jsx'
import Header from './components/Header.jsx'
import Ticker from './components/Ticker.jsx'
import TopNav from './components/TopNav.jsx'
import { usePortfolioStore } from './store/portfolioStore.js'
import { signInWithGoogle, signOutUser, useAuth } from './services/firebase.js'
import './index.css'
import SentimentDashboard from './components/SentimentDashboard.jsx'

function MovingAverage({ series, windowSize }) {
  const ma = useMemo(() => {
    if (!series || series.length === 0) return []
    const out = []
    let sum = 0
    for (let i = 0; i < series.length; i++) {
      sum += series[i].y
      if (i >= windowSize) sum -= series[i - windowSize].y
      out.push(i >= windowSize - 1 ? sum / windowSize : null)
    }
    return out
  }, [series, windowSize])
  return (
    <Chart
      title={`Moving Average (${windowSize})`}
      series={[{ name: `MA${windowSize}`, x: series.map(p => p.x), y: ma, type: 'scatter' }]}
    />
  )
}

export default function App() {
  const [cryptoIds, setCryptoIds] = useState('bitcoin,ethereum')
  const [symbol, setSymbol] = useState('AAPL')
  const [cryptoChart, setCryptoChart] = useState([])
  const [stockChart, setStockChart] = useState([])
  const [active, setActive] = useState('charts')
  const [dark, setDark] = useState(false)
  const user = useAuth()
  const { positions, value, addPosition, removePosition } = usePortfolioStore()
  const { loadUserPortfolio } = usePortfolioStore.getState()

  useEffect(() => {
    const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDark(prefers)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    if (user) loadUserPortfolio()
  }, [user])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const market = await getCryptoMarketChart(cryptoIds.split(',')[0], 'usd', 1)
      const cSeries = market.prices.map(p => ({ x: new Date(p[0]), y: p[1] }))
      const sIntraday = await getStockIntraday(symbol, '5min')
      const sPoints = Object.entries(sIntraday).map(([t, o]) => ({ x: new Date(t), y: parseFloat(o['4. close']) })).sort((a, b) => a.x - b.x)
      if (mounted) {
        setCryptoChart([{ name: cryptoIds.split(',')[0], x: cSeries.map(p => p.x), y: cSeries.map(p => p.y), type: 'scatter' }])
        setStockChart([{ name: symbol, x: sPoints.map(p => p.x), y: sPoints.map(p => p.y), type: 'scatter' }])
      }
    }
    load()
    const id = setInterval(load, 10000)
    return () => { mounted = false; clearInterval(id) }
  }, [cryptoIds, symbol])

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Background3D />
      <Sidebar active={active} setActive={setActive} />
      <main className="main">
        <Ticker />
        <TopNav active={active} setActive={setActive} />
        <Header user={user} onSignIn={signInWithGoogle} onSignOut={signOutUser} dark={dark} toggle={() => setDark(d => !d)} />
        {active === 'charts' && (
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="card">
              <h2 style={{ marginBottom: 12 }}>Crypto</h2>
              <div className="flex" style={{ marginBottom: 12 }}>
                <input value={cryptoIds} onChange={e => setCryptoIds(e.target.value)} placeholder="bitcoin,ethereum" />
              </div>
              <Chart title="Crypto Price" series={cryptoChart} />
              {cryptoChart.length > 0 && (
                <MovingAverage series={cryptoChart[0].x.map((x, i) => ({ x, y: cryptoChart[0].y[i] }))} windowSize={10} />
              )}
            </div>
            <div className="card">
              <h2 style={{ marginBottom: 12 }}>Stock</h2>
              <div className="flex" style={{ marginBottom: 12 }}>
                <input value={symbol} onChange={e => setSymbol(e.target.value.toUpperCase())} placeholder="AAPL" />
              </div>
              <Chart title="Stock Price" series={stockChart} />
              {stockChart.length > 0 && (
                <MovingAverage series={stockChart[0].x.map((x, i) => ({ x, y: stockChart[0].y[i] }))} windowSize={10} />
              )}
            </div>
          </div>
        )}
        {active === 'portfolio' && (
          <div className="card">
            <h2 style={{ marginBottom: 16 }}>Portfolio</h2>
            <Portfolio positions={positions} value={value} onAdd={addPosition} onRemove={removePosition} />
          </div>
        )}
        {active === 'leaderboard' && (
          <div className="card">
            <Leaderboard />
          </div>
        )}
        {active === 'sentiment' && (
          <div className="card">
            <SentimentDashboard />
          </div>
        )}
      </main>
    </div>
  )
}
