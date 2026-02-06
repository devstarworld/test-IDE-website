'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import Navbar from '@/components/Navbar/Navbar'
import Footer from '@/components/Footer/Footer'
import AnimatedSection from '@/components/AnimatedSection/AnimatedSection'
import { 
  Menu, 
  PanelLeftClose,
  PanelLeftOpen, 
  X,
  Users, 
  CreditCard, 
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Trash2,
  Ban
} from 'lucide-react'
import {
  fetchUsers,
  fetchPendingPayments,
  banUsers,
  deleteUsers,
  UserData,
  PendingPayment,
  PaginationResult
} from '@/actions/adminActions'
import { DocumentSnapshot } from 'firebase/firestore'

type TabType = 'users' | 'payments'

export default function AdminPage() {
  const router = useRouter()
  const user = useAppSelector((state) => state.auth.user)
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('users')
  
  // Users state
  const [users, setUsers] = useState<UserData[]>([])
  const [usersTotal, setUsersTotal] = useState(0)
  const [usersHasMore, setUsersHasMore] = useState(false)
  const [usersLastDoc, setUsersLastDoc] = useState<DocumentSnapshot | null>(null)
  const [usersPage, setUsersPage] = useState(1)
  const [usersLimit, setUsersLimit] = useState(50)
  const [usersSearch, setUsersSearch] = useState('')
  const [usersSortBy, setUsersSortBy] = useState<'memberSince'>('memberSince')
  const [usersSortOrder, setUsersSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  
  // Payments state
  const [payments, setPayments] = useState<PendingPayment[]>([])
  const [paymentsTotal, setPaymentsTotal] = useState(0)
  const [paymentsHasMore, setPaymentsHasMore] = useState(false)
  const [paymentsLastDoc, setPaymentsLastDoc] = useState<DocumentSnapshot | null>(null)
  const [paymentsPage, setPaymentsPage] = useState(1)
  const [paymentsLimit, setPaymentsLimit] = useState(50)
  const [paymentsSearch, setPaymentsSearch] = useState('')
  const [paymentsSortBy, setPaymentsSortBy] = useState<'createdAt' | 'expectedAmount' | 'usdAmount' | 'networkFee'>('createdAt')
  const [paymentsSortOrder, setPaymentsSortOrder] = useState<'asc' | 'desc'>('desc')

  // Check if user is admin
  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    
    if (user.role !== 'admin') {
      router.push('/')
      return
    }
    
    setIsLoading(false)
  }, [user, router])

  // Load users data
  useEffect(() => {
    if (activeTab === 'users' && !isLoading) {
      loadUsers()
    }
  }, [activeTab, isLoading, usersPage, usersLimit, usersSortBy, usersSortOrder])

  // Load payments data
  useEffect(() => {
    if (activeTab === 'payments' && !isLoading) {
      loadPayments()
    }
  }, [activeTab, isLoading, paymentsPage, paymentsLimit, paymentsSortBy, paymentsSortOrder])

  const loadUsers = async () => {
    try {
      const result = await fetchUsers(
        usersLimit,
        usersSearch,
        usersSortBy,
        usersSortOrder,
        usersPage > 1 ? usersLastDoc : null
      )
      setUsers(result.data)
      setUsersTotal(result.total)
      setUsersHasMore(result.hasMore)
      setUsersLastDoc(result.lastDoc)
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }

  const loadPayments = async () => {
    try {
      const result = await fetchPendingPayments(
        paymentsLimit,
        paymentsSearch,
        paymentsSortBy,
        paymentsSortOrder,
        paymentsPage > 1 ? paymentsLastDoc : null
      )
      setPayments(result.data)
      setPaymentsTotal(result.total)
      setPaymentsHasMore(result.hasMore)
      setPaymentsLastDoc(result.lastDoc)
    } catch (error) {
      console.error('Error loading payments:', error)
    }
  }

  const handleUsersSearch = () => {
    setUsersPage(1)
    setUsersLastDoc(null)
    loadUsers()
  }

  const handlePaymentsSearch = () => {
    setPaymentsPage(1)
    setPaymentsLastDoc(null)
    loadPayments()
  }

  const handleUserSelect = (uid: string) => {
    setSelectedUsers(prev => 
      prev.includes(uid) 
        ? prev.filter(id => id !== uid)
        : [...prev, uid]
    )
  }

  const handleSelectAllUsers = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(users.map(u => u.uid))
    }
  }

  const handleBanUsers = async () => {
    if (selectedUsers.length === 0) return
    if (!confirm(`Are you sure you want to ban ${selectedUsers.length} user(s)?`)) return
    
    try {
      await banUsers(selectedUsers)
      setSelectedUsers([])
      loadUsers()
    } catch (error) {
      alert('Error banning users')
    }
  }

  const handleDeleteUsers = async () => {
    if (selectedUsers.length === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedUsers.length} user(s)? This action cannot be undone.`)) return
    
    try {
      await deleteUsers(selectedUsers)
      setSelectedUsers([])
      loadUsers()
    } catch (error) {
      alert('Error deleting users')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 flex">
        {/* Sidebar */}
        <AnimatedSection delay={100}>
          <aside 
          className={`${
            isSidebarOpen ? 'w-64' : 'w-16'
          } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
        >
          <div className="p-4 border-b border-gray-200 flex items-center justify-between mt-3">
            {isSidebarOpen && <h2 className="font-semibold text-lg">Admin Panel</h2>}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
            </button>
          </div>
          
          <nav className="flex-1 p-4">
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-1 py-3 rounded-lg transition-colors mb-2 ${
                activeTab === 'users'
                  ? 'bg-green-50 text-green-700'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Users size={20} />
              {isSidebarOpen && <span>Users</span>}
            </button>
            
            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full flex items-center gap-3 px-1 py-3 rounded-lg transition-colors ${
                activeTab === 'payments'
                  ? 'bg-green-50 text-green-700'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <CreditCard size={20} />
              {isSidebarOpen && <span>Payments</span>}
            </button>
          </nav>
        </aside>
        </AnimatedSection>

        {/* Main Content */}
        <AnimatedSection className="flex-1 p-8" delay={200}>
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold">
                {activeTab === 'users' ? 'Users Management' : 'Payments Management'}
              </h1>
              
              {activeTab === 'users' && selectedUsers.length > 0 ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleBanUsers}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    <Ban size={18} />
                    Ban ({selectedUsers.length})
                  </button>
                  <button
                    onClick={handleDeleteUsers}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                    Delete ({selectedUsers.length})
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={activeTab === 'users' ? 'Search by name or email...' : 'Search by email...'}
                    value={activeTab === 'users' ? usersSearch : paymentsSearch}
                    onChange={(e) => activeTab === 'users' ? setUsersSearch(e.target.value) : setPaymentsSearch(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (activeTab === 'users' ? handleUsersSearch() : handlePaymentsSearch())}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={activeTab === 'users' ? handleUsersSearch : handlePaymentsSearch}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Search size={18} />
                    Search
                  </button>
                </div>
              )}
            </div>

            {/* Users Table */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedUsers.length === users.length && users.length > 0}
                            onChange={handleSelectAllUsers}
                            className="rounded border-gray-300"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email Verified
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                          onClick={() => setUsersSortOrder(usersSortOrder === 'asc' ? 'desc' : 'asc')}
                        >
                          <div className="flex items-center gap-1">
                            Member Since
                            <ArrowUpDown size={14} />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.uid} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user.uid)}
                              onChange={() => handleUserSelect(user.uid)}
                              className="rounded border-gray-300"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.emailVerified ? (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                Verified
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                                Not Verified
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              user.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.memberSince).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Rows per page:</span>
                    <select
                      value={usersLimit}
                      onChange={(e) => {
                        setUsersLimit(Number(e.target.value))
                        setUsersPage(1)
                        setUsersLastDoc(null)
                      }}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <span className="text-sm text-gray-700 ml-4">
                      {((usersPage - 1) * usersLimit) + 1}-{Math.min(usersPage * usersLimit, usersTotal)} of {usersTotal}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setUsersPage(p => Math.max(1, p - 1))}
                      disabled={usersPage === 1}
                      className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => setUsersPage(p => p + 1)}
                      disabled={!usersHasMore}
                      className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Payments Table */}
            {activeTab === 'payments' && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Plan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Token Type
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                          onClick={() => {
                            setPaymentsSortBy('expectedAmount')
                            setPaymentsSortOrder(paymentsSortOrder === 'asc' ? 'desc' : 'asc')
                          }}
                        >
                          <div className="flex items-center gap-1">
                            Expected Amount
                            <ArrowUpDown size={14} />
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                          onClick={() => {
                            setPaymentsSortBy('usdAmount')
                            setPaymentsSortOrder(paymentsSortOrder === 'asc' ? 'desc' : 'asc')
                          }}
                        >
                          <div className="flex items-center gap-1">
                            USD Amount
                            <ArrowUpDown size={14} />
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                          onClick={() => {
                            setPaymentsSortBy('networkFee')
                            setPaymentsSortOrder(paymentsSortOrder === 'asc' ? 'desc' : 'asc')
                          }}
                        >
                          <div className="flex items-center gap-1">
                            Network Fee
                            <ArrowUpDown size={14} />
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created At
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {payments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {payment.userEmail}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs uppercase">
                              {payment.plan}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {payment.tokenType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {payment.expectedAmount.toFixed(6)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${payment.usdAmount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${payment.networkFee.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              payment.status === 'completed' 
                                ? 'bg-green-100 text-green-800'
                                : payment.status === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(payment.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Rows per page:</span>
                    <select
                      value={paymentsLimit}
                      onChange={(e) => {
                        setPaymentsLimit(Number(e.target.value))
                        setPaymentsPage(1)
                        setPaymentsLastDoc(null)
                      }}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <span className="text-sm text-gray-700 ml-4">
                      {((paymentsPage - 1) * paymentsLimit) + 1}-{Math.min(paymentsPage * paymentsLimit, paymentsTotal)} of {paymentsTotal}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPaymentsPage(p => Math.max(1, p - 1))}
                      disabled={paymentsPage === 1}
                      className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => setPaymentsPage(p => p + 1)}
                      disabled={!paymentsHasMore}
                      className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </AnimatedSection>
      </div>

      <Footer />
    </div>
  )
}
