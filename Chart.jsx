import Plot from 'react-plotly.js'

export default function Chart({ title, series }) {
  return (
    <Plot
      data={series.map(s => ({ x: s.x, y: s.y, type: s.type || 'scatter', name: s.name }))}
      layout={{
        title: { text: title, font: { size: 16, color: 'var(--text)' } },
        autosize: true,
        margin: { t: 40, r: 10, b: 40, l: 40 },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { color: 'var(--text)' },
        xaxis: { gridcolor: 'var(--border)', zerolinecolor: 'var(--border)' },
        yaxis: { gridcolor: 'var(--border)', zerolinecolor: 'var(--border)' }
      }}
      style={{ width: '100%', height: '360px' }}
      useResizeHandler
      config={{ displayModeBar: false }}
    />
  )
}
