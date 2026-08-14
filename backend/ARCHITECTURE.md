# SqlMela Backend Structure

## Project Architecture Overview

The SqlMela backend has been refactored from a monolithic `server.js` into a clean, modular, production-ready MVC architecture.

```
backend/
├── server.js                 # Main entry point
├── package.json
├── config/
│   ├── db.js                # PostgreSQL connection pool
│   ├── passport.js          # GitHub OAuth configuration
│   └── session.js           # Express session configuration
├── routes/
│   ├── authRoutes.js        # Authentication endpoints
│   ├── githubRoutes.js      # GitHub OAuth endpoints
│   ├── queryRoutes.js       # SQL query endpoints
│   ├── leaderboardRoutes.js # Leaderboard endpoints
│   └── userRoutes.js        # User profile endpoints
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── githubController.js  # GitHub OAuth logic
│   ├── queryController.js   # Query execution logic
│   └── userController.js    # User management logic
├── middlewares/
│   ├── authMiddleware.js    # Auth validation middleware
│   ├── githubMiddleware.js  # GitHub token middleware
│   └── maintenanceMiddleware.js # Maintenance mode middleware
├── services/
│   ├── githubService.js     # GitHub API interactions
│   ├── sqlAnalyzerService.js # SQL validation & analysis
│   └── statsService.js      # User statistics management
├── models/
│   ├── users.js             # User model & operations
│   └── githubAccounts.js    # GitHub accounts model
├── utils/
│   ├── fileUtils.js         # File I/O operations
│   └── queryParser.js       # SQL parsing utilities
└── DB/
    ├── user.json            # User database file
    └── data.json            # Sample data
```

## Directory Descriptions

### **config/** - Configuration Files
- `db.js`: PostgreSQL connection pool setup
- `passport.js`: GitHub OAuth strategy configuration
- `session.js`: Express session middleware configuration

### **routes/** - API Route Definitions
- `authRoutes.js`: Login, logout, session management
- `githubRoutes.js`: GitHub OAuth flow and repository access
- `queryRoutes.js`: Database query execution and validation
- `leaderboardRoutes.js`: User rankings and statistics
- `userRoutes.js`: User profile and stats endpoints

### **controllers/** - Business Logic
- `authController.js`: Handles authentication requests
- `githubController.js`: Manages GitHub OAuth and repo operations
- `queryController.js`: Processes SQL queries and returns results
- `userController.js`: Manages user profiles and leaderboard

### **middlewares/** - Request Processing
- `authMiddleware.js`: Validates user authentication
- `githubMiddleware.js`: Verifies GitHub authentication
- `maintenanceMiddleware.js`: Enforces maintenance mode access control

### **services/** - Business Logic Layer
- `githubService.js`: GitHub API wrapper functions
- `sqlAnalyzerService.js`: SQL validation and analysis
- `statsService.js`: User scoring and leaderboard calculations

### **models/** - Data Access Layer
- `users.js`: User data operations (CRUD)
- `githubAccounts.js`: GitHub account data operations

### **utils/** - Utility Functions
- `fileUtils.js`: File reading/writing operations
- `queryParser.js`: SQL query parsing and validation

## API Endpoints

### Authentication
```
POST   /auth/login              # User login
POST   /auth/logout             # User logout
GET    /auth/session            # Get current session
```

### GitHub OAuth
```
GET    /auth/github             # Initiate GitHub OAuth
GET    /auth/github/callback    # GitHub OAuth callback
GET    /auth/github/account     # Get linked GitHub account
GET    /auth/github/repos       # Get user's repositories
POST   /auth/github/repo/content # Get repository content
```

### Query Operations
```
GET    /api/table/:tableName           # Fetch table data
POST   /api/query/:tableName           # Execute custom query
POST   /api/validate-output            # Validate query output
```

### User Management
```
POST   /user/update-stats       # Update user statistics
GET    /user/profile            # Get user profile
GET    /user/all                # Get all user profiles (admin only)
```

### Leaderboard
```
GET    /leaderboard             # Get top users leaderboard
```

### Health Check
```
GET    /health                  # Server health status
```

## Key Features

### 1. **Modular Architecture**
- Separation of concerns (Routes → Controllers → Services → Models)
- Easy to test and maintain
- Scalable structure for adding new features

### 2. **Error Handling**
- Centralized error handling middleware
- Proper HTTP status codes
- Detailed error messages in development mode

### 3. **Security**
- SQL injection prevention via query parsing
- CORS configuration
- Secure session management
- Passport.js OAuth integration

### 4. **Maintenance Mode**
- Toggle maintenance mode via environment variable
- Developers can bypass maintenance restrictions
- User-friendly maintenance messages

### 5. **Database Operations**
- Connection pooling for PostgreSQL
- File-based user storage for JSON data
- Prepared statements for SQL safety

## Environment Variables

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://...
FRONTEND_URL=https://sqlmelafrontend.onrender.com
SESSION_SECRET=my_session_secret
MAINTENANCE_MODE=false
```

## Usage

### Starting the Server
```bash
npm start
```

### Development Mode
```bash
NODE_ENV=development npm start
```

### Enable Maintenance Mode
```bash
MAINTENANCE_MODE=true npm start
```

## Data Flow Example

### User Login Flow
1. User sends credentials to `POST /auth/login`
2. `authController.login()` validates credentials
3. `authMiddleware` creates session
4. User can now access protected routes

### Query Execution Flow
1. User sends SQL query to `POST /api/query/:tableName`
2. `queryController.executeQuery()` validates request
3. `sqlAnalyzerService.validateQuery()` checks SQL safety
4. `pool.query()` executes query on database
5. Results returned to user

### GitHub Integration Flow
1. User clicks GitHub login button
2. `passport.authenticate("github")` redirects to GitHub
3. GitHub OAuth callback to `/auth/github/callback`
4. `githubController.handleGitHubCallback()` stores token
5. User redirected to practice page with access token

## Migration Guide (From Monolithic to Modular)

### Old Structure
- All logic in `server.js`
- Inline middleware functions
- Direct database queries

### New Structure
Benefits:
- ✅ Cleaner codebase
- ✅ Better testability
- ✅ Easier debugging
- ✅ Scalable architecture
- ✅ Reusable services
- ✅ Separated concerns

## Future Enhancements

- [ ] Add database logging/auditing
- [ ] Implement rate limiting
- [ ] Add input validation middleware
- [ ] Create comprehensive test suite
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Implement caching layer (Redis)
- [ ] Add email notifications
- [ ] Create admin dashboard

## Contributing

When adding new features:
1. Create route in `routes/`
2. Create controller in `controllers/`
3. Create service in `services/` if needed
4. Create model in `models/` if needed
5. Update this documentation

## Support

For questions or issues with the backend structure, refer to individual file headers or create an issue in the repository.
