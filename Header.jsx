import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { firebaseEnabled } from '../services/firebase.js'

export default function Header({ user, onSignIn, onSignOut, dark, toggle }) {
  return (
    <header className="flex" style={{ justifyContent: 'space-between', marginBottom: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Crypto & Stock Market Tracker</h1>
      <div className="flex">
        <button onClick={toggle} className="flex" style={{ background: 'transparent', color: 'var(--text)', padding: 4, marginRight: 12 }}>
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        {user ? (
          <button onClick={onSignOut}>Sign out</button>
        ) : (
          <button onClick={onSignIn} disabled={!firebaseEnabled} style={!firebaseEnabled ? { opacity: .6, cursor: 'not-allowed' } : undefined}>
            {firebaseEnabled ? 'Sign in with Google' : 'Configure Firebase'}
          </button>
        )}
      </div>
    </header>
  )
}
