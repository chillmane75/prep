import { addPrepTask, resetEverything } from "./db.js";
import { db } from "./firebase.js";
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ---------- ELEMENTER ---------- */

const addPrepModal = document.getElementById("addPrepModal");
const addPrepForm = document.getElementById("addPrepForm");

const titleInput = document.getElementById("title");
const categorySelect = document.getElementById("category");
const prioritySelect = document.getElementById("priority");
const commentInput = document.getElementById("comment");
const allergenDropdown = document.getElementById("allergenDropdown");

/* ---------- ADD PREP ---------- */

document.getElementById("openAddForm").onclick = () => {
  addPrepModal.hidden = false;
};

document.getElementById("cancelAdd").onclick = () => {
  addPrepModal.hidden = true;
  addPrepForm.reset();
  allergenDropdown.hidden = true;
};

document.getElementById("toggleAllergens").onclick = () => {
  allergenDropdown.hidden = !allergenDropdown.hidden;
};

addPrepForm.onsubmit = async (e) => {
  e.preventDefault();

  await addPrepTask({
    title: titleInput.value.trim(),
    category: categorySelect.value,
    priority: prioritySelect.value,
    comment: commentInput.value.trim(),
    allergens: Array.from(
      allergenDropdown.querySelectorAll("input:checked")
    ).map(cb => cb.value)
  });

  addPrepForm.reset();
  allergenDropdown.hidden = true;
  addPrepModal.hidden = true;
};

/* ---------- SETTINGS ---------- */

const settingsModal = document.getElementById("settingsModal");
const mainContent = document.getElementById("mainContent");

document.getElementById("openSettings").onclick = () => {
  settingsModal.hidden = false;
  mainContent.hidden = true;
};

document.getElementById("closeSettings").onclick = () => {
  settingsModal.hidden = true;
  mainContent.hidden = false;
};

/* ---------- HARD RESET ---------- */

document.getElementById("resetBtn").onclick = async () => {
  if (!confirm("Dette sletter ALL prep og ALLE områder. Fortsette?")) return;
  await resetEverything();
};

/* ---------- OMRÅDER (kun lesing nå) ---------- */

const areasRef = doc(db, "settings", "areas");

onSnapshot(areasRef, snap => {
  if (!snap.exists()) return;
  const areas = snap.data().areas || [];
  categorySelect.innerHTML = "";
  areas.forEach(a => {
    const opt = document.createElement("option");
    opt.value = a;
    opt.textContent = a;
    categorySelect.appendChild(opt);
  });
});
