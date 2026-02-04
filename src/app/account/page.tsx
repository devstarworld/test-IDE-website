'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { checkAuthState, logoutUser } from '@/actions/authActions'

export default function AccountPage() {
  const { user, isLoading } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const router = useRouter()

  useEffect(() => {
    dispatch(checkAuthState())
  }, [dispatch])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  const handleLogout = async () => {
    await dispatch(logoutUser())
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Account</h1>
            <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* User Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {user.name}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {user.email}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md capitalize">
                    {user.role}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Verification Status
                  </label>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.emailVerified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.emailVerified ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Account Actions</h2>
              
              <div className="space-y-4">
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Sign Out
                </button>

                {user.role === 'admin' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <h3 className="text-sm font-medium text-blue-900 mb-2">
                      Admin Access
                    </h3>
                    <p className="text-sm text-blue-700 mb-3">
                      You have administrator privileges on this account.
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1 px-3 rounded">
                      Admin Dashboard
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}