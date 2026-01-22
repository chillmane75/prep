import { addTask, resetAllTasks } from "./db.js";

const modal = document.getElementById("addPrepModal");
const openBtn = document.getElementById("openAddForm");
const cancelBtn = document.getElementById("cancelAdd");
const form = document.getElementById("addPrepForm");
const toggleDoneBtn = document.getElementById("toggleDone");
const doneList = document.getElementById("doneList");
const resetBtn = document.getElementById("resetBtn");

openBtn.addEventListener("click", () => {
  modal.hidden = false;
});

cancelBtn.addEventListener("click", () => {
  modal.hidden = true;
});

form.addEventListener("submit", e => {
  e.preventDefault();

  addTask({
    title: title.value,
    category: category.value,
    priority: priority.value,
    comment: comment.value
  });

  form.reset();
  modal.hidden = true;
});

toggleDoneBtn.addEventListener("click", () => {
  doneList.hidden = !doneList.hidden;
});

resetBtn.addEventListener("click", async () => {
  const ok = confirm(
    "Er du HELT sikker?\n\nDette sletter ALL aktiv og ferdig prep for alle."
  );
  if (!ok) return;

  await resetAllTasks();
});
