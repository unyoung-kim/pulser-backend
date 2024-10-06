# Pulser Backend

Backend server for Pulser, built with Express.js and TypeScript.

## Setup

### Prerequisites

- Node.js (version 14.x or later)
- npm (comes with Node.js)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

## Development

Run the server in development mode:

npm run dev


The server will start on `http://localhost:3000` by default.

## Production

1. Build the project:
   ```
   npm run build
   ```
2. Start the server:
   ```
   npm start
   ```

## Project Structure

- `src/index.ts`: Entry point
- `src/server.ts`: Express server setup
- `src/routes.ts`: API route definitions

## API Endpoints

- GET `/api/hello`: Returns a "Hello, World!" message

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Compile TypeScript to JavaScript
- `npm start`: Run the compiled JavaScript

## Environment Variables

- `PORT`: Server port (default: 3000)

## Notes for Developers

- Use TypeScript for type safety
- Follow existing code style and structure
- Create a new branch for yourself
- Submit pull requests for review before merging to main