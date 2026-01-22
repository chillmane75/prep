import { listenTasks, markDone, undoTask } from "./db.js";

const activeList = document.getElementById("activeList");
const doneList = document.getElementById("doneList");

listenTasks(tasks => {
  activeList.innerHTML = "";
  doneList.innerHTML = "";

  tasks.forEach(t => {
    const el = document.createElement("div");
    el.className = `task ${t.priority}`;

    el.innerHTML = `
      <div class="task-header">
        <strong>${t.title}</strong>
        <span class="category">${t.category}</span>
      </div>
      ${t.comment ? `<p>${t.comment}</p>` : ""}
    `;

    const btn = document.createElement("button");

    if (t.status === "active") {
      btn.textContent = "GJORT";
      btn.className = "done-btn";
      btn.onclick = () => markDone(t.id);
      el.appendChild(btn);
      activeList.appendChild(el);
    } else {
      btn.textContent = "Angre";
      btn.className = "undo-btn";
      btn.onclick = () => undoTask(t.id);
      el.appendChild(btn);
      doneList.appendChild(el);
    }
  });
});
