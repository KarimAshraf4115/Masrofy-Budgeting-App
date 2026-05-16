'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AddExpensePage() {
  // STATE: memory boxes
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [note, setNote] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [cycleData, setCycleData] = useState(null)  // holds active cycle info
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T'[0])) //YYYY-MM-DD
  const router = useRouter()

    // Calculate remaining days from the cycle data
  const remainingDays = cycleData ? (() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(cycleData.endDate);
    end.setHours(0, 0, 0, 0);
    if (end < today) return 0;
    const diffTime = end - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include today
  })() : '...';

  // EFFECT: load active cycle when page opens
  useEffect(() => {
    const fetchCycle = async () => {
      const response = await fetch('/api/cycle')  // get active cycle
      const data = await response.json()
      if (response.ok) setCycleData(data.cycle)   // save cycle to memory
    }
    fetchCycle()
  }, [])

  // SUBMIT: runs when user clicks "Log Expense"
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!cycleData) {
      setError('No active cycle found. Please set up a budget first.')
      return
    }
    setIsLoading(true)
    setError('')

    const response = await fetch('/api/expense', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: parseFloat(amount),   // convert "50" → 50
        categoryId: parseInt(categoryId), // convert "1" → 1
        cycleId: cycleData.id,        // from the cycle we loaded
        timestamp: new Date(expenseDate).toISOString(), // use selected date
        note: note
      })
    })

    const data = await response.json()

    if (response.ok) {
      router.push('/dashboard')       // go to dashboard on success
    } else {
      setError(data.message || 'Something went wrong')
      setIsLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-background p-container-margin md:p-section-gap">
      
      {/* Page Header */}
      <div className="mb-10 max-w-2xl">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Log Expense</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
          Record your spending to keep your daily limit accurate.
        </p>
      </div>

      {/* Bento Layout Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Form Card (Spans 8 cols) */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          
          <h3 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">receipt_long</span>
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

            {/* Category & Date Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Category Dropdown */}
              <div className="relative group">
                <label className="font-label-caps text-label-caps text-outline block mb-2 transition-colors group-focus-within:text-primary" htmlFor="category">
                  Category
                </label>
                <div className="flex items-center bg-surface-container hover:bg-surface-variant transition-colors border-b-2 border-transparent focus-within:border-primary focus-within:bg-surface-variant rounded-t-md px-4 py-3">
                  <span className="material-symbols-outlined text-outline-variant mr-3 group-focus-within:text-primary transition-colors">category</span>
                  {/* Styled Select Dropdown */}
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

              {/* Date Input */}
              <div className="relative group">
                <label className="font-label-caps text-label-caps text-outline block mb-2 transition-colors group-focus-within:text-primary" htmlFor="date">
                  Date
                </label>
                <div className="flex items-center bg-surface-container hover:bg-surface-variant transition-colors border-b-2 border-transparent focus-within:border-primary focus-within:bg-surface-variant rounded-t-md px-4 py-3">
                  <span className="material-symbols-outlined text-outline-variant mr-3 group-focus-within:text-primary transition-colors">calendar_today</span>
                  <input 
                    type="date" 
                    id="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 p-0 font-body-lg text-body-lg text-on-surface outline-none cursor-pointer" 
                  />
                </div>
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
              <button type="button" onClick={() => router.push('/dashboard')} className="px-6 py-3 rounded-full font-label-caps text-label-caps text-on-surface hover:bg-surface-container transition-colors">
                Cancel
              </button>
              <button disabled={isLoading || !cycleData} type="submit" className="px-8 py-3 rounded-full font-label-caps text-label-caps bg-primary text-on-primary shadow-md hover:bg-on-primary-fixed-variant transition-colors active:scale-95 duration-200 flex items-center gap-2 disabled:opacity-50">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check</span>
                {isLoading ? 'Saving...' : 'Log Expense'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Side Helper Card (Spans 4 cols) */}
                {/* Right Side Helper Card (Spans 4 cols) */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/20">
          
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
            <h3 className="font-headline-md text-headline-md text-on-surface">Quick Tip</h3>
          </div>
          
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-6">
            Logging expenses immediately after spending helps maintain an accurate daily limit and gives you better insights into your spending habits at the end of the cycle.
          </p>

          <div className="bg-surface-container p-4 rounded-lg border border-outline-variant/20">
            <div className="flex justify-between items-center font-body-sm text-body-sm mb-2">
              <span className="text-on-surface-variant">Current Cycle</span>
              <span className="text-on-surface font-semibold">
                {cycleData ? `${cycleData.startDate} - ${cycleData.endDate}` : 'Loading...'}
              </span>
            </div>
            <div className="flex justify-between items-center font-body-sm text-body-sm">
              <span className="text-on-surface-variant">Remaining</span>
              <span className="text-secondary font-semibold">
                {cycleData ? (() => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  // Adding 'T00:00:00' prevents Javascript timezone bugs that shift the date back by 1 day
                  const end = new Date(cycleData.endDate + 'T00:00:00'); 
                  end.setHours(0, 0, 0, 0);
                  
                  if (end < today) return '0 days';
                  
                  const diffTime = end - today;
                  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include today
                  
                  return `${days} days`;
                })() : 'Loading...'}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}