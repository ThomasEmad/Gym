# FitTrack - Gym Management System

A modern, responsive gym membership management system built with Next.js and Django.

## Features

- **Member Management**: Add, edit, delete, and search gym members
- **Dashboard Analytics**: View membership statistics and recent activities
- **Real-time Updates**: Live data synchronization with backend API
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Loading States**: Smooth loading indicators for better UX

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Context** - State management
- **React Icons** - Icon library

### Backend
- **Django REST Framework** - API backend
- **SQLite** - Database (development)

## Getting Started

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gym-management-system
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   NEXT_PUBLIC_API_TIMEOUT=10000
   NEXT_PUBLIC_ENV=development
   ```

4. **Start the backend server**
   ```bash
   # Navigate to your Django project directory
   python manage.py runserver
   ```

5. **Start the frontend development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## API Integration

### Endpoints

The application integrates with the following Django REST API endpoints:

- `GET /gymApi/members/` - Fetch all members
- `POST /gymApi/members/` - Create new member
- `GET /gymApi/members/{id}/` - Fetch specific member
- `PUT /gymApi/members/{id}/` - Update member
- `DELETE /gymApi/members/{id}/` - Delete member

### Error Handling

The application includes comprehensive error handling:

- **Network errors**: Timeout and connection issues
- **API errors**: HTTP status codes and server messages
- **Validation errors**: Form validation and data integrity
- **Runtime errors**: Error boundaries for unexpected crashes

### Loading States

Loading indicators are shown during:
- Initial data fetch
- CRUD operations
- Data refresh
- Form submissions

## Project Structure

```
src/
├── app/                 # Next.js App Router
├── components/          # React components
│   ├── Dashboard.tsx
│   ├── MembersTable.tsx
│   ├── MemberModal.tsx
│   ├── DeleteModal.tsx
│   ├── Navigation.tsx
│   ├── Toast.tsx
│   ├── LoadingSpinner.tsx
│   └── ErrorBoundary.tsx
├── context/             # React Context providers
│   └── MemberContext.tsx
├── hooks/               # Custom React hooks
│   └── useApi.ts
├── lib/                 # Utility libraries
│   └── api.ts
├── types/               # TypeScript type definitions
│   └── member.ts
└── utils/               # Helper functions
    └── statusUtils.ts
```

## Development

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Error Boundaries**: Graceful error handling
- **Loading States**: User feedback during operations

### Best Practices
- **Separation of Concerns**: API logic separated from UI components
- **Error Handling**: Comprehensive error management
- **Type Safety**: Full TypeScript coverage
- **Responsive Design**: Mobile-first approach
- **Performance**: Optimized rendering and data fetching

## Deployment

### Frontend (Vercel/Netlify)
1. Build the application: `npm run build`
2. Deploy to your preferred platform
3. Update environment variables for production API

### Backend (Django)
1. Configure production database
2. Set up CORS for frontend domain
3. Deploy to your preferred hosting service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.