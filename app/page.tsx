'use client'

import { useState } from 'react'

interface FetchResult {
  success: boolean
  data?: any
  error?: string
  timestamp: string
}

export default function Home() {
  const [url, setUrl] = useState('')
  const [results, setResults] = useState<FetchResult[]>([])
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    if (!url) return

    setLoading(true)
    const timestamp = new Date().toISOString()

    try {
      const response = await fetch('/api/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })

      const result = await response.json()

      setResults(prev => [{
        success: result.success,
        data: result.data,
        error: result.error,
        timestamp
      }, ...prev])
    } catch (error) {
      setResults(prev => [{
        success: false,
        error: String(error),
        timestamp
      }, ...prev])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ color: 'white', textAlign: 'center', marginBottom: '40px', fontSize: '2.5rem' }}>
          🤖 Data Fetch Agent
        </h1>

        <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', marginBottom: '30px' }}>
          <h2 style={{ marginTop: 0, color: '#333' }}>Fetch Data from URL</h2>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL (e.g., https://api.github.com/users/github)"
              style={{
                flex: 1,
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '16px'
              }}
              onKeyPress={(e) => e.key === 'Enter' && fetchData()}
            />
            <button
              onClick={fetchData}
              disabled={loading || !url}
              style={{
                padding: '12px 30px',
                background: loading ? '#ccc' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s'
              }}
            >
              {loading ? '⏳ Fetching...' : '🚀 Fetch'}
            </button>
          </div>

          <div style={{ fontSize: '14px', color: '#666' }}>
            <strong>Try these examples:</strong>
            <div style={{ marginTop: '8px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={() => setUrl('https://api.github.com/users/github')} style={{ padding: '6px 12px', background: '#f0f0f0', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>GitHub API</button>
              <button onClick={() => setUrl('https://jsonplaceholder.typicode.com/posts/1')} style={{ padding: '6px 12px', background: '#f0f0f0', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>JSONPlaceholder</button>
              <button onClick={() => setUrl('https://api.coindesk.com/v1/bpi/currentprice.json')} style={{ padding: '6px 12px', background: '#f0f0f0', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>Bitcoin Price</button>
            </div>
          </div>
        </div>

        <div>
          <h2 style={{ color: 'white', marginBottom: '20px' }}>📊 Fetch History</h2>
          {results.length === 0 && (
            <div style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '30px', borderRadius: '12px', textAlign: 'center' }}>
              No fetches yet. Enter a URL above to start!
            </div>
          )}
          {results.map((result, index) => (
            <div key={index} style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  background: result.success ? '#4caf50' : '#f44336',
                  color: 'white'
                }}>
                  {result.success ? '✓ Success' : '✗ Failed'}
                </span>
                <span style={{ fontSize: '14px', color: '#666' }}>{new Date(result.timestamp).toLocaleString()}</span>
              </div>

              {result.success ? (
                <pre style={{
                  background: '#f8f9fa',
                  padding: '15px',
                  borderRadius: '6px',
                  overflow: 'auto',
                  maxHeight: '400px',
                  fontSize: '13px',
                  margin: 0
                }}>
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              ) : (
                <div style={{ color: '#f44336', padding: '15px', background: '#ffebee', borderRadius: '6px' }}>
                  <strong>Error:</strong> {result.error}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
