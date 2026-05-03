"use client";

import { useState } from "react"; //gives the page memory (remember what the user typed)
import { useRouter } from "next/navigation";//gives the page navigation (ability to go to another page)

export default function SetupPage() {
  // 1. THE MEMORY: Variables to hold what the user types
  const [totalAllowance, setTotalAllowance] = useState(""); //[value stored,how to set it]
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  // Live calculations for the projection card
 // Calculated from state — not stored, recalculated on every render
const duration = startDate && endDate        // if both dates are picked
    ? Math.ceil(
        (new Date(endDate) - new Date(startDate)) // subtract dates → milliseconds
        / (1000 * 60 * 60 * 24)                   // convert to days
      ) + 1                                        // +1 to include both start and end day
    : 0                                            // otherwise 0

const dailyLimit = duration > 0 && totalAllowance // if dates and allowance exist
    ? (parseFloat(totalAllowance) / duration)      // divide money by days
        .toFixed(2)                                // round to 2 decimals
    : '0.00'                                       // otherwise "0.00"

const handleSubmit = async (e) => {  // runs when user clicks the button. async = can wait
    e.preventDefault()               // stop page from refreshing
    setIsLoading(true)               // disable button, show "Saving"
    setError("")                     // clear old errors

    const response = await fetch("/api/cycle", { // call the backend, wait for response
        method: "POST",                           // POST = sending new data
        headers: { "Content-Type": "application/json" }, // tell server data is JSON
        body: JSON.stringify({ totalAllowance, startDate, endDate }), // data we're sending
    })

    const data = await response.json() // convert response from JSON text → JS object

    if (response.ok) {                 // if success (status 200-299)
        router.push("/dashboard")      // go to dashboard
    } else {                           // if failed
        setError(data.message || "Something went wrong") // show error message
        setIsLoading(false)            // re-enable button
    }
}
  
  return (
    <div className="min-h-screen bg-background p-container-margin md:p-section-gap">
      {/* THE GRID CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* THE WHITE FORM CARD (Left Side) */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">tune</span>
            Cycle Parameters
          </h3>

          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Total Allowance Input */}
            <div className="relative group">
              <label className="font-label-caps text-label-caps text-outline block mb-2 transition-colors group-focus-within:text-primary">
                Total Allowance (EGP)
              </label>
              <div className="flex items-center bg-surface-container hover:bg-surface-variant transition-colors border-b-2 border-transparent focus-within:border-primary focus-within:bg-surface-variant rounded-t-md px-4 py-3">
                <span className="material-symbols-outlined text-outline-variant mr-3 group-focus-within:text-primary transition-colors">
                  payments
                </span>
                <input
                  type="number"
                  value={totalAllowance}
                  onChange={(e) => setTotalAllowance(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 p-0 font-headline-md text-headline-md text-on-surface placeholder:text-outline-variant outline-none"
                  placeholder="0.00"
                />
                <span className="font-body-sm text-body-sm text-outline ml-3 font-semibold">
                  EGP
                </span>
              </div>
            </div>

            {/* Date Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative group">
                <label className="font-label-caps text-label-caps text-outline block mb-2 transition-colors group-focus-within:text-primary">
                  Start Date
                </label>
                <div className="flex items-center bg-surface-container hover:bg-surface-variant transition-colors border-b-2 border-transparent focus-within:border-primary focus-within:bg-surface-variant rounded-t-md px-4 py-3">
                  <span className="material-symbols-outlined text-outline-variant mr-3 group-focus-within:text-primary transition-colors">
                    calendar_today
                  </span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 p-0 font-body-lg text-body-lg text-on-surface outline-none cursor-pointer"
                  />
                </div>
              </div>
              <div className="relative group">
                <label className="font-label-caps text-label-caps text-outline block mb-2 transition-colors group-focus-within:text-primary">
                  End Date
                </label>
                <div className="flex items-center bg-surface-container hover:bg-surface-variant transition-colors border-b-2 border-transparent focus-within:border-primary focus-within:bg-surface-variant rounded-t-md px-4 py-3">
                  <span className="material-symbols-outlined text-outline-variant mr-3 group-focus-within:text-primary transition-colors">
                    event
                  </span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 p-0 font-body-lg text-body-lg text-on-surface outline-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-surface-variant my-4"></div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-4 pt-2">
              {/* Reset Button - Now clears the state memory */}
              <button
                type="button"
                onClick={() => {
                  setTotalAllowance("");
                  setStartDate("");
                  setEndDate("");
                }}
                className="px-6 py-3 rounded-full font-label-caps text-label-caps text-on-surface hover:bg-surface-container transition-colors"
              >
                Reset
              </button>

              {error && (
                <p className="text-error font-body-sm text-body-sm">{error}</p>
              )}
              <button
                disabled={isLoading}
                type="submit"
                className="px-8 py-3 rounded-full font-label-caps text-label-caps bg-primary text-on-primary shadow-md hover:bg-on-primary-fixed-variant transition-colors active:scale-95 duration-200 flex items-center gap-2 disabled:opacity-50"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "18px" }}
                >
                  play_arrow
                </span>
                {isLoading ? "Saving..." : "Start Budget Cycle"}
              </button>
            </div>
          </form>
        </div>

        {/* THE BLUE PROJECTION CARD (Right Side) */}
        <div className="lg:col-span-4 bg-primary text-on-primary rounded-xl p-card-padding shadow-[0_4px_20px_rgba(0,0,0,0.04)] relative overflow-hidden flex flex-col justify-between min-h-[300px]">
          {/* Decorative Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

          {/* Top Section */}
          <div>
            <div className="flex items-center gap-2 mb-8 opacity-80">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                insights
              </span>
              <h3 className="font-label-caps text-label-caps tracking-widest uppercase">
                Target Projection
              </h3>
            </div>
            <p className="font-body-sm text-body-sm opacity-90 mb-2">
              Calculated Initial Daily Limit
            </p>
            <div className="flex items-baseline gap-1">
              <span className="font-headline-md text-headline-md opacity-80 font-normal">
                EGP
              </span>
              <span className="font-display-num text-display-num tracking-tight">{dailyLimit}</span>
            </div>
          </div>

          {/* Bottom Stats Box */}
          <div className="mt-12 bg-on-primary-fixed-variant bg-opacity-30 rounded-lg p-4 backdrop-blur-sm border border-white border-opacity-10">
            <div className="flex justify-between items-center font-body-sm text-body-sm opacity-90 mb-2">
              <span>Duration</span>
              <span className="font-semibold">{duration > 0 ? `${duration} Days` : '-- Days'}</span>
            </div>
            <div className="flex justify-between items-center font-body-sm text-body-sm opacity-90">
              <span>Status</span>
              <span className="flex items-center gap-1 text-secondary-container font-semibold">
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check_circle</span>
                  {duration > 0 && totalAllowance ? 'Ready to Start' : 'Ready to Setup'}
                </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
