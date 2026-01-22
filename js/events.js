import {
  getPrepByArea,
  movePrepToArea,
  deletePrepInArea,
  deleteArea,
  addArea
} from "./db.js";

const areaFlowModal = document.getElementById("areaFlowModal");
const areaFlowTitle = document.getElementById("areaFlowTitle");
const areaFlowBody = document.getElementById("areaFlowBody");
const backBtn = document.getElementById("areaFlowBack");
const cancelBtn = document.getElementById("areaFlowCancel");

let flowStack = [];
let currentArea = null;

function showFlow(title, bodyFn) {
  areaFlowTitle.textContent = title;
  areaFlowBody.innerHTML = "";
  bodyFn();
  areaFlowModal.hidden = false;
}

function pushFlow(step) {
  flowStack.push(step);
  step();
}

backBtn.onclick = () => {
  flowStack.pop();
  const prev = flowStack.pop();
  if (prev) pushFlow(prev);
  else areaFlowModal.hidden = true;
};

cancelBtn.onclick = () => {
  flowStack = [];
  areaFlowModal.hidden = true;
};

/* ENTRY POINT */
window.startDeleteAreaFlow = async (area) => {
  currentArea = area;
  flowStack = [];

  const prep = await getPrepByArea(area);

  pushFlow(() => {
    if (prep.length === 0) {
      showFlow(`Slette område "${area}"?`, () => {
        const btn = document.createElement("button");
        btn.textContent = "Slett område";
        btn.className = "danger";
        btn.onclick = async () => {
          await deleteArea(area);
          cancelBtn.onclick();
        };
        areaFlowBody.appendChild(btn);
      });
    } else {
      showFlow(`Område "${area}" har prep`, () => {
        const delAll = document.createElement("button");
        delAll.textContent = "Slett område og all prep";
        delAll.className = "danger";
        delAll.onclick = async () => {
          await deletePrepInArea(area);
          await deleteArea(area);
          cancelBtn.onclick();
        };

        const moveExisting = document.createElement("button");
        moveExisting.textContent = "Flytt til eksisterende område";
        moveExisting.onclick = () => pushFlow(moveToExisting);

        const moveNew = document.createElement("button");
        moveNew.textContent = "Flytt til nytt område";
        moveNew.onclick = () => pushFlow(moveToNew);

        areaFlowBody.append(delAll, moveExisting, moveNew);
      });
    }
  });
};

function moveToExisting() {
  showFlow("Velg nytt område", () => {
    const select = document.createElement("select");
    document.querySelectorAll("#category option").forEach(o => {
      if (o.value !== currentArea) select.appendChild(o.cloneNode(true));
    });

    const ok = document.createElement("button");
    ok.textContent = "Flytt";
    ok.onclick = async () => {
      await movePrepToArea(currentArea, select.value);
      await deleteArea(currentArea);
      cancelBtn.onclick();
    };

    areaFlowBody.append(select, ok);
  });
}

function moveToNew() {
  showFlow("Nytt område", () => {
    const input = document.createElement("input");
    input.placeholder = "Navn på område";

    const ok = document.createElement("button");
    ok.textContent = "Opprett og flytt";
    ok.onclick = async () => {
      await addArea(input.value.trim());
      await movePrepToArea(currentArea, input.value.trim());
      await deleteArea(currentArea);
      cancelBtn.onclick();
    };

    areaFlowBody.append(input, ok);
  });
}
