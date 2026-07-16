import { createClient } from '@supabase/supabase-js'
import { UserSession } from '@/types'

const SESSION_COOKIE_NAME = 'meryam_session'
const SESSION_COOKIE_MAXAGE = 7 * 24 * 60 * 60 // 7 days

export function setSessionCookie(email: string) {
  const sessionData = {
    email,
    isOwner: email === process.env.NEXT_PUBLIC_OWNER_EMAIL,
    expiresAt: new Date(Date.now() + SESSION_COOKIE_MAXAGE * 1000).toISOString(),
  }

  // Store in localStorage (client-side)
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_COOKIE_NAME, JSON.stringify(sessionData))
  }

  return sessionData
}

export function getSession(): UserSession | null {
  if (typeof window === 'undefined') return null

  const sessionData = localStorage.getItem(SESSION_COOKIE_NAME)
  if (!sessionData) return null

  try {
    const session = JSON.parse(sessionData)
    const expiresAt = new Date(session.expiresAt)

    if (expiresAt < new Date()) {
      clearSession()
      return null
    }

    return {
      email: session.email,
      isOwner: session.isOwner,
    }
  } catch {
    clearSession()
    return null
  }
}

export function clearSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_COOKIE_NAME)
  }
}

export function isOwner(): boolean {
  const session = getSession()
  return session?.isOwner ?? false
}

export function getOwnerEmail(): string {
  return process.env.NEXT_PUBLIC_OWNER_EMAIL || ''
}

// Sign up with email and password
export async function signUpWithEmail(email: string, password: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  setSessionCookie(email)
  return { success: true, data }
}

// Sign in with email and password
export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  setSessionCookie(email)
  return { success: true, data }
}

// Sign out
export async function signOut() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )

  const { error } = await supabase.auth.signOut()
  clearSession()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
