export interface Event {
  id: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  color: string
  category: string
  isAllDay: boolean
  location?: string
  attendees?: string[]
  priority: 'low' | 'medium' | 'high'
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
    interval: number
    endDate?: Date
  }
}

export interface AISuggestion {
  id: string
  type: 'schedule' | 'optimize' | 'conflict' | 'reminder'
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  action?: string
  events?: Event[]
  timestamp: Date
}

export interface CalendarSettings {
  view: 'month' | 'week' | 'day'
  startOfWeek: 'sunday' | 'monday'
  showWeekNumbers: boolean
  showTodayHighlight: boolean
  defaultEventDuration: number // in minutes
  workingHours: {
    start: string
    end: string
  }
  timezone: string
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  aiFeatures: {
    smartScheduling: boolean
    conflictDetection: boolean
    optimizationSuggestions: boolean
    naturalLanguageInput: boolean
  }
}