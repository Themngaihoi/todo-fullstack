const API = "/api/tasks";

let tasks = [];
let editingId = null;

// ---------- API calls ----------
async function loadTasks() {
  try {
    const res = await fetch(API);
    tasks = await res.json();
  } catch (err) {
    console.error("Could not load tasks:", err);
    tasks = [];
  }
  renderTasks();
}

async function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();
  if (text === "") return;

  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  if (res.ok) {
    tasks.push(await res.json());
    input.value = "";
    renderTasks();
  }
}

async function updateTask(id, newText) {
  newText = newText.trim();
  if (newText === "") return;

  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: newText })
  });

  if (res.ok) {
    const updated = await res.json();
    tasks = tasks.map((t) => (t.id === id ? updated : t));
    editingId = null;
    renderTasks();
  }
}

async function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ done: !task.done })
  });

  if (res.ok) {
    const updated = await res.json();
    tasks = tasks.map((t) => (t.id === id ? updated : t));
    renderTasks();
  }
}

async function deleteTask(id) {
  const res = await fetch(`${API}/${id}`, { method: "DELETE" });

  if (res.ok) {
    tasks = tasks.filter((t) => t.id !== id);
    if (editingId === id) editingId = null;
    renderTasks();
  }
}

// ---------- UI ----------
function startEdit(id) {
  editingId = id;
  renderTasks();
}

function cancelEdit() {
  editingId = null;
  renderTasks();
}

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  if (tasks.length === 0) {
    list.innerHTML = "<li>No tasks yet.</li>";
    return;
  }

  tasks.forEach((task) => {
    const li = document.createElement("li");

    if (editingId === task.id) {
      const editInput = document.createElement("input");
      editInput.type = "text";
      editInput.value = task.text;

      const saveBtn = document.createElement("button");
      saveBtn.innerText = "Save";
      saveBtn.onclick = () => updateTask(task.id, editInput.value);

      const cancelBtn = document.createElement("button");
      cancelBtn.innerText = "Cancel";
      cancelBtn.onclick = cancelEdit;

      editInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") updateTask(task.id, editInput.value);
        if (e.key === "Escape") cancelEdit();
      });

      li.appendChild(editInput);
      li.appendChild(saveBtn);
      li.appendChild(cancelBtn);
      list.appendChild(li);
      editInput.focus();
    } else {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      checkbox.onchange = () => toggleTask(task.id);

      const span = document.createElement("span");
      span.innerText = " " + task.text + " ";
      if (task.done) span.style.textDecoration = "line-through";

      const editBtn = document.createElement("button");
      editBtn.innerText = "Edit";
      editBtn.onclick = () => startEdit(task.id);

      const deleteBtn = document.createElement("button");
      deleteBtn.innerText = "Delete";
      deleteBtn.onclick = () => deleteTask(task.id);

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(editBtn);
      li.appendChild(deleteBtn);
      list.appendChild(li);
    }
  });
}

document.getElementById("taskInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

loadTasks();
