Kanban Task Management Web App (Angular 20)
A client-side Kanban task management web application built with Angular 20, Angular Signals, and Angular CDK Drag-and-Drop. It allows users to organize boards, columns, tasks, and subtasks with drag-and-drop reordering and light/dark theme support, storing all state locally in the browser.

Live Demo: kanban-management-web-app-angular.vercel.app

Project Origin & Assistance Used
Bootstrapped & Iterated with v0: This repository was generated and developed with the assistance of v0 by Vercel. You can view or continue iterating on the v0 project here:
Continue working on v0 →
(Note: Although v0 initially generated a default Next.js README template, the actual implementation in this repository uses Angular 20).
Design & Seed Data: Inspired by the Frontend Mentor — Kanban Task Management Web App challenge specification and starter dataset (
seed-data.ts
).
Tech Stack
Framework: Angular 20 (Standalone Components, OnPush change detection)
State Management: Angular Signals (signal, computed, effect)
Drag & Drop: Angular CDK (@angular/cdk/drag-drop)
Styling: SCSS with CSS custom properties for Light & Dark themes
Build Tooling: @angular/build & Angular CLI (ng serve, ng build)
Language: TypeScript ~5.8
Local Data Persistence (localStorage)
All application data is stored strictly locally in the user's browser using the Web Storage API (localStorage). There is no backend server or external database.

kanban-boards: Stores the full list of boards, columns, tasks, and subtasks as JSON (managed in 
board.service.ts
).
kanban-active-board: Stores the currently selected board index.
kanban-theme: Stores the active color theme (light or dark, managed in 
theme.service.ts
), defaulting to the user's system preference (prefers-color-scheme) on first load.
Initial Seed Data: When opened for the first time (or if localStorage is cleared), the app loads default sample boards (Platform Launch, Marketing Plan, Roadmap) from 
seed-data.ts
.
Because data is saved in localStorage:

Changes persist across page reloads within the same browser profile.
Data is not synchronized across different devices, browsers, or incognito sessions.
Clearing browser site data will reset the boards to the initial seed data.
Scope, Verification & Known Limitations
This project is a client-side frontend application focused on UI/UX workflows and local state management. It is not intended as a full-stack production system without additional backend and testing infrastructure:

No Backend / Multi-User Support: No authentication, user accounts, API persistence, or real-time collaboration.
Storage Boundaries: Relies on browser localStorage (~5 MB typical quota) with basic try/catch fallbacks if storage is unavailable or full.
Current Verification: Verified via TypeScript strict compilation and Angular production build checks (npm run build / ng build with bundle budgets configured in 
angular.json
).
Testing Status: Automated unit tests (ng test) and end-to-end (E2E) tests are not yet configured in this repository.
Getting Started
Prerequisites
Node.js (v20+ recommended)
npm or pnpm
Installation
Bash

npm install
# or
pnpm install
Run the Development Server
Bash

npm run dev
# or
npm start
Open http://localhost:4200 in your browser to view the application. The app will automatically reload when you modify source files under src/.

Build for Production
Bash

npm run build
The build artifacts will be generated in the dist/kanban directory (which is ignored by Git and generated during CI/deployment).

Project Structure
text

src/
├── index.html                        # HTML entry point
├── main.ts                           # Angular bootstrap entry point
├── styles.scss                       # Global styles & theme variables
└── app/
    ├── app.ts                        # Root standalone component
    ├── app.config.ts                 # Application providers
    ├── core/
    │   ├── data/seed-data.ts         # Default boards/tasks seed dataset
    │   ├── models/board.model.ts     # TypeScript interfaces (Board, Column, Task, Subtask)
    │   └── services/
    │       ├── board.service.ts      # Signals-based board CRUD & localStorage sync
    │       ├── theme.service.ts      # Light/Dark theme state & localStorage sync
    │       └── ui-state.service.ts   # Sidebar & modal UI state
    ├── layout/                       # Header, Sidebar, Board List, Mobile Nav, Theme Toggle
    └── features/
        ├── board/                    # Board View, Board Column (CDK Drag & Drop), Task Card
        └── modals/                   # Add/Edit/View/Delete modals for Boards and Tasks
