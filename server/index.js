import express from "express";
import cors from "cors";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

const dir = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(dir, "data", "tasks.json");
const app = express();

app.use(express.json());
app.use(cors());

async function read() {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, "[]");
    return [];
  }
}

async function save(x) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(x, null, 2));
}

app.get("/api/health", (_, r) => {
  r.json({ status: "ok" });
});

app.get("/api/tasks", async (_, r) => {
  r.json(await read());
});

app.post("/api/tasks", async (q, r) => {
  if (!q.body.title?.trim()) {
    return r.status(400).json({ message: "Title required" });
  }

  const a = await read();

  const t = {
    id: randomUUID(),
    title: q.body.title.trim(),
    category: q.body.category || "Study",
    priority: q.body.priority || "Medium",
    dueDate: q.body.dueDate || "",
    completed: false,
    createdAt: new Date().toISOString(),
    completedAt: null
  };

  a.unshift(t);
  await save(a);

  r.status(201).json(t);
});

app.patch("/api/tasks/:id", async (q, r) => {
  const a = await read();
  const i = a.findIndex(t => t.id === q.params.id);

  if (i < 0) {
    return r.sendStatus(404);
  }

  a[i] = {
    ...a[i],
    ...q.body,
    completedAt:
      q.body.completed === true
        ? new Date().toISOString()
        : q.body.completed === false
        ? null
        : a[i].completedAt
  };

  await save(a);
  r.json(a[i]);
});

app.delete("/api/tasks/:id", async (q, r) => {
  const a = await read();
  const b = a.filter(t => t.id !== q.params.id);

  if (a.length === b.length) {
    return r.sendStatus(404);
  }

  await save(b);
  r.json({ success: true });
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Little Wins API started");
});