# Mosque Membership

Web application for managing mosque membership fees — member records, payment tracking (2015-2030), and printable membership cards.

## Tech Stack

- **Frontend:** React + TypeScript (Vite), Tailwind CSS, shadcn/ui
- **Backend:** Firebase (Firestore + Auth)

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
src/
  assets/       static assets (images, icons)
  components/
    ui/         shadcn/ui primitives
    layout/     shared layout components (nav, shell, etc.)
  contexts/     React context providers (e.g. auth)
  firebase/     Firebase config and data-access helpers
  hooks/        custom React hooks
  lib/          utility functions
  pages/        route-level page components
  types/        shared TypeScript types
```
