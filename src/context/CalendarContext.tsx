import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { Event, AISuggestion, CalendarSettings, UserPreferences } from '../types'

interface CalendarState {
  events: Event[]
  aiSuggestions: AISuggestion[]
  currentDate: Date
  selectedDate: Date
  settings: CalendarSettings
  preferences: UserPreferences
  isLoading: boolean
}

type CalendarAction =
  | { type: 'ADD_EVENT'; payload: Event }
  | { type: 'UPDATE_EVENT'; payload: Event }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'SET_CURRENT_DATE'; payload: Date }
  | { type: 'SET_SELECTED_DATE'; payload: Date }
  | { type: 'ADD_AI_SUGGESTION'; payload: AISuggestion }
  | { type: 'REMOVE_AI_SUGGESTION'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<CalendarSettings> }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<UserPreferences> }
  | { type: 'SET_LOADING'; payload: boolean }

const initialState: CalendarState = {
  events: [
    {
      id: '1',
      title: 'Team Standup',
      description: 'Daily team sync meeting',
      startTime: new Date(new Date().setHours(9, 0, 0, 0)),
      endTime: new Date(new Date().setHours(9, 30, 0, 0)),
      color: '#3b82f6',
      category: 'Meeting',
      isAllDay: false,
      priority: 'high',
    },
    {
      id: '2',
      title: 'Project Review',
      description: 'Review Q4 project progress',
      startTime: new Date(new Date().setHours(14, 0, 0, 0)),
      endTime: new Date(new Date().setHours(15, 30, 0, 0)),
      color: '#10b981',
      category: 'Work',
      isAllDay: false,
      priority: 'medium',
    },
    {
      id: '3',
      title: 'Lunch with Sarah',
      description: 'Discuss new collaboration opportunities',
      startTime: new Date(new Date().setHours(12, 0, 0, 0)),
      endTime: new Date(new Date().setHours(13, 0, 0, 0)),
      color: '#f59e0b',
      category: 'Social',
      isAllDay: false,
      priority: 'low',
    },
    {
      id: '4',
      title: 'Focus Time',
      description: 'Deep work session - no interruptions',
      startTime: new Date(new Date().setHours(10, 0, 0, 0)),
      endTime: new Date(new Date().setHours(12, 0, 0, 0)),
      color: '#8b5cf6',
      category: 'Work',
      isAllDay: false,
      priority: 'high',
    },
  ],
  aiSuggestions: [
    {
      id: '1',
      type: 'optimize',
      title: 'Schedule Optimization Suggestion',
      description: 'You have back-to-back meetings from 9 AM to 12 PM. Consider adding a 15-minute break between meetings for better productivity.',
      priority: 'medium',
      timestamp: new Date(),
    },
    {
      id: '2',
      type: 'schedule',
      title: 'Smart Scheduling Tip',
      description: 'Your focus time is scheduled during peak productivity hours (10 AM - 12 PM). This is optimal for deep work!',
      priority: 'low',
      timestamp: new Date(),
    },
  ],
  currentDate: new Date(),
  selectedDate: new Date(),
  settings: {
    view: 'month',
    startOfWeek: 'sunday',
    showWeekNumbers: false,
    showTodayHighlight: true,
    defaultEventDuration: 60,
    workingHours: { start: '09:00', end: '17:00' },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
  preferences: {
    theme: 'light',
    notifications: { email: true, push: true, sms: false },
    aiFeatures: {
      smartScheduling: true,
      conflictDetection: true,
      optimizationSuggestions: true,
      naturalLanguageInput: true,
    },
  },
  isLoading: false,
}

function calendarReducer(state: CalendarState, action: CalendarAction): CalendarState {
  switch (action.type) {
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] }
    
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.id ? action.payload : event
        ),
      }
    
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter(event => event.id !== action.payload),
      }
    
    case 'SET_CURRENT_DATE':
      return { ...state, currentDate: action.payload }
    
    case 'SET_SELECTED_DATE':
      return { ...state, selectedDate: action.payload }
    
    case 'ADD_AI_SUGGESTION':
      return { ...state, aiSuggestions: [...state.aiSuggestions, action.payload] }
    
    case 'REMOVE_AI_SUGGESTION':
      return {
        ...state,
        aiSuggestions: state.aiSuggestions.filter(suggestion => suggestion.id !== action.payload),
      }
    
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } }
    
    case 'UPDATE_PREFERENCES':
      return { ...state, preferences: { ...state.preferences, ...action.payload } }
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    default:
      return state
  }
}

interface CalendarContextType {
  state: CalendarState
  dispatch: React.Dispatch<CalendarAction>
  addEvent: (event: Omit<Event, 'id'>) => void
  updateEvent: (event: Event) => void
  deleteEvent: (id: string) => void
  addAISuggestion: (suggestion: Omit<AISuggestion, 'id' | 'timestamp'>) => void
  removeAISuggestion: (id: string) => void
  getEventsForDate: (date: Date) => Event[]
  getEventsForDateRange: (start: Date, end: Date) => Event[]
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined)

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(calendarReducer, initialState)

  const addEvent = (eventData: Omit<Event, 'id'>) => {
    const event: Event = {
      ...eventData,
      id: crypto.randomUUID(),
    }
    dispatch({ type: 'ADD_EVENT', payload: event })
  }

  const updateEvent = (event: Event) => {
    dispatch({ type: 'UPDATE_EVENT', payload: event })
  }

  const deleteEvent = (id: string) => {
    dispatch({ type: 'DELETE_EVENT', payload: id })
  }

  const addAISuggestion = (suggestionData: Omit<AISuggestion, 'id' | 'timestamp'>) => {
    const suggestion: AISuggestion = {
      ...suggestionData,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    }
    dispatch({ type: 'ADD_AI_SUGGESTION', payload: suggestion })
  }

  const removeAISuggestion = (id: string) => {
    dispatch({ type: 'REMOVE_AI_SUGGESTION', payload: id })
  }

  const getEventsForDate = (date: Date): Event[] => {
    return state.events.filter(event => {
      const eventDate = new Date(event.startTime)
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const getEventsForDateRange = (start: Date, end: Date): Event[] => {
    return state.events.filter(event => {
      const eventDate = new Date(event.startTime)
      return eventDate >= start && eventDate <= end
    })
  }

  const value: CalendarContextType = {
    state,
    dispatch,
    addEvent,
    updateEvent,
    deleteEvent,
    addAISuggestion,
    removeAISuggestion,
    getEventsForDate,
    getEventsForDateRange,
  }

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  )
}

export function useCalendar() {
  const context = useContext(CalendarContext)
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider')
  }
  return context
}