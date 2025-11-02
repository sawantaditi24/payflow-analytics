'use client'

import { DollarSign, CreditCard, TrendingUp, Users } from 'lucide-react'

export default function MetricsCards() {
  const metrics = [
    {
      title: 'Total Revenue',
      value: '$124,532',
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Transactions',
      value: '2,847',
      change: '+8.2%',
      changeType: 'positive',
      icon: CreditCard,
      color: 'blue'
    },
    {
      title: 'Success Rate',
      value: '98.7%',
      change: '+0.3%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Active Users',
      value: '1,234',
      change: '+15.1%',
      changeType: 'positive',
      icon: Users,
      color: 'orange'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      green: 'bg-green-50 border-green-200 text-green-700',
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      purple: 'bg-purple-50 border-purple-200 text-purple-700',
      orange: 'bg-orange-50 border-orange-200 text-orange-700'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        return (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{metric.value}</p>
                <div className="flex items-center mt-2 flex-wrap">
                  <span className={`text-xs md:text-sm font-medium ${metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change}
                  </span>
                  <span className="text-xs md:text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className={`p-2 md:p-3 rounded-lg ${getColorClasses(metric.color)} flex-shrink-0 ml-2`}>
                <Icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}



