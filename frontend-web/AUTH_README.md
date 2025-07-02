# Authentication System Documentation

## Overview

This authentication system provides login and signup functionality with comprehensive form validation using React Hook Form and Zod validation.

## Features

### 🔐 **Login Page (`/login`)**

- Email and password validation
- Show/hide password toggle
- Remember me checkbox
- Forgot password link
- Loading states with spinner
- Proper error handling
- Responsive design matching app theme

### 📝 **Signup Page (`/signup`)**

- Full name, email, department, and password fields
- Password confirmation with matching validation
- Strong password requirements (uppercase, lowercase, number)
- Terms and conditions checkbox
- Real-time validation feedback
- Loading states
- Responsive design

### ✅ **Form Validation**

- **Zod Schema Validation**: Comprehensive validation rules
- **React Hook Form**: Efficient form state management
- **Real-time Feedback**: Instant validation on field changes
- **Error Messages**: Clear, user-friendly error messages
- **Type Safety**: Full TypeScript support

## File Structure

```
src/
├── pages/
│   ├── Login.tsx           # Login page component
│   ├── Signup.tsx          # Signup page component
│   └── AuthDemo.tsx        # Demo page with navigation
├── store/slices/
│   └── authSlice.ts        # Redux authentication state
├── utils/
│   └── validationSchemas.ts # Zod validation schemas
├── components/
│   └── FormComponents.tsx   # Reusable form components
└── types/
    └── interfaces.ts       # TypeScript interfaces
```

## Validation Rules

### Login

- **Email**: Required, valid email format
- **Password**: Required, minimum 6 characters

### Signup

- **Name**: Required, 2-50 characters
- **Email**: Required, valid email format
- **Department**: Required, minimum 2 characters
- **Password**: Required, minimum 6 characters, must contain:
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
- **Confirm Password**: Must match password

## Usage

### Navigation

- Visit `/login` for login page
- Visit `/signup` for signup page
- Visit `/auth-demo` for demo with navigation tabs

### Form Submission

Forms include loading states and error handling. On successful submission:

- Login: Shows success toast and can redirect to dashboard
- Signup: Shows success toast and can redirect to login or dashboard

### Redux Integration

Authentication state is managed through Redux with:

- User information storage
- Token management
- Loading states
- Error handling
- Persistence in localStorage

## Styling

- **Theme**: Matches existing app theme with primary blue color (#1565C0)
- **Layout**: Centered cards with shadows
- **Icons**: Lucide React icons for visual appeal
- **Responsive**: Mobile-first design with proper breakpoints
- **Accessibility**: Proper labels, focus states, and ARIA attributes

## API Integration Ready

The forms are prepared for API integration with:

- Async form submission handlers
- Loading states during API calls
- Error handling for API responses
- Token storage for authentication
- User data persistence

## Dependencies Added

```json
{
  "react-hook-form": "^7.x.x",
  "@hookform/resolvers": "^3.x.x",
  "zod": "^3.x.x"
}
```

## Example Usage in Components

```tsx
import { useSelector } from "../store/hooks";

const MyComponent = () => {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <div>Welcome, {user?.name}!</div>;
};
```

## Next Steps

1. Connect to actual authentication API
2. Add protected routes
3. Implement password reset functionality
4. Add email verification
5. Add social login options
6. Implement role-based access control
