# HelpDesk Pro Suite, Frontend

A modern frontend for a full stack help desk platform focused on ticket management, role based access, and a clean support workflow experience.

This application connects to an ASP.NET Core backend API and provides authentication, dashboard analytics, ticket creation, ticket listing, and user oriented views through a responsive interface.

## Features

- JWT based authentication
- Protected routes
- Dashboard with ticket overview
- Ticket listing and ticket creation
- Role aware UI
- User and profile views
- English and Spanish support
- Modern responsive layout
- Empty states, loading states, and toast feedback

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Query
- Axios
- React Router
- i18next

## Project Structure

```bash
src/
  app/
  components/
    layout/
    shared/
    ui/
  constants/
  content/
    en/
    es/
  features/
    auth/
    comments/
    dashboard/
    tickets/
    users/
  hooks/
  i18n/
  lib/
  mappers/
  services/
  types/