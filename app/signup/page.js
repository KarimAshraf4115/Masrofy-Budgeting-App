'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()

  const [pin, setPin] = useState('')           // first PIN entry
  const [confirmPin, setConfirmPin] = useState('') // confirmation PIN entry
  const [step, setStep] = useState(1)          // 1 = enter PIN, 2 = confirm PIN
  const [error, setError] = useState('')       // error message
  const [isLoading, setIsLoading] = useState(false) // true while calling API

  const currentPin = step === 1 ? pin : confirmPin // which PIN we're currently filling
  const setCurrentPin = step === 1 ? setPin : setConfirmPin // which setter to use

  // KEYPAD PRESS: adds a digit to the current PIN
  const handleKeyPress = (digit) => {
    if (currentPin.length >= 4) return // max 4 digits
    const newPin = currentPin + digit
    setCurrentPin(newPin)

    // Auto advance to step 2 when 4 digits entered in step 1
    if (step === 1 && newPin.length === 4) {
      setTimeout(() => setStep(2), 300) // small delay so user sees 4th dot fill
    }

    // Auto submit when 4 digits entered in step 2
    if (step === 2 && newPin.length === 4) {
      setTimeout(() => handleSubmit(newPin), 300)
    }
  }

  // BACKSPACE: removes last digit
  const handleBackspace = () => {
    setCurrentPin(prev => prev.slice(0, -1))
  }

  // SUBMIT: called automatically when confirm PIN reaches 4 digits
  const handleSubmit = async (finalConfirmPin) => {
    setError('')

    if (pin !== finalConfirmPin) {
      setError('PINs do not match. Please try again.')
      setPin('')
      setConfirmPin('')
      setStep(1)
      return
    }

    setIsLoading(true)
    const response = await fetch('/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin })
    })

    const data = await response.json()

    if (response.ok) {
      router.push('/login') // PIN created → go to login
    } else {
      setError(data.message || 'Something went wrong.')
      setPin('')
      setConfirmPin('')
      setStep(1)
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-surface-container-low min-h-screen flex items-center justify-center p-4 md:p-8 selection:bg-primary-fixed selection:text-on-primary-fixed">
      
      {/* Main Centered Container */}
      <div className="w-full max-w-[440px]">

        {/* App Logo Area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-surface-container-lowest rounded-2xl shadow-sm mb-4">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">Masroofy</h1>
        </div>

        {/* PIN Setup Card */}
        <div className="bg-surface-container-lowest rounded-[1.5rem] p-8 shadow-[0_8px_30px_rgba(0,0,55,0.04)] relative overflow-hidden">
          
          {/* Subtle Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary-container opacity-80"></div>

          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="font-headline-md text-headline-md text-on-surface">
              {step === 1 ? 'Create your PIN' : 'Confirm your PIN'}
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              {step === 1
                ? 'Choose a 4-digit PIN to secure your account.'
                : 'Enter your PIN again to confirm.'}
            </p>
          </div>

          {/* PIN Dot Indicators */}
          <div className="flex justify-center gap-4 mb-8">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  i < currentPin.length
                    ? 'bg-primary scale-110'           // filled dot
                    : 'bg-surface-container-highest border border-outline-variant' // empty dot
                }`}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-center font-body-sm text-body-sm text-error mb-6">{error}</p>
          )}

          {/* Step Indicator */}
          <div className="flex justify-center gap-2 mb-8">
            <div className={`h-1.5 w-8 rounded-full transition-colors ${step === 1 ? 'bg-primary' : 'bg-surface-variant'}`}></div>
            <div className={`h-1.5 w-8 rounded-full transition-colors ${step === 2 ? 'bg-primary' : 'bg-surface-variant'}`}></div>
          </div>

          {/* Numeric Keypad */}
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleKeyPress(String(num))}
                disabled={isLoading}
                className="h-16 rounded-xl bg-surface hover:bg-surface-container active:scale-95 transition-all duration-150 font-display-num text-[24px] font-medium text-on-surface flex items-center justify-center shadow-sm disabled:opacity-50"
              >
                {num}
              </button>
            ))}
            {/* Bottom row: empty, 0, backspace */}
            <div className="h-16" /> {/* empty space */}
            <button
              onClick={() => handleKeyPress('0')}
              disabled={isLoading}
              className="h-16 rounded-xl bg-surface hover:bg-surface-container active:scale-95 transition-all duration-150 font-display-num text-[24px] font-medium text-on-surface flex items-center justify-center shadow-sm disabled:opacity-50"
            >
              0
            </button>
            <button
              onClick={handleBackspace}
              disabled={isLoading}
              className="h-16 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container active:scale-95 transition-all duration-150 flex items-center justify-center disabled:opacity-50"
            >
              <span className="material-symbols-outlined">backspace</span>
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <p className="text-center font-body-sm text-body-sm text-on-surface-variant mt-6">
              Setting up your PIN...
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <span className="font-body-sm text-body-sm text-on-surface-variant">Already have a PIN? </span>
          <Link className="font-body-sm text-body-sm text-primary font-semibold hover:text-primary-container hover:underline transition-colors px-1 py-2" href="/login">
            Log in
          </Link>
        </div>

      </div>
    </div>
  )
}