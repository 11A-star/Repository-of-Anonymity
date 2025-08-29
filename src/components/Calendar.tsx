import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Plus, MoreHorizontal } from 'lucide-react'
import { useCalendar } from '../context/CalendarContext'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import EventModal from './EventModal'
import toast from 'react-hot-toast'

const Calendar: React.FC = () => {
  const { state, dispatch, getEventsForDate } = useCalendar()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showEventModal, setShowEventModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Add padding days to fill the grid
  const startPadding = monthStart.getDay()
  const endPadding = 6 - monthEnd.getDay()
  
  const calendarDays = [
    ...Array(startPadding).fill(null),
    ...monthDays,
    ...Array(endPadding).fill(null)
  ]

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentMonth(today)
    setSelectedDate(today)
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setShowEventModal(true)
  }

  const handleEventClick = (event: any, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedEvent(event)
    setShowEventModal(true)
  }

  const createEvent = (eventData: any) => {
    const newEvent = {
      ...eventData,
      id: crypto.randomUUID(),
      startTime: selectedDate,
      endTime: new Date(selectedDate.getTime() + 60 * 60 * 1000), // 1 hour later
    }

    dispatch({ type: 'ADD_EVENT', payload: newEvent })

    // AI suggestion for the new event
    const aiSuggestion = {
      type: 'schedule' as const,
      title: 'Smart Scheduling Tip',
      description: `AI suggests this event fits well in your schedule. Consider adding a 15-minute buffer before and after for optimal productivity.`,
      priority: 'medium' as const,
    }

    dispatch({ type: 'ADD_AI_SUGGESTION', payload: { ...aiSuggestion, id: crypto.randomUUID(), timestamp: new Date() } })
    
    toast.success('Event created with AI optimization!')
    setShowEventModal(false)
  }

  const updateEvent = (eventData: any) => {
    dispatch({ type: 'UPDATE_EVENT', payload: eventData })
    toast.success('Event updated successfully!')
    setShowEventModal(false)
    setSelectedEvent(null)
  }

  const deleteEvent = (eventId: string) => {
    dispatch({ type: 'DELETE_EVENT', payload: eventId })
    toast.success('Event deleted successfully!')
    setShowEventModal(false)
    setSelectedEvent(null)
  }

  // AI-powered conflict detection
  useEffect(() => {
    const detectConflicts = () => {
      const today = new Date()
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      
      const weekEvents = state.events.filter(event => {
        const eventDate = new Date(event.startTime)
        return eventDate >= today && eventDate <= nextWeek
      })

      // Check for overlapping events
      for (let i = 0; i < weekEvents.length; i++) {
        for (let j = i + 1; j < weekEvents.length; j++) {
          const event1 = weekEvents[i]
          const event2 = weekEvents[j]
          
          if (isSameDay(new Date(event1.startTime), new Date(event2.startTime))) {
            const start1 = new Date(event1.startTime)
            const end1 = new Date(event1.endTime)
            const start2 = new Date(event2.startTime)
            const end2 = new Date(event2.endTime)
            
            if (start1 < end2 && start2 < end1) {
              const conflictSuggestion = {
                type: 'conflict' as const,
                title: 'Schedule Conflict Detected',
                description: `"${event1.title}" and "${event2.title}" have overlapping times on ${format(start1, 'MMM d')}. Consider rescheduling one of them.`,
                priority: 'high' as const,
              }
              
              // Check if this conflict suggestion already exists
              const exists = state.aiSuggestions.some(s => 
                s.type === 'conflict' && 
                s.description.includes(event1.title) && 
                s.description.includes(event2.title)
              )
              
              if (!exists) {
                dispatch({ type: 'ADD_AI_SUGGESTION', payload: { ...conflictSuggestion, id: crypto.randomUUID(), timestamp: new Date() } })
              }
            }
          }
        }
      }
    }

    if (state.events.length > 0) {
      detectConflicts()
    }
  }, [state.events, state.aiSuggestions, dispatch])

  return (
    <div className="bg-white rounded-lg shadow-sm border border-calendar-border">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-6 border-b border-calendar-border">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-calendar-text">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => setShowEventModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-px mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="calendar-grid">
          {calendarDays.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="calendar-day other-month" />
            }

            const isToday = isSameDay(day, new Date())
            const isCurrentMonth = isSameMonth(day, currentMonth)
            const dayEvents = getEventsForDate(day)
            const isSelected = isSameDay(day, selectedDate)

            return (
              <motion.div
                key={day.toISOString()}
                whileHover={{ scale: 1.02 }}
                className={`calendar-day ${isToday ? 'today' : ''} ${!isCurrentMonth ? 'other-month' : ''} ${isSelected ? 'ring-2 ring-primary-500' : ''}`}
                onClick={() => handleDateClick(day)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${isToday ? 'text-primary-600' : 'text-calendar-text'}`}>
                    {format(day, 'd')}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full">
                      {dayEvents.length}
                    </span>
                  )}
                </div>

                {/* Events for this day */}
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="event-item"
                      style={{ backgroundColor: event.color + '20', color: event.color }}
                      onClick={(e) => handleEventClick(event, e)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{event.title}</span>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Event Modal */}
      <AnimatePresence>
        {showEventModal && (
          <EventModal
            isOpen={showEventModal}
            onClose={() => {
              setShowEventModal(false)
              setSelectedEvent(null)
            }}
            event={selectedEvent}
            selectedDate={selectedDate}
            onCreateEvent={createEvent}
            onUpdateEvent={updateEvent}
            onDeleteEvent={deleteEvent}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Calendar