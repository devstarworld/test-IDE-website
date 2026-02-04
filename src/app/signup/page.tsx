'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useFirebase } from '@/contexts/FirebaseContext'
import { signupUser, testFirebaseConnectivity } from '@/actions/authActions'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({})
  
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.auth)
  const { firebaseReady, loading: firebaseLoading } = useFirebase()
  const router = useRouter()

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!firebaseReady) {
      alert('Firebase is not ready. Please refresh the page and try again.')
      return
    }
    
    if (!validateForm()) {
      return
    }

    const result = await dispatch(signupUser({
      name: formData.name,
      email: formData.email,
      password: formData.password
    }))

    if (result.success) {
      // Redirect to verify-email page with email parameter
      router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`)
    }
  }

  const handleTestConnectivity = async () => {
    console.log('Testing Firebase connectivity...')
    const result = await testFirebaseConnectivity()
    console.log('Connectivity test result:', result)
    alert(`Connectivity test: ${result.success ? 'PASSED' : 'FAILED'}\n${result.message}\nCheck console for details.`)
  }

  const isFormValid = () => {
    return formData.name.trim() && 
           formData.email.trim() && 
           formData.password && 
           formData.confirmPassword && 
           formData.password === formData.confirmPassword &&
           Object.keys(errors).length === 0
  }

  // Show loading while Firebase is initializing
  if (firebaseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 mb-2">Initializing Firebase...</p>
          <p className="text-sm text-gray-500">
            If this takes too long, please check your internet connection and Firebase configuration.
          </p>
        </div>
      </div>
    )
  }

  // Show error if Firebase failed to initialize
  if (!firebaseReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Firebase Connection Failed
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Unable to connect to Firebase services. Please check your internet connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary text-white font-medium py-2 px-4 rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/">
            <Image
              src="/images/continue-logo-light.png"
              alt="Continue"
              width={120}
              height={40}
              className="mx-auto h-12 w-auto"
            />
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link href="/login" className="font-medium text-primary hover:text-primary/80">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Create a password"
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={!isFormValid() || isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                  isFormValid() && !isLoading
                    ? 'btn-primary text-white hover:bg-primary/90'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </div>

            <div className="text-xs text-gray-500 text-center">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-primary hover:text-primary/80">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary hover:text-primary/80">
                Privacy Policy
              </a>
            </div>

            {/* Debug: Connectivity Test Button */}
            {process.env.NODE_ENV === 'development' && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleTestConnectivity}
                  className="text-xs text-gray-400 hover:text-gray-600 underline"
                >
                  Test Firebase Connectivity (Debug)
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}