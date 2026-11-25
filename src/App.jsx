import { useEffect, useMemo, useState } from "react";
import {
  Flower2, Plus, CheckCircle2, Circle, Trash2, Search,
  Sparkles, Flame, Zap, Target, Leaf, Trophy, X
} from "lucide-react";

const API = "https://little-wins-backend.onrender.com";

const cats = ["Study", "Personal", "Health", "Other"];
const priorities = ["Low", "Medium", "High"];

function plantFor(x) {
  return x >= 300
    ? ["🌸", "Blooming garden"]
    : x >= 150
    ? ["🌿", "Growing plant"]
    : x >= 50
    ? ["🌱", "Tiny sprout"]
    : ["🪴", "New seed"];
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    category: "Study",
    priority: "Medium",
    dueDate: ""
  });

  useEffect(() => {
    fetch(`${API}/api/tasks`)
      .then(r => {
        if (!r.ok) throw new Error("Failed");
        return r.json();
      })
      .then(setTasks)
      .catch(() => setError("Server not connected. Please refresh."));
  }, []);

  const done = tasks.filter(t => t.completed);
  const xp = done.length * 20;
  const plant = plantFor(xp);
  const progress = tasks.length
    ? Math.round(done.length / tasks.length * 100)
    : 0;

  const visible = useMemo(
    () =>
      tasks.filter(
        t =>
          (
            filter === "All" ||
            (filter === "Active" && !t.completed) ||
            (filter === "Completed" && t.completed) ||
            t.category === filter
          ) &&
          t.title.toLowerCase().includes(search.toLowerCase())
      ),
    [tasks, filter, search]
  );

  async function add(e) {
    e.preventDefault();

    try {
      const r = await fetch(`${API}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!r.ok) throw new Error("Failed to save");

      const t = await r.json();

      setTasks(a => [t, ...a]);
      setForm({
        title: "",
        category: "Study",
        priority: "Medium",
        dueDate: ""
      });
      setModal(false);
      setError("");
    } catch {
      setError("Task save nahi hua. Backend check karo.");
    }
  }

  async function toggle(t) {
    try {
      const r = await fetch(`${API}/api/tasks/${t.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !t.completed })
      });

      if (!r.ok) throw new Error();

      const u = await r.json();

      setTasks(a => a.map(x => x.id === t.id ? u : x));
      setError("");
    } catch {
      setError("Task update nahi hua.");
    }
  }

  async function remove(id) {
    try {
      const r = await fetch(`${API}/api/tasks/${id}`, {
        method: "DELETE"
      });

      if (!r.ok) throw new Error();

      setTasks(a => a.filter(t => t.id !== id));
      setError("");
    } catch {
      setError("Task delete nahi hua.");
    }
  }

  return (
    <div className="layout">
      <aside>
        <div className="brand">
          <span className="logo"><Flower2 /></span>
          <div>
            <b>little wins</b>
            <small>your happy space</small>
          </div>
        </div>

        <p className="sidehead">WORKSPACE</p>

        <button className="nav active" onClick={() => setFilter("All")}>
          ▦　 My tasks <span>{tasks.length - done.length}</span>
        </button>

        <button className="nav" onClick={() => setFilter("Completed")}>
          ✓　 Completed
        </button>

        <p className="sidehead">CATEGORIES</p>

        {cats.map((c, i) => (
          <button className="nav" key={c} onClick={() => setFilter(c)}>
            <i className={"dot d" + i} />　{c}
          </button>
        ))}

        <div className="quote">
          <Sparkles size={17} />
          <p>Small steps every day add up to big things.</p>
          <small>— keep going</small>
        </div>

        <div className="user">
          <span>L</span>
          <div>
            <b>Little achiever</b>
            <small>Growing every day ✨</small>
          </div>
        </div>
      </aside>

      <main>
        <header>
          <span>Workspace　/　<b>My tasks</b></span>
          <label>● Your personal growth space</label>
        </header>

        <section className="welcome">
          <div>
            <small className="eyebrow">
              <Sparkles size={14} /> A LITTLE PROGRESS IS STILL PROGRESS
            </small>
            <h1>Make today <em>count.</em></h1>
            <p>One task at a time. You're doing better than you think.</p>
          </div>

          <div className="date">
            <small>YOUR DAY</small>
            <b>{new Date().getDate()}</b>
            <span>
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                year: "numeric"
              })}
            </span>
          </div>
        </section>

        {error && (
          <div className="error">
            {error}
            <button onClick={() => setError("")}>×</button>
          </div>
        )}

        <section className="stats">
          <div className="stat pink">
            <Target />
            <small>TASKS COMPLETED</small>
            <strong>{done.length}<i> / {tasks.length}</i></strong>
            <span>You're making progress</span>
          </div>

          <div className="stat lilac">
            <Zap />
            <small>TOTAL XP EARNED</small>
            <strong>{xp}<i> XP</i></strong>
            <span>20 XP for every win</span>
          </div>

          <div className="stat peach">
            <Flame />
            <small>WINS TODAY</small>
            <strong>
              {
                done.filter(
                  t =>
                    t.completedAt?.slice(0, 10) ===
                    new Date().toISOString().slice(0, 10)
                ).length
              }
              <i> wins</i>
            </strong>
            <span>Celebrate each one</span>
          </div>
        </section>

        <section className="columns">
          <div className="panel tasks">
            <div className="panelhead">
              <div>
                <small className="eyebrow">YOUR CHECKLIST</small>
                <h2>
                  Today's tasks <small>{tasks.length - done.length} left</small>
                </h2>
              </div>

              <button className="add" onClick={() => setModal(true)}>
                <Plus size={17} /> Add a task
              </button>
            </div>

            <div className="progresslabel">
              <span>Daily progress</span>
              <b>{progress}%</b>
            </div>

            <div className="track">
              <i style={{ width: progress + "%" }} />
            </div>

            <div className="toolbar">
              <div>
                {["All", "Active", "Completed"].map(f => (
                  <button
                    key={f}
                    className={filter === f ? "chosen" : ""}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <label className="search">
                <Search size={15} />
                <input
                  placeholder="Search tasks"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </label>
            </div>

            <div className="list">
              {visible.length ? (
                visible.map(t => (
                  <div
                    className={"task " + (t.completed ? "finished" : "")}
                    key={t.id}
                  >
                    <button className="check" onClick={() => toggle(t)}>
                      {t.completed ? <CheckCircle2 /> : <Circle />}
                    </button>

                    <div className="tasktext">
                      <b>{t.title}</b>
                      <small>
                        <span>{t.category}</span>
                        <i className={"p" + t.priority}>
                          {t.priority} priority
                        </i>
                        {t.dueDate && "Due " + t.dueDate}
                      </small>
                    </div>

                    <button className="delete" onClick={() => remove(t.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="empty">
                  <div>🌷</div>
                  <b>No tasks here yet</b>
                  <span>Add a tiny task and make it happen.</span>
                </div>
              )}
            </div>

            <footer>
              ♡　Every little win counts.
              <span>{done.length} completed</span>
            </footer>
          </div>

          <div className="right">
            <div className="panel plant">
              <small className="eyebrow">YOUR GROWTH CORNER</small>
              <h2>Look how you grow</h2>

              <div className="scene">
                <span>{plant[0]}</span>
              </div>

              <b>{plant[1]}</b>
              <p>Complete tasks to help your plant bloom.</p>

              <div className="progresslabel">
                <span>Growth level</span>
                <b>{Math.min(4, Math.floor(xp / 75) + 1)} / 4</b>
              </div>

              <div className="track">
                <i style={{ width: Math.min(100, xp / 3) + "%" }} />
              </div>

              <small className="hint">
                <Leaf size={14} /> Every completed task earns 20 XP.
              </small>
            </div>

            <div className="panel reminder">
              <Trophy />
              <div>
                <b>Little reminder</b>
                <p>
                  You don't have to do it all today.
                  Just start with one thing.
                </p>
              </div>
            </div>

            <div className="panel momentum">
              <small className="eyebrow">YOUR MOMENTUM</small>
              <h3>Keep it going</h3>
              <strong>{progress}%</strong>
              <p>of your current tasks completed</p>
            </div>
          </div>
        </section>

        <div className="made">
          Made with care, one little win at a time ♡
        </div>
      </main>

      {modal && (
        <div
          className="overlay"
          onClick={e => e.target === e.currentTarget && setModal(false)}
        >
          <form className="modal" onSubmit={add}>
            <div className="modalhead">
              <div>
                <small className="eyebrow">A NEW LITTLE WIN</small>
                <h2>Add a task</h2>
              </div>
              <button type="button" onClick={() => setModal(false)}>
                <X />
              </button>
            </div>

            <label>
              What would you like to do?
              <input
                autoFocus
                required
                maxLength="90"
                placeholder="e.g. Finish my assignment"
                value={form.title}
                onChange={e =>
                  setForm({ ...form, title: e.target.value })
                }
              />
            </label>

            <div className="formrow">
              <label>
                Category
                <select
                  value={form.category}
                  onChange={e =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  {cats.map(c => <option key={c}>{c}</option>)}
                </select>
              </label>

              <label>
                Priority
                <select
                  value={form.priority}
                  onChange={e =>
                    setForm({ ...form, priority: e.target.value })
                  }
                >
                  {priorities.map(p => <option key={p}>{p}</option>)}
                </select>
              </label>
            </div>

            <label>
              Due date
              <input
                type="date"
                value={form.dueDate}
                onChange={e =>
                  setForm({ ...form, dueDate: e.target.value })
                }
              />
            </label>

            <div className="actions">
              <button
                type="button"
                className="cancel"
                onClick={() => setModal(false)}
              >
                Cancel
              </button>
              <button className="add">
                <Plus size={16} /> Save task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}