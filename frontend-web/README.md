# Frontend Web Application - SpaceSync

This is a React TypeScript web application that mirrors the functionality of the mobile SpaceSync app.

## Features

- Room booking system
- Calendar view for availability
- Booking management (upcoming and past)
- User profile
- Redux state management with persistence
- Responsive design with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technology Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Redux Toolkit & Redux Persist
- React Router DOM
- React Calendar
- Lucide React (for icons)

## Project Structure

```
src/
├── components/          # Reusable components
├── pages/              # Page components
├── store/              # Redux store and slices
├── types/              # TypeScript interfaces
├── utils/              # Helper functions and mock data
└── App.tsx             # Main app component
```
