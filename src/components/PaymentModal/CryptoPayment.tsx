'use client'

import { useState } from 'react'

interface CryptoPaymentProps {
  plan: 'free' | 'pro' | 'premium'
  amount: number
  onBack: () => void
  onSuccess: () => void
}

type CryptoType = 'ETH' | 'BNB' | 'USDT'

export default function CryptoPayment({ plan, amount, onBack, onSuccess }: CryptoPaymentProps) {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoType>('ETH')
  const [transactionHash, setTransactionHash] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const walletAddress = '0x93c6D2624f167a30D5f627b55d8774d6d9540eb5'

  // Crypto conversion rates (example rates - in production, fetch from API)
  const cryptoRates: { [key in CryptoType]: number } = {
    ETH: 0.012,
    BNB: 0.05,
    USDT: amount
  }

  const cryptoAmount = cryptoRates[selectedCrypto]

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleVerifyPayment = async () => {
    if (!transactionHash.trim()) {
      setError('Please enter a transaction hash')
      return
    }

    if (transactionHash.length < 10) {
      setError('Invalid transaction hash format')
      return
    }

    setIsVerifying(true)
    setError('')

    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false)
      onSuccess()
    }, 2000)
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

      {/* Crypto Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Cryptocurrency
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(['ETH', 'BNB', 'USDT'] as CryptoType[]).map((crypto) => (
            <button
              key={crypto}
              onClick={() => setSelectedCrypto(crypto)}
              className={`p-4 border-2 rounded-lg transition-all ${
                selectedCrypto === crypto
                  ? 'border-primary bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{crypto}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {crypto === 'USDT' ? `${cryptoAmount}` : `≈${cryptoAmount}`}
                </div>
              </div>
            </button>
          ))}
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
            <span>Send exactly <strong>{cryptoAmount} {selectedCrypto}</strong> to the wallet address below</span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">
              2
            </span>
            <span>Copy the transaction hash from your wallet</span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">
              3
            </span>
            <span>Paste the transaction hash below and click verify</span>
          </li>
        </ol>
      </div>

      {/* Wallet Address */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Wallet Address ({selectedCrypto})
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

      {/* QR Code Placeholder */}
      <div className="mb-6 flex justify-center">
        <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
          <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded">
            <div className="text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <p className="text-sm">QR Code</p>
              <p className="text-xs">Scan to pay</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Hash Input */}
      <div className="mb-6">
        <label htmlFor="txHash" className="block text-sm font-medium text-gray-700 mb-2">
          Transaction Hash
        </label>
        <input
          type="text"
          id="txHash"
          value={transactionHash}
          onChange={(e) => {
            setTransactionHash(e.target.value)
            if (error) setError('')
          }}
          placeholder="0x..."
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
        <p className="text-xs text-gray-500 mt-2">
          Enter the transaction hash after sending the payment
        </p>
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
              Please send the exact amount. Incorrect amounts may delay your upgrade.
              Network fees are not included in the amount shown.
            </p>
          </div>
        </div>
      </div>

      {/* Verify Button */}
      <button
        onClick={handleVerifyPayment}
        disabled={isVerifying || !transactionHash.trim()}
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
        Payment verification may take a few minutes depending on network congestion
      </p>
    </div>
  )
}
