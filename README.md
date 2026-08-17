# MeeFins Frontend

MeeFins is a web application designed for peer-to-peer language exchange, interactive video meetings, and vocabulary learning. It provides a real-time scheduling system, integrated video room experiences via LiveKit, vocabulary collection management, and user authentication workflows.

## Features & Capabilities

- User Authentication & Verification: Complete account management supporting sign-up, email verification code workflows, login, password recovery, and GitHub OAuth integration.
- Language Exchange Slot Booking: Interactive calendar and dashboard for creating, browsing, booking, and managing language exchange slots.
- Real-Time Video Rooms: Integrated LiveKit video/audio conferencing for booked exchange sessions.
- Vocabulary Collections & Practice: Management of custom vocabulary words, practice decks, and progress tracking.
- Community & Activity History: Overview of past exchange sessions, participant ratings, and community member interactions.
- Responsive Design & Notification System: Custom design token architecture built with Tailwind CSS, animated notifications via Framer Motion, and mobile/desktop layout support.

## Tech Stack / Prerequisites

### Core Framework & Libraries

| Technology | Purpose |
| --- | --- |
| Next.js 16 (App Router) | React Framework & SSR/SSG Routing |
| React 19 & React DOM 19 | User Interface Component Library |
| TypeScript 5 | Type Safety & Interfaces |
| Tailwind CSS 4 | Utility-First Styling Framework |
| Framer Motion 12 | Component & Toast Animations |
| LiveKit Client & Components | Real-time Video/Audio Communication |
| FullCalendar 6 | Interactive Slot Scheduling Calendar |
| React Hook Form 7 | Form Management & Input Validation |
| Axios | HTTP Client for API Communications |

### System Prerequisites

- Node.js version 20.x or higher
- npm (Node Package Manager) or pnpm
- Running instance of the MeeFins Backend API (default: http://localhost:3001)

## Installation & Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/NguyenKhangPhuc/mee-fins.git
cd mee-fins
```

2. Install dependencies:

```bash
npm install
```

3. Configure Environment Variables:

Create a `.env` file in the root directory and define the following variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_LIVEKIT_URL=wss://your-livekit-server-url
```

4. Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser to access the application.

5. Build for production:

```bash
npm run build
npm run start
```

## Usage Examples & Route Overview

### Main Application Routes

- `/login` - User login page with credentials and GitHub OAuth options.
- `/sign-up` - Account creation page.
- `/sign-up/verify` - Email verification code entry page.
- `/forget-password` - Password recovery request page.
- `/reset-password` - Password update page.
- `/dashboard` - User dashboard for viewing active slots and scheduling.
- `/room/[slotId]` - LiveKit video exchange room for booked slots.
- `/collection` - Personal vocabulary list and practice management.
- `/community` - Language exchange partner discovery.
- `/history` - Completed session records and rating feedback.

### Backend API Integration

The application communicates with the backend via dedicated service modules located in `app/services`:

- `signupService`, `loginService`, `logoutService` - Authentication endpoints.
- `generateSignUpCodeService`, `verifySignUpCodeService` - Verification code endpoints.
- `updatePasswordService`, `generateForgetPasswordCodeService` - Password recovery endpoints.
- `slotsService` - Slot creation, booking, and meeting lifecycle endpoints.

## Contribution Guidelines & License

### Contribution Guidelines

1. Fork the repository and create a descriptive feature branch: `git checkout -b feat/your-feature-name`.
2. Maintain consistent code formatting and follow the established design token conventions in `app/constants/design-tokens.ts`.
3. Verify TypeScript type correctness and run build checks prior to opening a pull request:

```bash
npm run lint
npm run build
```

4. Submit pull requests with conventional commit messages (e.g., `feat(auth): implement reset password`).

### License

This project is private software. All rights reserved.
