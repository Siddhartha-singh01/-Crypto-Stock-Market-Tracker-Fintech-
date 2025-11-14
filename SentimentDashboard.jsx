import { useEffect, useState } from 'react'
import Chart from './Chart.jsx'
import { getRedditSentiment } from '../services/api.js'

export default function SentimentDashboard() {
  const [keywords, setKeywords] = useState('anxiety,stress,happy')
  const [limit, setLimit] = useState(50)
  const [timeseries, setTimeseries] = useState([])
  const [distribution, setDistribution] = useState({ positive: 0, neutral: 0, negative: 0 })
  const [trending, setTrending] = useState([])
  const [posts, setPosts] = useState([])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const data = await getRedditSentiment(keywords, limit)
      if (!mounted) return
      setTimeseries(data.timeseries || [])
      setDistribution(data.sentiments || { positive: 0, neutral: 0, negative: 0 })
      setTrending(data.trending || [])
      setPosts(data.posts || [])
    }
    load()
    const id = setInterval(load, 15000)
    return () => { mounted = false; clearInterval(id) }
  }, [keywords, limit])

  const seriesTime = [
    {
      name: 'Avg Sentiment',
      x: timeseries.map(p => new Date(p.time)),
      y: timeseries.map(p => p.avg),
      type: 'scatter'
    }
  ]

  const seriesDist = [
    {
      name: 'Counts',
      x: ['positive', 'neutral', 'negative'],
      y: ['positive', 'neutral', 'negative'].map(k => distribution[k] || 0),
      type: 'bar'
    }
  ]

  return (
    <div className="grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
      <div className="card">
        <h2 style={{ marginBottom: 12 }}>Mental Health Sentiment</h2>
        <div className="flex" style={{ gap: 8, marginBottom: 12 }}>
          <input value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="anxiety,stress,happy" />
          <input type="number" value={limit} onChange={e => setLimit(parseInt(e.target.value) || 50)} min={10} max={100} />
        </div>
        <Chart title="Average Sentiment Over Time" series={seriesTime} />
        <Chart title="Sentiment Distribution" series={seriesDist} />
      </div>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Trending Emotional Keywords</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {trending.map(t => (
            <li key={t.keyword} className="flex" style={{ justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ textTransform: 'capitalize' }}>{t.keyword}</span>
              <span>{t.count}</span>
            </li>
          ))}
          {trending.length === 0 && <li>No trending keywords</li>}
        </ul>
        <h3 style={{ marginTop: 16 }}>Live Feed</h3>
        <div style={{ maxHeight: 360, overflow: 'auto', border: '1px solid var(--border)', borderRadius: 8, padding: 8 }}>
          {posts.map(p => (
            <article key={p.id} style={{ marginBottom: 12 }}>
              <div className="flex" style={{ justifyContent: 'space-between' }}>
                <strong>{p.subreddit}</strong>
                <span style={{ opacity: 0.7 }}>{new Date(p.created).toLocaleString()}</span>
              </div>
              <div style={{ margin: '4px 0' }}>{p.title}</div>
              <div style={{ fontSize: 12, opacity: 0.9 }}>Sentiment: {p.label} ({p.score})</div>
            </article>
          ))}
          {posts.length === 0 && <div>No posts found</div>}
        </div>
      </div>
    </div>
  )
}
