# TacticalGearForge

A military-themed e-commerce platform for tactical equipment, built with modern web technologies.

## Features

- 🎖️ Military-grade UI design with authentic tactical theme
- 🛒 Full e-commerce functionality with shopping cart
- 🎬 Immersive hero section with SWAT training video
- 📱 Fully responsive design
- ⚡ Lightning-fast performance with Vite
- 🎨 Tailwind CSS with custom military color palette

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Build Tool**: Vite
- **UI Components**: Shadcn/ui with Radix UI

## Quick Start with GitHub Codespaces

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Dreadpool/TacticalGearForge)

1. Click the button above or press `.` in this repository
2. Wait for the environment to set up (takes ~2 minutes)
3. The dev server will start automatically
4. Open the forwarded port to see the application

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run production server
npm start
```

## Project Structure

```
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared types and schemas
├── attached_assets/ # Media assets
└── dist/           # Production build
```

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `DATABASE_URL` - PostgreSQL connection string (optional)

## Deployment

The project includes configurations for:
- Railway (`railway.json`)
- Render (`render.yaml`)
- Replit (`.replit`)

## License

MIT