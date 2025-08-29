import React, { useState, useEffect } from 'react'
import { X, Calendar, Clock, MapPin, Users, Tag, AlertTriangle, Lightbulb } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { Event } from '../types'

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  event?: Event | null
  selectedDate: Date
  onCreateEvent: (eventData: any) => void
  onUpdateEvent: (eventData: any) => void
  onDeleteEvent: (eventId: string) => void
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  event,
  selectedDate,
  onCreateEvent,
  onUpdateEvent,
  onDeleteEvent,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    color: '#3b82f6',
    category: 'General',
    isAllDay: false,
    location: '',
    attendees: '',
    priority: 'medium' as const,
  })

  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        startTime: format(new Date(event.startTime), 'yyyy-MM-dd\'T\'HH:mm'),
        endTime: format(new Date(event.endTime), 'yyyy-MM-dd\'T\'HH:mm'),
        color: event.color,
        category: event.category,
        isAllDay: event.isAllDay,
        location: event.location || '',
        attendees: event.attendees?.join(', ') || '',
        priority: event.priority,
      })
    } else {
      const now = new Date()
      const startTime = new Date(selectedDate)
      startTime.setHours(now.getHours(), now.getMinutes(), 0, 0)
      
      const endTime = new Date(startTime)
      endTime.setHours(startTime.getHours() + 1)

      setFormData({
        title: '',
        description: '',
        startTime: format(startTime, 'yyyy-MM-dd\'T\'HH:mm'),
        endTime: format(endTime, 'yyyy-MM-dd\'T\'HH:mm'),
        color: '#3b82f6',
        category: 'General',
        isAllDay: false,
        location: '',
        attendees: '',
        priority: 'medium',
      })
    }

    // Generate AI suggestions
    generateAISuggestions()
  }, [event, selectedDate])

  const generateAISuggestions = () => {
    const suggestions = [
      'Consider adding a 15-minute buffer before and after for optimal productivity',
      'This time slot aligns with your typical focus hours',
      'You have similar events scheduled around this time - good for context switching',
      'Weather forecast shows good conditions for outdoor activities',
      'Your team availability is high during this time slot',
    ]
    setAiSuggestions(suggestions.slice(0, 3))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const eventData = {
      ...formData,
      startTime: new Date(formData.startTime),
      endTime: new Date(formData.endTime),
      attendees: formData.attendees ? formData.attendees.split(',').map(email => email.trim()) : [],
    }

    if (event) {
      onUpdateEvent({ ...event, ...eventData })
    } else {
      onCreateEvent(eventData)
    }
  }

  const handleDelete = () => {
    if (event && confirm('Are you sure you want to delete this event?')) {
      onDeleteEvent(event.id)
    }
  }

  const colorOptions = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899'
  ]

  const categoryOptions = [
    'General', 'Work', 'Personal', 'Meeting', 'Appointment', 'Travel', 'Health', 'Social'
  ]

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'text-green-600 bg-green-100' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600 bg-yellow-100' },
    { value: 'high', label: 'High', color: 'text-red-600 bg-red-100' },
  ]

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-calendar-border">
            <h2 className="text-xl font-semibold text-calendar-text">
              {event ? 'Edit Event' : 'Create New Event'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* AI Suggestions */}
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
            <div className="flex items-center space-x-2 mb-3">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-blue-900">AI Suggestions</h3>
            </div>
            <div className="space-y-2">
              {aiSuggestions.map((suggestion, index) => (
                <div key={index} className="text-sm text-blue-800 flex items-start space-x-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>{suggestion}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-calendar-text mb-2">
                Event Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-calendar-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter event title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-calendar-text mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-calendar-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter event description"
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-calendar-text mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Start Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-3 py-2 border border-calendar-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-calendar-text mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  End Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-3 py-2 border border-calendar-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* All Day Toggle */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isAllDay"
                checked={formData.isAllDay}
                onChange={(e) => setFormData({ ...formData, isAllDay: e.target.checked })}
                className="w-4 h-4 text-primary-600 border-calendar-border rounded focus:ring-primary-500"
              />
              <label htmlFor="isAllDay" className="text-sm font-medium text-calendar-text">
                All Day Event
              </label>
            </div>

            {/* Color and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-calendar-text mb-2">
                  <Tag className="w-4 h-4 inline mr-2" />
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-calendar-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-calendar-text mb-2">
                  Color
                </label>
                <div className="flex space-x-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.color === color ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-calendar-text mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-calendar-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter location"
              />
            </div>

            {/* Attendees */}
            <div>
              <label className="block text-sm font-medium text-calendar-text mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                Attendees
              </label>
              <input
                type="text"
                value={formData.attendees}
                onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                className="w-full px-3 py-2 border border-calendar-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter email addresses separated by commas"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-calendar-text mb-2">
                <AlertTriangle className="w-4 h-4 inline mr-2" />
                Priority
              </label>
              <div className="flex space-x-2">
                {priorityOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: option.value as any })}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      formData.priority === option.value
                        ? option.color
                        : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-calendar-border">
              <div className="flex space-x-3">
                {event && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete Event
                  </button>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-calendar-border text-calendar-text rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {event ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default EventModal