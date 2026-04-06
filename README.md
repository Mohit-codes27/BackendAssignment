# 💰 Financial Records Management API

**🟢 Live API Endpoint:** [https://backendassignment-fnqd.onrender.com](https://backendassignment-fnqd.onrender.com)

A RESTful backend API built with **Node.js**, **Express**, and **MongoDB** for managing financial records (income & expenses). Features JWT-based authentication, role-based access control (RBAC), user management, and a dashboard with aggregated analytics.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [User Management](#user-management)
  - [Records](#records)
  - [Dashboard](#dashboard)
- [Access Control Implementation](#access-control-implementation)
- [Role-Based Access Control](#role-based-access-control)
- [Data Models](#data-models)
  - [User Model](#user-model)
  - [Record Model](#record-model)
- [API Response Format](#api-response-format)
- [Error Handling](#error-handling)
- [Trade-offs & Assumptions](#trade-offs--assumptions)

---

## ✨ Features

- **User Authentication** — Register & login with hashed passwords (bcrypt) and JWT tokens.
- **User Management** — Admin can list all users and activate/deactivate accounts.
- **Role-Based Access Control** — Three roles: `viewer`, `analyst`, `admin` with granular permissions.
- **Financial Records CRUD** — Create, read, update, and delete income/expense records.
- **Filtering & Pagination** — Filter records by type, category, and date range with paginated results.
- **Dashboard Analytics** — Aggregated summaries, category breakdowns, and monthly trends with user-scoped data.
- **Standardized Responses** — Consistent API response and error format across all endpoints.

---

## 🛠 Tech Stack

| Technology      | Purpose              |
| --------------- | -------------------- |
| **Node.js**     | Runtime environment  |
| **Express.js**  | Web framework        |
| **MongoDB**     | NoSQL database       |
| **Mongoose**    | ODM for MongoDB      |
| **JWT**         | Token authentication |
| **bcryptjs**    | Password hashing     |
| **cors**        | Cross-origin support |
| **dotenv**      | Environment config   |

---

## 📁 Project Structure

```
src/
 ├── controllers/
 │    ├── auth.controller.js        # Register & login logic
 │    ├── user.controller.js        # User listing & status management
 │    ├── record.controller.js      # Financial record CRUD
 │    ├── dashboard.controller.js   # Analytics & aggregations
 │
 ├── models/
 │    ├── user.model.js             # User schema (roles, status)
 │    ├── record.model.js           # Record schema (income/expense)
 │
 ├── routes/
 │    ├── auth.routes.js            # POST /register, /login
 │    ├── user.routes.js            # GET users, PATCH status
 │    ├── record.routes.js          # Record CRUD routes
 │    ├── dashboard.routes.js       # Dashboard analytics routes
 │
 ├── middlewares/
 │    ├── auth.middleware.js         # JWT token verification
 │    ├── role.middleware.js         # Role-based authorization
 │    ├── error.middleware.js        # Global error handler
 │
 ├── utils/
 │    ├── apiResponse.js            # ApiResponse & ApiError classes
 │
 ├── config/
 │    ├── db.js                     # MongoDB connection setup
 │
 └── app.js                         # Express app entry point
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **npm** (comes with Node.js)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd BackendAssignment
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root directory (refer to `.env.example`):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/backend_assignment
JWT_SECRET=your_jwt_secret_here
```

| Variable      | Description                        | Default                                       |
| ------------- | ---------------------------------- | --------------------------------------------- |
| `PORT`        | Server port                        | `5000`                                        |
| `MONGO_URI`   | MongoDB connection string          | `mongodb://localhost:27017/backend_assignment` |
| `JWT_SECRET`  | Secret key for signing JWT tokens  | —                                             |

### Running the Server

```bash
# Production
npm start

# Development (with nodemon)
npm run dev
```

The server will start at `http://localhost:5000`.

---

## 📡 API Endpoints

> **Base URL (Local):** `http://localhost:5000/api`
> **Base URL (Live):** `https://backendassignment-fnqd.onrender.com/api`

All protected routes require a `Bearer` token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

---

### Authentication

| Method | Endpoint          | Description          | Access  |
| ------ | ----------------- | -------------------- | ------- |
| POST   | `/api/auth/register` | Register a new user  | Public  |
| POST   | `/api/auth/login`    | Login & get JWT token | Public  |

#### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "viewer"
}
```

**Roles accepted:** `viewer` (default), `analyst`, `admin`

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
  },
  "success": true
}
```

---

### User Management

| Method | Endpoint                  | Description                    | Access     |
| ------ | ------------------------- | ------------------------------ | ---------- |
| GET    | `/api/users/`             | Get all registered users       | Admin only |
| PATCH  | `/api/users/:id/status`   | Activate or deactivate a user  | Admin only |

#### Get All Users

```http
GET /api/users/
Authorization: Bearer <admin_token>
```

**Response:**

```json
{
  "statusCode": 200,
  "message": "Users fetched successfully",
  "data": [
    {
      "_id": "663f...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "viewer",
      "status": "active",
      "createdAt": "2026-04-01T..."
    }
  ],
  "success": true
}
```

#### Toggle User Status

```http
PATCH /api/users/663f.../status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "inactive"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "message": "User deactivated successfully",
  "data": {
    "_id": "663f...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "viewer",
    "status": "inactive"
  },
  "success": true
}
```

---

### Records

| Method | Endpoint              | Description               | Access     |
| ------ | --------------------- | ------------------------- | ---------- |
| POST   | `/api/records/`       | Create a financial record | Admin only |
| GET    | `/api/records/`       | Get records (with filters) | Authenticated |
| PUT    | `/api/records/:id`    | Update a record           | Admin only |
| DELETE | `/api/records/:id`    | Delete a record           | Admin only |

#### Create Record

```http
POST /api/records/
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 5000,
  "type": "income",
  "category": "Salary",
  "date": "2026-04-01",
  "notes": "April salary"
}
```

#### Get Records (with filters & pagination)

```http
GET /api/records/?type=expense&category=Food&startDate=2026-01-01&endDate=2026-12-31&page=1&limit=5
Authorization: Bearer <token>
```

**Query Parameters:**

| Parameter   | Type   | Description                       | Default |
| ----------- | ------ | --------------------------------- | ------- |
| `type`      | String | Filter by `income` or `expense`   | —       |
| `category`  | String | Filter by category name           | —       |
| `startDate` | Date   | Start of date range (YYYY-MM-DD)  | —       |
| `endDate`   | Date   | End of date range (YYYY-MM-DD)    | —       |
| `page`      | Number | Page number for pagination        | `1`     |
| `limit`     | Number | Records per page                  | `5`     |

---

### Dashboard

| Method | Endpoint                  | Description                    | Access              |
| ------ | ------------------------- | ------------------------------ | ------------------- |
| GET    | `/api/dashboard/summary`  | Total income, expense & balance | Analyst, Admin      |
| GET    | `/api/dashboard/category` | Spending breakdown by category  | Analyst, Admin      |
| GET    | `/api/dashboard/trends`   | Monthly spending trends         | Analyst, Admin      |

> **Note:** Dashboard data is **user-scoped** — analysts see only their own records, while admins see aggregated data across all users.

#### Summary Response

```json
{
  "statusCode": 200,
  "message": "Dashboard stats fetched successfully",
  "data": {
    "totalIncome": 50000,
    "totalExpense": 30000,
    "netBalance": 20000
  },
  "success": true
}
```

#### Category Breakdown Response

```json
{
  "statusCode": 200,
  "message": "Category data fetched successfully",
  "data": [
    { "_id": "Salary", "total": 50000 },
    { "_id": "Food", "total": 12000 },
    { "_id": "Rent", "total": 18000 }
  ],
  "success": true
}
```

#### Monthly Trends Response

```json
{
  "statusCode": 200,
  "message": "Trends data fetched successfully",
  "data": [
    { "_id": { "month": 1 }, "total": 15000 },
    { "_id": { "month": 2 }, "total": 22000 },
    { "_id": { "month": 3 }, "total": 18000 }
  ],
  "success": true
}
```

---

## 🔒 Access Control Implementation

The API enforces access control through a **middleware chaining** pattern. Every protected route passes through two layers before reaching the controller:

```
Request → auth.middleware → role.middleware → Controller
```

### How It Works

1. **JWT Authentication Middleware (`auth.middleware.js`)**
   - Extracts the Bearer token from the `Authorization` header.
   - Verifies and decodes the token using `jsonwebtoken`.
   - Attaches the decoded user payload (`id`, `role`) to `req.user`.
   - Rejects the request with `401` if the token is missing or invalid.

2. **Role Authorization Middleware (`role.middleware.js`)**
   - Accepts a list of allowed roles (e.g., `authorize("analyst", "admin")`).
   - Checks `req.user.role` against the allowed roles.
   - Rejects the request with `403` if the user's role is not permitted.

3. **Route-Level Chaining**
   - Routes compose these middlewares declaratively:
     ```js
     // Only admins can create records
     router.post("/", auth, authorize("admin"), createRecord);

     // Analysts and admins can view dashboard
     router.get("/summary", auth, authorize("analyst", "admin"), getSummary);
     ```

This approach keeps authorization logic **decoupled** from business logic, making it easy to modify permissions without touching controllers.

---

## 🔐 Role-Based Access Control

The API implements three user roles with different permission levels:

| Feature                   | Viewer | Analyst | Admin |
| ------------------------- | :----: | :-----: | :---: |
| Register / Login          |   ✅   |   ✅    |  ✅   |
| View records              |   ✅   |   ✅    |  ✅   |
| Create records            |   ❌   |   ❌    |  ✅   |
| Update records            |   ❌   |   ❌    |  ✅   |
| Delete records            |   ❌   |   ❌    |  ✅   |
| View dashboard (own data) |   ❌   |   ✅    |  ✅   |
| View dashboard (all data) |   ❌   |   ❌    |  ✅   |
| List all users            |   ❌   |   ❌    |  ✅   |
| Activate/deactivate users |   ❌   |   ❌    |  ✅   |

---

## 📦 Data Models

### User Model

| Field      | Type     | Required | Default    | Description                          |
| ---------- | -------- | :------: | ---------- | ------------------------------------ |
| `name`     | String   |    ✅    | —          | User's full name                     |
| `email`    | String   |    ✅    | —          | Unique email (lowercase, trimmed)    |
| `password` | String   |    ✅    | —          | Hashed password (min 6 chars)        |
| `role`     | String   |    ❌    | `viewer`   | One of: `viewer`, `analyst`, `admin` |
| `status`   | String   |    ❌    | `active`   | One of: `active`, `inactive`         |

*Timestamps (`createdAt`, `updatedAt`) are auto-generated.*

### Record Model

| Field      | Type     | Required | Description                              |
| ---------- | -------- | :------: | ---------------------------------------- |
| `userId`   | ObjectId |    ✅    | Reference to the User who created it     |
| `amount`   | Number   |    ✅    | Financial amount                         |
| `type`     | String   |    ✅    | One of: `income`, `expense`              |
| `category` | String   |    ✅    | Category name (e.g., Salary, Food, Rent) |
| `date`     | Date     |    ✅    | Date of the transaction (indexed)        |
| `notes`    | String   |    ❌    | Optional notes about the record          |

*Timestamps (`createdAt`, `updatedAt`) are auto-generated. `userId` and `date` fields are indexed for performance.*

---

## 📤 API Response Format

All endpoints return a standardized response format:

### Success Response

```json
{
  "statusCode": 200,
  "message": "Descriptive success message",
  "data": { },
  "success": true
}
```

### Error Response

```json
{
  "success": false,
  "message": "Descriptive error message",
  "errors": []
}
```

---

## ⚠️ Error Handling

The API uses a centralized error handling middleware. Common error codes:

| Status Code | Meaning                                    |
| :---------: | ------------------------------------------ |
|    `400`    | Bad Request — Invalid input or duplicate   |
|    `401`    | Unauthorized — Missing or invalid token    |
|    `403`    | Forbidden — Insufficient role permissions  |
|    `404`    | Not Found — Resource doesn't exist         |
|    `500`    | Internal Server Error                      |

---

## 🤔 Trade-offs & Assumptions

| Decision | Rationale |
| -------- | --------- |
| **MongoDB over SQL** | Chosen for schema flexibility — financial record categories and types can evolve without migrations. Document model maps naturally to JSON API responses. |
| **JWT over Sessions** | Stateless authentication simplifies horizontal scaling — no server-side session store needed. Token expiry (7 days) balances security with user convenience. |
| **bcryptjs over bcrypt** | Pure JavaScript implementation avoids native compilation issues across platforms, making deployment simpler at the cost of marginal hashing speed. |
| **No caching layer** | Redis/in-memory caching was not implemented to keep the scope focused. For production, dashboard aggregation results would benefit from caching with TTL-based invalidation. |
| **No rate limiting** | Not implemented in current scope. Production deployments should add `express-rate-limit` to protect auth endpoints from brute-force attacks. |
| **Admin creates records** | Record creation is restricted to admins to maintain data integrity. In a real-world scenario, this could be extended to allow analysts to submit records pending admin approval. |
| **User-scoped dashboard** | Analysts see only their own data while admins see global aggregations. This supports multi-tenancy without adding a separate tenant/org model. |

---

## 📄 License

This project is licensed under the ISC License.
