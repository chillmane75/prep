import { addTask, getAreas, saveAreas, resetAllTasks } from "./db.js";

const addModal = document.getElementById("addPrepModal");
const settingsModal = document.getElementById("settingsModal");

const categorySelect = document.getElementById("category");

/* LOAD AREAS INTO SELECT */
getAreas().then(areas => {
  categorySelect.innerHTML = "";
  areas.forEach(a => {
    const opt = document.createElement("option");
    opt.value = a;
    opt.textContent = a;
    categorySelect.appendChild(opt);
  });
});

/* ADD PREP */
openAddForm.onclick = () => addModal.hidden = false;
cancelAdd.onclick = () => addModal.hidden = true;

addPrepForm.onsubmit = e => {
  e.preventDefault();
  addTask({
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
  renderAreas();
};

closeSettings.onclick = () => settingsModal.hidden = true;

async function renderAreas() {
  const areas = await getAreas();
  areasList.innerHTML = "";
  areas.forEach(a => {
    const div = document.createElement("div");
    div.textContent = a;
    areasList.appendChild(div);
  });
}

addAreaBtn.onclick = async () => {
  if (!newArea.value.trim()) return;
  const areas = await getAreas();
  areas.push(newArea.value.trim());
  await saveAreas(areas);
  newArea.value = "";
  renderAreas();
};

/* RESET */
resetBtn.onclick = async () => {
  if (!confirm("Er du HELT sikker? Dette sletter ALT.")) return;
  await resetAllTasks();
};

/* DONE TOGGLE */
toggleDone.onclick = () => {
  doneList.hidden = !doneList.hidden;
};
