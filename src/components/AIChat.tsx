import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Calendar, Clock, MapPin, Users } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCalendar } from '../context/CalendarContext'
import { parseNaturalLanguage, optimizeSchedule, detectConflicts } from '../utils/aiHelpers'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  action?: {
    type: 'create_event' | 'suggest_time' | 'show_conflicts' | 'optimize_schedule'
    data?: any
  }
}

const AIChat: React.FC = () => {
  const { state, addEvent, addAISuggestion } = useCalendar()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI calendar assistant. I can help you schedule events, find optimal times, and optimize your calendar. Try saying something like "Schedule a meeting with John tomorrow at 2 PM" or "Find free time for a 2-hour focus session".',
      timestamp: new Date(),
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, newMessage])
  }

  const simulateTyping = async (callback: () => void) => {
    setIsTyping(true)
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    setIsTyping(false)
    callback()
  }

  const processUserInput = async (input: string) => {
    const userMessage: Omit<Message, 'id' | 'timestamp'> = {
      type: 'user',
      content: input,
    }
    addMessage(userMessage)

    // Process the input with AI
    await simulateTyping(() => {
      const response = generateAIResponse(input)
      addMessage(response)
    })
  }

  const generateAIResponse = (input: string): Omit<Message, 'id' | 'timestamp'> => {
    const lowerInput = input.toLowerCase()

    // Schedule event
    if (lowerInput.includes('schedule') || lowerInput.includes('create') || lowerInput.includes('add')) {
      const parsedEvent = parseNaturalLanguage(input)
      
      if (parsedEvent.title) {
        // Create the event
        const newEvent = {
          title: parsedEvent.title,
          description: parsedEvent.description || '',
          startTime: new Date(),
          endTime: new Date(Date.now() + 60 * 60 * 1000),
          color: '#3b82f6',
          category: parsedEvent.category || 'General',
          isAllDay: false,
          priority: 'medium' as const,
        }

        addEvent(newEvent)

        // Add AI suggestion
        addAISuggestion({
          type: 'schedule',
          title: 'Event Created Successfully',
          description: `I've scheduled "${parsedEvent.title}" for you. The event has been added to your calendar.`,
          priority: 'medium',
        })

        return {
          type: 'ai',
          content: `Perfect! I've scheduled "${parsedEvent.title}" for you. The event has been added to your calendar. Would you like me to suggest an optimal time or add any additional details?`,
          action: {
            type: 'create_event',
            data: newEvent
          }
        }
      }
    }

    // Find free time
    if (lowerInput.includes('free time') || lowerInput.includes('available') || lowerInput.includes('open slot')) {
      const optimization = optimizeSchedule(state.events, {})
      
      return {
        type: 'ai',
        content: `I found some optimal time slots for you! ${optimization.reason}. The best time would be ${format(optimization.suggestedTime, 'MMM d, h:mm a')}. Would you like me to schedule something there?`,
        action: {
          type: 'suggest_time',
          data: optimization
        }
      }
    }

    // Check conflicts
    if (lowerInput.includes('conflict') || lowerInput.includes('overlap') || lowerInput.includes('busy')) {
      const conflicts = detectConflicts(state.events, {})
      
      if (conflicts.hasConflict) {
        return {
          type: 'ai',
          content: `I found ${conflicts.conflictingEvents.length} scheduling conflicts in your calendar. ${conflicts.suggestions[0]} Would you like me to help you resolve them?`,
          action: {
            type: 'show_conflicts',
            data: conflicts
          }
        }
      } else {
        return {
          type: 'ai',
          content: 'Great news! I don\'t see any scheduling conflicts in your calendar right now. Your schedule looks well-organized!'
        }
      }
    }

    // Optimize schedule
    if (lowerInput.includes('optimize') || lowerInput.includes('improve') || lowerInput.includes('better')) {
      return {
        type: 'ai',
        content: 'I\'d be happy to help optimize your schedule! I can analyze your current calendar and suggest improvements like better meeting times, adding buffer periods, or finding optimal focus time slots. What specific aspect would you like me to focus on?',
        action: {
          type: 'optimize_schedule'
        }
      }
    }

    // General help
    if (lowerInput.includes('help') || lowerInput.includes('what can you do')) {
      return {
        type: 'ai',
        content: 'I can help you with many calendar tasks! Here are some examples:\n\n• "Schedule a meeting with John tomorrow at 2 PM"\n• "Find free time for a 2-hour focus session"\n• "Check for scheduling conflicts"\n• "Optimize my schedule for better productivity"\n• "What\'s my schedule like this week?"\n\nWhat would you like to do?'
      }
    }

    // Default response
    return {
      type: 'ai',
      content: 'I understand you\'re asking about your calendar. I can help you schedule events, find optimal times, check for conflicts, and optimize your schedule. Could you be more specific about what you\'d like me to help with?'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isTyping) return

    const input = inputValue.trim()
    setInputValue('')
    await processUserInput(input)
  }

  const handleQuickAction = (action: string) => {
    setInputValue(action)
    processUserInput(action)
  }

  const quickActions = [
    'Schedule a team meeting tomorrow at 10 AM',
    'Find free time for a 2-hour focus session',
    'Check for scheduling conflicts this week',
    'Optimize my schedule for better productivity'
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-calendar-border h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center space-x-3 p-4 border-b border-calendar-border">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-calendar-text">AI Calendar Assistant</h3>
          <p className="text-sm text-gray-600">Ask me anything about your calendar</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-calendar-border">
        <p className="text-sm text-gray-600 mb-3">Quick actions:</p>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action)}
              className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-primary-600' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-3 h-3 text-white" />
                  ) : (
                    <Bot className="w-3 h-3 text-white" />
                  )}
                </div>
                <div className={`rounded-lg px-3 py-2 ${
                  message.type === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-calendar-text'
                }`}>
                  <div className="whitespace-pre-line text-sm">{message.content}</div>
                  {message.action && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        {message.action.type === 'create_event' && <Calendar className="w-3 h-3" />}
                        {message.action.type === 'suggest_time' && <Clock className="w-3 h-3" />}
                        {message.action.type === 'show_conflicts' && <AlertTriangle className="w-3 h-3" />}
                        {message.action.type === 'optimize_schedule' && <Bot className="w-3 h-3" />}
                        <span className="capitalize">{message.action.type.replace('_', ' ')}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-start space-x-2 max-w-[80%]">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-3 h-3 text-white" />
              </div>
              <div className="bg-gray-100 rounded-lg px-3 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-calendar-border">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me to schedule, optimize, or help with your calendar..."
            className="flex-1 px-3 py-2 border border-calendar-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}

export default AIChat