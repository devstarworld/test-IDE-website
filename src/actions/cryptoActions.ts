'use server'

import { db } from '@/lib/firebase'
import { doc, setDoc, updateDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'

export interface PendingPayment {
  id: string
  userId: string
  userEmail: string
  plan: 'free' | 'pro' | 'premium'
  tokenType: string
  expectedAmount: number
  usdAmount: number
  networkFee: number
  walletAddress: string
  status: 'pending' | 'verified' | 'failed'
  createdAt: number
  verifiedAt?: number
  txHash?: string
}

const WALLET_ADDRESS = '0x93c6D2624f167a30D5f627b55d8774d6d9540eb5'

// Ankr RPC endpoints
const ANKR_BSC_RPC = 'https://rpc.ankr.com/bsc'
const ANKR_ETH_RPC = 'https://rpc.ankr.com/eth'

// Token contract addresses
const USDT_BSC_CONTRACT = '0x55d398326f99059fF775485246999027B3197955'
const USDT_ETH_CONTRACT = '0xdAC17F958D2ee523a2206206994597C13D831ec7'

// Fetch crypto price from Bitget API
export async function fetchCryptoPrice(symbol: string): Promise<number> {
  try {
    const response = await fetch(`https://api.bitget.com/api/v2/spot/market/tickers?symbol=${symbol}USDT`)
    const data = await response.json()
    
    if (data.code === '00000' && data.data && data.data.length > 0) {
      return parseFloat(data.data[0].lastPr)
    }
    
    throw new Error('Failed to fetch price')
  } catch (error) {
    console.error('Error fetching crypto price:', error)
    throw error
  }
}

// Calculate crypto amount with network fee
export async function calculateCryptoAmount(
  usdAmount: number,
  tokenType: string
): Promise<{ cryptoAmount: number; networkFee: number; total: number; price: number }> {
  try {
    // Generate random network fee between 0 and 1 (exclusive)
    const networkFee = Math.random() * 0.99 + 0.01 // Between 0.01 and 1.00
    const totalUsd = usdAmount + networkFee
    
    let price: number
    let cryptoAmount: number
    
    if (tokenType === 'USDT(ERC20)' || tokenType === 'USDT(BEP20)') {
      // USDT is 1:1 with USD
      price = 1
      cryptoAmount = totalUsd
    } else if (tokenType === 'ETH(ERC20)') {
      price = await fetchCryptoPrice('ETH')
      cryptoAmount = totalUsd / price
    } else if (tokenType === 'BNB(BEP20)') {
      price = await fetchCryptoPrice('BNB')
      cryptoAmount = totalUsd / price
    } else {
      throw new Error('Invalid token type')
    }
    
    return {
      cryptoAmount: parseFloat(cryptoAmount.toFixed(8)),
      networkFee: parseFloat(networkFee.toFixed(2)),
      total: parseFloat(totalUsd.toFixed(2)),
      price
    }
  } catch (error) {
    console.error('Error calculating crypto amount:', error)
    throw error
  }
}

// Create pending payment record
export async function createPendingPayment(
  userId: string,
  userEmail: string,
  plan: 'free' | 'pro' | 'premium',
  tokenType: string,
  expectedAmount: number,
  usdAmount: number,
  networkFee: number
): Promise<{ success: boolean; paymentId?: string; error?: string }> {
  try {
    if (!db) {
      return { success: false, error: 'Database not initialized' }
    }
    
    const paymentId = `${userId}_${Date.now()}`
    const paymentRef = doc(db, 'pending_payments', paymentId)
    
    await setDoc(paymentRef, {
      id: paymentId,
      userId,
      userEmail,
      plan,
      tokenType,
      expectedAmount,
      usdAmount,
      networkFee,
      walletAddress: WALLET_ADDRESS,
      status: 'pending',
      createdAt: Date.now(),
    })
    
    return { success: true, paymentId }
  } catch (error) {
    console.error('Error creating pending payment:', error)
    return { success: false, error: 'Failed to create payment record' }
  }
}

// Get latest block number
async function getLatestBlockNumber(rpcUrl: string): Promise<number> {
  try {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1,
      }),
    })
    
    const data = await response.json()
    return parseInt(data.result, 16)
  } catch (error) {
    console.error('Error getting latest block:', error)
    return 0
  }
}

// Get block number from timestamp
async function getBlockNumberFromTimestamp(timestamp: number, rpcUrl: string): Promise<number> {
  try {
    const latestBlock = await getLatestBlockNumber(rpcUrl)
    const secondsPerBlock = rpcUrl.includes('bsc') ? 3 : 12
    const secondsAgo = (Date.now() - timestamp) / 1000
    const blocksAgo = Math.floor(secondsAgo / secondsPerBlock)
    return Math.max(0, latestBlock - blocksAgo)
  } catch (error) {
    console.error('Error calculating block number:', error)
    return 0
  }
}

// Check native token transactions
async function checkNativeTransactions(
  address: string,
  startTime: number,
  rpcUrl: string
): Promise<any[]> {
  try {
    const startBlock = await getBlockNumberFromTimestamp(startTime, rpcUrl)
    const latestBlock = await getLatestBlockNumber(rpcUrl)
    
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getLogs',
        params: [{
          fromBlock: `0x${startBlock.toString(16)}`,
          toBlock: `0x${latestBlock.toString(16)}`,
          address: address,
        }],
        id: 1,
      }),
    })
    
    const data = await response.json()
    return data.result || []
  } catch (error) {
    console.error('Error checking native transactions:', error)
    return []
  }
}

// Check token transactions
async function checkTokenTransactions(
  address: string,
  tokenAddress: string,
  startTime: number,
  rpcUrl: string
): Promise<any[]> {
  try {
    const startBlock = await getBlockNumberFromTimestamp(startTime, rpcUrl)
    const latestBlock = await getLatestBlockNumber(rpcUrl)
    
    const transferTopic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getLogs',
        params: [{
          fromBlock: `0x${startBlock.toString(16)}`,
          toBlock: `0x${latestBlock.toString(16)}`,
          address: tokenAddress,
          topics: [
            transferTopic,
            null,
            `0x000000000000000000000000${address.slice(2).toLowerCase()}`,
          ],
        }],
        id: 1,
      }),
    })
    
    const data = await response.json()
    
    if (data.result) {
      return data.result.map((log: any) => ({
        hash: log.transactionHash,
        to: address,
        value: parseInt(log.data, 16),
        blockNumber: parseInt(log.blockNumber, 16),
      }))
    }
    
    return []
  } catch (error) {
    console.error('Error checking token transactions:', error)
    return []
  }
}

// Verify payment and update membership
export async function verifyPayment(paymentId: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!db) {
      return { success: false, error: 'Database not initialized' }
    }
    
    const paymentRef = doc(db, 'pending_payments', paymentId)
    const paymentDoc = await getDoc(paymentRef)
    
    if (!paymentDoc.exists()) {
      return { success: false, error: 'Payment not found' }
    }
    
    const payment = paymentDoc.data() as PendingPayment
    
    if (payment.status !== 'pending') {
      return { success: false, error: 'Payment already processed' }
    }
    
    let transactions: any[] = []
    
    // Get transactions based on token type
    if (payment.tokenType === 'BNB(BEP20)') {
      transactions = await checkNativeTransactions(WALLET_ADDRESS, payment.createdAt, ANKR_BSC_RPC)
    } else if (payment.tokenType === 'ETH(ERC20)') {
      transactions = await checkNativeTransactions(WALLET_ADDRESS, payment.createdAt, ANKR_ETH_RPC)
    } else if (payment.tokenType === 'USDT(BEP20)') {
      transactions = await checkTokenTransactions(WALLET_ADDRESS, USDT_BSC_CONTRACT, payment.createdAt, ANKR_BSC_RPC)
    } else if (payment.tokenType === 'USDT(ERC20)') {
      transactions = await checkTokenTransactions(WALLET_ADDRESS, USDT_ETH_CONTRACT, payment.createdAt, ANKR_ETH_RPC)
    }
    
    // Check if any transaction matches the expected amount
    for (const tx of transactions) {
      const value = payment.tokenType.includes('USDT')
        ? parseFloat(tx.value.toString()) / 1e6
        : parseFloat(tx.value.toString()) / 1e18
      
      // Allow 1% tolerance
      const tolerance = payment.expectedAmount * 0.01
      const amountMatch = Math.abs(value - payment.expectedAmount) <= tolerance
      
      if (amountMatch) {
        // Update payment status
        await updateDoc(paymentRef, {
          status: 'verified',
          verifiedAt: Date.now(),
          txHash: tx.hash,
        })
        
        // Update user membership
        const userRef = doc(db, 'users', payment.userId)
        await updateDoc(userRef, {
          membership: payment.plan,
        })
        
        return { success: true }
      }
    }
    
    return { success: false, error: 'Payment not found on blockchain' }
  } catch (error) {
    console.error('Error verifying payment:', error)
    return { success: false, error: 'Verification failed' }
  }
}
