import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 8000
})

export async function getCryptoPrices(ids, vsCurrency = 'usd') {
  const { data } = await api.get('/crypto/prices', { params: { ids, vs_currency: vsCurrency } })
  return data
}

export async function getCryptoMarketChart(id, vsCurrency = 'usd', days = 1) {
  const { data } = await api.get('/crypto/market_chart', { params: { id, vs_currency: vsCurrency, days } })
  return data
}

export async function getStockIntraday(symbol, interval = '5min') {
  const { data } = await api.get('/stock/intraday', { params: { symbol, interval } })
  return data
}

export async function getRedditSentiment(keywords = 'anxiety,stress,happy', limit = 50) {
  const { data } = await api.get('/sentiment/reddit', { params: { q: keywords, limit } })
  return data
}
