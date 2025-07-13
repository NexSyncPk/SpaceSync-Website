# SpaceSync API Interceptor

This document explains the updated Axios interceptor for the SpaceSync frontend application, which is designed to work seamlessly with your backend server's user functionality and API structure.

## Features

### 🔐 Authentication Handling

- **Redux Persist Integration**: Works with your Redux Persist store for authentication state
- **Automatic token attachment**: Adds JWT tokens from Redux store to all authenticated requests
- **Token validation**: Checks if tokens are expired before sending requests
- **Automatic logout**: Dispatches logout action and redirects when tokens are invalid
- **State management**: Integrates seamlessly with your auth slice

### 📡 Request/Response Intercepting

- **Request logging**: Tracks API calls with timing information
- **Response processing**: Handles SpaceSync API response format (`{ success, message, data }`)
- **Error handling**: Comprehensive error handling with user-friendly messages
- **Performance monitoring**: Measures request duration for optimization

### 🎯 SpaceSync-Specific Features

- **Role-based error handling**: Different responses for admin/employee/unassigned users
- **Organization context**: Handles organization-specific operations
- **Room booking conflicts**: Specific handling for reservation conflicts
- **User feedback**: Toast notifications for all user actions

## Configuration

### Environment Variables

Create a `.env` file in your frontend root with:

```bash
# Server Configuration
VITE_SERVER_URL=http://localhost:8000/api

# Application Configuration
VITE_APP_NAME=SpaceSync
VITE_APP_VERSION=1.0.0
```

### Files Structure

```
src/
├── api/
│   ├── interceptor.ts      # Main interceptor (updated for Redux)
│   ├── services.ts         # API service examples
│   └── setup.ts           # Redux integration setup
├── config.ts               # App configuration
├── store/
│   ├── store.ts           # Redux store with persist config
│   └── slices/
│       └── authSlice.ts   # Authentication state management
├── utils/
│   ├── constants.ts        # Routes, endpoints, status codes
│   └── helpers.ts          # Redux-based token utilities
└── types/
    └── interfaces.ts       # TypeScript interfaces
```

## Setup and Integration

### 1. Initialize the Interceptor

In your main App component or store setup:

```typescript
import { setupApiInterceptor } from "@/api/setup";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store/store";

// Initialize the API interceptor with Redux store
setupApiInterceptor();

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        {/* Your app components */}
      </PersistGate>
    </Provider>
  );
}
```

### 2. Redux Store Configuration

Your store is configured to persist auth state:

```typescript
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "booking"], // Auth state is persisted
};
```

## Usage Examples

### Basic API Calls

```typescript
import api from "@/api/interceptor";

// The interceptor automatically handles:
// ✅ Adding Authorization headers
// ✅ Token validation
// ✅ Error handling with toasts
// ✅ Response unwrapping

// Simple GET request
const rooms = await api.get("/rooms");

// POST request with data
const newRoom = await api.post("/rooms", {
  name: "Conference Room A",
  capacity: 10,
  displayProjector: true,
});

// Error handling is automatic - users see toast notifications
```

### Using the API Services with Redux

```typescript
import { useDispatch } from "react-redux";
import { loginSuccess, signupSuccess } from "@/store/slices/authSlice";
import { auth, rooms, reservations } from "@/api/services";

// In your login component
const dispatch = useDispatch();

const handleLogin = async (credentials) => {
  try {
    // API call returns the server response
    const response = await auth.login(credentials);

    // Dispatch to Redux store (this also persists via Redux Persist)
    dispatch(
      loginSuccess({
        user: response.user,
        token: response.token,
      })
    );

    navigate("/dashboard");
  } catch (error) {
    // Error handling is automatic via interceptor
  }
};

// Registration works the same way
const handleSignup = async (userData) => {
  try {
    const response = await auth.register(userData);

    dispatch(
      signupSuccess({
        user: response.user,
        token: response.token,
      })
    );

    navigate("/dashboard");
  } catch (error) {
    // Automatic error handling
  }
};

// Other API calls work as before
const roomData = await rooms.getAllRooms();
const myBookings = await reservations.getMyReservations();
```

## Error Handling

The interceptor handles various error scenarios based on your SpaceSync server responses:

### HTTP Status Codes

- **401 Unauthorized**: Auto-logout and redirect to login
- **403 Forbidden**: Access denied message for role restrictions
- **404 Not Found**: Resource not found (for mutations only)
- **409 Conflict**: Handles booking conflicts, duplicate users
- **422 Validation Error**: Form validation errors
- **500 Server Error**: Generic server error message
- **Network Errors**: Connection issues and timeouts

### User Feedback

All errors show appropriate toast notifications:

```typescript
// Success toast for successful operations
toast({
  title: "Success",
  description: "Room created successfully",
  variant: "default",
});

// Error toast for failures
toast({
  title: "Access Denied",
  description: "You don't have permission to perform this action.",
  variant: "destructive",
});
```

## Token Management

### Redux-Based Token Access

```typescript
import { getToken, getAuthUser, isAuthenticated } from "@/utils/helpers";
import { useSelector } from "react-redux";

// Access token from Redux store
const token = getToken(); // Gets token from Redux state

// Access current user
const user = getAuthUser(); // Gets user from Redux state

// Check authentication status
const isLoggedIn = isAuthenticated(); // Checks Redux state

// Or use Redux hooks directly in components
const { token, user, isAuthenticated } = useSelector((state) => state.auth);
```

### Automatic Token Handling

- **Request Interceptor**: Automatically reads token from Redux store and adds `Authorization: Bearer <token>` headers
- **Token Expiry**: Checks token expiration before each request using JWT payload
- **Auto-logout**: Dispatches Redux logout action when token is invalid, clearing all persisted state

## Integration with Redux Store

Your interceptor is fully integrated with Redux Persist:

```typescript
// In your main App.tsx or index.tsx
import { setupApiInterceptor } from "@/api/setup";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store/store";

// Initialize API interceptor with Redux store
setupApiInterceptor();

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <Routes />
      </PersistGate>
    </Provider>
  );
}

// In your login/register components
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "@/store/slices/authSlice";

const dispatch = useDispatch();

const handleLogin = async (credentials) => {
  try {
    const response = await auth.login(credentials);

    // This automatically persists due to Redux Persist configuration
    dispatch(
      loginSuccess({
        user: response.user,
        token: response.token,
      })
    );

    navigate("/dashboard");
  } catch (error) {
    // Error handling is automatic via interceptor
  }
};

const handleLogout = () => {
  // This clears persisted state and redirects
  dispatch(logout());
  navigate("/login");
};
```

## SpaceSync Server Compatibility

The interceptor is designed to work with your server's API structure:

### Request Format

- **Authentication**: `Bearer <JWT_TOKEN>` in Authorization header
- **Content-Type**: `application/json` for all requests
- **Organization Context**: Automatically included via token claims

### Response Format

Expects SpaceSync server response format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### User Roles & Permissions

- **Unassigned**: Can create/join organizations
- **Employee**: Can make reservations, view rooms
- **Admin**: Full access to organization management

## Performance Features

- **Request Timing**: Monitors API call duration
- **Timeout Handling**: 15-second timeout for reliability
- **Debugging**: Logs all requests/responses with timing
- **Connection Retry**: Graceful handling of network issues

## Security Features

- **Token Validation**: Prevents expired token usage
- **Secure Storage**: Proper localStorage error handling
- **CORS Handling**: Configured for your server setup
- **Error Sanitization**: Prevents sensitive data leakage

## Troubleshooting

### Common Issues

1. **401 Errors**: Token expired or invalid

   - Solution: Login again, token will be refreshed

2. **403 Errors**: Insufficient permissions

   - Solution: Check user role, contact admin for promotion

3. **Network Errors**: Server unreachable

   - Solution: Check server status and network connection

4. **CORS Issues**: Cross-origin requests blocked
   - Solution: Ensure server CORS is configured for frontend URL

### Debug Mode

The interceptor logs all requests and responses for debugging:

```
✅ POST /user/login - 200 (245ms)
❌ GET /rooms/invalid-id - 404 (123ms) Resource not found
```

## Migration Notes

If migrating from the old interceptor:

1. **Setup interceptor**: Call `setupApiInterceptor()` in your App component after Redux store is created
2. **Redux Persist**: Ensure 'auth' is in the persist whitelist (already configured)
3. **Remove localStorage**: No need for manual token storage - Redux Persist handles it
4. **Update login/register**: Use Redux actions instead of manual token storage
5. **Error handling**: Remove manual error handling (now automatic)

### Key Changes:

- ✅ **Token storage**: Now via Redux Persist instead of localStorage
- ✅ **Auto-logout**: Dispatches Redux action instead of manual cleanup
- ✅ **State persistence**: Auth state survives page reloads automatically
- ✅ **Type safety**: Full TypeScript support with Redux store types

The updated interceptor maintains full backward compatibility while adding Redux integration and better state management.
