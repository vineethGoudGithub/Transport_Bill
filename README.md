# Full Stack Transport Billing Application

A production-level transport billing management system with a Spring Boot backend and a React + Vite frontend.

## Features
- Create, view, update, and search transport bills
- Auto-calculate final amounts based on weight and charges
- Export pixel-perfect invoices to PDF
- Premium UI with glassmorphism design
- PostgreSQL database integration

## Prerequisites
- Java 17+
- Node.js 18+
- Docker & Docker Compose (Optional for containerized deployment)

## Setup Instructions

### 1. Backend (Spring Boot)
1. Navigate to the `backend` directory.
2. Build the application using Maven:
   ```bash
   mvn clean install
   ```
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
4. Swagger UI will be available at: `http://localhost:8080/swagger-ui.html`

### 2. Frontend (React + Vite)
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access the frontend at: `http://localhost:5173`

### 3. Docker Deployment
To run the entire stack using Docker Compose:
```bash
docker-compose up --build -d
```
- Frontend will be accessible on port `3000`
- Backend API will be accessible on port `8080`

### 4. Vercel Deployment (Frontend)
The frontend contains a `vercel.json` file. You can link your GitHub repository to Vercel and it will automatically deploy using Vite's build settings.
