'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'

interface FirebaseContextType {
  user: User | null
  loading: boolean
  firebaseReady: boolean
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  loading: true,
  firebaseReady: false
})

export const useFirebase = () => {
  const context = useContext(FirebaseContext)
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider')
  }
  return context
}

interface FirebaseProviderProps {
  children: React.ReactNode
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [firebaseReady, setFirebaseReady] = useState(false)

  useEffect(() => {
    const checkFirebaseReady = async () => {
      try {
        // Check if Firebase services are available
        const { auth: firebaseAuth, db } = await import('@/lib/firebase')
        
        if (firebaseAuth && db) {
          console.log('Firebase services ready')
          setFirebaseReady(true)
          
          // Set up auth state listener
          const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
            setUser(user)
            setLoading(false)
          })

          return () => unsubscribe()
        } else {
          console.error('Firebase services not available')
          setFirebaseReady(false)
          setLoading(false)
        }
      } catch (error) {
        console.error('Firebase initialization error:', error)
        setFirebaseReady(false)
        setLoading(false)
      }
    }

    checkFirebaseReady()
  }, [])

  const value = {
    user,
    loading,
    firebaseReady
  }

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  )
}