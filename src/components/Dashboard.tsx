'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import TransactionFeed from '@/components/TransactionFeed'
import AnalyticsCharts from '@/components/AnalyticsCharts'
import MetricsCards from '@/components/MetricsCards'
import FraudDetection from '@/components/FraudDetection'
import TestTransactionCreator from '@/components/TestTransactionCreator'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <MetricsCards />
            <AnalyticsCharts />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TransactionFeed onViewAll={() => setActiveTab('transactions')} />
              <FraudDetection onViewAll={() => setActiveTab('fraud')} />
            </div>
            <TestTransactionCreator />
          </div>
        )
      case 'transactions':
        return <TransactionFeed />
      case 'analytics':
        return <AnalyticsCharts />
      case 'fraud':
        return <FraudDetection />
      case 'test-transactions':
        return <TestTransactionCreator />
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}
