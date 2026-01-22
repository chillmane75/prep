import { addPrepTask } from "./db.js";

const addPrepModal = document.getElementById("addPrepModal");
const addPrepForm = document.getElementById("addPrepForm");

document.getElementById("openAddForm").onclick = () => {
  addPrepModal.hidden = false;
};

document.getElementById("cancelAdd").onclick = () => {
  addPrepModal.hidden = true;
  addPrepForm.reset();
};

document.getElementById("toggleAllergens").onclick = () => {
  const box = document.getElementById("allergenDropdown");
  box.hidden = !box.hidden;
};

addPrepForm.onsubmit = async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const category = document.getElementById("category").value;
  const priority = document.getElementById("priority").value;
  const comment = document.getElementById("comment").value.trim();

  const allergens = Array.from(
    document.querySelectorAll("#allergenDropdown input:checked")
  ).map(cb => cb.value);

  await addPrepTask({
    title,
    category,
    priority,
    comment,
    allergens
  });

  addPrepForm.reset();
  document.getElementById("allergenDropdown").hidden = true;
  addPrepModal.hidden = true;
};
