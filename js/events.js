import { addPrepTask } from "./db.js";
import { db } from "./firebase.js";
import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ---------- ADD PREP ---------- */

const addPrepModal = document.getElementById("addPrepModal");
const addPrepForm = document.getElementById("addPrepForm");
const allergenDropdown = document.getElementById("allergenDropdown");

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

  const title = document.getElementById("title").value.trim();
  const category = document.getElementById("category").value;
  const priority = document.getElementById("priority").value;
  const comment = document.getElementById("comment").value.trim();

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

/* ---------- SETTINGS (ÅPNE / LUKK) ---------- */

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

/* ---------- OMRÅDER ---------- */

const areasRef = doc(db, "settings", "areas");
const areasList = document.getElementById("areasList");
const newAreaInput = document.getElementById("newArea");

async function renderAreas() {
  const snap = await getDoc(areasRef);
  const areas = snap.exists() ? snap.data().areas : [];

  areasList.innerHTML = "";

  areas.forEach(area => {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.justifyContent = "space-between";
    row.style.marginBottom = ".25rem";

    const name = document.createElement("span");
    name.textContent = area;

    const del = document.createElement("button");
    del.textContent = "✕";
    del.className = "danger";
    del.onclick = async () => {
      const updated = areas.filter(a => a !== area);
      await setDoc(areasRef, { areas: updated });
      renderAreas();
    };

    row.append(name, del);
    areasList.appendChild(row);
  });
}

document.getElementById("addAreaBtn").onclick = async () => {
  const value = newAreaInput.value.trim().toLowerCase();
  if (!value) return;

  const snap = await getDoc(areasRef);
  const areas = snap.exists() ? snap.data().areas : [];

  if (areas.includes(value)) return;

  await setDoc(areasRef, {
    areas: [...areas, value]
  });

  newAreaInput.value = "";
  renderAreas();
};

/* ---------- INIT ---------- */

renderAreas();
