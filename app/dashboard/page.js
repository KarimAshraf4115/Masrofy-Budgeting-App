'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  // STATE: memory boxes for our data
  const [data, setData] = useState(null)       // holds all dashboard data from API
  const [isLoading, setIsLoading] = useState(true)  // true while waiting for API
  const [error, setError] = useState('')        // holds error message if API fails

  // EFFECT: runs automatically when page loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard') // call the API
        const json = await response.json()             // convert response to JS object
        setData(json)                                  // save data to memory
      } catch (err) {
        setError('Failed to load dashboard')           // save error to memory
      } finally {
        setIsLoading(false)                            // stop loading regardless
      }
    }
    fetchData() // call the function
  }, [])        // [] = run only once when page loads

  // LOADING STATE: show this while waiting for API
  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-on-surface-variant">Loading...</p>
    </div>
  )

  // ERROR STATE: show this if API failed
  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-error">{error}</p>
    </div>
  )

  // NO CYCLE STATE: show this if no active cycle exists
  if (!data.hasActiveCycle) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-on-surface-variant">No active cycle. <a href="/setup" className="text-primary">Set one up!</a></p>
    </div>
  )

// SHORTCUT VARIABLES: so we don't write data.financials.dailyLimit every time
  const { financials, cycle, alerts, categoryBreakdown } = data
  const percentageNumber = parseFloat(financials.percentageUsed)  // "0.0%" → 0.0

  // CATEGORY MAP: maps category IDs to names and colors
  const CATEGORIES = {
    "1": { name: "Food",          color: "#0f4c81", dot: "bg-primary-container" },
    "2": { name: "Transport",     color: "#6cf8bb", dot: "bg-secondary-container" },
    "3": { name: "Entertainment", color: "#ffa71e", dot: "bg-[#ffa71e]" },
    "4": { name: "Other",         color: "#d3e4fe", dot: "bg-surface-variant" },
  }

  // BUILD CONIC GRADIENT: turns category percentages into a CSS gradient
  // e.g. Food 60%, Transport 40% → "conic-gradient(#0f4c81 0% 60%, #6cf8bb 60% 100%)"
  const buildGradient = () => {
    if (categoryBreakdown.length === 0) {
      return 'conic-gradient(#e5eeff 0% 100%)' // empty = light blue circle
    }
    let gradient = 'conic-gradient('
    let cumulative = 0  // tracks where we are in the circle (0% to 100%)
    categoryBreakdown.forEach((item, index) => {
      const color = CATEGORIES[item.categoryId]?.color || '#d3e4fe' // get color or default
      const start = cumulative
      const end = cumulative + item.percentage
      gradient += `${color} ${start}% ${end}%`  // e.g. "#0f4c81 0% 60%"
      if (index < categoryBreakdown.length - 1) gradient += ', ' // add comma between segments
      cumulative = end  // move pointer forward
    })
    gradient += ')'
    return gradient
  }

  return (
    /* 1. THE CANVAS: Outer wrapper with padding */
    <div className="p-container-margin md:p-section-gap">
      
      {/* 2. THE HEADER ROW */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 mt-4 md:mt-8">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-background">Overview</h2>
          <p className="font-body-sm text-body-sm text-outline mt-1">Your financial health at a glance.</p>
        </div>
        
        {/* UPDATED: Changed from <button> to <Link> pointing to /expenses/add */}
        <Link href="/expenses/add" className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-lg font-label-caps text-label-caps shadow-[0_2px_10px_rgba(0,53,95,0.2)] hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors active:scale-95 duration-200">
          <span className="material-symbols-outlined text-[18px]">add</span> 
          Log Expense
        </Link>
      </div>

      {/* 3. ALERT BANNER - only shows if there's an alert */}
      {alerts.length > 0 && alerts.map((alert, i) => (
        <div key={i} className="mb-8 flex items-start gap-4 bg-error-container p-4 rounded-xl border border-error/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="bg-error/10 p-2 rounded-full mt-0.5">
            <span className="material-symbols-outlined text-error text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
          </div>
          <div>
            <h4 className="font-label-caps text-label-caps text-on-error-container">Alert</h4>
            <p className="font-body-sm text-body-sm text-on-error-container mt-1 opacity-90">{alert.message}</p>
          </div>
        </div>
      ))}

      {/* 4. DASHBOARD BENTO GRID */}
      {/* grid-cols-1: 1 column on mobile. lg:grid-cols-12: 12 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ========================================== */}
        {/* 4A. HERO CARD: SAFE DAILY LIMIT (Spans 8 cols) */}
        {/* ========================================== */}
        <div className="col-span-1 lg:col-span-8 bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6 md:p-8 flex flex-col justify-between border border-outline-variant/20 relative overflow-hidden">
          
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline-md text-headline-md text-on-surface">Safe Daily Limit</h3>
              <div className="bg-surface-container text-on-surface px-3 py-1 rounded-full font-label-caps text-label-caps border border-outline-variant/30">
                Today
              </div>
            </div>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="font-display-num text-display-num text-primary tracking-tight">{financials.dailyLimit}</span>
              <span className="font-headline-md text-headline-md text-outline">EGP</span>
            </div>
            <p className="font-body-sm text-body-sm text-outline">Calculated to maintain balance until end of cycle.</p>
          </div>

          {/* Stats Row */}
          <div className="relative z-10 mt-10 border-t border-surface-variant pt-6 grid grid-cols-2 gap-8">
            <div>
              <p className="font-label-caps text-label-caps text-outline mb-2">Remaining Days</p>
              <p className="font-headline-lg text-headline-lg text-on-surface">{financials.remainingDays} <span className="font-body-sm text-body-sm text-outline font-normal ml-1">days</span></p>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-outline mb-2">Total Balance</p>
              <p className="font-headline-lg text-headline-lg text-on-surface">{financials.remainingBalance} <span className="font-body-sm text-body-sm text-outline font-normal ml-1">EGP</span></p>
            </div>
          </div>

          {/* Linear Progress Gauge */}
          <div className="relative z-10 mt-8 bg-surface p-4 rounded-lg border border-outline-variant/20">
            <div className="flex justify-between font-label-caps text-label-caps mb-3">
              <span className="text-on-surface">Monthly Cycle Progress</span>
              <span className={`font-bold ${percentageNumber >= 100 ? 'text-error' : percentageNumber >= 80 ? 'text-on-tertiary-container' : 'text-secondary'}`}>
                {financials.percentageUsed} Used
              </span>
            </div>
            {/* The 8px height Budget Progress Bar */}
            <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden shadow-inner">
              {/* Progress Fill - Warning Orange because it's over 80% */}
              <div className={`h-full rounded-full relative ${percentageNumber >= 100 ? 'bg-error' : percentageNumber >= 80 ? 'bg-on-tertiary-container' : 'bg-secondary'}`} style={{ width: `${Math.min(percentageNumber, 100)}%` }}>
                <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/20"></div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* 4B. DONUT CHART CARD (Spans 4 cols) */}
        {/* ========================================== */}
        <div className="col-span-1 lg:col-span-4 bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6 md:p-8 flex flex-col border border-outline-variant/20">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-headline-md text-headline-md text-on-surface">Categories</h3>
            <button className="text-outline hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[20px]">more_horiz</span>
            </button>
          </div>
          
          {/* Donut Chart - built from real data */}
          <div className="relative w-48 h-48 mx-auto mb-8 rounded-full shadow-inner border border-outline-variant/10" style={{ background: buildGradient() }}>
            <div className="absolute inset-5 bg-surface-container-lowest rounded-full flex items-center justify-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)]">
              <div className="text-center">
                <span className="block font-headline-lg text-headline-lg text-on-surface mb-0.5">{categoryBreakdown.length}</span>
                <span className="block font-label-caps text-label-caps text-outline">
                  {categoryBreakdown.length === 0 ? 'No data' : 'Active'}
                </span>
              </div>
            </div>
          </div>

          {/* Legends - built from real data */}
          <ul className="space-y-4 mt-auto">
            {categoryBreakdown.length === 0 ? (
              // show this if no expenses yet
              <li className="text-center font-body-sm text-body-sm text-on-surface-variant py-4">
                No expenses yet
              </li>
            ) : (
              // loop through real category data
              categoryBreakdown.map((item) => {
                const category = CATEGORIES[item.categoryId] // get name and color
                return (
                  <li key={item.categoryId} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      {/* colored dot using inline style since color is dynamic */}
                      <span className="w-2.5 h-2.5 rounded-full shadow-sm group-hover:scale-125 transition-transform"
                        style={{ backgroundColor: category?.color || '#d3e4fe' }}
                      ></span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                        {category?.name || 'Unknown'}
                      </span>
                    </div>
                    <span className="font-label-caps text-label-caps text-on-surface">
                      {item.percentage.toFixed(1)}%
                    </span>
                  </li>
                )
              })
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}