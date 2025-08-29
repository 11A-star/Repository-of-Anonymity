# AI Calendar - Smart Calendar Management

A modern, AI-powered calendar application built with React, TypeScript, and Tailwind CSS. This application uses artificial intelligence to help optimize your schedule, detect conflicts, and provide smart suggestions for better productivity.

## ✨ Features

### 🧠 AI-Powered Features
- **Smart Scheduling**: AI suggests optimal time slots based on your existing schedule
- **Conflict Detection**: Automatically detects overlapping events and suggests solutions
- **Productivity Insights**: Analyzes your calendar patterns and provides optimization tips
- **Natural Language Input**: Create events using natural language (e.g., "Meeting with John tomorrow at 2 PM")
- **Intelligent Suggestions**: AI-powered recommendations for better work-life balance

### 📅 Calendar Features
- **Month View**: Clean, intuitive monthly calendar layout
- **Event Management**: Create, edit, and delete events with rich details
- **Color Coding**: Organize events by category with customizable colors
- **Priority Levels**: Set high, medium, or low priority for events
- **Attendee Management**: Add multiple attendees to events
- **Location Support**: Include location information for events
- **All-Day Events**: Support for events that span entire days

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations**: Beautiful transitions and micro-interactions
- **Dark/Light Theme**: Customizable appearance
- **Collapsible Sidebar**: AI insights and upcoming events panel
- **Toast Notifications**: User-friendly feedback for all actions

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-calendar-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application

### Building for Production

```bash
npm run build
# or
yarn build
```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Calendar.tsx    # Main calendar view
│   ├── Header.tsx      # Application header with AI assistant
│   ├── Sidebar.tsx     # AI insights and navigation
│   └── EventModal.tsx  # Event creation/editing modal
├── context/            # React context for state management
│   └── CalendarContext.tsx
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── aiHelpers.ts    # AI-powered calendar functions
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## 🧠 AI Features Explained

### Smart Scheduling
The AI analyzes your existing calendar to find optimal time slots for new events, considering:
- Available gaps in your schedule
- Working hours preferences
- Event duration and type
- Existing commitments

### Conflict Detection
Automatically identifies scheduling conflicts and provides suggestions:
- Overlapping event detection
- Buffer time recommendations
- Alternative scheduling options
- Priority-based conflict resolution

### Productivity Insights
AI analyzes your calendar patterns to suggest improvements:
- Meeting density analysis
- Work-life balance recommendations
- Break time suggestions
- Optimal meeting time distribution

## 🎨 Customization

### Colors and Themes
- Modify the color palette in `tailwind.config.js`
- Customize event colors and categories
- Adjust UI component styling

### AI Behavior
- Modify AI logic in `src/utils/aiHelpers.ts`
- Adjust working hours and preferences
- Customize suggestion algorithms

### Event Categories
- Add new event categories in the EventModal component
- Customize category colors and icons
- Modify priority levels and descriptions

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_APP_TITLE=AI Calendar
VITE_APP_DESCRIPTION=Smart Calendar Management
```

### Tailwind Configuration
Customize the design system in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Custom primary color palette
      },
      calendar: {
        // Custom calendar-specific colors
      }
    }
  }
}
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the Vite configuration
3. Deploy with zero configuration

### Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure build settings if needed

### Traditional Hosting
1. Build the project: `npm run build`
2. Upload the `dist` folder to your web server
3. Configure your server to serve the static files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Animations with [Framer Motion](https://www.framer.com/motion/)
- Date handling with [date-fns](https://date-fns.org/)

## 📞 Support

If you have any questions or need help with the application, please:
- Open an issue on GitHub
- Check the documentation
- Review the code examples

---

**Happy Scheduling! 🎉**
