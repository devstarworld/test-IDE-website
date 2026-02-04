'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { checkAuthState, initializeAdmin } from '@/actions/authActions'

export default function AppInitializer() {
  const dispatch = useAppDispatch()
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const initializeApp = async () => {
      if (initialized) return
      
      try {
        console.log('Initializing app...')
        
        // Check authentication state first
        dispatch(checkAuthState())
        
        // Wait for Firebase to be ready, then initialize admin
        let retries = 0
        const maxRetries = 5
        
        const tryInitializeAdmin = async () => {
          try {
            await initializeAdmin()
            console.log('Admin initialization completed')
            setInitialized(true)
          } catch (error: any) {
            console.error('Admin initialization failed:', error)
            
            if (retries < maxRetries) {
              retries++
              console.log(`Retrying admin initialization (${retries}/${maxRetries})...`)
              setTimeout(tryInitializeAdmin, 3000) // Wait 3 seconds before retry
            } else {
              console.error('Admin initialization failed after all retries')
              setInitialized(true) // Mark as initialized to prevent infinite retries
            }
          }
        }
        
        // Start admin initialization after a short delay
        setTimeout(tryInitializeAdmin, 2000)
        
      } catch (error) {
        console.error('App initialization error:', error)
        setInitialized(true)
      }
    }

    initializeApp()
  }, [dispatch, initialized])

  return null // This component doesn't render anything
}