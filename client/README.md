# IntelliQuery CRAG Frontend

A complete runnable React + TailwindCSS frontend for an Agentic + Corrective RAG document assistant.

## What is included

- React + Vite
- TailwindCSS light-mode UI
- Redux Toolkit for client/global UI state
- TanStack Query for async server/cache state
- Login and logout flow
- Protected dashboard route
- Responsive layout
- Document upload and delete
- Local mock document indexing
- Multi-session chat
- Mock CRAG answer generation
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

## Demo login

Use any email and password.

Example:

```text
Email: alex@example.com
Password: password
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
    mockApi.js
    storage.js
    ragEngine.js

  components/
    layout/
    documents/
    chat/
    pipeline/
    sources/
    ui/

  pages/
    LoginPage.jsx
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
- Mutations for upload, delete, create session, send message

This is the recommended split because server data should not be manually duplicated in Redux unless necessary.

## Backend integration later

Currently the app runs fully using a local mock API backed by localStorage.

Later, replace `src/services/mockApi.js` with real FastAPI calls:

```text
POST /auth/login
POST /auth/logout
GET  /documents
POST /documents/upload
DELETE /documents/:id

GET  /sessions
POST /sessions
DELETE /sessions/:id

GET  /sessions/:id/messages
POST /sessions/:id/messages
POST /chat
```

## Light mode only

The app intentionally uses only light-mode Tailwind classes. No dark-mode classes are included.
