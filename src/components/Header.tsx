'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, Search, User, Settings, Menu } from 'lucide-react'

interface HeaderProps {
  onMenuClick?: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const notificationsRef = useRef<HTMLDivElement>(null)

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications])

  const notifications = [
    { id: 1, message: 'New transaction received', time: '2m ago', type: 'info' },
    { id: 2, message: 'Fraud alert detected', time: '5m ago', type: 'alert' },
    { id: 3, message: 'Payment failed - customer@email.com', time: '10m ago', type: 'error' },
  ]

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 md:space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 text-gray-400 hover:text-gray-600"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <h2 className="text-lg md:text-2xl font-bold text-gray-900">Payment Analytics</h2>
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Search - hidden on mobile */}
          <div className="hidden md:block relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>
          
          <div className="relative" ref={notificationsRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                {notifications.length}
              </span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 md:w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[80vh] overflow-hidden flex flex-col">
                <div className="p-3 md:p-4 border-b border-gray-200">
                  <h3 className="text-sm md:text-base font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="overflow-y-auto">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className="p-2 md:p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setShowNotifications(false)}
                    >
                      <p className="text-xs md:text-sm text-gray-900">{notif.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-2 md:p-3 border-t border-gray-200">
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="w-full text-xs md:text-sm text-blue-600 hover:text-blue-700 text-center"
                  >
                    Mark all as read
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => {
              setShowSettings(!showSettings)
              alert('Settings panel coming soon!')
            }}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          
          <div className="hidden md:flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Admin</span>
          </div>
          
          {/* Mobile: Just show user icon */}
          <div className="md:hidden">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}



