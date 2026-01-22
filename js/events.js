import { addPrepTask } from "./db.js";

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
