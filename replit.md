# Tactical Equipment E-commerce Platform

## Overview

This is a modern full-stack e-commerce application specializing in tactical equipment and military gear. The application features a React frontend with a military-inspired design system and an Express.js backend with in-memory storage for development. The site uses award-winning design patterns inspired by sites like Lusion v3 and Igloo Inc, with a classified military interface aesthetic.

## User Preferences

```
Preferred communication style: Simple, everyday language.
```

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom military-themed color system
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **State Management**: 
  - Zustand for cart state management with persistence
  - TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion for smooth transitions and effects

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Express sessions with PostgreSQL store
- **Development**: Hot reload with Vite integration in development mode

### Design System
The application uses a military-tactical theme with custom CSS variables:
- **Primary Colors**: Night vision green (#00FF41), tactical tan, steel gray, ops black (#0A0A0A)
- **Typography**: Monospace fonts for technical/military aesthetic
- **Components**: HUD-style borders, glitch effects, terminal-inspired loading screens, scanline effects
- **Animations**: Framer Motion for smooth transitions, GSAP-style effects via CSS
- **Military Boot Screen**: Loading sequence with tactical system initialization and progress bars

## Key Components

### Database Schema
Located in `shared/schema.ts`:
- **Users**: Authentication and user management
- **Products**: Tactical equipment catalog with categories (PROTECTION, LOAD BEARING, OPTICS, TOOLS, FOOTWEAR)
- **Cart Items**: Shopping cart functionality with user association

### API Endpoints
- `GET /api/products` - Fetch all products or filter by category
- `GET /api/products/:id` - Get specific product details
- `GET /api/cart` - Retrieve user's cart items
- `POST /api/cart` - Add items to cart
- `PUT /api/cart/:id` - Update cart item quantities
- `DELETE /api/cart/:id` - Remove items from cart

### Frontend Pages
- **Home**: Hero section, featured products, category showcase
- **Products**: Product catalog with search, filtering, and sorting
- **Product Detail**: Individual product view with specifications
- **Cart**: Shopping cart management and checkout preparation

### Storage Layer
The application uses in-memory storage (`server/storage.ts`) for development with pre-loaded tactical equipment inventory including:
- Body armor and protective equipment
- Tactical footwear and gear
- Optics and surveillance equipment
- Tools and utility items
This provides fast development iteration and can be easily replaced with database operations.

## Data Flow

1. **Product Browsing**: Users browse products through category filters or search
2. **Cart Management**: Items are added to cart with real-time updates via TanStack Query
3. **State Synchronization**: Cart state is managed locally with Zustand and synchronized with the server
4. **Persistence**: Cart data persists across browser sessions

## External Dependencies

### Core Dependencies
- **Storage**: In-memory storage for development (can be upgraded to PostgreSQL)
- **Schema Validation**: Drizzle ORM with Zod validation for type safety
- **UI Library**: Comprehensive Radix UI component set with Shadcn/ui
- **State Management**: TanStack Query for server state, Zustand for cart persistence
- **Animation**: Framer Motion for enhanced user experience and military-themed transitions
- **Styling**: Tailwind CSS with custom military color system and HUD-style components

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **ESBuild**: Fast bundling for production builds
- **Vite Plugins**: Runtime error overlay and cartographer for Replit integration

## Deployment Strategy

### Build Process
- Frontend builds to `dist/public` via Vite
- Backend compiles to `dist/index.js` via ESBuild
- Shared schemas and types are accessible across both environments

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Development/production mode switching via `NODE_ENV`
- Replit-specific optimizations and integrations

### Path Aliases
Configured for clean imports:
- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`
- `@assets/*` → `attached_assets/*`

The application is designed to be easily deployable on Replit with in-memory storage for fast development and integrated development tools. Features a sophisticated military-themed UI with loading screens, glitch effects, and HUD-style interfaces inspired by award-winning design agencies.

## Recent Changes (July 2025)

✓ Replaced custom 3D models with professional tactical optic showcase using authentic military specifications
✓ Integrated authentic military color palette (Olive Drab #3C341F, Ranger Green #425439, Coyote Brown #81613C, FDE #C8A882, Wolf Gray #4A4E54)
✓ Added professional military typography fonts (Bebas Neue, Oswald, Share Tech Mono, Rajdhani)
✓ Implemented SWAT training video background for realistic military environment
✓ Created separate loading screen with embedded Sketchfab Holosun HS510C model (no rotation animation on iframe)
✓ Moved SWAT training video to hero section with professional styling and overlays
✓ Enhanced lighting system with multiple professional light sources for equipment visibility
✓ Updated military HUD interface for tactical optic status display
✓ Added professional picatinny rail mounting system with authentic details
✓ Implemented inspection mode with zoom functionality for equipment detail viewing