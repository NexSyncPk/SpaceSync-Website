# Simple Authentication System

## Overview

A clean and simple authentication system using Redux Persist for state management with proper form validation.

## Key Features

### ✅ **Simple Redux State Management**

- No manual localStorage operations
- Redux Persist handles persistence automatically
- Clean, simple slice with essential actions only

### 🔐 **Authentication Flow**

1. User visits any protected route → redirected to `/login`
2. User logs in successfully → redirect to home page
3. User data stored in Redux with Redux Persist
4. User can access all protected routes
5. User logs out → state cleared and redirect to login

### 📝 **Form Validation**

- React Hook Form for performance
- Zod validation schemas
- Real-time error feedback
- Type-safe forms with TypeScript

### 🛡️ **Protected Routes**

- Automatic redirect to login if not authenticated
- Header only shows when authenticated
- Clean separation of public/protected routes

## File Structure

```
src/
├── pages/
│   ├── Login.tsx           # Login page
│   └── Signup.tsx          # Signup page
├── store/slices/
│   └── authSlice.ts        # Simple auth Redux slice
├── components/
│   ├── ProtectedRoute.tsx  # Route protection wrapper
│   └── Header.tsx          # Updated with user info & logout
├── routes/
│   └── Routes.tsx          # Route configuration
└── utils/
    └── validationSchemas.ts # Form validation
```

## Redux Auth Slice

**Simple actions only:**

- `setLoading(boolean)` - Set loading state
- `loginSuccess({ user, token })` - Store user data on login
- `signupSuccess({ user, token })` - Store user data on signup
- `setError(string)` - Set error message
- `clearError()` - Clear error
- `logout()` - Clear all auth data
- `updateUser(partial)` - Update user profile

**No localStorage operations** - Redux Persist handles everything!

## Usage

### Login Flow

```tsx
// Login component
const onSubmit = async (data) => {
  dispatch(setLoading(true));

  try {
    // Your API call here
    const response = await authAPI.login(data);

    // Store user data in Redux
    dispatch(
      loginSuccess({
        user: response.user,
        token: response.token,
      })
    );

    // Redirect handled automatically
    navigate("/");
  } catch (error) {
    dispatch(setError(error.message));
  }
};
```

### Check Authentication

```tsx
// Any component
const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
const user = useSelector((state) => state.auth.user);

if (!isAuthenticated) {
  return <Navigate to="/login" />;
}

return <div>Welcome {user.name}!</div>;
```

### Protected Routes

```tsx
// Routes.tsx
<Route
  path="/"
  element={
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  }
/>
```

## Mock Data for Testing

The login/signup forms currently use mock data:

- Any email/password combination works for login
- Mock user data is created and stored
- Replace API calls with your actual endpoints

## Advantages of This Approach

1. **Simple**: No complex localStorage logic
2. **Persistent**: Redux Persist handles state persistence
3. **Clean**: Separation of concerns
4. **Type Safe**: Full TypeScript support
5. **Performant**: React Hook Form for optimal performance
6. **Secure**: Proper validation and error handling

## Integration Steps

1. Replace mock API calls with real endpoints
2. Update user interface types as needed
3. Add any additional user fields
4. Implement password reset functionality
5. Add role-based access control if needed

The system is ready to use and can be easily extended!
