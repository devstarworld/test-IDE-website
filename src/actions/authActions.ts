import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import {
  doc,
  setDoc,
  getDoc
} from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { AppDispatch } from '@/store'
import { setLoading, setError, setUser, clearUser } from '@/store/slices/authSlice'

interface SignupData {
  name: string
  email: string
  password: string
}

interface User {
  uid: string
  name: string
  email: string
  role: 'user' | 'admin'
  emailVerified: boolean
  membership: 'free' | 'pro' | 'premium'
  memberSince: string
  creditUsage: number
}

// Check if Firebase services are available
const isFirebaseReady = (): boolean => {
  return auth !== null && db !== null
}

// Test Firebase connectivity
export const testFirebaseConnectivity = async (): Promise<{ success: boolean; message: string; details: any }> => {
  const details: any = {}

  try {
    console.log('Testing Firebase connectivity...')

    // Test 1: Check if Firebase services are initialized
    details.servicesInitialized = {
      auth: !!auth,
      firestore: !!db
    }

    if (!auth || !db) {
      return {
        success: false,
        message: 'Firebase services not initialized',
        details
      }
    }

    // Test 2: Check Firebase configuration
    details.config = {
      authDomain: auth.app.options.authDomain,
      projectId: auth.app.options.projectId,
      apiKey: auth.app.options.apiKey ? 'Present' : 'Missing'
    }

    // Test 3: Try to access Firebase Auth (this will test network connectivity)
    try {
      // This should work even without authentication
      const currentUser = auth.currentUser
      details.authAccess = {
        success: true,
        currentUser: currentUser ? 'Logged in' : 'Not logged in'
      }
    } catch (authError: any) {
      details.authAccess = {
        success: false,
        error: authError.message
      }
    }

    // Test 4: Try a simple network request to Firebase
    try {
      // Try to create a user with invalid credentials to test network connectivity
      // This should fail with auth/invalid-email, not network-request-failed
      await createUserWithEmailAndPassword(auth, 'test', 'test')
    } catch (testError: any) {
      details.networkTest = {
        errorCode: testError.code,
        errorMessage: testError.message,
        networkWorking: testError.code !== 'auth/network-request-failed'
      }

      if (testError.code === 'auth/network-request-failed') {
        return {
          success: false,
          message: 'Network connectivity to Firebase failed',
          details
        }
      }
    }

    return {
      success: true,
      message: 'Firebase connectivity test passed',
      details
    }

  } catch (error: any) {
    details.generalError = {
      code: error.code,
      message: error.message
    }

    return {
      success: false,
      message: `Firebase connectivity test failed: ${error.message}`,
      details
    }
  }
}

// Initialize admin user if not exists
export const initializeAdmin = async (): Promise<void> => {
  try {
    // Check if Firebase services are ready
    if (!isFirebaseReady() || !auth || !db) {
      return
    }

    // Simply try to create admin user - if it exists, Firebase will tell us
    try {
      const adminCredential = await createUserWithEmailAndPassword(
        auth,
        'admin@admin.com',
        '123456'
      )

      // Now add to Firestore (we're authenticated as the new admin)
      await setDoc(doc(db, 'users', adminCredential.user.uid), {
        name: 'admin',
        email: 'admin@admin.com',
        role: 'admin',
        emailVerified: true,
        createdAt: new Date().toISOString()
      })
      // Sign out the admin user after creation
      await signOut(auth)
    } catch (authError: any) {
      if (authError.code === 'auth/email-already-in-use') {
        console.log('Admin already exists - no action needed')
        return
      } else {
        console.error('Failed to create admin user:', authError.code, authError.message)
      }
    }

  } catch (error: any) {
    console.error('Admin initialization failed:', error.code, error.message)
  }
}

// Signup action
export const signupUser = (signupData: SignupData) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  dispatch(setError(null))

  try {
    if (!isFirebaseReady() || !auth || !db) {
      throw new Error('Firebase services not available. Please try again later.')
    }

    console.log('Starting signup process for:', signupData.email)
    console.log('Firebase Auth domain:', auth.app.options.authDomain)
    console.log('Firebase Project ID:', auth.app.options.projectId)

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      signupData.email,
      signupData.password
    )

    const user = userCredential.user
    console.log('User created successfully in Auth, UID:', user.uid)

    // Store user data in users collection first (before email verification)
    console.log('Adding user to Firestore...')
    await setDoc(doc(db, 'users', user.uid), {
      name: signupData.name,
      email: signupData.email,
      role: 'user',
      emailVerified: false,
      membership: 'free',
      memberSince: new Date().toISOString(),
      creditUsage: 0,
      createdAt: new Date().toISOString()
    })
    console.log('User data stored in Firestore successfully')

    // Send email verification
    try {
      console.log('Sending email verification to:', user.email)

      // Send email verification with proper configuration
      await sendEmailVerification(user, {
        url: `${window.location.origin}/verify-success`,
        handleCodeInApp: true,
      })

      console.log('Email verification sent successfully')
    } catch (emailError: any) {
      console.error('Email verification failed:', emailError.code, emailError.message)

      // Try without custom URL as fallback
      try {
        console.log('Retrying email verification without custom URL...')
        await sendEmailVerification(user)
        console.log('Email verification sent successfully (fallback)')
      } catch (fallbackError: any) {
        console.error('Email verification fallback also failed:', fallbackError.code, fallbackError.message)

        // Log specific error codes for debugging
        if (fallbackError.code === 'auth/too-many-requests') {
          console.error('Too many email verification requests. Please wait before trying again.')
        } else if (fallbackError.code === 'auth/invalid-email') {
          console.error('Invalid email address for verification.')
        } else if (fallbackError.code === 'auth/user-disabled') {
          console.error('User account has been disabled.')
        }

        // Don't fail the signup, but inform the user
        console.warn('Email verification could not be sent, but account was created successfully')
      }
    }

    dispatch(setLoading(false))
    return { success: true, message: 'Account created! Please check your email to verify your account.' }

  } catch (error: any) {
    console.error('Signup failed:', error.code, error.message)
    console.error('Full error object:', error)

    let errorMessage = error.message

    // Provide more user-friendly error messages
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'An account with this email already exists.'
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password is too weak. Please choose a stronger password.'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Please enter a valid email address.'
    } else if (error.code === 'auth/configuration-not-found') {
      errorMessage = 'Authentication service is not configured. Please contact support.'
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network connection failed. Please check your internet connection and try again. If the problem persists, it might be a firewall or DNS issue.'
      console.error('Network request failed. Possible causes:')
      console.error('1. Internet connection issues')
      console.error('2. Firewall blocking Firebase domains')
      console.error('3. DNS resolution problems')
      console.error('4. Firebase service outage')
      console.error('Try accessing https://firebase.google.com in your browser to test connectivity')
    } else if (error.code === 'permission-denied') {
      errorMessage = 'Permission denied. Please contact support to resolve this issue.'
    } else if (error.code === 'unavailable') {
      errorMessage = 'Service temporarily unavailable. Please try again in a few moments.'
    }

    dispatch(setError(errorMessage))
    dispatch(setLoading(false))
    return { success: false, message: errorMessage }
  }
}

// Login action
export const loginUser = (email: string, password: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  dispatch(setError(null))

  try {
    if (!isFirebaseReady() || !auth || !db) {
      throw new Error('Firebase services not available. Please try again later.')
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const firebaseUser = userCredential.user

    // Get user data from Firestore first to check role
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))

    if (!userDoc.exists()) {
      dispatch(setError('User data not found'))
      dispatch(setLoading(false))
      return { success: false, message: 'User data not found' }
    }

    const userData = userDoc.data()

    // Admin users can login without email verification
    if (userData.role !== 'admin' && !firebaseUser.emailVerified) {
      console.log('User email not verified, sending verification email...')
      
      // Send verification email
      try {
        await sendEmailVerification(firebaseUser, {
          url: `${window.location.origin}/verify-success`,
          handleCodeInApp: true,
        })
        console.log('Verification email sent successfully')
      } catch (emailError: any) {
        console.error('Failed to send verification email:', emailError.code, emailError.message)
        // Continue even if email sending fails
      }
      
      // Sign out the user since they can't proceed without verification
      await signOut(auth)
      
      dispatch(setLoading(false))
      return { 
        success: false, 
        message: 'Please verify your email before logging in',
        needsVerification: true,
        email: firebaseUser.email || email
      }
    }

    const token = await firebaseUser.getIdToken()

    const user: User = {
      uid: firebaseUser.uid,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      emailVerified: firebaseUser.emailVerified,
      membership: userData.membership || 'free',
      memberSince: userData.memberSince || new Date().toISOString(),
      creditUsage: userData.creditUsage || 0
    }

    // Store in Redux and localStorage
    dispatch(setUser({ user, token }))
    localStorage.setItem('authToken', token)
    localStorage.setItem('user', JSON.stringify(user))

    dispatch(setLoading(false))
    return { success: true, user }

  } catch (error: any) {
    console.error('Login error:', error.code, error.message)
    let errorMessage = error.message

    // Firebase now uses auth/invalid-credential for both wrong email and wrong password
    if (error.code === 'auth/invalid-credential') {
      errorMessage = 'Invalid email or password. Please check your credentials and try again.'
    } else if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email address.'
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password.'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Please enter a valid email address.'
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many failed login attempts. Please try again later or reset your password.'
    } else if (error.code === 'auth/user-disabled') {
      errorMessage = 'This account has been disabled. Please contact support.'
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Please check your internet connection and try again.'
    } else if (error.code === 'auth/configuration-not-found') {
      errorMessage = 'Incorrect configuration. Please contact support.'
    }

    dispatch(setError(errorMessage))
    dispatch(setLoading(false))
    return { success: false, message: errorMessage }
  }
}

// Logout action
export const logoutUser = () => async (dispatch: AppDispatch) => {
  try {
    if (auth) {
      await signOut(auth)
    }
    dispatch(clearUser())
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  } catch (error: any) {
    dispatch(setError(error.message))
  }
}

// Forgot password - send password reset email
export const sendPasswordReset = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    if (!isFirebaseReady() || !auth) {
      throw new Error('Firebase services not available. Please try again later.')
    }

    console.log('Sending password reset email to:', email)
    
    await sendPasswordResetEmail(auth, email)
    
    console.log('Password reset email sent successfully')
    return { 
      success: true, 
      message: 'Password reset email sent! Please check your inbox.' 
    }
    
  } catch (error: any) {
    console.error('Password reset error:', error.code, error.message)
    
    let errorMessage = error.message
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email address.'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Please enter a valid email address.'
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many requests. Please wait a few minutes before trying again.'
    }
    
    return { success: false, message: errorMessage }
  }
}

// Google Sign In
export const signInWithGoogle = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  dispatch(setError(null))
  
  try {
    if (!isFirebaseReady() || !auth || !db) {
      throw new Error('Firebase services not available. Please try again later.')
    }

    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    const firebaseUser = result.user

    console.log('Google sign in successful:', firebaseUser.email)

    // Check if user exists in Firestore
    let userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
    
    if (!userDoc.exists()) {
      // Create new user in Firestore
      const userData = {
        name: firebaseUser.displayName || 'Google User',
        email: firebaseUser.email || '',
        role: 'user',
        emailVerified: true, // Google users are always verified
        membership: 'free',
        memberSince: new Date().toISOString(),
        creditUsage: 0,
        createdAt: new Date().toISOString(),
        provider: 'google'
      }
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userData)
      console.log('New Google user created in Firestore')
    }

    // Get updated user data
    userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
    const userData = userDoc.data()!

    const token = await firebaseUser.getIdToken()
    
    const user: User = {
      uid: firebaseUser.uid,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      emailVerified: true, // Google users are always verified
      membership: userData.membership || 'free',
      memberSince: userData.memberSince || new Date().toISOString(),
      creditUsage: userData.creditUsage || 0
    }

    // Store in Redux and localStorage
    dispatch(setUser({ user, token }))
    localStorage.setItem('authToken', token)
    localStorage.setItem('user', JSON.stringify(user))

    dispatch(setLoading(false))
    return { success: true, user }

  } catch (error: any) {
    console.error('Google sign in error:', error.code, error.message)
    
    let errorMessage = error.message
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign in was cancelled.'
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Popup was blocked by your browser. Please allow popups and try again.'
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Please check your internet connection and try again.'
    }

    dispatch(setError(errorMessage))
    dispatch(setLoading(false))
    return { success: false, message: errorMessage }
  }
}

// GitHub Sign In
export const signInWithGitHub = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  dispatch(setError(null))
  
  try {
    if (!isFirebaseReady() || !auth || !db) {
      throw new Error('Firebase services not available. Please try again later.')
    }

    const provider = new GithubAuthProvider()
    const result = await signInWithPopup(auth, provider)
    const firebaseUser = result.user

    console.log('GitHub sign in successful:', firebaseUser.email)

    // Check if user exists in Firestore
    let userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
    
    if (!userDoc.exists()) {
      // Create new user in Firestore
      const userData = {
        name: firebaseUser.displayName || 'GitHub User',
        email: firebaseUser.email || '',
        role: 'user',
        emailVerified: true, // GitHub users are always verified
        membership: 'free',
        memberSince: new Date().toISOString(),
        creditUsage: 0,
        createdAt: new Date().toISOString(),
        provider: 'github'
      }
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userData)
      console.log('New GitHub user created in Firestore')
    }

    // Get updated user data
    userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
    const userData = userDoc.data()!

    const token = await firebaseUser.getIdToken()
    
    const user: User = {
      uid: firebaseUser.uid,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      emailVerified: true, // GitHub users are always verified
      membership: userData.membership || 'free',
      memberSince: userData.memberSince || new Date().toISOString(),
      creditUsage: userData.creditUsage || 0
    }

    // Store in Redux and localStorage
    dispatch(setUser({ user, token }))
    localStorage.setItem('authToken', token)
    localStorage.setItem('user', JSON.stringify(user))

    dispatch(setLoading(false))
    return { success: true, user }

  } catch (error: any) {
    console.error('GitHub sign in error:', error.code, error.message)
    
    let errorMessage = error.message
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign in was cancelled.'
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Popup was blocked by your browser. Please allow popups and try again.'
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      errorMessage = 'An account already exists with the same email address but different sign-in credentials.'
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Please check your internet connection and try again.'
    }

    dispatch(setError(errorMessage))
    dispatch(setLoading(false))
    return { success: false, message: errorMessage }
  }
}

// Resend email verification
export const resendEmailVerification = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  dispatch(setError(null))

  try {
    if (!auth || !auth.currentUser) {
      throw new Error('No user is currently signed in')
    }

    console.log('Resending email verification to:', auth.currentUser.email)

    await sendEmailVerification(auth.currentUser, {
      url: `${window.location.origin}/verify-success`,
      handleCodeInApp: true,
    })

    console.log('Verification email resent successfully')
    dispatch(setLoading(false))
    return { success: true, message: 'Verification email sent successfully' }
  } catch (error: any) {
    console.error('Resend email verification error:', error.code, error.message)

    let errorMessage = error.message
    if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many requests. Please wait a few minutes before requesting another verification email.'
    } else if (error.code === 'auth/user-not-found') {
      errorMessage = 'User not found. Please sign up again.'
    }

    dispatch(setError(errorMessage))
    dispatch(setLoading(false))
    return { success: false, message: errorMessage }
  }
}

// Resend email verification by email (for verify-email page)
export const resendEmailVerificationByEmail = (email: string, password: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  dispatch(setError(null))

  try {
    if (!isFirebaseReady() || !auth || !db) {
      throw new Error('Firebase services not available. Please try again later.')
    }

    console.log('Attempting to resend verification email for:', email)

    // We need to temporarily sign in the user to send verification email
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    if (user.emailVerified) {
      // User is already verified, redirect them
      dispatch(setLoading(false))
      return { success: false, message: 'Email is already verified. You can now log in.' }
    }

    // Send verification email
    await sendEmailVerification(user, {
      url: `${window.location.origin}/verify-success`,
      handleCodeInApp: true,
    })

    // Sign out the user after sending verification
    await signOut(auth)

    console.log('Verification email resent successfully')
    dispatch(setLoading(false))
    return { success: true, message: 'Verification email sent successfully' }

  } catch (error: any) {
    console.error('Resend email verification error:', error.code, error.message)

    let errorMessage = error.message
    if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many requests. Please wait a few minutes before requesting another verification email.'
    } else if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email address.'
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password. Please try again.'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Please enter a valid email address.'
    }

    dispatch(setError(errorMessage))
    dispatch(setLoading(false))
    return { success: false, message: errorMessage }
  }
}
export const checkAuthState = () => async (dispatch: AppDispatch) => {
  if (!isFirebaseReady() || !auth || !db) {
    console.error('Firebase services not ready for auth state check')
    return
  }

  const token = localStorage.getItem('authToken')
  const userStr = localStorage.getItem('user')

  if (token && userStr) {
    try {
      const user = JSON.parse(userStr)
      dispatch(setUser({ user, token }))
    } catch (error) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
    }
  }

  // Listen to auth state changes
  onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser && firebaseUser.emailVerified && db) {
      try {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))

        if (userDoc.exists()) {
          const userData = userDoc.data()

          // Update emailVerified status in Firestore if needed
          if (!userData.emailVerified) {
            await setDoc(doc(db, 'users', firebaseUser.uid), {
              ...userData,
              emailVerified: true,
              verifiedAt: new Date().toISOString()
            }, { merge: true })
          }

          const token = await firebaseUser.getIdToken()

          const user: User = {
            uid: firebaseUser.uid,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            emailVerified: firebaseUser.emailVerified,
            membership: userData.membership || 'free',
            memberSince: userData.memberSince || new Date().toISOString(),
            creditUsage: userData.creditUsage || 0
          }

          dispatch(setUser({ user, token }))
          localStorage.setItem('authToken', token)
          localStorage.setItem('user', JSON.stringify(user))
        }
      } catch (error) {
        console.error('Error updating user data:', error)
      }
    } else if (!firebaseUser) {
      // User signed out
      dispatch(clearUser())
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
    }
  })
}