import { addTask } from "./db.js";

const modal = document.getElementById("addPrepModal");
const openBtn = document.getElementById("openAddForm");
const cancelBtn = document.getElementById("cancelAdd");
const form = document.getElementById("addPrepForm");
const toggleDoneBtn = document.getElementById("toggleDone");
const doneList = document.getElementById("doneList");

openBtn.addEventListener("click", () => {
  modal.hidden = false;
});

cancelBtn.addEventListener("click", () => {
  modal.hidden = true;
});

form.addEventListener("submit", e => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const priority = document.getElementById("priority").value;
  const comment = document.getElementById("comment").value;

  addTask({ title, category, priority, comment });

  form.reset();
  modal.hidden = true;
});

toggleDoneBtn.addEventListener("click", () => {
  doneList.hidden = !doneList.hidden;
});
