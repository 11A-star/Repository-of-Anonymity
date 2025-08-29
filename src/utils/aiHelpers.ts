import { Event, AISuggestion } from '../types'

export interface AIScheduleOptimization {
  suggestedTime: Date
  reason: string
  confidence: number
}

export interface ConflictAnalysis {
  hasConflict: boolean
  conflictingEvents: Event[]
  suggestions: string[]
}

export interface ProductivityInsight {
  type: 'focus' | 'meeting' | 'break' | 'optimization'
  message: string
  priority: 'low' | 'medium' | 'high'
}

// AI-powered schedule optimization
export const optimizeSchedule = (events: Event[], newEvent: Partial<Event>): AIScheduleOptimization => {
  const workingHours = { start: 9, end: 17 } // 9 AM to 5 PM
  const now = new Date()
  
  // Find the next available time slot
  let suggestedTime = new Date(now)
  suggestedTime.setHours(workingHours.start, 0, 0, 0)
  
  // If it's past working hours, suggest tomorrow
  if (now.getHours() >= workingHours.end) {
    suggestedTime.setDate(suggestedTime.getDate() + 1)
  }
  
  // Check for conflicts and find optimal time
  const dayEvents = events.filter(event => {
    const eventDate = new Date(event.startTime)
    return eventDate.toDateString() === suggestedTime.toDateString()
  })
  
  // Sort events by start time
  dayEvents.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
  
  // Find gaps in schedule
  let bestTime = suggestedTime
  let bestGap = 0
  
  for (let i = 0; i < dayEvents.length - 1; i++) {
    const currentEnd = new Date(dayEvents[i].endTime)
    const nextStart = new Date(dayEvents[i + 1].startTime)
    const gap = nextStart.getTime() - currentEnd.getTime()
    
    if (gap >= 60 * 60 * 1000) { // At least 1 hour gap
      if (gap > bestGap) {
        bestGap = gap
        bestTime = currentEnd
      }
    }
  }
  
  const reason = bestGap > 0 
    ? `Found optimal ${Math.round(bestGap / (60 * 60 * 1000))} hour gap in your schedule`
    : 'Scheduled at start of working hours for maximum productivity'
  
  return {
    suggestedTime: bestTime,
    reason,
    confidence: bestGap > 0 ? 0.9 : 0.7
  }
}

// Detect scheduling conflicts
export const detectConflicts = (events: Event[], newEvent: Partial<Event>): ConflictAnalysis => {
  const conflicts: Event[] = []
  const suggestions: string[] = []
  
  if (!newEvent.startTime || !newEvent.endTime) {
    return { hasConflict: false, conflictingEvents: [], suggestions: [] }
  }
  
  const newStart = new Date(newEvent.startTime)
  const newEnd = new Date(newEvent.endTime)
  
  events.forEach(event => {
    const eventStart = new Date(event.startTime)
    const eventEnd = new Date(event.endTime)
    
    // Check for overlap
    if (newStart < eventEnd && newEnd > eventStart) {
      conflicts.push(event)
    }
  })
  
  if (conflicts.length > 0) {
    suggestions.push('Consider rescheduling one of the conflicting events')
    suggestions.push('Add buffer time between events for better productivity')
    suggestions.push('Check if any events can be moved to different days')
  }
  
  return {
    hasConflict: conflicts.length > 0,
    conflictingEvents: conflicts,
    suggestions
  }
}

// Generate productivity insights
export const generateProductivityInsights = (events: Event[]): ProductivityInsight[] => {
  const insights: ProductivityInsight[] = []
  
  // Analyze meeting density
  const today = new Date()
  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.startTime)
    return eventDate.toDateString() === today.toDateString()
  })
  
  const meetings = todayEvents.filter(event => event.category === 'Meeting')
  
  if (meetings.length > 4) {
    insights.push({
      type: 'optimization',
      message: 'You have many meetings today. Consider blocking focus time for deep work.',
      priority: 'medium'
    })
  }
  
  // Check for back-to-back meetings
  const sortedEvents = todayEvents.sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  )
  
  for (let i = 0; i < sortedEvents.length - 1; i++) {
    const currentEnd = new Date(sortedEvents[i].endTime)
    const nextStart = new Date(sortedEvents[i + 1].startTime)
    const gap = nextStart.getTime() - currentEnd.getTime()
    
    if (gap < 15 * 60 * 1000) { // Less than 15 minutes
      insights.push({
        type: 'optimization',
        message: `Add buffer time between "${sortedEvents[i].title}" and "${sortedEvents[i + 1].title}"`,
        priority: 'high'
      })
    }
  }
  
  // Suggest breaks
  const longWorkSessions = todayEvents.filter(event => {
    const duration = new Date(event.endTime).getTime() - new Date(event.startTime).getTime()
    return duration > 2 * 60 * 60 * 1000 && event.category !== 'Meeting' // More than 2 hours
  })
  
  if (longWorkSessions.length > 0) {
    insights.push({
      type: 'break',
      message: 'Consider adding short breaks during long work sessions for better focus',
      priority: 'medium'
    })
  }
  
  return insights
}

// Natural language event parsing (simplified)
export const parseNaturalLanguage = (text: string): Partial<Event> => {
  const event: Partial<Event> = {}
  
  // Extract title (everything before time indicators)
  const timePatterns = /\b(today|tomorrow|next week|at \d{1,2}(?::\d{2})?\s*(?:am|pm)?|in \d+\s*(?:hours?|days?|weeks?))\b/i
  const titleMatch = text.split(timePatterns)[0]
  if (titleMatch) {
    event.title = titleMatch.trim()
  }
  
  // Extract time information
  const timeMatch = text.match(/\b(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\b/i)
  if (timeMatch) {
    const timeStr = timeMatch[1]
    // This is a simplified parser - in a real app you'd use a more sophisticated library
    event.startTime = new Date() // Placeholder
  }
  
  // Extract duration
  const durationMatch = text.match(/\b(\d+)\s*(?:hour|hr)s?\b/i)
  if (durationMatch) {
    const hours = parseInt(durationMatch[1])
    // Calculate end time based on duration
  }
  
  // Extract category based on keywords
  if (text.toLowerCase().includes('meeting') || text.toLowerCase().includes('call')) {
    event.category = 'Meeting'
  } else if (text.toLowerCase().includes('appointment') || text.toLowerCase().includes('doctor')) {
    event.category = 'Appointment'
  } else if (text.toLowerCase().includes('lunch') || text.toLowerCase().includes('dinner')) {
    event.category = 'Social'
  }
  
  return event
}

// Generate AI suggestions based on calendar patterns
export const generateAISuggestions = (events: Event[]): Omit<AISuggestion, 'id' | 'timestamp'>[] => {
  const suggestions: Omit<AISuggestion, 'id' | 'timestamp'>[] = []
  
  // Analyze productivity patterns
  const workEvents = events.filter(event => event.category === 'Work')
  const personalEvents = events.filter(event => event.category === 'Personal')
  
  if (workEvents.length > personalEvents.length * 2) {
    suggestions.push({
      type: 'optimize',
      title: 'Work-Life Balance Reminder',
      description: 'Your calendar shows mostly work events. Consider adding personal time for better balance.',
      priority: 'medium'
    })
  }
  
  // Check for optimal meeting times
  const meetings = events.filter(event => event.category === 'Meeting')
  const morningMeetings = meetings.filter(event => {
    const hour = new Date(event.startTime).getHours()
    return hour >= 9 && hour <= 11
  })
  
  if (morningMeetings.length > meetings.length * 0.6) {
    suggestions.push({
      type: 'optimize',
      title: 'Meeting Time Optimization',
      description: 'Most of your meetings are in the morning. Consider spreading them throughout the day for better focus.',
      priority: 'low'
    })
  }
  
  return suggestions
}