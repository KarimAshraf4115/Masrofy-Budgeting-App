'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'

export default function EditExpensePage({ params }) {
    const { id } =  use(params)
  // STATE: memory boxes
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [note, setNote] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)  // loading the existing expense
  const [error, setError] = useState('')
  const router = useRouter()

  // EFFECT: load the existing expense when page opens
  useEffect(() => {
    const fetchExpense = async () => {
      const cycleRes = await fetch('/api/cycle')
      const cycleData = await cycleRes.json()
      if (!cycleRes.ok) {
        setError('No active cycle found')
        setIsFetching(false)
        return
      }

      // get all expenses then find the one we want by ID
      const expRes = await fetch(`/api/expense?cycleId=${cycleData.cycle.id}`)
      const expData = await expRes.json()
      const expense = expData.expenses.find(e => e.id === parseInt(id))

      if (!expense) {
        setError('Expense not found')
        setIsFetching(false)
        return
      }

      // pre-fill the form with existing data
      setAmount(expense.amount)
      setCategoryId(expense.categoryId)
      setNote(expense.note || '')
      setIsFetching(false)
    }
    fetchExpense()
  }, [id])

  // SUBMIT: calls PUT /api/expense to update
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const response = await fetch('/api/expense', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: parseInt(id),
        amount: parseFloat(amount),
        categoryId: parseInt(categoryId),
        note: note
      })
    })

    const data = await response.json()

    if (response.ok) {
      router.push('/history')       // go back to history on success
    } else {
      setError(data.message || 'Something went wrong')
      setIsLoading(false)
    }
  }

  // LOADING STATE: while fetching existing expense
  if (isFetching) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-on-surface-variant">Loading...</p>
    </div>
  )

  // ERROR STATE
  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-error">{error}</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-background p-container-margin md:p-section-gap">

      {/* Page Header */}
      <div className="mb-10 max-w-2xl">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Edit Expense</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
          Update the details of your recorded expense.
        </p>
      </div>

      {/* Bento Layout Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Main Form Card (Spans 8 cols) */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.04)]">

          <h3 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">edit</span>
            Expense Details
          </h3>

          <form className="space-y-8" onSubmit={handleSubmit}>

            {/* Amount Input */}
            <div className="relative group">
              <label className="font-label-caps text-label-caps text-outline block mb-2 transition-colors group-focus-within:text-primary" htmlFor="amount">
                Amount (EGP)
              </label>
              <div className="flex items-center bg-surface-container hover:bg-surface-variant transition-colors border-b-2 border-transparent focus-within:border-primary focus-within:bg-surface-variant rounded-t-md px-4 py-3">
                <span className="material-symbols-outlined text-outline-variant mr-3 group-focus-within:text-primary transition-colors">payments</span>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 p-0 font-headline-md text-headline-md text-on-surface placeholder:text-outline-variant outline-none"
                  placeholder="0.00"
                  required
                />
                <span className="font-body-sm text-body-sm text-outline ml-3 font-semibold">EGP</span>
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="relative group">
              <label className="font-label-caps text-label-caps text-outline block mb-2 transition-colors group-focus-within:text-primary" htmlFor="category">
                Category
              </label>
              <div className="flex items-center bg-surface-container hover:bg-surface-variant transition-colors border-b-2 border-transparent focus-within:border-primary focus-within:bg-surface-variant rounded-t-md px-4 py-3">
                <span className="material-symbols-outlined text-outline-variant mr-3 group-focus-within:text-primary transition-colors">category</span>
                <select
                  id="category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 p-0 font-body-lg text-body-lg text-on-surface outline-none cursor-pointer appearance-none"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="1">🍔 Food</option>
                  <option value="2">🚗 Transport</option>
                  <option value="3">🎬 Entertainment</option>
                  <option value="4">📦 Other</option>
                </select>
                <span className="material-symbols-outlined text-outline-variant ml-3 pointer-events-none">expand_more</span>
              </div>
            </div>

            {/* Note Input */}
            <div className="relative group">
              <label className="font-label-caps text-label-caps text-outline block mb-2 transition-colors group-focus-within:text-primary" htmlFor="note">
                Note (Optional)
              </label>
              <div className="flex items-start bg-surface-container hover:bg-surface-variant transition-colors border-b-2 border-transparent focus-within:border-primary focus-within:bg-surface-variant rounded-t-md px-4 py-3">
                <span className="material-symbols-outlined text-outline-variant mr-3 group-focus-within:text-primary transition-colors mt-1">edit_note</span>
                <textarea
                  id="note"
                  rows="3"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 p-0 font-body-lg text-body-lg text-on-surface placeholder:text-outline-variant outline-none resize-none"
                  placeholder="e.g., Weekly grocery shopping at Carrefour"
                ></textarea>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-surface-variant my-4"></div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 pt-2">
              {error && <p className="text-error font-body-sm text-body-sm">{error}</p>}
              <button type="button" onClick={() => router.push('/history')} className="px-6 py-3 rounded-full font-label-caps text-label-caps text-on-surface hover:bg-surface-container transition-colors">
                Cancel
              </button>
              <button disabled={isLoading} type="submit" className="px-8 py-3 rounded-full font-label-caps text-label-caps bg-primary text-on-primary shadow-md hover:bg-on-primary-fixed-variant transition-colors active:scale-95 duration-200 flex items-center gap-2 disabled:opacity-50">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check</span>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Side Info Card (Spans 4 cols) */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/20">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
            <h3 className="font-headline-md text-headline-md text-on-surface">Quick Tip</h3>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Editing an expense will immediately update your Safe Daily Limit and spending breakdown to reflect the corrected amount.
          </p>
        </div>

      </div>
    </div>
  )
}