'use client'

import { useState } from 'react'
import { useAppSelector } from '@/store/hooks'

interface CardPaymentProps {
  plan: 'free' | 'pro' | 'premium'
  amount: number
  onBack: () => void
  onSuccess: () => void
}

export default function CardPayment({ plan, amount, onBack, onSuccess }: CardPaymentProps) {
  const { user } = useAppSelector((state) => state.auth)
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardName, setCardName] = useState('')
  const [country, setCountry] = useState('United States')
  const [address, setAddress] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isManualAddress, setIsManualAddress] = useState(false)

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '')
    const chunks = cleaned.match(/.{1,4}/g)
    return chunks ? chunks.join(' ') : cleaned
  }

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + ' / ' + cleaned.slice(2, 4)
    }
    return cleaned
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '')
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setCardNumber(formatCardNumber(value))
      setPaymentError('')
    }
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    if (value.length <= 4) {
      setExpiryDate(formatExpiryDate(value))
      setPaymentError('')
    }
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setCvv(value)
      setPaymentError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPaymentError('')
    setIsProcessing(true)

    // Simulate payment processing with failure
    setTimeout(() => {
      setIsProcessing(false)
      setPaymentError('Your card was declined. Please try a different payment method.')
    }, 2500)
  }

  return (
    <div className="max-w-xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors text-sm"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <h1 className="text-3xl font-semibold text-gray-900 mb-8">Pay with card</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email - Read Only */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Email
          </label>
          <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
            {user?.email || 'user@example.com'}
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment method</h2>
          
          {/* Card Information */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Card information
            </label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              {/* Card Number */}
              <div className={`relative border-b border-gray-300 ${
                focusedField === 'cardNumber' ? 'ring-2 ring-blue-400 border-blue-400' : ''
              }`}>
                <input
                  type="text"
                  id="cardNumber"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  onFocus={() => setFocusedField('cardNumber')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="1234 1234 1234 1234"
                  className="w-full px-4 py-3 text-base border-0 focus:outline-none"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <img 
                    src="/images/card_brand_icons.png" 
                    alt="Card brands" 
                    className="h-6"
                  />
                </div>
              </div>

              {/* Expiry and CVC */}
              <div className="flex">
                <div className={`flex-1 border-r border-gray-300 ${
                  focusedField === 'expiry' ? 'ring-2 ring-blue-400 border-blue-400' : ''
                }`}>
                  <input
                    type="text"
                    id="expiryDate"
                    value={expiryDate}
                    onChange={handleExpiryChange}
                    onFocus={() => setFocusedField('expiry')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="MM / YY"
                    className="w-full px-4 py-3 text-base border-0 focus:outline-none"
                  />
                </div>
                <div className={`flex-1 relative ${
                  focusedField === 'cvc' ? 'ring-2 ring-blue-400 border-blue-400' : ''
                }`}>
                  <input
                    type="text"
                    id="cvv"
                    value={cvv}
                    onChange={handleCvvChange}
                    onFocus={() => setFocusedField('cvc')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="CVC"
                    className="w-full px-4 py-3 text-base border-0 focus:outline-none pr-12"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <img 
                      src="/images/cvc_icon.png" 
                      alt="CVC" 
                      className="h-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cardholder Name */}
        <div>
          <label htmlFor="cardName" className="block text-sm font-medium text-gray-600 mb-2">
            Cardholder name
          </label>
          <input
            type="text"
            id="cardName"
            value={cardName}
            onChange={(e) => {
              setCardName(e.target.value)
              setPaymentError('')
            }}
            onFocus={() => setFocusedField('cardName')}
            onBlur={() => setFocusedField(null)}
            placeholder="Full name on card"
            className={`w-full px-4 py-3 border rounded-lg text-base transition-all ${
              focusedField === 'cardName'
                ? 'border-blue-400 ring-2 ring-blue-400'
                : 'border-gray-300'
            }`}
          />
        </div>

        {/* Billing Address */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Billing address
          </label>
          <div className="space-y-0 border border-gray-300 rounded-lg overflow-hidden">
            {/* Country Dropdown */}
            <div className={`${isManualAddress ? 'border-b border-gray-300' : ''}`}>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 0.75rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem'
                }}
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Japan">Japan</option>
              </select>
            </div>

            {/* Manual Address Fields */}
            {isManualAddress && (
              <>
                {/* Address Line 1 */}
                <div className="border-b border-gray-300">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onFocus={() => setFocusedField('address')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Address line 1"
                    className="w-full px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* Address Line 2 */}
                <div className="border-b border-gray-300">
                  <input
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    onFocus={() => setFocusedField('addressLine2')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Address line 2"
                    className="w-full px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* City and ZIP */}
                <div className="flex border-b border-gray-300">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onFocus={() => setFocusedField('city')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="City"
                    className="flex-1 px-4 py-3 text-base border-r border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    onFocus={() => setFocusedField('zip')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="ZIP"
                    className="flex-1 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* State Dropdown */}
                <div>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                      backgroundPosition: 'right 0.75rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem'
                    }}
                  >
                    <option value="">State</option>
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AZ">Arizona</option>
                    <option value="AR">Arkansas</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="DE">Delaware</option>
                    <option value="FL">Florida</option>
                    <option value="GA">Georgia</option>
                    <option value="HI">Hawaii</option>
                    <option value="ID">Idaho</option>
                    <option value="IL">Illinois</option>
                    <option value="IN">Indiana</option>
                    <option value="IA">Iowa</option>
                    <option value="KS">Kansas</option>
                    <option value="KY">Kentucky</option>
                    <option value="LA">Louisiana</option>
                    <option value="ME">Maine</option>
                    <option value="MD">Maryland</option>
                    <option value="MA">Massachusetts</option>
                    <option value="MI">Michigan</option>
                    <option value="MN">Minnesota</option>
                    <option value="MS">Mississippi</option>
                    <option value="MO">Missouri</option>
                    <option value="MT">Montana</option>
                    <option value="NE">Nebraska</option>
                    <option value="NV">Nevada</option>
                    <option value="NH">New Hampshire</option>
                    <option value="NJ">New Jersey</option>
                    <option value="NM">New Mexico</option>
                    <option value="NY">New York</option>
                    <option value="NC">North Carolina</option>
                    <option value="ND">North Dakota</option>
                    <option value="OH">Ohio</option>
                    <option value="OK">Oklahoma</option>
                    <option value="OR">Oregon</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="RI">Rhode Island</option>
                    <option value="SC">South Carolina</option>
                    <option value="SD">South Dakota</option>
                    <option value="TN">Tennessee</option>
                    <option value="TX">Texas</option>
                    <option value="UT">Utah</option>
                    <option value="VT">Vermont</option>
                    <option value="VA">Virginia</option>
                    <option value="WA">Washington</option>
                    <option value="WV">West Virginia</option>
                    <option value="WI">Wisconsin</option>
                    <option value="WY">Wyoming</option>
                  </select>
                </div>
              </>
            )}
          </div>

          {/* Enter Address Manually Button */}
          {!isManualAddress && (
            <button
              type="button"
              onClick={() => setIsManualAddress(true)}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700 underline"
            >
              Enter address manually
            </button>
          )}
        </div>

        {/* Error Message */}
        {paymentError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <svg className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-800">Payment failed</p>
              <p className="text-sm text-red-700 mt-1">{paymentError}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-sm"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Subscribe'
          )}
        </button>

        {/* Terms Text */}
        <p className="text-xs text-gray-500 text-center leading-relaxed">
          By clicking Subscribe, you agree that your Kiro subscription will automatically renew on a monthly basis at ${amount}.00/month, plus any applicable taxes, until you cancel your paid subscription. Kiro follows the UTC timezone for billing. The exact timing of your monthly charge depends on your local timezone. You can manage your subscription and cancel at any time by clicking the profile icon in the Kiro IDE and selecting the Manage Plan button.
        </p>

        {/* Footer Links */}
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-2">
          <span className="flex items-center">
            Powered by <span className="font-semibold ml-1">stripe</span>
          </span>
          <span>|</span>
          <a href="#" className="hover:text-gray-700">Terms</a>
          <a href="#" className="hover:text-gray-700">Privacy</a>
          <a href="#" className="hover:text-gray-700">Contact</a>
        </div>
      </form>
    </div>
  )
}
