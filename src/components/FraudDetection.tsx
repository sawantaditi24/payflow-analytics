'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Shield, CheckCircle, XCircle, Clock } from 'lucide-react'

interface FraudAlert {
  id: string
  type: 'high_amount' | 'unusual_location' | 'rapid_transactions' | 'suspicious_pattern'
  severity: 'high' | 'medium' | 'low'
  description: string
  amount: number
  customer: string
  timestamp: string
  status: 'investigating' | 'resolved' | 'false_positive'
}

interface FraudDetectionProps {
  onViewAll?: () => void
}

export default function FraudDetection({ onViewAll }: FraudDetectionProps) {
  const [alerts, setAlerts] = useState<FraudAlert[]>([])

  useEffect(() => {
    // Check for demo transactions and create alerts
    const checkDemoTransactions = () => {
      const demoTransactions = localStorage.getItem('demo_transactions')
      if (demoTransactions) {
        try {
          const transactions = JSON.parse(demoTransactions)
          
          setAlerts(prev => {
            const newAlerts: FraudAlert[] = []
            
            // Check for high amount transactions (> $1,000)
            transactions.forEach((txn: any) => {
              if (txn.amount > 1000 && txn.status === 'succeeded') {
                const alertId = `alert_${txn.id}_high_amount`
                const alertExists = prev.some(a => a.id === alertId)
                
                if (!alertExists) {
                  newAlerts.push({
                    id: alertId,
                    type: 'high_amount',
                    severity: 'high',
                    description: `Unusually high transaction amount detected: $${txn.amount.toFixed(2)}`,
                    amount: txn.amount,
                    customer: txn.customer,
                    timestamp: txn.timestamp,
                    status: 'investigating'
                  })
                }
              }
            })
            
            if (newAlerts.length > 0) {
              return [...newAlerts, ...prev.slice(0, 9 - newAlerts.length)]
            }
            return prev
          })
        } catch (error) {
          console.error('Error checking demo transactions:', error)
        }
      }
    }

    // Initial mock alerts
    const mockAlerts: FraudAlert[] = [
      {
        id: 'alert_001',
        type: 'unusual_location',
        severity: 'medium',
        description: 'Transaction from new geographic location',
        amount: 250.00,
        customer: 'user@email.com',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        status: 'investigating'
      },
      {
        id: 'alert_002',
        type: 'rapid_transactions',
        severity: 'medium',
        description: 'Multiple rapid transactions detected',
        amount: 150.00,
        customer: 'client@email.com',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        status: 'resolved'
      }
    ]
    
    setAlerts(mockAlerts)

    // Check demo transactions immediately
    checkDemoTransactions()

    // Check demo transactions every 5 seconds
    const checkInterval = setInterval(checkDemoTransactions, 5000)

    // Simulate new fraud alerts
    const interval = setInterval(() => {
      const alertTypes: FraudAlert['type'][] = ['unusual_location', 'rapid_transactions', 'suspicious_pattern']
      const severities: FraudAlert['severity'][] = ['medium', 'low']
      
      const newAlert: FraudAlert = {
        id: `alert_${Date.now()}`,
        type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        description: 'Suspicious activity pattern detected',
        amount: Math.random() * 500 + 50,
        customer: `customer${Math.floor(Math.random() * 1000)}@email.com`,
        timestamp: new Date().toISOString(),
        status: 'investigating'
      }
      
      setAlerts(prev => {
        if (!prev.some(a => a.id === newAlert.id)) {
          return [newAlert, ...prev.slice(0, 9)]
        }
        return prev
      })
    }, 15000)

    return () => {
      clearInterval(interval)
      clearInterval(checkInterval)
    }
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'low':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'investigating':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'false_positive':
        return <XCircle className="w-4 h-4 text-gray-500" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />
    }
  }

  const getTypeDescription = (type: string) => {
    switch (type) {
      case 'high_amount':
        return 'High Amount'
      case 'unusual_location':
        return 'Unusual Location'
      case 'rapid_transactions':
        return 'Rapid Transactions'
      case 'suspicious_pattern':
        return 'Suspicious Pattern'
      default:
        return 'Unknown'
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    return date.toLocaleTimeString()
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Fraud Detection</h3>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">Monitoring</span>
          </div>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-500">No fraud alerts detected</p>
            <p className="text-sm text-gray-400">System is monitoring transactions</p>
          </div>
        ) : (
          alerts.map((alert, index) => (
            <div key={alert.id} className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${index === 0 ? 'bg-red-50' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">{getTypeDescription(alert.type)}</span>
                    </div>
                    <p className="text-sm text-gray-900 mb-1">{alert.description}</p>
                    <p className="text-xs text-gray-500">
                      ${alert.amount.toFixed(2)} • {alert.customer}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getStatusIcon(alert.status)}
                  <span className="text-xs text-gray-500">{formatTime(alert.timestamp)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            {alerts.length} active alerts
          </span>
          <button 
            onClick={onViewAll || (() => {})}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View All →
          </button>
        </div>
      </div>
    </div>
  )
}



