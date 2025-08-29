import React, { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import Calendar from './components/Calendar'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import { CalendarProvider } from './context/CalendarContext'
import { Event, AISuggestion } from './types'

function App() {
  return (
    <CalendarProvider>
      <div className="min-h-screen bg-calendar-bg">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <Calendar />
          </main>
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </CalendarProvider>
  )
}

export default App