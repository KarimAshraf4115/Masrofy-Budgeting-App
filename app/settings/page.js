'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import UserRepository from '@/lib/UserRepository'

export default function SettingsPage() {
  const router = useRouter()

  // --- Cycle Reset State ---
  const [isResetting, setIsResetting] = useState(false)
  const [message, setMessage] = useState('')

  // --- PIN Change State ---
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [pinStep, setPinStep] = useState(1)        // 1 = enter new PIN, 2 = confirm PIN
  const [pinError, setPinError] = useState('')
  const [pinSuccess, setPinSuccess] = useState('')
  const [isPinLoading, setIsPinLoading] = useState(false)

  const currentPin = pinStep === 1 ? pin : confirmPin
  const setCurrentPin = pinStep === 1 ? setPin : setConfirmPin

  // KEYPAD PRESS
  const handleKeyPress = (digit) => {
    if (isPinLoading) return
    if (currentPin.length >= 4) return
    const newPin = currentPin + digit
    setCurrentPin(newPin)

    // Auto advance to confirm step
    if (pinStep === 1 && newPin.length === 4) {
      setTimeout(() => setPinStep(2), 300)
    }

    // Auto submit when confirm PIN reaches 4 digits
    if (pinStep === 2 && newPin.length === 4) {
      setTimeout(() => handlePinSubmit(newPin), 300)
    }
  }

  // BACKSPACE
  const handleBackspace = () => {
    if (isPinLoading) return
    setCurrentPin(prev => prev.slice(0, -1))
  }

  // RESET PIN FORM: go back to step 1
  const resetPinForm = () => {
    setPin('')
    setConfirmPin('')
    setPinStep(1)
    setPinError('')
  }

  // SUBMIT NEW PIN
  const handlePinSubmit = async (finalConfirmPin) => {
    setPinError('')
    setPinSuccess('')

    if (pin !== finalConfirmPin) {
      setPinError('PINs do not match. Please try again.')
      resetPinForm()
      return
    }

    setIsPinLoading(true)

    const response = await fetch('/api/user/change-pin', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin })
    })

    const data = await response.json()

    if (response.ok) {
      setPinSuccess('PIN updated successfully!')
      resetPinForm()
    } else {
      setPinError(data.message || 'Something went wrong.')
      resetPinForm()
    }

    setIsPinLoading(false)
  }

  // RESET CYCLE
  const handleReset = async () => {
    const confirmed = window.confirm('Are you sure? This will delete ALL expenses and the current cycle. This cannot be undone.')
    if (!confirmed) return

    setIsResetting(true)
    setMessage('')

    const response = await fetch('/api/cycle', { method: 'DELETE' })

    if (response.ok) {
      setMessage('Cycle reset successfully!')
      setTimeout(() => router.push('/setup'), 1500)
    } else {
      setMessage('Something went wrong. Please try again.')
      setIsResetting(false)
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto w-full space-y-section-gap pb-24">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT COLUMN: Profile & Preferences */}
        <div className="lg:col-span-7 space-y-8">

          {/* Profile Management Card — static UI, needs auth first */}
          <div className="bg-surface-container-lowest rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-6">Profile Management</h3>
            <div className="flex items-start gap-6 mb-8">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-surface-variant overflow-hidden flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant text-[48px]">person</span>
                </div>
                <button className="absolute bottom-0 right-0 h-8 w-8 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center border-2 border-surface-container-lowest shadow-sm hover:opacity-90 transition-opacity">
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                </button>
              </div>
              <div className="flex-1 space-y-4">
                <div className="relative pt-4">
                  <label className="absolute top-0 left-0 font-label-caps text-label-caps text-outline">FULL NAME</label>
                  <input className="w-full bg-surface py-2 border-0 border-b-2 border-transparent focus:border-primary-container focus:ring-0 transition-colors font-body-lg text-body-lg text-on-surface" type="text" value="Alexander Wright" readOnly />
                </div>
                <div className="relative pt-4">
                  <label className="absolute top-0 left-0 font-label-caps text-label-caps text-outline">EMAIL ADDRESS</label>
                  <input className="w-full bg-surface py-2 border-0 border-b-2 border-transparent focus:border-primary-container focus:ring-0 transition-colors font-body-lg text-body-lg text-on-surface text-on-surface-variant" type="email" value="alexander.wright@example.com" readOnly />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button className="px-6 py-2 rounded-lg font-body-sm text-body-sm font-medium text-primary-container border border-primary-container hover:bg-surface-container transition-colors">Discard</button>
              <button className="px-6 py-2 rounded-lg font-body-sm text-body-sm font-medium bg-primary-container text-on-primary-container hover:opacity-90 transition-opacity">Save Changes</button>
            </div>
          </div>

          {/* Preferences Card — static UI */}
          <div className="bg-surface-container-lowest rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-6">Preferences</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-body-lg text-body-lg font-medium text-on-surface">Currency Display</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Choose your primary currency</p>
                </div>
                <select className="bg-surface border-0 border-b-2 border-outline-variant py-2 pl-4 pr-10 focus:ring-0 focus:border-primary-container font-body-lg text-body-lg rounded-t-md">
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>EGP (£)</option>
                </select>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-surface-container">
                <div>
                  <h4 className="font-body-lg text-body-lg font-medium text-on-surface">Dark Mode</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Toggle application theme</p>
                </div>
                <div className="w-12 h-6 bg-outline-variant rounded-full relative cursor-pointer transition-colors">
                  <div className="absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow-md transform translate-x-0 transition-transform"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PIN Security */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-surface-container-lowest rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.04)] h-full flex flex-col">

            <div className="flex items-center justify-between mb-2">
              <h3 className="font-headline-md text-headline-md text-on-surface">PIN Security</h3>
              <div className="w-12 h-6 bg-primary-container rounded-full relative cursor-pointer transition-colors">
                <div className="absolute right-0 top-0 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform"></div>
              </div>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
              {pinStep === 1 ? 'Enter your new 4-digit PIN.' : 'Confirm your new PIN.'}
            </p>

            {/* Success Message */}
            {pinSuccess && (
              <p className="text-center font-body-sm text-body-sm text-secondary mb-4">{pinSuccess}</p>
            )}

            {/* Error Message */}
            {pinError && (
              <p className="text-center font-body-sm text-body-sm text-error mb-4">{pinError}</p>
            )}

            {/* Step Indicator */}
            <div className="flex justify-center gap-2 mb-6">
              <div className={`h-1.5 w-8 rounded-full transition-colors ${pinStep === 1 ? 'bg-primary' : 'bg-surface-variant'}`} />
              <div className={`h-1.5 w-8 rounded-full transition-colors ${pinStep === 2 ? 'bg-primary' : 'bg-surface-variant'}`} />
            </div>

            {/* PIN Dot Indicators */}
            <div className="flex justify-center gap-4 mb-8">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    i < currentPin.length
                      ? 'bg-primary scale-110'
                      : 'bg-surface-container-highest border border-outline-variant'
                  }`}
                />
              ))}
            </div>

            {/* Numeric Keypad */}
            <div className="grid grid-cols-3 gap-4 mt-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleKeyPress(String(num))}
                  disabled={isPinLoading}
                  className="h-16 rounded-lg bg-surface hover:bg-surface-container active:scale-95 transition-all duration-150 font-display-num text-[24px] font-medium text-on-surface flex items-center justify-center disabled:opacity-50"
                >
                  {num}
                </button>
              ))}
              <div className="h-16 flex items-center justify-center" />
              <button
                onClick={() => handleKeyPress('0')}
                disabled={isPinLoading}
                className="h-16 rounded-lg bg-surface hover:bg-surface-container active:scale-95 transition-all duration-150 font-display-num text-[24px] font-medium text-on-surface flex items-center justify-center disabled:opacity-50"
              >
                0
              </button>
              <button
                onClick={handleBackspace}
                disabled={isPinLoading}
                className="h-16 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container active:scale-95 transition-all duration-150 flex items-center justify-center disabled:opacity-50"
              >
                <span className="material-symbols-outlined">backspace</span>
              </button>
            </div>

            {/* Reset PIN form link */}
            {pinStep === 2 && (
              <button
                onClick={resetPinForm}
                className="mt-4 text-center font-body-sm text-body-sm text-outline hover:text-on-surface transition-colors"
              >
                ← Start over
              </button>
            )}

            {isPinLoading && (
              <p className="text-center font-body-sm text-body-sm text-on-surface-variant mt-4">
                Updating PIN...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* DANGER ZONE */}
      <div className="mt-12 bg-error-container/20 rounded-xl p-card-padding border border-error-container">
        <h3 className="font-headline-md text-headline-md text-error mb-2">Danger Zone</h3>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="font-body-lg text-body-lg font-medium text-on-surface">Reset Current Cycle</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">This will permanently delete all transactions for the current billing cycle. This action cannot be undone.</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {message && (
              <p className={`font-body-sm text-body-sm ${message.includes('successfully') ? 'text-secondary' : 'text-error'}`}>
                {message}
              </p>
            )}
            <button
              onClick={handleReset}
              disabled={isResetting}
              className="shrink-0 px-6 py-3 rounded-lg font-body-sm text-body-sm font-semibold bg-error text-on-error hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50"
            >
              {isResetting ? 'Resetting...' : 'Reset Current Cycle'}
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}