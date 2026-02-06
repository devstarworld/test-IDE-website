'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { checkAuthState, logoutUser } from '@/actions/authActions'

export default function Navbar() {
  const { user, isLoading } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(checkAuthState())
  }, [dispatch])

  const handleLogout = async () => {
    await dispatch(logoutUser())
  }

  return (
    <header className="sticky top-4 z-50 flex justify-center px-4">
      <div className="border backdrop-blur-lg bg-background/40 rounded-2xl transition-all duration-500 ease-out w-full max-w-7xl">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/zedai_logo.png"
                alt="ZedAI"
                width={40}
                height={40}
                className="h-10 w-auto"
                style={{ width: 'auto', height: '40px' }}
                priority
              />
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/pricing"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/about-us"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/get-in-touch"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact Us
              </Link>
              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Admin
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-4">
              
              {!isLoading && (
                <>
                  {user ? (
                    <div className="flex items-center gap-3">
                      <Link
                        href="/account"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Account
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Sign In
                      </Link>
                      
                      <Link href="/signup">
                        <button className="btn-primary text-sm h-8 px-3 py-1">
                          Sign Up
                        </button>
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}