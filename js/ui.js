import { listenTasks, markDone, undoTask, getAreas } from "./db.js";

const activeList = document.getElementById("activeList");
const doneList = document.getElementById("doneList");
const areaTabs = document.getElementById("areaTabs");

let selectedArea = null;
let allTasks = [];

listenTasks(tasks => {
  allTasks = tasks;
  render();
});

async function render() {
  const areas = await getAreas();
  const active = allTasks.filter(t => t.status === "active");

  const counts = {};
  active.forEach(t => counts[t.category] = (counts[t.category] || 0) + 1);

  /* AREA TABS */
  areaTabs.innerHTML = "";
  Object.entries(counts).forEach(([area, count]) => {
    const btn = document.createElement("button");
    btn.textContent = `${area} (${count})`;
    btn.className = area === selectedArea ? "active" : "";
    btn.onclick = () => {
      selectedArea = area === selectedArea ? null : area;
      render();
    };
    areaTabs.appendChild(btn);
  });

  /* ACTIVE LIST */
  activeList.innerHTML = "";
  active
    .filter(t => !selectedArea || t.category === selectedArea)
    .forEach(t => {
      const el = document.createElement("div");
      el.className = `task ${t.priority}`;
      el.innerHTML = `<strong>${t.title}</strong>`;
      const btn = document.createElement("button");
      btn.textContent = "GJORT";
      btn.onclick = () => markDone(t.id);
      el.appendChild(btn);
      activeList.appendChild(el);
    });

  /* DONE LIST */
  doneList.innerHTML = "";
  allTasks.filter(t => t.status === "done").forEach(t => {
    const el = document.createElement("div");
    el.className = "task";
    el.textContent = t.title;
    const btn = document.createElement("button");
    btn.textContent = "Angre";
    btn.onclick = () => undoTask(t.id);
    el.appendChild(btn);
    doneList.appendChild(el);
  });
}
