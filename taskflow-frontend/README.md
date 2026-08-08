# TaskFlow Lite Frontend

TaskFlow Lite is a responsive vanilla JavaScript task manager. It connects to the TaskFlow API when the backend is running and falls back to browser localStorage for offline demos.

## Features

- Add, edit, complete, delete, and clear completed tasks
- Filter tasks by All, Active, and Completed
- Empty state and task counter
- Input validation with a 120 character limit
- Dark/light mode preference saved in localStorage
- Backend API integration with localStorage fallback

## Run Locally

Open `index.html` directly in a browser, or use Live Server in VS Code.

For full-stack mode, start the backend first:

```bash
cd ../taskflow-backend
npm install
npm run dev
```

The frontend calls:

```txt
http://localhost:5000/api/tasks
```

## Architecture

- `index.html`: application markup and controls
- `css/styles.css`: responsive layout, task states, dark/light theme
- `js/api.js`: REST API wrapper for TaskFlow backend
- `js/storage.js`: localStorage persistence fallback
- `js/app.js`: state management, DOM rendering, validation, and event handling

## localStorage Schema

Key:

```txt
taskflow_tasks_v1
```

Value:

```json
[
  {
    "id": "1700000000000",
    "title": "Build portfolio",
    "status": "pending",
    "createdAt": "2026-08-09T00:00:00.000Z"
  }
]
```

Theme preference is saved under `taskflow_theme`.

## Event Flow

1. User submits the task form.
2. `app.js` validates the title.
3. If the API is connected, `api.js` sends the request to the backend.
4. If the API is unavailable during initial load, `storage.js` loads local tasks.
5. `render()` refreshes the visible task list, filters, status, and counter.
