import { db } from "./firebase.js";
import { markDone, undoDone, deletePrep } from "./db.js";
import {
  collection,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const activeList = document.getElementById("activeList");
const doneList = document.getElementById("doneList");
const toggleDoneBtn = document.getElementById("toggleDone");

let showDone = false;
let allTasks = [];

toggleDoneBtn.onclick = () => {
  showDone = !showDone;
  doneList.hidden = !showDone;
};

function render() {
  activeList.innerHTML = "";
  doneList.innerHTML = "";

  allTasks.forEach(task => {
    const el = document.createElement("div");
    el.className = `prep-item priority-${task.priority}`;

    el.innerHTML = `
      <div>
        <strong>${task.title}</strong>
        ${task.comment ? `<div class="comment">${task.comment}</div>` : ""}
        ${task.allergens?.length ? `<div class="allergens">Allergener: ${task.allergens.join(", ")}</div>` : ""}
      </div>

      <div style="display:flex; gap:.25rem">
        ${
          task.status === "active"
            ? `<button class="done-btn">GJORT</button>`
            : `<button class="secondary">ANGRE</button>`
        }
        <button class="danger">SLETT</button>
      </div>
    `;

    if (task.status === "active") {
      el.querySelector(".done-btn").onclick = () => markDone(task.id);
      el.querySelector(".danger").onclick = () => {
        if (confirm("Slette denne prep-oppgaven?")) {
          deletePrep(task.id);
        }
      };
      activeList.appendChild(el);
    } else {
      el.querySelector(".secondary").onclick = () => undoDone(task.id);
      el.querySelector(".danger").onclick = () => {
        if (confirm("Slette denne prep-oppgaven?")) {
          deletePrep(task.id);
        }
      };
      doneList.appendChild(el);
    }
  });
}

const q = query(collection(db, "prepTasks"), orderBy("createdAt"));

onSnapshot(q, snap => {
  allTasks = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  render();
});
