import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.error = null
    },
    clearUser: (state) => {
      state.user = null
      state.token = null
      state.error = null
    },
    updateEmailVerified: (state, action: PayloadAction<boolean>) => {
      if (state.user) {
        state.user.emailVerified = action.payload
      }
    },
    updateMembership: (state, action: PayloadAction<{ membership: 'free' | 'pro' | 'premium'; memberSince: string }>) => {
      if (state.user) {
        state.user.membership = action.payload.membership
        state.user.memberSince = action.payload.memberSince
      }
    },
  },
})

export const { setLoading, setError, setUser, clearUser, updateEmailVerified, updateMembership } = authSlice.actions
export default authSlice.reducer