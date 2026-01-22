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

const q = query(collection(db, "prepTasks"), orderBy("createdAt"));

onSnapshot(q, (snap) => {
  activeList.innerHTML = "";
  doneList.innerHTML = "";

  snap.forEach(docSnap => {
    const task = docSnap.data();

    const el = document.createElement("div");
    el.className = `prep-item priority-${task.priority}`;

    el.innerHTML = `
      <div>
        <strong>${task.title}</strong>
        ${task.comment ? `<div class="comment">${task.comment}</div>` : ""}
        ${
          task.allergens?.length
            ? `<div class="allergens">Allergener: ${task.allergens.join(", ")}</div>`
            : ""
        }
      </div>
      <button class="done-btn">GJORT</button>
    `;

    el.querySelector(".done-btn").onclick = () => markDone(docSnap.id);

    (task.status === "active" ? activeList : doneList).appendChild(el);
  });
});
