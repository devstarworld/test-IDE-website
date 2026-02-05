'use client'

import { useState } from 'react'
import CardPayment from './CardPayment'
import CryptoPayment from './CryptoPayment'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  plan: 'free' | 'pro' | 'premium'
  amount: number
}

export default function PaymentModal({ isOpen, onClose, plan, amount }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto' | null>(null)

  if (!isOpen) return null

  const handleClose = () => {
    setPaymentMethod(null)
    onClose()
  }

  const handlePaymentSuccess = () => {
    alert('Payment successful! Your membership will be updated shortly.')
    handleClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Content */}
        <div className="p-8">
          {!paymentMethod ? (
            // Payment Method Selection
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Choose Payment Method
                </h2>
                <p className="text-gray-600">
                  Upgrade to <span className="font-semibold capitalize">{plan}</span> Plan - ${amount}/month
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Card Payment Option */}
                <button
                  onClick={() => setPaymentMethod('card')}
                  className="border-2 border-gray-300 rounded-lg p-6 hover:border-primary hover:bg-blue-50 transition-all group"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Credit/Debit Card</h3>
                    <p className="text-sm text-gray-600 text-center">
                      Pay securely with your card
                    </p>
                    <div className="flex gap-2 mt-4">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-6" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                    </div>
                  </div>
                </button>

                {/* Crypto Payment Option */}
                <button
                  onClick={() => setPaymentMethod('crypto')}
                  className="border-2 border-gray-300 rounded-lg p-6 hover:border-primary hover:bg-blue-50 transition-all group"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-200">
                      <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z"/>
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Cryptocurrency</h3>
                    <p className="text-sm text-gray-600 text-center">
                      Pay with crypto (ETH, BNB, USDT)
                    </p>
                    <div className="flex gap-2 mt-4 text-xs text-gray-500">
                      <span>ETH</span>
                      <span>•</span>
                      <span>BNB</span>
                      <span>•</span>
                      <span>USDT</span>
                    </div>
                  </div>
                </button>
              </div>
            </>
          ) : paymentMethod === 'card' ? (
            <CardPayment
              plan={plan}
              amount={amount}
              onBack={() => setPaymentMethod(null)}
              onSuccess={handlePaymentSuccess}
            />
          ) : (
            <CryptoPayment
              plan={plan}
              amount={amount}
              onBack={() => setPaymentMethod(null)}
              onSuccess={handlePaymentSuccess}
            />
          )}
        </div>
      </div>
    </div>
  )
}
