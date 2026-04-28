'use client'; // This tells Next.js this is a client-side React component

import { useState } from 'react';

export default function Home() {
  // 1. STATE: These variables hold the data the user types in
  const [totalAllowance, setTotalAllowance] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 2. HANDLER: This runs when the user clicks "Create Cycle"
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing
    setIsLoading(true);
    setMessage('');

    try {
      // 3. API CALL: Send the data to our backend!
      const response = await fetch('/api/cycles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totalAllowance, startDate, endDate })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Success! Daily Limit: ${data.dailyLimit} EGP`);
        // Clear the form
        setTotalAllowance('');
        setStartDate('');
        setEndDate('');
      } else {
        setMessage(`Error: ${data.message || data.error}`);
      }
    } catch (error) {
      setMessage('Failed to connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  // 4. UI: The HTML/JSX we want to display
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          🎯 Masroofy Setup
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Allowance (EGP)
            </label>
            <input
              type="number"
              value={totalAllowance}
              onChange={(e) => setTotalAllowance(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 3000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Start Budget Cycle'}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-center text-sm ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}
      </div>
    </main>
  );
}