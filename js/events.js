import {
  addTask,
  getAreas,
  saveAreas,
  resetAllTasks
} from "./db.js";

/* ELEMENTS */
const addModal = document.getElementById("addPrepModal");
const settingsModal = document.getElementById("settingsModal");
const mainContent = document.getElementById("mainContent");

const categorySelect = document.getElementById("category");
const areasList = document.getElementById("areasList");

/* LOAD AREAS INTO SELECT */
async function refreshAreaSelect() {
  const areas = await getAreas();
  categorySelect.innerHTML = "";
  areas.forEach(a => {
    const opt = document.createElement("option");
    opt.value = a;
    opt.textContent = a;
    categorySelect.appendChild(opt);
  });
}
refreshAreaSelect();

/* ADD PREP */
openAddForm.onclick = async () => {
  await refreshAreaSelect();
  addModal.hidden = false;
};

cancelAdd.onclick = () => {
  addModal.hidden = true;
};

addPrepForm.onsubmit = async e => {
  e.preventDefault();

  await addTask({
    title: title.value,
    category: category.value,
    priority: priority.value,
    comment: comment.value
  });

  addPrepForm.reset();
  addModal.hidden = true;
};

/* SETTINGS */
openSettings.onclick = async () => {
  settingsModal.hidden = false;
  mainContent.style.display = "none";
  renderAreas();
};

closeSettings.onclick = () => {
  settingsModal.hidden = true;
  mainContent.style.display = "";
};

/* RENDER AREAS + DELETE */
async function renderAreas() {
  const areas = await getAreas();
  areasList.innerHTML = "";

  areas.forEach(area => {
    const row = document.createElement("div");
    row.className = "area-row";

    const span = document.createElement("span");
    span.textContent = area;

    const del = document.createElement("button");
    del.textContent = "✕";
    del.className = "danger";
    del.onclick = async () => {
      if (!confirm(`Slette området "${area}"?`)) return;
      const updated = areas.filter(a => a !== area);
      await saveAreas(updated);
      renderAreas();
      refreshAreaSelect();
    };

    row.appendChild(span);
    row.appendChild(del);
    areasList.appendChild(row);
  });
}

/* ADD AREA */
addAreaBtn.onclick = async () => {
  if (!newArea.value.trim()) return;
  const areas = await getAreas();
  areas.push(newArea.value.trim());
  await saveAreas(areas);
  newArea.value = "";
  renderAreas();
  refreshAreaSelect();
};

/* RESET */
resetBtn.onclick = async () => {
  if (!confirm("Er du HELT sikker? Dette sletter ALL prep.")) return;
  await resetAllTasks();
};

/* PRINT */
printBtn.onclick = () => window.print();

/* DONE TOGGLE */
toggleDone.onclick = () => {
  doneList.hidden = !doneList.hidden;
};
