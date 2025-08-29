import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Clock, Star, AlertTriangle, Lightbulb, X } from 'lucide-react'
import { useCalendar } from '../context/CalendarContext'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'

const Sidebar: React.FC = () => {
  const { state, dispatch } = useCalendar()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const removeSuggestion = (id: string) => {
    dispatch({ type: 'REMOVE_AI_SUGGESTION', payload: id })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'low':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'schedule':
        return <Calendar className="w-4 h-4" />
      case 'optimize':
        return <Lightbulb className="w-4 h-4" />
      case 'conflict':
        return <AlertTriangle className="w-4 h-4" />
      case 'reminder':
        return <Clock className="w-4 h-4" />
      default:
        return <Star className="w-4 h-4" />
    }
  }

  const upcomingEvents = state.events
    .filter(event => new Date(event.startTime) > new Date())
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 5)

  return (
    <motion.aside
      initial={{ width: 320 }}
      animate={{ width: isCollapsed ? 80 : 320 }}
      className="bg-white border-r border-calendar-border shadow-sm relative"
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 bg-white border border-calendar-border rounded-full p-1 shadow-sm hover:shadow-md transition-shadow z-10"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        )}
      </button>

      <div className="p-4">
        {/* AI Insights Header */}
        {!isCollapsed && (
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-calendar-text">AI Insights</h2>
            </div>
            <p className="text-sm text-gray-600">
              Smart suggestions to optimize your schedule
            </p>
          </div>
        )}

        {/* AI Suggestions */}
        <div className="space-y-3 mb-6">
          <AnimatePresence>
            {state.aiSuggestions.map((suggestion) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="ai-suggestion"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2">
                    <div className="text-blue-600 mt-0.5">
                      {getSuggestionIcon(suggestion.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-blue-900 mb-1">
                        {suggestion.title}
                      </h4>
                      <p className="text-xs text-blue-800 mb-2">
                        {suggestion.description}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(suggestion.priority)}`}>
                          {suggestion.priority}
                        </span>
                        <span className="text-xs text-blue-600">
                          {format(suggestion.timestamp, 'MMM d, h:mm a')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeSuggestion(suggestion.id)}
                    className="text-blue-400 hover:text-blue-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Upcoming Events */}
        {!isCollapsed && (
          <div className="mb-6">
            <h3 className="font-medium text-calendar-text mb-3">Upcoming Events</h3>
            <div className="space-y-2">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-3 bg-gray-50 rounded-lg border-l-4"
                  style={{ borderLeftColor: event.color }}
                >
                  <h4 className="font-medium text-sm text-calendar-text mb-1">
                    {event.title}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {format(new Date(event.startTime), 'MMM d, h:mm a')}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(event.priority)}`}>
                      {event.priority}
                    </span>
                    <span className="text-xs text-gray-500">
                      {event.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {!isCollapsed && (
          <div className="space-y-3">
            <h3 className="font-medium text-calendar-text">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {state.events.length}
                </div>
                <div className="text-xs text-blue-800">Total Events</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  {state.aiSuggestions.length}
                </div>
                <div className="text-xs text-green-800">AI Suggestions</div>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed View Icons */}
        {isCollapsed && (
          <div className="space-y-4">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <div className="text-xs text-center text-gray-600">AI</div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary-600" />
              </div>
              <div className="text-xs text-center text-gray-600">Events</div>
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  )
}

export default Sidebar