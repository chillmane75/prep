import { addPrepTask, resetAllPrep } from "./db.js";
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

  const title = titleInput.value.trim();
  if (!title) return;

  const category = categorySelect.value;
  const priority = prioritySelect.value;
  const comment = commentInput.value.trim();

  const allergens = Array.from(
    allergenDropdown.querySelectorAll("input:checked")
  ).map(cb => cb.value);

  await addPrepTask({
    title,
    category,
    priority,
    comment,
    allergens
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

/* ---------- RESET ---------- */

document.getElementById("resetBtn").onclick = async () => {
  if (!confirm("Er du sikker?")) return;
  await resetAllPrep();
};

/* ---------- OMRÅDER ---------- */

const areasRef = doc(db, "settings", "areas");
const areasList = document.getElementById("areasList");
const newAreaInput = document.getElementById("newArea");

function renderAreas(areas) {
  areasList.innerHTML = "";
  categorySelect.innerHTML = "";

  areas.forEach(area => {
    const opt = document.createElement("option");
    opt.value = area;
    opt.textContent = area;
    categorySelect.appendChild(opt);

    const row = document.createElement("div");
    row.textContent = area;
    areasList.appendChild(row);
  });
}

onSnapshot(areasRef, snap => {
  if (!snap.exists()) return;
  renderAreas(snap.data().areas || []);
});

document.getElementById("addAreaBtn").onclick = async () => {
  const value = newAreaInput.value.trim().toLowerCase();
  if (!value) return;

  const snap = await getDoc(areasRef);
  const areas = snap.exists() ? snap.data().areas : [];

  if (!areas.includes(value)) {
    await setDoc(areasRef, { areas: [...areas, value] });
  }

  newAreaInput.value = "";
};
