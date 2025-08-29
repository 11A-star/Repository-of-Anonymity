import React, { useState } from 'react'
import { Calendar, Plus, Search, Bot, Settings, Bell, User } from 'lucide-react'
import { useCalendar } from '../context/CalendarContext'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import AIChat from './AIChat'

const Header: React.FC = () => {
  const { state, dispatch } = useCalendar()
  const [searchQuery, setSearchQuery] = useState('')
  const [showAIChat, setShowAIChat] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // AI-powered search functionality
      toast.success(`Searching for: ${searchQuery}`)
      // Here you would integrate with AI search
    }
  }

  const handleAIAssistant = () => {
    setShowAIChat(!showAIChat)
    toast.success('AI Assistant activated!')
  }

  const quickAddEvent = () => {
    const newEvent = {
      title: 'New Event',
      description: 'Event description',
      startTime: new Date(),
      endTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
      color: '#3b82f6',
      category: 'General',
      isAllDay: false,
      priority: 'medium' as const,
    }
    
    // Use AI to suggest better timing
    const aiSuggestion = {
      type: 'schedule' as const,
      title: 'Smart Scheduling Suggestion',
      description: 'AI suggests scheduling this event during your optimal productivity hours.',
      priority: 'medium' as const,
    }
    
    dispatch({ type: 'ADD_EVENT', payload: { ...newEvent, id: crypto.randomUUID() } })
    dispatch({ type: 'ADD_AI_SUGGESTION', payload: { ...aiSuggestion, id: crypto.randomUUID(), timestamp: new Date() } })
    
    toast.success('Event created with AI suggestion!')
  }

  return (
    <header className="bg-white border-b border-calendar-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-primary-600 rounded-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-calendar-text">
              AI Calendar
            </h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search events, ask AI to schedule meetings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-calendar-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAIAssistant}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">AI Assistant</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={quickAddEvent}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Quick Add</span>
            </motion.button>

            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
            </button>

            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>

            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* AI Chat Panel */}
      <AnimatePresence>
        {showAIChat && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-calendar-border"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <AIChat />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header