import { addTask } from "./db.js";

const modal = document.getElementById("addPrepModal");

openAddForm.onclick = () => modal.hidden = false;
cancelAdd.onclick = () => modal.hidden = true;

addPrepForm.onsubmit = e => {
  e.preventDefault();

  addTask({
    title: title.value,
    category: category.value,
    priority: priority.value,
    comment: comment.value
  });

  addPrepForm.reset();
  modal.hidden = true;
};

toggleDone.onclick = () => {
  doneList.hidden = !doneList.hidden;
};
