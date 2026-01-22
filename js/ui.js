import { db } from "./firebase.js";
import { markDone } from "./db.js";
import {
  collection,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const activeList = document.getElementById("activeList");
const doneList = document.getElementById("doneList");
const toggleDoneBtn = document.getElementById("toggleDone");
const areaTabs = document.getElementById("areaTabs");

let showDone = false;
let currentArea = null;
let allTasks = [];

toggleDoneBtn.onclick = () => {
  showDone = !showDone;
  doneList.hidden = !showDone;
};

function render() {
  activeList.innerHTML = "";
  doneList.innerHTML = "";

  const visible = currentArea
    ? allTasks.filter(t => t.category === currentArea)
    : allTasks;

  visible.forEach(({ id, ...task }) => {
    const el = document.createElement("div");
    el.className = `prep-item priority-${task.priority}`;

    el.innerHTML = `
      <div>
        <strong>${task.title}</strong>
        ${task.comment ? `<div class="comment">${task.comment}</div>` : ""}
        ${task.allergens?.length ? `<div class="allergens">Allergener: ${task.allergens.join(", ")}</div>` : ""}
      </div>
      <button class="done-btn">GJORT</button>
    `;

    el.querySelector(".done-btn").onclick = () => markDone(id);

    (task.status === "active" ? activeList : doneList).appendChild(el);
  });
}

const q = query(collection(db, "prepTasks"), orderBy("createdAt"));

onSnapshot(q, snap => {
  allTasks = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  render();
});

/* --------- OMRÅDE TABS --------- */

onSnapshot(collection(db, "settings"), snap => {
  const doc = snap.docs.find(d => d.id === "areas");
  if (!doc) return;

  const areas = doc.data().areas || [];
  areaTabs.innerHTML = "";

  areas.forEach(area => {
    const btn = document.createElement("button");
    btn.textContent = area;
    btn.onclick = () => {
      currentArea = currentArea === area ? null : area;
      render();
    };
    areaTabs.appendChild(btn);
  });
});
