# IntelliQuery CRAG Frontend

A complete runnable React + TailwindCSS frontend for an Agentic + Corrective RAG document assistant.

## What is included

- React + Vite
- TailwindCSS light-mode UI
- Redux Toolkit for client/global UI state
- TanStack Query for async server/cache state
- Login, register, and session restore flow
- Protected dashboard route
- Responsive layout
- Backend API integration for auth, documents, sessions, and chat
- Document upload and ingestion trigger
- Multi-session chat
- Retrieval pipeline display
- Source citation panel
- Confidence score
- Feedback buttons
- Clean component architecture

## Run locally

```bash
npm install
npm run dev
```

Open:

```bash
http://localhost:5173
```

## Frontend architecture

```text
src/
  app/
    store.js
    queryClient.js

  features/
    auth/authSlice.js
    chat/chatSlice.js
    ui/uiSlice.js

  hooks/
    useAuthMutations.js
    useDocuments.js
    useSessions.js
    useMessages.js

  services/
    apiClient.js
    backendApi.js

  components/
    layout/
    documents/
    chat/
    pipeline/
    sources/
    ui/

  pages/
    LoginPage.jsx
    RegisterPage.jsx
    DashboardPage.jsx
```

## State management choice

This project uses both Redux Toolkit and TanStack Query:

### Redux Toolkit

Used for true client-side app state:

- Auth user
- Active chat session
- Mobile sidebar state
- Selected document
- UI filters

### TanStack Query

Used for server/cache state:

- Documents
- Chat sessions
- Messages
- Mutations for register, login, upload, create session, and send message

This is the recommended split because server data should not be manually duplicated in Redux unless necessary.

## Backend endpoints wired

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me

POST /api/v1/documents/register-s3-and-ingest
GET  /api/v1/documents
GET  /api/v1/documents/{document_id}
GET  /api/v1/ingestion/jobs/{job_id}

POST /api/v1/sessions
GET  /api/v1/sessions

POST /api/v1/chat
GET  /api/v1/sessions/{session_id}/messages

GET  /api/v1/health
```

## Light mode only

The app intentionally uses only light-mode Tailwind classes. No dark-mode classes are included.
