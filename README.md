# Project Name

A full-stack booking management system with React frontend and Node.js backend.

## Features

- Room booking system with calendar view
- Admin panel for room management
- User booking history
- Responsive UI with Tailwind CSS

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite 5 for build tool
- Tailwind CSS 3 for styling
- React Router 6 for routing
- React Query 5 for state management
- Date-fns for date handling

### Backend
- Express 5
- Sequelize 6 ORM
- MySQL database

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8+

### Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Set up database:
   - Create a MySQL database
   - Update database config in `config/config.json`
4. Run migrations:
```bash
npx sequelize-cli db:migrate
```
5. Seed demo data (optional):
```bash
npx sequelize-cli db:seed:all
```

### Running the App
- Frontend only:
```bash
npm run dev
```
- Backend only:
```bash
npm run api
```
- Both frontend and backend:
```bash
npm run dev:full
```

## Project Structure

```
project/
├── config/            # Configuration files
├── migrations/        # Database migrations
├── models/            # Sequelize models
├── seeders/           # Database seeders
├── src/               # Frontend source
│   ├── components/    # React components
│   ├── pages/         # Page components
│   ├── routes/        # API routes
│   ├── services/      # API services
│   └── ...            # Other frontend files
├── server.mjs         # Backend entry
└── ...                # Config files
```

## Available Scripts

- `npm run dev`: Start frontend dev server
- `npm run api`: Start backend server
- `npm run dev:full`: Start both frontend and backend
- `npm run build`: Build for production
- `npm run lint`: Run ESLint
- `npm run preview`: Preview production build

## License

MIT
