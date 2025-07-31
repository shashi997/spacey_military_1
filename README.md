# Spacey Science: Smart Profile System

Spacey Science is an interactive educational platform that immerses players in space-themed missions, evolving their player profile with traits and feedback based on their choices and behaviors. The system features a smart profile backend, dynamic trait analysis, and a modern React frontend with real-time dashboard updates.

## Features

- **Smart Profile System:**
  - Tracks player traits (cautious, bold, creative, etc.) and mission completions.
  - Provides evolving feedback based on dominant traits.
  - Stores user progress, choices, and analytics persistently.
- **Mission-Based Learning:**
  - Interactive lessons with branching choices and summaries.
  - Mission history and replay support.
- **Real-Time Dashboard:**
  - Player profile and trait feedback update instantly after mission completion.
  - Custom React hooks for dashboard refresh.
- **Emotion & Face Analysis:**
  - Integrates face-api.js for emotion detection (browser-based, optional).
- **Modern Frontend:**
  - Built with React, Vite, and Tailwind CSS.
  - Responsive UI with avatars, mission monitor, and lesson flow.
- **Backend API:**
  - Node.js/Express server with REST endpoints for profile, traits, and missions.
  - Persistent storage using JSON files (per user).

## Project Structure

```
spacey_military_1/
├── client/                # Frontend React app
│   ├── public/            # Static assets (images, audio, lesson JSON)
│   ├── src/
│   │   ├── api/           # API utilities (lesson_api.js, etc.)
│   │   ├── components/    # UI components (dashboard, lesson, chat, etc.)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Main pages (LessonPage.jsx, UserDashboardPage.jsx, etc.)
│   │   └── assets/        # Images and other assets
│   ├── package.json       # Frontend dependencies
│   └── vite.config.js     # Vite config
├── server/                # Backend Node.js/Express API
│   ├── controllers/       # Core logic (persistentMemory.js, spaceyController.js, etc.)
│   ├── routes/            # API routes (chatRoutes.js)
│   ├── utils/             # Utility scripts
│   ├── index.js           # Server entry point
│   └── package.json       # Backend dependencies
├── README.md              # Project documentation (this file)
└── ...
```

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd spacey_military_1
```

### 2. Install Dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd ../client
npm install
```

### 3. Set Up Environment Variables

- Copy `.env.example` to `.env` in both `client/` and `server/` if present.
- Set required API keys (e.g., Firebase, OpenAI) as needed.

### 4. Run the Application

#### Start Backend

```bash
cd server
npm start
```

#### Start Frontend

```bash
cd ../client
npm run dev
```

- The frontend will be available at `http://localhost:5173` by default.

## Key Files & Folders

- **Backend:**
  - `server/controllers/persistentMemory.js`: Smart profile logic, trait/memory management.
  - `server/controllers/spaceyController.js`: API endpoints for profile, traits, missions.
  - `server/routes/chatRoutes.js`: API routing.
- **Frontend:**
  - `client/src/pages/LessonPage.jsx`: Lesson flow, mission completion, replay logic.
  - `client/src/pages/UserDashboardPage.jsx`: Dashboard/profile logic, custom hooks.
  - `client/src/components/dashboard/PlayerProfile.jsx`: Trait feedback display.
  - `client/src/api/lesson_api.js`: API calls for lesson and profile actions.

## Customization & Extending

- Add new lessons by placing JSON files in `client/public/lessons/`.
- Extend traits or feedback logic in `persistentMemory.js`.
- Update UI components in `client/src/components/` as needed.

## Troubleshooting

- Ensure all required API keys are set in `.env` files.
- If dashboard/profile does not update after a mission, refresh or check the custom hook integration.
- For face analysis errors, check browser console and ensure webcam permissions are granted.

## License

MIT (or your chosen license)

---

Spacey Science © 2025
