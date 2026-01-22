import {
  listenTasks,
  markDone,
  undoTask,
  getAreas
} from "./db.js";

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
  const active = allTasks.filter(t => t.status === "active");

  /* AREA TABS */
  areaTabs.innerHTML = "";
  const counts = {};
  active.forEach(t => counts[t.category] = (counts[t.category] || 0) + 1);

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

  /* ACTIVE */
  activeList.innerHTML = "";
  active
    .filter(t => !selectedArea || t.category === selectedArea)
    .forEach(t => {
      const row = document.createElement("div");
      row.className = `task-row ${t.priority}`;

      row.innerHTML = `
        <div class="task-info">
          <strong>${t.title}</strong>
          <span>${t.category}</span>
        </div>
      `;

      const btn = document.createElement("button");
      btn.textContent = "GJORT";
      btn.className = "done-btn";
      btn.onclick = () => markDone(t.id);

      row.appendChild(btn);
      activeList.appendChild(row);
    });

  /* DONE */
  doneList.innerHTML = "";
  allTasks.filter(t => t.status === "done").forEach(t => {
    const row = document.createElement("div");
    row.className = "task-row done";

    row.innerHTML = `<strong>${t.title}</strong>`;

    const btn = document.createElement("button");
    btn.textContent = "Angre";
    btn.onclick = () => undoTask(t.id);

    row.appendChild(btn);
    doneList.appendChild(row);
  });
}
