'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()

  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [attemptsLeft, setAttemptsLeft] = useState(5)

  // COUNTDOWN TIMER: ticks down every second when locked
  useEffect(() => {
    if (!isLocked || timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsLocked(false) // unlock when timer hits 0
          setError('')
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer) // cleanup on unmount
  }, [isLocked, timeLeft])

  // KEYPAD PRESS: adds digit to PIN
  const handleKeyPress = (digit) => {
    if (isLocked || isLoading) return
    if (pin.length >= 4) return
    const newPin = pin + digit
    setPin(newPin)

    // Auto submit when 4 digits entered
    if (newPin.length === 4) {
      setTimeout(() => handleSubmit(newPin), 300)
    }
  }

  // BACKSPACE: removes last digit
  const handleBackspace = () => {
    if (isLocked || isLoading) return
    setPin(prev => prev.slice(0, -1))
  }

  // SUBMIT: verify PIN against API
  const handleSubmit = async (finalPin) => {
    setError('')
    setIsLoading(true)

    const response = await fetch('/api/user', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: finalPin })
    })

    const data = await response.json()

    if (response.ok && data.success) {
      router.push('/dashboard') // correct PIN → go to dashboard
    } else if (response.status === 429) {
      // locked out
      setIsLocked(true)
      setTimeLeft(data.timeLeft)
      setError(data.message)
      setPin('')
    } else {
      // wrong PIN
      setError(data.message)
      setAttemptsLeft(data.attemptsLeft)
      setPin('')
    }

    setIsLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 bg-surface-container-low min-h-screen flex items-center justify-center p-4 md:p-8 selection:bg-primary-fixed selection:text-on-primary-fixed">

      {/* Main Centered Container */}
      <div className="w-full max-w-[420px]">

        {/* App Logo Area */}
        <div className="mb-8 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-sm mb-4">
            <span className="material-symbols-outlined text-on-primary" style={{ fontVariationSettings: "'FILL' 1", fontSize: '28px' }}>account_balance_wallet</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary text-center tracking-tight">Masroofy</h1>
        </div>

        {/* Login Card */}
        <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] relative overflow-hidden">

          {/* Subtle Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary-container opacity-80"></div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="font-headline-md text-headline-md text-on-surface">Welcome back</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              {isLocked
                ? `Account locked. Try again in ${timeLeft} seconds.`
                : 'Enter your PIN to access your account.'}
            </p>
          </div>

          {/* Locked Warning Banner — only shows when locked */}
          {isLocked && (
            <div className="w-full bg-error-container rounded-lg p-4 mb-6 flex items-start gap-3 border border-error/20">
              <span className="material-symbols-outlined text-on-error-container shrink-0 mt-0.5">lock</span>
              <div>
                <h3 className="font-label-caps text-label-caps text-on-error-container mb-1">Account Locked</h3>
                <p className="font-body-sm text-body-sm text-on-error-container">
                  Too many failed attempts. Try again in {timeLeft} seconds.
                </p>
              </div>
            </div>
          )}

          {/* PIN Dot Indicators */}
          <div className="flex justify-center gap-4 mb-6">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  i < pin.length
                    ? 'bg-primary scale-110'
                    : 'bg-surface-container-highest border border-outline-variant'
                }`}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && !isLocked && (
            <p className="text-center font-body-sm text-body-sm text-error mb-4">
              {error}
              {attemptsLeft > 0 && attemptsLeft < 5 && (
                <span className="block text-on-surface-variant mt-1">
                  {attemptsLeft} attempt{attemptsLeft === 1 ? '' : 's'} remaining
                </span>
              )}
            </p>
          )}

          {/* Numeric Keypad */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleKeyPress(String(num))}
                disabled={isLocked || isLoading}
                className="h-16 rounded-xl bg-surface hover:bg-surface-container active:scale-95 transition-all duration-150 font-display-num text-[24px] font-medium text-on-surface flex items-center justify-center shadow-sm disabled:opacity-50"
              >
                {num}
              </button>
            ))}
            {/* Bottom row: empty, 0, backspace */}
            <div className="h-16" />
            <button
              onClick={() => handleKeyPress('0')}
              disabled={isLocked || isLoading}
              className="h-16 rounded-xl bg-surface hover:bg-surface-container active:scale-95 transition-all duration-150 font-display-num text-[24px] font-medium text-on-surface flex items-center justify-center shadow-sm disabled:opacity-50"
            >
              0
            </button>
            <button
              onClick={handleBackspace}
              disabled={isLocked || isLoading}
              className="h-16 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container active:scale-95 transition-all duration-150 flex items-center justify-center disabled:opacity-50"
            >
              <span className="material-symbols-outlined">backspace</span>
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <p className="text-center font-body-sm text-body-sm text-on-surface-variant mt-6">
              Verifying...
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            First time here?
            <Link className="text-primary font-medium hover:text-on-primary-fixed-variant hover:underline transition-colors ml-1" href="/signup">
              Set up your PIN
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}