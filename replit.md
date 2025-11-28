# Calyte - Mental Wellness Application

## Project Overview
Calyte is a comprehensive mental wellness application featuring meditation/breathing exercises, healing frequency music, AI chatbot support, community support circles, sleep tracking, and personal journaling.

## Recent Changes (Latest)
- **Journal Feature Implemented** - Moved daily journal to Chat page (replacing anonymous chat)
- **Features**:
  - Daily Feeling input
  - Mood selector (8 options: happy, sad, anxious, calm, grateful, stressed, motivated, neutral)
  - Journal entry textarea
  - Save/load/delete entries
  - Recent entries display with date, feeling, mood, and content preview
  - Dark/light theme support

## Architecture

### Frontend (React + Vite)
- **Pages**: Home, Meditation, Playlist, Circles, Chat (Journal), Breathing
- **Components**: Layout, UI components from shadcn
- **State Management**: React hooks + TanStack Query
- **Styling**: Tailwind CSS with dark mode support

### Backend (Express)
- **Routes**:
  - Auth: `/api/auth/signup`, `/api/auth/login`, `/api/auth/logout`
  - Chat/AI: `/api/chat/messages`
  - Journal: `/api/journal`, `/api/journal/:id` (CRUD operations)
  - Circles: `/api/circles`, `/api/circles/:id`
  - Music: `/api/music`

### Database Schema
- **Users**: id, username, password
- **Circles**: id, name, description, topic, isPrivate, createdBy, memberCount
- **CircleMembers**: id, circleId, userId, joinedAt
- **CircleDiscussions**: id, circleId, userId, message, likes, createdAt
- **JournalEntries**: id, userId, feeling, mood, notes, createdAt

### Storage
- In-memory storage (MemStorage) for development
- Can be upgraded to PostgreSQL (Neon database)

## Features Implemented

### ✅ Meditation & Breathing
- Breathing exercises (4-7-8 technique)
- Meditation timer with background music
- Guided sessions

### ✅ Music & Healing Frequencies
- 432Hz healing frequency tracks
- 528Hz healing frequency tracks
- Mute toggle for all audio
- Playlist management

### ✅ Sleep Mode
- Hour-based counting timer (HH:MM:SS format)
- Tracks upward from 00:00:00
- Sleep session logging

### ✅ Journal
- Write daily feelings and thoughts
- Track mood (8 options)
- Store entries with timestamp
- View recent entries
- Delete entries
- Private reflection space

### ✅ Support Circles
- Join/leave communities
- View circle members
- Recent discussions display
- Topic-based grouping

### ✅ DevOps Infrastructure
- Docker containerization
- Kubernetes manifests (EKS-ready)
- Terraform IaC for AWS
- CI/CD pipelines (GitHub Actions)
- Deployment automation

## User Preferences
- Dark mode enabled by default
- Theme toggle in header
- Responsive design (mobile/tablet/desktop)

## Testing
- All interactive elements have data-testid attributes
- Test IDs follow pattern: `{action}-{target}`
- Dynamic elements: `{type}-{description}-{id}`

## Deployment
- Ready for AWS EKS deployment
- Docker image production-ready
- Terraform configuration available
- CI/CD pipelines configured

## Known Integrations
- None currently added (can search for integrations as needed)

## File Structure
```
├── client/
│   └── src/
│       ├── pages/
│       │   ├── home.tsx
│       │   ├── meditation.tsx
│       │   ├── chat.tsx (Journal)
│       │   ├── circles.tsx
│       │   ├── playlist.tsx
│       │   └── breathing.tsx
│       ├── components/
│       ├── contexts/
│       └── App.tsx
├── server/
│   ├── routes.ts
│   ├── storage.ts
│   └── index.ts
├── shared/
│   └── schema.ts
└── public/
```

## Next Steps
- Add AI chatbot integration (Chatbase)
- Enhance journal analytics/statistics
- Add meditation progress tracking
- Implement user profiles
- Add community messaging
