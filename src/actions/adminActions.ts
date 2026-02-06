'use client'

import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  doc,
  updateDoc,
  deleteDoc,
  DocumentSnapshot,
  getCountFromServer
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface UserData {
  uid: string
  name: string
  email: string
  emailVerified: boolean
  role: 'user' | 'admin'
  memberSince: string
  membership: 'free' | 'pro' | 'premium'
  creditUsage: number
}

export interface PendingPayment {
  id: string
  userEmail: string
  plan: 'pro' | 'premium'
  tokenType: string
  expectedAmount: number
  usdAmount: number
  networkFee: number
  status: 'pending' | 'completed' | 'failed'
  createdAt: string
}

export interface PaginationResult<T> {
  data: T[]
  total: number
  hasMore: boolean
  lastDoc: DocumentSnapshot | null
}

// Fetch users with pagination and search
export async function fetchUsers(
  pageLimit: number = 50,
  searchQuery: string = '',
  sortBy: 'memberSince' = 'memberSince',
  sortOrder: 'asc' | 'desc' = 'desc',
  lastDoc: DocumentSnapshot | null = null
): Promise<PaginationResult<UserData>> {
  try {
    if (!db) throw new Error('Firestore not initialized')
    
    const usersRef = collection(db, 'users')
    let q = query(usersRef)

    // Apply search filter
    if (searchQuery) {
      // Search by email or name
      q = query(
        usersRef,
        where('email', '>=', searchQuery),
        where('email', '<=', searchQuery + '\uf8ff')
      )
    }

    // Apply sorting
    q = query(q, orderBy(sortBy, sortOrder))

    // Apply pagination
    if (lastDoc) {
      q = query(q, startAfter(lastDoc))
    }
    q = query(q, limit(pageLimit))

    const snapshot = await getDocs(q)
    const users: UserData[] = snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    } as UserData))

    // Get total count
    const countSnapshot = await getCountFromServer(collection(db, 'users'))
    const total = countSnapshot.data().count

    return {
      data: users,
      total,
      hasMore: snapshot.docs.length === pageLimit,
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

// Fetch pending payments with pagination and search
export async function fetchPendingPayments(
  pageLimit: number = 50,
  searchQuery: string = '',
  sortBy: 'createdAt' | 'expectedAmount' | 'usdAmount' | 'networkFee' = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc',
  lastDoc: DocumentSnapshot | null = null
): Promise<PaginationResult<PendingPayment>> {
  try {
    if (!db) throw new Error('Firestore not initialized')
    
    const paymentsRef = collection(db, 'pending_payments')
    let q = query(paymentsRef)

    // Apply search filter
    if (searchQuery) {
      q = query(
        paymentsRef,
        where('userEmail', '>=', searchQuery),
        where('userEmail', '<=', searchQuery + '\uf8ff')
      )
    }

    // Apply sorting
    q = query(q, orderBy(sortBy, sortOrder))

    // Apply pagination
    if (lastDoc) {
      q = query(q, startAfter(lastDoc))
    }
    q = query(q, limit(pageLimit))

    const snapshot = await getDocs(q)
    const payments: PendingPayment[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as PendingPayment))

    // Get total count
    const countSnapshot = await getCountFromServer(collection(db, 'pending_payments'))
    const total = countSnapshot.data().count

    return {
      data: payments,
      total,
      hasMore: snapshot.docs.length === pageLimit,
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null
    }
  } catch (error) {
    console.error('Error fetching pending payments:', error)
    throw error
  }
}

// Ban users (bulk action)
export async function banUsers(userIds: string[]): Promise<void> {
  try {
    if (!db) throw new Error('Firestore not initialized')
    
    const promises = userIds.map(async (uid) => {
      const userRef = doc(db!, 'users', uid)
      await updateDoc(userRef, {
        role: 'banned'
      })
    })
    await Promise.all(promises)
  } catch (error) {
    console.error('Error banning users:', error)
    throw error
  }
}

// Delete users (bulk action)
export async function deleteUsers(userIds: string[]): Promise<void> {
  try {
    if (!db) throw new Error('Firestore not initialized')
    
    const promises = userIds.map(async (uid) => {
      const userRef = doc(db!, 'users', uid)
      await deleteDoc(userRef)
    })
    await Promise.all(promises)
  } catch (error) {
    console.error('Error deleting users:', error)
    throw error
  }
}
