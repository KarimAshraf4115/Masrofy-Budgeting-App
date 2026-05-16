'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation' 
export default function HistoryPage() {

  // STATE
  const [expenses, setExpenses] = useState([])       // list of all expenses
  const [totalSpent, setTotalSpent] = useState(0)    // total spent this cycle
  const [isLoading, setIsLoading] = useState(true)   // loading state
  const [error, setError] = useState('')             // error message
  const router = useRouter()  

  // CATEGORY MAP: maps categoryId to name and icon
  const CATEGORIES = {
    1: { name: 'Food', icon: 'restaurant', bg: 'bg-secondary-container', text: 'text-on-secondary-container' },
    2: { name: 'Transport', icon: 'directions_car', bg: 'bg-tertiary-container', text: 'text-on-tertiary-container' },
    3: { name: 'Entertainment', icon: 'movie', bg: 'bg-primary-fixed', text: 'text-on-primary-fixed' },
    4: { name: 'Other', icon: 'category', bg: 'bg-surface-variant', text: 'text-on-surface' },
  }

  const loadExpenses = async () => {
    try {
      setIsLoading(true)

      // Step 1: get active cycle
      const cycleRes = await fetch('/api/cycle')
      const cycleData = await cycleRes.json()
      if (!cycleRes.ok) {
        setError('No active cycle found')
        setIsLoading(false)
        return
      }

      // Step 2: get all expenses for this cycle
      const expRes = await fetch(`/api/expense?cycleId=${cycleData.cycle.id}`)
      const expData = await expRes.json()
      setExpenses(expData.expenses)

      // Step 3: get total spent from expenses
      const total = expData.expenses.reduce((sum, exp) => sum + exp.amount, 0)
      setTotalSpent(total)

    } catch (err) {
      setError('Failed to load expenses')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadExpenses()

  }, [])

  // DELETE: removes an expense and refreshes the list
  const handleDelete = async (expenseId) => {
    const response = await fetch(`/api/expense?id=${expenseId}`, { //----------new fix : make DELETE request work on id from search params (best practice)
      method: 'DELETE'
    })
    if (response.ok) {
      loadExpenses() // refresh the list after deleting
    }
  }

  // GROUP BY DATE: turns flat list into object grouped by date
  // Input:  [{ timestamp: "2026-05-03T...", ... }, { timestamp: "2026-05-03T...", ... }]
  // Output: { "May 3, 2026": [expense1, expense2], "May 2, 2026": [expense3] }
  const groupByDate = (expenses) => {
    const groups = {}
    expenses.forEach(expense => {
      const date = new Date(expense.timestamp).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      }) // e.g. "May 3, 2026"
      if (!groups[date]) groups[date] = [] // create array if first time seeing this date
      groups[date].push(expense)           // add expense to that date's array
    })
    return groups
  }

  // LOADING STATE
  if (isLoading) return (
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

  const groupedExpenses = groupByDate(expenses) // group the expenses by date
  const dateGroups = Object.keys(groupedExpenses) // get list of dates ["May 3, 2026", ...]

  return (
    <div className="max-w-6xl w-full mx-auto p-container-margin md:p-section-gap space-y-section-gap pb-24">

      {/* 1. HEADER & SUMMARY */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-stack-gap">
        <div className="space-y-2">
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Transaction History</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">Review and manage your financial activity with precision.</p>
        </div>

        {/* Summary Card - real total */}
        <div className="bg-surface-container-lowest p-card-padding rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-surface-container flex flex-col items-end min-w-[280px]">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-1">Total Spent This Cycle</span>
          <div className="flex items-baseline gap-1">
            <span className="font-headline-md text-headline-md text-primary">EGP</span>
            <span className="font-display-num text-display-num text-primary tracking-tighter">{totalSpent.toFixed(2)}</span>
          </div>
        </div>
      </section>

      {/* 2. EXPENSE LIST */}
      <section className="space-y-6">

        {/* EMPTY STATE: no expenses yet */}
        {dateGroups.length === 0 && (
          <div className="text-center py-20 text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] mb-4 block">receipt_long</span>
            <p className="font-headline-md text-headline-md">No expenses yet</p>
            <p className="font-body-sm text-body-sm mt-2">Start logging your expenses to see them here.</p>
          </div>
        )}

        {/* LOOP through each date group */}
        {dateGroups.map(date => (
          <div key={date} className="space-y-3">

            {/* Date Header */}
            <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest pl-2">{date}</h3>

            {/* Expenses for this date */}
            <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-surface-container overflow-hidden divide-y divide-surface-container">

              {/* LOOP through each expense in this date group */}
              {groupedExpenses[date].map(expense => {
                const category = CATEGORIES[expense.categoryId] || CATEGORIES[4] // fallback to Other
                return (
                  <div key={expense.id} className="flex items-center justify-between p-4 hover:bg-surface-bright transition-colors group">

                    {/* Left: icon + info */}
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full ${category.bg} flex items-center justify-center ${category.text} shadow-inner`}>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{category.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-headline-md text-headline-md text-on-surface">{category.name}</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">{expense.note || 'No note'}</p>
                      </div>
                    </div>

                    {/* Right: amount + edit + delete buttons */}
                    <div className="flex items-center gap-6">
                      <span className="font-body-lg text-body-lg font-semibold text-error tracking-tight">-{expense.amount} EGP</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => router.push(`/expenses/edit/${expense.id}`)}
                          aria-label="Edit"
                          className="p-2 text-outline hover:text-primary hover:bg-primary-container rounded-full transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          aria-label="Delete"
                          className="p-2 text-outline hover:text-error hover:bg-error-container rounded-full transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </div>

                  </div>
                )
              })}
            </div>
          </div>
        ))}

      </section>
    </div>
  )
}