import { listenTasks, markDone, undoTask } from "./db.js";

const activeList = document.getElementById("activeList");
const doneList = document.getElementById("doneList");

listenTasks(tasks => {
  activeList.innerHTML = "";
  doneList.innerHTML = "";

  tasks
    .sort((a, b) => a.priority === "high" ? -1 : 1)
    .forEach(t => {
      const el = document.createElement("div");
      el.className = "task " + t.priority;
      el.innerHTML = `
        <strong>${t.title}</strong>
        <small>${t.category}</small>
        <p>${t.comment || ""}</p>
      `;

      if (t.status === "active") {
        const btn = document.createElement("button");
        btn.textContent = "GJORT";
        btn.onclick = () => markDone(t.id);
        el.appendChild(btn);
        activeList.appendChild(el);
      } else {
        const btn = document.createElement("button");
        btn.textContent = "Angre";
        btn.onclick = () => undoTask(t.id);
        el.appendChild(btn);
        doneList.appendChild(el);
      }
    });
});
