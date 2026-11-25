# Full Stack To Do App

Frontend: HTML, CSS, JavaScript (in `public/`)
Backend: Node.js + Express (`server.js`), tasks saved in `data/tasks.json`

## Run

    npm install
    npm start

Open http://localhost:3000

## API

| Method | Endpoint         | Purpose                     |
|--------|------------------|-----------------------------|
| GET    | /api/tasks       | Get all tasks               |
| POST   | /api/tasks       | Create task `{ text }`      |
| PUT    | /api/tasks/:id   | Update `{ text?, done? }`   |
| DELETE | /api/tasks/:id   | Delete task                 |
