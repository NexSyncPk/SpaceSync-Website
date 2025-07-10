# SpaceSync Backend Server

A robust Node.js/Express backend for a meeting room reservation system with real-time notifications, user management, and role-based access control.

## Features

### Core Functionality
- **User Management**: Registration, authentication, and profile management
- **Organization Management**: Create and join organizations with role-based access
- **Room Reservation System**: Book meeting rooms with approval workflows
- **Real-time Notifications**: Socket.io integration for live updates
- **Room Status Monitoring**: Real-time occupancy tracking
- **Admin Dashboard**: Administrative controls for organization management

### Security & Validation
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control (RBAC)**: Admin, employee, and unassigned roles
- **Input Validation**: Comprehensive Joi schema validation
- **Error Handling**: Centralized error management with custom error classes
- **Rate Limiting**: Protection against abuse

### Architecture
- **MVC Pattern**: Clean separation of concerns
- **Repository Pattern**: Abstracted data access layer
- **Service Layer**: Business logic separation
- **Middleware**: Authentication, authorization, and error handling
- **Real-time Services**: Socket.io and room status monitoring

## Project Structure

```
server/
├── app.js                      # Express app configuration
├── server.js                   # Server entry point with Socket.io
├── package.json               # Dependencies and scripts
├── .env.example              # Environment variables template
├── config/
│   ├── config.js             # Database configuration
│   └── ca.pem               # SSL certificate
├── controllers/
│   ├── BaseController.js     # Base controller with response helpers
│   ├── UserController.js     # User registration, auth, profiles
│   ├── AdminController.js    # Admin-only operations
│   ├── OrganizationController.js  # Organization management
│   ├── RoomController.js     # Room CRUD operations
│   └── ReservationController.js   # Reservation management
├── middlewares/
│   ├── auth.middleware.js    # JWT authentication
│   ├── rbac.middleware.js    # Role-based access control
│   └── error.middleware.js   # Global error handling
├── models/
│   ├── index.js             # Sequelize model loader
│   ├── user.js              # User model with roles
│   ├── organization.js      # Organization model
│   ├── room.js              # Room model
│   ├── reservation.js       # Reservation model
│   └── externalAttendee.js  # External attendee model
├── migrations/
│   ├── 20250625064711-create-organization.js
│   ├── 20250625064724-create-user.js
│   ├── 20250625064746-create-room.js
│   ├── 20250625064756-create-reservation.js
│   ├── 20250625064841-create-external-attendee.js
│   └── 20250710163000-add-unassigned-role.js
├── repos/
│   ├── BaseRepo.js          # Base repository class
│   ├── UserRepo.js          # User data access
│   ├── AdminRepo.js         # Admin operations
│   ├── OrganizationRepo.js  # Organization data access
│   ├── RoomRepo.js          # Room data access
│   └── ReservationRepo.js   # Reservation data access
├── router/
│   ├── routes.js            # Main router
│   ├── user.route.js        # User routes
│   ├── admin.route.js       # Admin routes
│   ├── organization.route.js # Organization routes
│   ├── room.route.js        # Room routes
│   ├── reservation.route.js # Reservation routes
│   └── externalAttendees.route.js # External attendee routes
├── services/
│   ├── EmailService.js      # Email notifications
│   ├── SocketService.js     # Real-time notifications
│   └── RoomStatusService.js # Room occupancy monitoring
├── utils/
│   ├── asyncErrorHandler.js # Async error wrapper
│   ├── CustomError.js       # Custom error classes
│   └── responseHelper.js    # Response formatting
├── validators/
│   ├── BaseValidator.js     # Base validation class
│   ├── UserValidator.js     # User input validation
│   ├── OrganizationValidator.js # Organization validation
│   ├── RoomValidator.js     # Room validation
│   └── ReservationValidator.js  # Reservation validation
└── seeders/                 # Database seeders
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository and navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your database credentials and other configuration:
   ```env
   DB_USER=your_database_username
   DB_PASS=your_database_password
   DB_NAME=spacesync_db
   DB_HOST=your_database_host
   DB_PORT=5432
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   PORT=8000
   NODE_ENV=development
   ```

4. **Run database migrations**
   ```bash
   npx sequelize-cli db:migrate
   ```

5. **Start the server**
   ```bash
   # Development mode with nodemon
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication & Users
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/user/join-organization` - Join an organization
- `POST /api/user/create-organization` - Create new organization

### Admin Operations
- `GET /api/admin/users` - List organization users
- `PUT /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Remove user from organization
- `GET /api/admin/organizations/:id` - Get organization details
- `PUT /api/admin/organizations/:id` - Update organization
- `DELETE /api/admin/organizations/:id` - Delete organization

### Organizations
- `GET /api/organizations` - List all organizations
- `GET /api/organizations/:id` - Get organization by ID
- `POST /api/organizations` - Create organization
- `PUT /api/organizations/:id` - Update organization
- `DELETE /api/organizations/:id` - Delete organization

### Rooms
- `GET /api/rooms` - List all rooms
- `GET /api/rooms/:id` - Get room by ID
- `POST /api/rooms` - Create room
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room

### Reservations
- `GET /api/reservations` - List reservations
- `GET /api/reservations/:id` - Get reservation by ID
- `POST /api/reservations` - Create reservation
- `PUT /api/reservations/:id` - Update reservation
- `DELETE /api/reservations/:id` - Cancel reservation

## User Roles & Permissions

### Role Hierarchy
1. **unassigned** - Default role for new users
   - Can view public information
   - Can join organizations
   - Can create organizations (becomes admin)

2. **employee** - Organization member
   - Can view organization rooms
   - Can create reservation requests
   - Can view own reservations
   - Receives notifications about reservation status

3. **admin** - Organization administrator
   - All employee permissions
   - Can approve/reject reservations
   - Can manage organization users
   - Can add/edit/delete rooms
   - Receives notifications about new reservation requests

### Role Transitions
- New users start as `unassigned`
- When joining an organization: `unassigned` → `employee`
- When creating an organization: `unassigned` → `admin`
- Admin can promote employees: `employee` → `admin`
- Admin can demote admins: `admin` → `employee`
- When removed from organization: `employee/admin` → `unassigned`

## Real-time Features

### Socket.io Events

#### Client → Server
- `userRegistered` - Register user for notifications
- `disconnect` - Handle user disconnection

#### Server → Client
- `newReservationRequest` - Admin receives new reservation request
- `reservationStatusUpdate` - Employee receives reservation status change
- `roomStatusUpdate` - All organization users receive room occupancy changes

### Room Status Monitoring
- Automatic monitoring of room occupancy based on confirmed reservations
- Real-time updates when rooms become occupied or free
- Background service runs every minute to check status changes

## Database Schema

### Core Tables
- **organizations** - Organization details
- **users** - User accounts with roles and organization relationships
- **rooms** - Meeting rooms belonging to organizations
- **reservations** - Room booking requests and confirmations
- **external_attendees** - External guests for reservations

### Key Relationships
- Users belong to Organizations (optional)
- Rooms belong to Organizations
- Reservations link Users and Rooms
- External Attendees link to Reservations

## Error Handling

### Custom Error Classes
- `CustomError` - Base error class with status codes
- `ValidationError` - Input validation failures
- `AuthenticationError` - Authentication failures
- `AuthorizationError` - Permission denied errors

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

## Security Features

### Authentication
- JWT tokens with configurable expiration
- Password hashing with bcryptjs
- Protected routes with authentication middleware

### Authorization
- Role-based access control (RBAC)
- Organization-scoped operations
- Admin-only endpoints protection

### Validation
- Joi schema validation for all inputs
- Sanitization of user data
- Type checking and format validation

## Development

### Code Structure Guidelines
- **Controllers**: Handle HTTP requests, use BaseController for consistent responses
- **Repositories**: Handle database operations, extend BaseRepo
- **Services**: Business logic and external integrations
- **Validators**: Input validation using Joi schemas
- **Middleware**: Cross-cutting concerns (auth, RBAC, error handling)

### Testing
- Run syntax checks: `node -c filename.js`
- Test individual components by requiring them
- Use the development server for integration testing

### Adding New Features
1. Create database migration if needed
2. Update/create model with associations
3. Create repository for data access
4. Add controller with validation
5. Create/update routes
6. Add real-time notifications if applicable

## Production Deployment

### Environment Variables
- Set `NODE_ENV=production`
- Use strong JWT secrets
- Configure production database
- Set appropriate CORS origins

### Database
- Run migrations: `npx sequelize-cli db:migrate`
- Consider adding seeders for initial data
- Set up database backups
- Configure connection pooling

### Security Considerations
- Use HTTPS in production
- Configure rate limiting
- Set up proper CORS policies
- Monitor for security vulnerabilities
- Use environment-specific configurations

## Contributing

1. Follow the established code patterns
2. Use proper error handling with `asyncErrorHandler`
3. Validate all inputs with Joi schemas
4. Include proper JSDoc comments
5. Test changes thoroughly
6. Update documentation as needed

## License

This project is licensed under the ISC License.
