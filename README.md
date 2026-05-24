# DevPulse 🚀

A collaborative platform for software teams to report bugs, suggest features, and coordinate issue resolutions efficiently.

---

# 🌐 Live URL

```bash
https://dev-pulse-beige-xi.vercel.app
```

---

# 📌 Project Overview

DevPulse is an internal issue and feature tracking system designed for software teams.

Users can:

- Report bugs
- Suggest feature requests
- Track issue workflow
- Manage issue resolutions
- Authenticate securely using JWT

The system supports two roles:

- contributor
- maintainer

---

# ✨ Features

## 🔐 Authentication System

- User Registration
- User Login
- JWT Authentication
- Password Hashing using bcrypt
- Protected Routes
- Role-based Authorization

---

## 🐞 Issues Management

- Create Issues
- Get All Issues
- Get Single Issue
- Update Issues
- Delete Issues
- Filter Issues
- Sort Issues

---

## 🛡️ Security Features

- Password hashing
- JWT verification
- Protected endpoints
- Role validation
- Secure error handling

---

# 👥 User Roles & Permissions

| Role | Permissions |
|---|---|
| contributor | Create issues, view issues |
| maintainer | Full issue management, metrics access |

---

# 🛠️ Technology Stack

| Technology | Usage |
|---|---|
| Node.js | Backend runtime |
| TypeScript | Type safety |
| Express.js | Server framework |
| PostgreSQL | Database |
| pg | PostgreSQL driver |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT authentication |
| cors | Cross-origin support |
| cookie-parser | Cookie parsing |

---

# 📂 Folder Structure

```bash
src/
│
├── app/
│   ├── modules/
│   │   ├── auth/
│   │   ├── issue/
│   │
│   ├── middleware/
│   ├── utility/
│   ├── types/
│
├── config/
├── db/
├── server.ts
├── app.ts
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/yeasin-riyad/DevPulse.git
```

---

## 2️⃣ Move Into Project

```bash
cd DevPulse
```

---

## 3️⃣ Install Dependencies

```bash
npm install
```

---

## 4️⃣ Create `.env` File

```env
PORT=8000

POSTGRESQL_CONNECTION_STRING=your_postgresql_connection_string

JWT_SECRET=your_secret_key
```

---

## 5️⃣ Run Development Server

```bash
npm run dev
```

---

# 📦 NPM Scripts

```json
{
  "dev": "tsx watch src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

---

# 🗄️ Database Schema Summary

---

## Table: users

| Field | Type |
|---|---|
| id | SERIAL PRIMARY KEY |
| name | VARCHAR(120) |
| email | VARCHAR(120) UNIQUE |
| password | TEXT |
| role | VARCHAR(50) |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

---

## Table: issues

| Field | Type |
|---|---|
| id | SERIAL PRIMARY KEY |
| title | VARCHAR(150) |
| description | TEXT |
| type | VARCHAR(50) |
| status | VARCHAR(50) |
| reporter_id | INTEGER |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

---

# 🔐 Authentication Flow

```text
Client Login
    ↓
Server validates credentials
    ↓
JWT generated
    ↓
Client stores token
    ↓
Client sends token in Authorization header
    ↓
Server verifies token
```

---

# 🌐 API Endpoints

---

# 🔹 Authentication Routes

---

## 1. Register User

### Endpoint

```http
POST /api/auth/signup
```

### Access

Public

### Request Body

```json
{
  "name": "John Doe",
  "email": "john.doe@devpulse.com",
  "password": "securePassword123",
  "role": "contributor"
}
```

---

## 2. Login User

### Endpoint

```http
POST /api/auth/login
```

### Access

Public

### Request Body

```json
{
  "email": "john.doe@devpulse.com",
  "password": "securePassword123"
}
```

---

# 🔹 Issues Routes

---

## 3. Create Issue

### Endpoint

```http
POST /api/issues
```

### Access

Authenticated Users

### Headers

```http
Authorization: <JWT_TOKEN>
```

---

## 4. Get All Issues

### Endpoint

```http
GET /api/issues
```

### Query Parameters

| Parameter | Values |
|---|---|
| sort | newest, oldest |
| type | bug, feature_request |
| status | open, in_progress, resolved |

---

## 5. Get Single Issue

### Endpoint

```http
GET /api/issues/:id
```

---

## 6. Update Issue

### Endpoint

```http
PATCH /api/issues/:id
```

### Access

- Maintainer
- Contributor (own issue only when status = open)

---

## 7. Delete Issue

### Endpoint

```http
DELETE /api/issues/:id
```

### Access

Maintainer Only

---

# 📄 Standard Response Structure

---

## ✅ Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

---

## ❌ Error Response

```json
{
  "success": false,
  "message": "Something went wrong",
  "errors": {}
}
```

---

# 🔒 Authorization Rules

| Operation | contributor | maintainer |
|---|---|---|
| Create Issue | ✅ | ✅ |
| View Issues | ✅ | ✅ |
| Update Own Open Issue | ✅ | ✅ |
| Update Any Issue | ❌ | ✅ |
| Delete Issue | ❌ | ✅ |

---

# 🧠 Key Engineering Concepts Used

- REST API Design
- Modular Architecture
- JWT Authentication
- Role-Based Authorization
- PostgreSQL Raw SQL Queries
- Separation of Concerns
- Middleware Pattern
- Error Handling
- TypeScript Interfaces & Types

---

# 🚀 Future Improvements

- Pagination
- Search functionality
- Refresh token system
- Rate limiting
- API documentation using Swagger
- Unit & Integration Testing
- Docker support

---

# 👨‍💻 Author

## Yeasin Riyad

Backend Developer | TypeScript & PostgreSQL Enthusiast

---

# 📜 License

This project is licensed under the MIT License.
