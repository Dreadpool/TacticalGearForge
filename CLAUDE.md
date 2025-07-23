# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development Workflow
```bash
# Start development server with hot reload
npm run dev

# Build for production (frontend + backend)
npm run build

# Run production server
npm start

# TypeScript type checking
npm run check

# Database schema updates
npm run db:push
```

### Development Server Details
- Frontend dev server runs on Vite with React hot reload
- Backend runs on Express.js with tsx for TypeScript execution
- Both services start together with `npm run dev`
- API endpoints are prefixed with `/api`

## Architecture Overview

### Project Structure
- **Monorepo**: Client (React) + Server (Express) + Shared schemas
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Shadcn/ui
- **Backend**: Express.js + TypeScript + Drizzle ORM
- **Database**: PostgreSQL with Drizzle ORM (configured via `DATABASE_URL`)
- **State Management**: Zustand (cart) + TanStack Query (server state)
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with custom military theme

### Path Aliases (configured in vite.config.ts)
- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`
- `@assets/*` → `attached_assets/*`

### Database Schema (shared/schema.ts)
- **users**: Authentication with username/password
- **products**: Tactical equipment catalog with categories
- **cartItems**: Shopping cart with user association
- Uses Drizzle ORM with Zod validation schemas

### Theme System
The application uses an authentic military/tactical theme with:
- **Colors**: Ops Black, Night Vision Green, Ranger Green, Coyote Brown, FDE, Wolf Gray
- **Fonts**: Bebas Neue, Oswald, Share Tech Mono, Rajdhani
- **UI Style**: HUD interfaces, glitch effects, terminal aesthetics

## Key Directories

### Frontend Structure (client/src/)
- **components/**: Reusable UI components including military-themed elements
- **components/ui/**: Shadcn/ui component library
- **components/three/**: Three.js 3D components for product showcase
- **pages/**: Route components (home, products, cart, product-detail)
- **hooks/**: Custom React hooks (cart, mobile detection, smooth scroll)
- **lib/**: Utilities, cart store (Zustand), query client

### Backend Structure (server/)
- **index.ts**: Express app setup with middleware and logging
- **routes.ts**: API endpoints for products and cart management
- **storage.ts**: In-memory data storage with tactical equipment inventory
- **vite.ts**: Vite integration for development/production

### API Endpoints
- `GET /api/products` - Product catalog with optional category filtering
- `GET /api/products/:id` - Individual product details
- `GET /api/cart` - User cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove cart item

## Build System

### Production Build Process
1. Vite builds frontend to `dist/public/`
2. ESBuild compiles server to `dist/index.js`
3. Static files served from `dist/public/`

### Development Features
- Hot reload for both frontend and backend changes
- Runtime error overlay (Replit plugin)
- TypeScript strict mode enabled
- Automatic path resolution with aliases

## Testing & Quality

### Type Safety
- Full TypeScript coverage across frontend and backend
- Shared Zod schemas ensure API contract consistency
- Drizzle provides type-safe database operations

### Development Tools
- ESLint and TypeScript checking via `npm run check`
- Vite dev server with fast refresh
- Express logging middleware for API request monitoring

## Deployment Notes

- **Environment**: Supports NODE_ENV=development/production
- **Database**: Requires DATABASE_URL for PostgreSQL connection
- **Assets**: Static assets in `attached_assets/` for product media
- **PWA**: Service worker and manifest configured for app-like experience
- **Replit**: Cartographer plugin for cloud development environment

## Key Features

### Military/Tactical Theme
- Professional military-grade UI design
- HUD-style interfaces and terminal loading screens
- Authentic color palette and military typography
- Glitch effects and tactical animations

### E-commerce Functionality
- Product catalog with advanced filtering
- Shopping cart with persistent state (localStorage)
- Product categories: PROTECTION, LOAD_BEARING, OPTICS, TOOLS, FOOTWEAR
- 3D product showcase using Three.js

### Performance Optimizations
- Code splitting with React.lazy
- Intersection observer for lazy loading
- Skeleton loaders for better UX
- Lenis smooth scrolling integration