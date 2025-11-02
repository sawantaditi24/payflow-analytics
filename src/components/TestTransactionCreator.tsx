'use client'

import { useState } from 'react'
import { Plus, CreditCard, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react'

interface TransactionScenario {
  name: string
  description: string
  amount: number
  status: 'succeeded' | 'failed' | 'pending'
  customer: string
  icon: React.ElementType
  color: string
}

const scenarios: TransactionScenario[] = [
  {
    name: 'Normal Payment',
    description: 'Successful payment - typical transaction',
    amount: 25.50,
    status: 'succeeded',
    customer: 'customer@example.com',
    icon: CheckCircle,
    color: 'green'
  },
  {
    name: 'High Amount (Fraud Alert)',
    description: 'Large transaction - triggers fraud detection',
    amount: 5000.00,
    status: 'succeeded',
    customer: 'suspicious@example.com',
    icon: AlertTriangle,
    color: 'red'
  },
  {
    name: 'Failed Payment',
    description: 'Payment declined - customer issue',
    amount: 89.99,
    status: 'failed',
    customer: 'customer2@example.com',
    icon: XCircle,
    color: 'red'
  },
  {
    name: 'Pending Payment',
    description: 'Payment processing - waiting for confirmation',
    amount: 150.00,
    status: 'pending',
    customer: 'customer3@example.com',
    icon: Clock,
    color: 'yellow'
  },
  {
    name: 'Medium Amount',
    description: 'Standard business transaction',
    amount: 250.75,
    status: 'succeeded',
    customer: 'business@example.com',
    icon: CreditCard,
    color: 'blue'
  },
  {
    name: 'Small Payment',
    description: 'Low value transaction',
    amount: 9.99,
    status: 'succeeded',
    customer: 'user@example.com',
    icon: CreditCard,
    color: 'green'
  }
]

export default function TestTransactionCreator() {
  const [selectedScenario, setSelectedScenario] = useState<TransactionScenario | null>(null)
  const [customAmount, setCustomAmount] = useState('25.00')
  const [customStatus, setCustomStatus] = useState<'succeeded' | 'failed' | 'pending'>('succeeded')
  const [isCreating, setIsCreating] = useState(false)
  const [showCustom, setShowCustom] = useState(false)

  const createTestTransaction = async (transaction: {
    amount: number
    status: 'succeeded' | 'failed' | 'pending'
    customer: string
  }) => {
    setIsCreating(true)
    try {
      // Create a mock transaction (not using Stripe for demo flexibility)
      const newTransaction = {
        id: `txn_${Date.now()}`,
        amount: transaction.amount,
        currency: 'USD',
        status: transaction.status,
        customer: transaction.customer,
        timestamp: new Date().toISOString(),
        method: 'card',
        description: 'Test transaction'
      }

      // Store in localStorage temporarily for demo
      const existing = localStorage.getItem('demo_transactions')
      const transactions = existing ? JSON.parse(existing) : []
      transactions.unshift(newTransaction)
      // Keep only last 20
      localStorage.setItem('demo_transactions', JSON.stringify(transactions.slice(0, 20)))

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('transactionCreated', { detail: newTransaction }))
      
      // Small delay to ensure localStorage is updated, then refresh
      setTimeout(() => {
        window.location.reload()
      }, 100)
    } catch (error) {
      console.error('Error creating test transaction:', error)
      setIsCreating(false)
    }
  }

  const handleScenarioClick = (scenario: TransactionScenario) => {
    setSelectedScenario(scenario)
    createTestTransaction({
      amount: scenario.amount,
      status: scenario.status,
      customer: scenario.customer
    })
  }

  const handleCustomCreate = () => {
    const amount = parseFloat(customAmount)
    if (!amount || amount < 0.50) {
      alert('Please enter a valid amount (minimum $0.50)')
      return
    }
    
    createTestTransaction({
      amount: amount,
      status: customStatus,
      customer: `custom-${Date.now()}@example.com`
    })
    
    // Reset custom form
    setCustomAmount('25.00')
    setCustomStatus('succeeded')
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
      <div className="flex items-center space-x-2 mb-3 md:mb-4">
        <Plus className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
        <h3 className="text-base md:text-lg font-semibold text-gray-900">Create Test Transactions</h3>
      </div>

      <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
        Select a scenario to demonstrate different payment types and fraud detection:
      </p>
      
      <div className="space-y-3 mb-4">
        {scenarios.map((scenario, index) => {
          const Icon = scenario.icon
          const isSelected = selectedScenario?.name === scenario.name
          
          return (
            <button
              key={index}
              onClick={() => handleScenarioClick(scenario)}
              disabled={isCreating}
              className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              } ${isCreating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    scenario.color === 'green' ? 'bg-green-100 text-green-700' :
                    scenario.color === 'red' ? 'bg-red-100 text-red-700' :
                    scenario.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{scenario.name}</p>
                    <p className="text-xs text-gray-500">{scenario.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${scenario.amount.toFixed(2)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    scenario.status === 'succeeded' ? 'bg-green-100 text-green-700' :
                    scenario.status === 'failed' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {scenario.status}
                  </span>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <button
          onClick={() => setShowCustom(!showCustom)}
          className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium mb-3"
        >
          {showCustom ? 'Hide' : 'Show'} Custom Transaction Creator
        </button>

        {showCustom && (
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
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
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="25.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Status
              </label>
              <select
                value={customStatus}
                onChange={(e) => setCustomStatus(e.target.value as 'succeeded' | 'failed' | 'pending')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="succeeded">Succeeded</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <button
              onClick={handleCustomCreate}
              disabled={isCreating || !customAmount}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              <span>{isCreating ? 'Creating...' : 'Create Custom Transaction'}</span>
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-700">
          <strong>Demo Tip:</strong> Click scenarios to see different payment types appear in the live transaction feed. 
          Try "High Amount" to see fraud detection in action!
        </p>
      </div>
    </div>
  )
}
