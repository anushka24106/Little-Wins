# Little Wins
A pastel task manager with XP points and a virtual plant.

## Run
1. Install Node.js.
2. Open this folder in VS Code.
3. Open Terminal and run `npm install`.
4. Run `npm run dev`.
5. Open the Vite URL shown in terminal (usually http://localhost:5173).

## Stack
React + Vite, Express API, JSON-file persistence, Lucide icons.

## API
GET /api/health, GET /api/tasks, POST /api/tasks, PATCH /api/tasks/:id, DELETE /api/tasks/:id.

Data is stored locally in `server/data/tasks.json`. This starter has no login or multi-user database; add a hosted database and authentication before a public multi-user launch.
