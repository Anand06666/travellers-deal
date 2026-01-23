# Travel Experiences Marketplace

A production-ready travel marketplace built with the MERN stack (MongoDB, Express, React, Node.js), inspired by GetYourGuide.

## Features
- **User Roles**: Traveler, Vendor, Admin
- **Experiences**: Browse, Search, Book
- **Design System**: Custom theme based on "Travellers Deal" logo (Cyan, Amber, Green)
- **Tech Stack**:
    - Frontend: React (Vite), Tailwind CSS
    - Backend: Node.js, Express, MongoDB (Mongoose)

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (Running locally or Atlas URI)

### 1. Setup Backend
1. Go to `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure `.env`:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Secret for auth
   - `PORT`: 5000
4. Run server:
   ```bash
   npm run dev (or node server.js)
   ```

### 2. Setup Frontend
1. Go to `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173)

## Project Structure
- `/backend`: API Server
    - `/models`: DB Schemas (User, Experience, Booking)
    - `/routes`: API Endpoints
    - `/controllers`: Logic
- `/frontend`: React App
    - `/src/components`: Reusable UI (Header, Footer, Cards)
    - `/src/pages`: Views (Home, Listing, Detail)
