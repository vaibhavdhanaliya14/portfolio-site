# TaskFlow API Backend

TaskFlow API is a Node.js, Express, and MongoDB/Mongoose backend for task management.

## Features

- RESTful CRUD endpoints for tasks
- MongoDB Atlas persistence through Mongoose
- Request validation middleware
- Central error handling for validation, invalid IDs, and malformed JSON
- CORS, Helmet security headers, and Morgan request logging
- Environment-based configuration

## Setup

```bash
npm install
copy .env.example .env
npm run dev
```

Update `.env` with your MongoDB Atlas connection string:

```txt
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/taskflow?retryWrites=true&w=majority
```

In MongoDB Atlas, add your current IP address in **Network Access** and make sure the database user has read/write permissions.

## Scripts

```bash
npm start
npm run dev
```

## API Endpoints

Base URL:

```txt
http://localhost:5000/api/tasks
```

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/:id` | Get one task |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

## Request Examples

Create task:

```json
{
  "title": "Complete internship task",
  "description": "Finish frontend and backend integration",
  "priority": "medium"
}
```

Update task:

```json
{
  "completed": true
}
```

## Response Format

Success:

```json
{
  "success": true,
  "data": {
    "_id": "66...",
    "title": "Complete internship task",
    "status": "pending",
    "priority": "medium"
  }
}
```

Errors:

```json
{
  "success": false,
  "error": "Validation Error: Title is required and must be a non-empty string."
}
```

## Database Notes

The `Task` model stores `title`, `description`, `status`, `priority`, and `dueDate`, with automatic timestamps. An index on `status` supports filtered task queries.

For production, keep `.env` out of Git, rotate exposed credentials, and use MongoDB Atlas network access rules.
