'use client'

import { useState } from 'react'
import { Plus, CreditCard } from 'lucide-react'

export default function TestTransactionCreator() {
  const [isCreating, setIsCreating] = useState(false)
  const [amount, setAmount] = useState('25.00')

  const createTestTransaction = async () => {
    setIsCreating(true)
    try {
      const response = await fetch('/api/test-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency: 'usd'
        })
      })

      if (response.ok) {
        // Refresh the page or trigger a refetch
        window.location.reload()
      }
    } catch (error) {
      console.error('Error creating test transaction:', error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Plus className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Create Test Transaction</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (USD)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              step="0.01"
              min="0.50"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="25.00"
            />
          </div>
        </div>
        
        <button
          onClick={createTestTransaction}
          disabled={isCreating || !amount}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <CreditCard className="w-4 h-4" />
          <span>{isCreating ? 'Creating...' : 'Create Test Payment'}</span>
        </button>
        
        <p className="text-xs text-gray-500 text-center">
          This will create a test transaction using Stripe's test mode
        </p>
      </div>
    </div>
  )
}



