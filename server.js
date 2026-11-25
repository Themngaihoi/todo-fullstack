const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "tasks.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ---------- Storage helpers ----------
function loadTasks() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return [];
  }
}

function saveTasks(tasks) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// ---------- REST API (CRUD) ----------

// READ all
app.get("/api/tasks", (req, res) => {
  res.json(loadTasks());
});

// CREATE
app.post("/api/tasks", (req, res) => {
  const text = (req.body.text || "").trim();
  if (!text) return res.status(400).json({ error: "Task text is required" });

  const tasks = loadTasks();
  const task = { id: Date.now().toString(), text, done: false };
  tasks.push(task);
  saveTasks(tasks);
  res.status(201).json(task);
});

// UPDATE (text and/or done)
app.put("/api/tasks/:id", (req, res) => {
  const tasks = loadTasks();
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  if (req.body.text !== undefined) {
    const text = String(req.body.text).trim();
    if (!text) return res.status(400).json({ error: "Task text cannot be empty" });
    task.text = text;
  }
  if (req.body.done !== undefined) task.done = Boolean(req.body.done);

  saveTasks(tasks);
  res.json(task);
});

// DELETE
app.delete("/api/tasks/:id", (req, res) => {
  const tasks = loadTasks();
  const remaining = tasks.filter((t) => t.id !== req.params.id);
  if (remaining.length === tasks.length) {
    return res.status(404).json({ error: "Task not found" });
  }
  saveTasks(remaining);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
