'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { checkAuthState, initializeAdmin } from '@/actions/authActions'

export default function AppInitializer() {
  const dispatch = useAppDispatch()
  const [hasInitialized, setHasInitialized] = useState(false)

  useEffect(() => {
    // Prevent multiple initializations
    if (hasInitialized) return
    
    const initializeApp = async () => {
      try {
        // Check authentication state first
        dispatch(checkAuthState())
        
        // Initialize admin only once when app starts
        await initializeAdmin()
        
        setHasInitialized(true)
        
      } catch (error) {
        console.error('App initialization error:', error)
        setHasInitialized(true) // Mark as initialized even on error to prevent retries
      }
    }

    initializeApp()
  }, [dispatch, hasInitialized])

  return null // This component doesn't render anything
}