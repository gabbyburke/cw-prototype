'use client'

import { useEffect } from 'react'
import { onAuthStateChanged, signInWithRedirect } from 'firebase/auth'
import { auth, googleProvider } from '../lib/firebase'

export function AuthInitializer() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // Automatically sign in with Google SSO when no user is authenticated
        try {
          await signInWithRedirect(auth, googleProvider)
        } catch (error) {
          console.error('Auto sign-in failed:', error)
        }
      }
    })

    return unsubscribe
  }, [])

  return null // This component doesn't render anything
}
