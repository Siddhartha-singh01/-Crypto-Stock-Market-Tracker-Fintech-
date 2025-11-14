import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

const enabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)
let app
let authInst
let dbInst
if (enabled) {
  app = initializeApp(firebaseConfig)
  authInst = getAuth(app)
  dbInst = getFirestore(app)
}
export const auth = authInst
export const db = dbInst
export const firebaseEnabled = enabled

export async function signInWithGoogle() {
  if (!enabled) return
  const provider = new GoogleAuthProvider()
  await signInWithPopup(auth, provider)
}

export async function signOutUser() {
  if (!enabled) return
  await signOut(auth)
}

export function useAuth() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    if (!enabled) return
    return onAuthStateChanged(auth, setUser)
  }, [])
  return user
}

export async function loadPortfolio(uid) {
  if (!enabled) return { positions: [] }
  const ref = doc(db, 'portfolios', uid)
  const snap = await getDoc(ref)
  return snap.exists() ? snap.data() : { positions: [] }
}

export async function savePortfolio(uid, data) {
  if (!enabled) return
  const ref = doc(db, 'portfolios', uid)
  await setDoc(ref, data, { merge: true })
}

export async function listPortfolios() {
  if (!enabled) return []
  const col = collection(db, 'portfolios')
  const snaps = await getDocs(col)
  return snaps.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function signUpWithEmail(email, password) {
  if (!enabled) return null
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  return cred.user
}

export async function signInWithEmail(email, password) {
  if (!enabled) return null
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return cred.user
}
