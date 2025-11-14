import { useState } from 'react'
import { firebaseEnabled, signInWithGoogle, signUpWithEmail, signInWithEmail } from '../services/firebase.js'

export default function Login({ onSuccess }) {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!firebaseEnabled) return
    setLoading(true)
    setError('')
    try {
      if (mode === 'signup') await signUpWithEmail(email, password)
      else await signInWithEmail(email, password)
      if (onSuccess) onSuccess()
    } catch (e) {
      setError('Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const google = async () => {
    if (!firebaseEnabled) return
    setLoading(true)
    setError('')
    try {
      await signInWithGoogle()
      if (onSuccess) onSuccess()
    } catch (e) {
      setError('Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card" style={{ maxWidth: 420 }}>
      <div className="flex" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Login</h2>
        <select value={mode} onChange={e => setMode(e.target.value)}>
          <option value="signin">Sign In</option>
          <option value="signup">Sign Up</option>
        </select>
      </div>
      <div className="flex" style={{ flexDirection: 'column', gap: 12 }}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={submit} disabled={!firebaseEnabled || loading}>
          {mode === 'signup' ? 'Create Account' : 'Sign In'}
        </button>
        <button onClick={google} disabled={!firebaseEnabled || loading}>
          Sign In with Google
        </button>
        {!firebaseEnabled && (<div style={{ color: 'var(--muted)' }}>Configure Firebase to enable login</div>)}
        {error && (<div style={{ color: '#ef4444' }}>{error}</div>)}
      </div>
    </div>
  )
}

