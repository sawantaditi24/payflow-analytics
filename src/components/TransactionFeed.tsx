'use client'

import { useState, useEffect } from 'react'
import { Clock, CreditCard, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react'

interface Transaction {
  id: string
  amount: number
  currency: string
  status: 'succeeded' | 'failed' | 'pending'
  customer: string
  timestamp: string
  method: string
  description?: string
  receipt_url?: string
}

interface TransactionFeedProps {
  onViewAll?: () => void
}

export default function TransactionFeed({ onViewAll }: TransactionFeedProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/transactions')
      
      if (!response.ok) {
        throw new Error('Failed to fetch transactions')
      }
      
      const data = await response.json()
      setTransactions(data.transactions || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching transactions:', err)
      setError('Failed to load transactions. Using demo data.')
      
      // Fallback to demo data if Stripe API fails
      const mockTransactions: Transaction[] = [
        {
          id: 'txn_001',
          amount: 125.50,
          currency: 'USD',
          status: 'succeeded',
          customer: 'john.doe@email.com',
          timestamp: new Date().toISOString(),
          method: 'card',
          description: 'Demo transaction'
        },
        {
          id: 'txn_002',
          amount: 89.99,
          currency: 'USD',
          status: 'pending',
          customer: 'jane.smith@email.com',
          timestamp: new Date(Date.now() - 30000).toISOString(),
          method: 'bank_transfer',
          description: 'Demo transaction'
        },
        {
          id: 'txn_003',
          amount: 250.00,
          currency: 'USD',
          status: 'failed',
          customer: 'bob.wilson@email.com',
          timestamp: new Date(Date.now() - 60000).toISOString(),
          method: 'card',
          description: 'Demo transaction'
        }
      ]
      setTransactions(mockTransactions)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()

    // Refresh every 30 seconds
    const interval = setInterval(fetchTransactions, 30000)
    return () => clearInterval(interval)
  }, [])

  // Load and merge demo transactions from localStorage
  const loadDemoTransactions = () => {
    const demoTransactions = localStorage.getItem('demo_transactions')
    if (demoTransactions) {
      try {
        const parsed = JSON.parse(demoTransactions) as Transaction[]
        // Merge with existing transactions, remove duplicates, sort by timestamp (newest first)
        setTransactions(prev => {
          const existingIds = new Set(prev.map(t => t.id))
          const newDemos = parsed.filter((t: Transaction) => !existingIds.has(t.id))
          const allTransactions = [...newDemos, ...prev]
          // Sort by timestamp (newest first)
          return allTransactions.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
        })
      } catch (error) {
        console.error('Error parsing demo transactions:', error)
      }
    }
  }

  // Load demo transactions on mount and when window focuses (after reload)
  useEffect(() => {
    loadDemoTransactions()
    
    // Also reload when window gets focus (handles page reload case)
    const handleFocus = () => {
      setTimeout(loadDemoTransactions, 100)
    }
    window.addEventListener('focus', handleFocus)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  // Listen for new transaction events (immediate update without reload)
  useEffect(() => {
    const handleTransactionCreated = (event: CustomEvent) => {
      const newTransaction = event.detail as Transaction
      // Add new transaction immediately to the top of the list
      setTransactions(prev => {
        // Check if transaction already exists
        if (prev.some(t => t.id === newTransaction.id)) {
          return prev
        }
        // Add to top and sort by timestamp (newest first)
        const updated = [newTransaction, ...prev]
        return updated.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
      })
    }

    window.addEventListener('transactionCreated', handleTransactionCreated as EventListener)
    
    return () => {
      window.removeEventListener('transactionCreated', handleTransactionCreated as EventListener)
    }
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    return date.toLocaleTimeString()
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Live Transactions</h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchTransactions}
              disabled={loading}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${error ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
              <span className="text-sm text-gray-500">
                {error ? 'Demo Mode' : 'Real-time'}
              </span>
            </div>
          </div>
        </div>
        {error && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-700">{error}</p>
          </div>
        )}
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {loading && transactions.length === 0 ? (
          <div className="p-6 text-center">
            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-3" />
            <p className="text-gray-500">Loading transactions...</p>
          </div>
        ) : (
          transactions.map((transaction, index) => (
          <div key={transaction.id} className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${index === 0 ? 'bg-blue-50' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">${transaction.amount.toFixed(2)} {transaction.currency}</p>
                  <p className="text-sm text-gray-500">{transaction.customer}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(transaction.status)}`}>
                  {transaction.status}
                </span>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(transaction.status)}
                  <span className="text-sm text-gray-500">{formatTime(transaction.timestamp)}</span>
                </div>
              </div>
            </div>
          </div>
        ))
        )}
      </div>
      
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Showing {transactions.length} recent transactions
          </span>
          {onViewAll && (
            <button 
              onClick={onViewAll}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View All →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
