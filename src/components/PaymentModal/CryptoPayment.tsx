'use client'

import { useState, useEffect } from 'react'
import { useAppSelector } from '@/store/hooks'
import { calculateCryptoAmount, createPendingPayment, verifyPayment } from '@/actions/cryptoActions'

interface CryptoPaymentProps {
  plan: 'free' | 'pro' | 'premium'
  amount: number
  onBack: () => void
  onSuccess: () => void
}

type TokenType = 'ETH(ERC20)' | 'BNB(BEP20)' | 'USDT(ERC20)' | 'USDT(BEP20)'

export default function CryptoPayment({ plan, amount, onBack, onSuccess }: CryptoPaymentProps) {
  const { user } = useAppSelector((state) => state.auth)
  const [selectedToken, setSelectedToken] = useState<TokenType>('ETH(ERC20)')
  const [isVerifying, setIsVerifying] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [paymentId, setPaymentId] = useState<string | null>(null)
  
  // Crypto calculation state
  const [cryptoAmount, setCryptoAmount] = useState<number>(0)
  const [networkFee, setNetworkFee] = useState<number>(0)
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [cryptoPrice, setCryptoPrice] = useState<number>(0)

  const walletAddress = '0x93c6D2624f167a30D5f627b55d8774d6d9540eb5'

  // Calculate crypto amount when token type changes
  useEffect(() => {
    const calculate = async () => {
      setLoading(true)
      setError('')
      try {
        const result = await calculateCryptoAmount(amount, selectedToken)
        setCryptoAmount(result.cryptoAmount)
        setNetworkFee(result.networkFee)
        setTotalAmount(result.total)
        setCryptoPrice(result.price)
        
        // Create pending payment record
        if (user) {
          const paymentResult = await createPendingPayment(
            user.uid,
            user.email,
            plan,
            selectedToken,
            result.cryptoAmount,
            amount,
            result.networkFee
          )
          
          if (paymentResult.success && paymentResult.paymentId) {
            setPaymentId(paymentResult.paymentId)
          }
        }
      } catch (err) {
        setError('Failed to calculate crypto amount. Please try again.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    calculate()
  }, [selectedToken, amount, plan, user])

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleVerifyPayment = async () => {
    if (!paymentId) {
      setError('Payment record not found. Please refresh and try again.')
      return
    }

    setIsVerifying(true)
    setError('')
    setSuccess('')

    try {
      const result = await verifyPayment(paymentId)
      
      if (result.success) {
        setSuccess('Payment verified successfully! Your membership has been upgraded.')
        setTimeout(() => {
          onSuccess()
        }, 2000)
      } else {
        setError(result.error || 'Payment verification failed. Please ensure you sent the correct amount to the wallet address.')
      }
    } catch (err) {
      setError('Verification failed. Please try again.')
      console.error(err)
    } finally {
      setIsVerifying(false)
    }
  }

  const getTokenDisplay = (token: TokenType) => {
    if (token === 'ETH(ERC20)') return 'ETH'
    if (token === 'BNB(BEP20)') return 'BNB'
    if (token === 'USDT(ERC20)') return 'USDT (ERC20)'
    if (token === 'USDT(BEP20)') return 'USDT (BEP20)'
    return token
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to payment methods
      </button>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Cryptocurrency Payment
        </h2>
        <p className="text-gray-600">
          Upgrade to <span className="font-semibold capitalize">{plan}</span> Plan - ${amount}/month
        </p>
      </div>

      {/* Token Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Token Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(['ETH(ERC20)', 'BNB(BEP20)', 'USDT(ERC20)', 'USDT(BEP20)'] as TokenType[]).map((token) => (
            <button
              key={token}
              onClick={() => setSelectedToken(token)}
              disabled={loading}
              className={`p-4 border-2 rounded-lg transition-all ${
                selectedToken === token
                  ? 'border-primary bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="text-center">
                <div className="text-base font-bold text-gray-900">{getTokenDisplay(token)}</div>
                {loading && selectedToken === token ? (
                  <div className="text-sm text-gray-600 mt-1">Calculating...</div>
                ) : (
                  <div className="text-sm text-gray-600 mt-1">
                    {token.includes('USDT') ? `${cryptoAmount.toFixed(2)}` : `≈${cryptoAmount.toFixed(6)}`}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Payment Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Payment Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Plan Amount:</span>
            <span className="font-medium text-gray-900">${amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Network Fee:</span>
            <span className="font-medium text-gray-900">${networkFee.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-300 pt-2 flex justify-between">
            <span className="font-semibold text-gray-900">Total (USD):</span>
            <span className="font-bold text-gray-900">${totalAmount.toFixed(2)}</span>
          </div>
          {!selectedToken.includes('USDT') && cryptoPrice > 0 && (
            <div className="flex justify-between text-xs text-gray-500 pt-1">
              <span>Current {selectedToken.split('(')[0]} Price:</span>
              <span>${cryptoPrice.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t border-gray-300 pt-2 flex justify-between">
            <span className="font-semibold text-primary">Amount to Send:</span>
            <span className="font-bold text-primary">
              {cryptoAmount.toFixed(selectedToken.includes('USDT') ? 2 : 6)} {selectedToken.split('(')[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Instructions</h3>
        <ol className="space-y-3 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">
              1
            </span>
            <span>Send exactly <strong>{cryptoAmount.toFixed(selectedToken.includes('USDT') ? 2 : 6)} {selectedToken.split('(')[0]}</strong> to the wallet address below</span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">
              2
            </span>
            <span>Make sure to use the correct network: <strong>{selectedToken.includes('ERC20') ? 'Ethereum (ERC20)' : 'BNB Smart Chain (BEP20)'}</strong></span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">
              3
            </span>
            <span>After sending, click "Verify Payment" button below to confirm your transaction</span>
          </li>
        </ol>
      </div>

      {/* Wallet Address */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Wallet Address ({selectedToken.includes('ERC20') ? 'ERC20' : 'BEP20'})
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={walletAddress}
            readOnly
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
          />
          <button
            onClick={handleCopyAddress}
            className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            {copied ? (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Warning Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium text-yellow-900">Important</p>
            <p className="text-sm text-yellow-800 mt-1">
              Please send the EXACT amount shown above. Sending incorrect amounts may result in payment verification failure. 
              Make sure you're using the correct network ({selectedToken.includes('ERC20') ? 'Ethereum' : 'BNB Smart Chain'}).
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium text-green-900">Success!</p>
              <p className="text-sm text-green-800 mt-1">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Verify Button */}
      <button
        onClick={handleVerifyPayment}
        disabled={isVerifying || loading || !paymentId}
        className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isVerifying ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Verifying Payment...
          </span>
        ) : (
          'Verify Payment'
        )}
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        Payment verification checks the blockchain for your transaction. This may take a few minutes depending on network congestion.
      </p>
    </div>
  )
}
