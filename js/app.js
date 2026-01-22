(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyCVNXfmezAwYXPFzu7b_mBlUWCDNnVek_s",
    authDomain: "kitchen-prep.firebaseapp.com",
    projectId: "kitchen-prep",
    storageBucket: "kitchen-prep.firebasestorage.app",
    messagingSenderId: "986168499689",
    appId: "1:986168499689:web:8133e23a6012c957e87f78"
  };

  const appScript = document.createElement("script");
  appScript.src =
    "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js";
  appScript.onload = () => {
    const fsScript = document.createElement("script");
    fsScript.src =
      "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js";
    fsScript.onload = initApp;
    document.head.appendChild(fsScript);
  };
  document.head.appendChild(appScript);

  function initApp() {
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    let allTasks = [];
    let currentArea = null;
    let showDone = false;

    const activeList = document.getElementById("activeList");
    const doneList = document.getElementById("doneList");
    const areaTabs = document.getElementById("areaTabs");

    const addPrepModal = document.getElementById("addPrepModal");
    const addPrepForm = document.getElementById("addPrepForm");
    const allergenDropdown = document.getElementById("allergenDropdown");

    const settingsModal = document.getElementById("settingsModal");
    const mainContent = document.getElementById("mainContent");
    const areasList = document.getElementById("areasList");

    /* ---------- UI ---------- */

    document.getElementById("openAddForm").onclick = () => addPrepModal.hidden = false;
    document.getElementById("cancelAdd").onclick = () => {
      addPrepModal.hidden = true;
      addPrepForm.reset();
      allergenDropdown.hidden = true;
    };

    document.getElementById("toggleAllergens").onclick = () =>
      allergenDropdown.hidden = !allergenDropdown.hidden;

    document.getElementById("openSettings").onclick = () => {
      settingsModal.hidden = false;
      mainContent.hidden = true;
    };

    document.getElementById("closeSettings").onclick = () => {
      settingsModal.hidden = true;
      mainContent.hidden = false;
    };

    document.getElementById("toggleDone").onclick = () => {
      showDone = !showDone;
      doneList.hidden = !showDone;
    };

    document.getElementById("printBtn").onclick = () => window.print();

    /* ---------- ADD PREP ---------- */

    addPrepForm.onsubmit = async (e) => {
      e.preventDefault();

      const title = titleInput.value.trim();
      const category = categorySelect.value;
      const priority = prioritySelect.value;
      const comment = commentInput.value.trim();

      const allergens = Array.from(
        allergenDropdown.querySelectorAll("input:checked")
      ).map(c => c.value);

      await db.collection("prepTasks").add({
        title,
        category,
        priority,
        comment,
        allergens,
        status: "active",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        completedAt: null
      });

      addPrepForm.reset();
      allergenDropdown.hidden = true;
      addPrepModal.hidden = true;
    };

    /* ---------- RENDER PREP ---------- */

    function priorityWeight(p) {
      return p === "high" ? 1 : p === "normal" ? 2 : 3;
    }

    function render() {
      activeList.innerHTML = "";
      doneList.innerHTML = "";

      const visible = currentArea
        ? allTasks.filter(t => t.category === currentArea)
        : allTasks;

      const active = visible
        .filter(t => t.status === "active")
        .sort((a, b) => priorityWeight(a.priority) - priorityWeight(b.priority));

      const done = visible.filter(t => t.status === "done");

      active.forEach(t => renderTask(t, activeList));
      done.forEach(t => renderTask(t, doneList));
    }

    function renderTask(task, container) {
      const card = document.createElement("div");
      card.className = "prep-card";

      card.innerHTML = `
        <div class="prep-main">
          <div class="prep-title">${task.title}</div>
          ${task.comment ? `<div class="prep-comment">${task.comment}</div>` : ""}
        </div>
        <div class="prep-actions">
          <button class="done-btn">${task.status === "active" ? "GJORT" : "ANGRE"}</button>
        </div>
      `;

      card.querySelector("button").onclick = async () => {
        await db.collection("prepTasks").doc(task.id).update({
          status: task.status === "active" ? "done" : "active",
          completedAt:
            task.status === "active"
              ? firebase.firestore.FieldValue.serverTimestamp()
              : null
        });
      };

      container.appendChild(card);
    }

    /* ---------- SNAPSHOTS ---------- */

    db.collection("prepTasks").onSnapshot(snap => {
      allTasks = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      render();
    });

    const categorySelect = document.getElementById("category");
    const titleInput = document.getElementById("title");
    const prioritySelect = document.getElementById("priority");
    const commentInput = document.getElementById("comment");

    db.collection("settings").doc("areas").onSnapshot(doc => {
      const areas = doc.exists ? doc.data().areas : [];

      areaTabs.innerHTML = "";
      categorySelect.innerHTML = "";
      areasList.innerHTML = "";

      areas.forEach(a => {
        const tab = document.createElement("button");
        tab.textContent = a;
        tab.onclick = () => {
          currentArea = currentArea === a ? null : a;
          render();
        };
        areaTabs.appendChild(tab);

        const opt = document.createElement("option");
        opt.value = a;
        opt.textContent = a;
        categorySelect.appendChild(opt);

        const row = document.createElement("div");
        row.className = "settings-area-row";
        row.innerHTML = `
          <span>${a}</span>
          <button class="danger">Slett</button>
        `;

        row.querySelector("button").onclick = () => {
          if (!confirm(`Slette området "${a}"?`)) return;
          removeArea(a);
        };

        areasList.appendChild(row);
      });
    });

    async function removeArea(area) {
      const ref = db.collection("settings").doc("areas");
      const snap = await ref.get();
      const areas = snap.data().areas.filter(a => a !== area);
      await ref.set({ areas });
    }

    document.getElementById("addAreaBtn").onclick = async () => {
      const input = document.getElementById("newArea");
      const value = input.value.trim().toLowerCase();
      if (!value) return;

      const ref = db.collection("settings").doc("areas");
      const snap = await ref.get();
      const areas = snap.exists ? snap.data().areas : [];

      if (!areas.includes(value)) {
        await ref.set({ areas: [...areas, value] });
      }
      input.value = "";
    };

    document.getElementById("resetBtn").onclick = async () => {
      if (!confirm("Slette ALL prep og ALLE områder?")) return;

      const batch = db.batch();
      const prepSnap = await db.collection("prepTasks").get();
      prepSnap.forEach(d => batch.delete(d.ref));
      batch.delete(db.collection("settings").doc("areas"));
      await batch.commit();
    };
  }
})();
