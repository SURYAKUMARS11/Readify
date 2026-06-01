# Readify

Readify is a book marketplace platform, featuring a Node.js/Express backend and a React (Vite) frontend.

## Project Structure

```
Readify/
├── Readify-back/     # Node.js + Express Backend
└── Readify-front/    # React + Vite Frontend
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm
- MongoDB (Database)

## Setup & Running

### 1. Backend

1. Navigate to the backend directory:
   ```bash
   cd Readify/Readify-back/nodeapp
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on your database configuration:
   ```env
   PORT=8080
   DB_URL=your_mongodb_connection_string
   SECRET_KEY=your_secret_key
   ```
4. Start the server:
   ```bash
   npm start
   # OR for development with auto-reload:
   npm run dev
   ```

### 2. Frontend

1. Navigate to the frontend directory:
   ```bash
   cd Readify/Readify-front
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```env
   REACT_APP_API_URL=http://localhost:8080/api
   BASE_URL=http://localhost:8080
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment Guidelines

### Backend (Render)
- **Root Directory:** `Readify/Readify-back/nodeapp`
- **Build Command:** `npm install`
- **Start Command:** `node index.js`
- **Environment Variables:** Set `DB_URL`, `SECRET_KEY`, and `PORT`.

### Frontend (Vercel)
- **Root Directory:** `Readify/Readify-front`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variables:** Set `REACT_APP_API_URL` to your production backend API URL.
