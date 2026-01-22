/*********************************************************
 * FIREBASE (klassisk – ingen modules)
 *********************************************************/
(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyCVNXfmezAwYXPFzu7b_mBlUWCDNnVek_s",
    authDomain: "kitchen-prep.firebaseapp.com",
    projectId: "kitchen-prep",
    storageBucket: "kitchen-prep.firebasestorage.app",
    messagingSenderId: "986168499689",
    appId: "1:986168499689:web:8133e23a6012c957e87f78"
  };

  // Last Firebase SDK (compat)
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

    /*********************************************************
     * STATE
     *********************************************************/
    let allTasks = [];
    let currentArea = null;
    let showDone = false;

    /*********************************************************
     * ELEMENTER
     *********************************************************/
    const activeList = document.getElementById("activeList");
    const doneList = document.getElementById("doneList");
    const toggleDoneBtn = document.getElementById("toggleDone");
    const areaTabs = document.getElementById("areaTabs");

    const addPrepModal = document.getElementById("addPrepModal");
    const addPrepForm = document.getElementById("addPrepForm");
    const allergenDropdown = document.getElementById("allergenDropdown");

    const settingsModal = document.getElementById("settingsModal");
    const mainContent = document.getElementById("mainContent");

    /*********************************************************
     * UI HANDLERS
     *********************************************************/
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

    document.getElementById("openSettings").onclick = () => {
      settingsModal.hidden = false;
      mainContent.hidden = true;
    };

    document.getElementById("closeSettings").onclick = () => {
      settingsModal.hidden = true;
      mainContent.hidden = false;
    };

    toggleDoneBtn.onclick = () => {
      showDone = !showDone;
      doneList.hidden = !showDone;
    };

    document.getElementById("printBtn").onclick = () => window.print();

    /*********************************************************
     * ADD PREP
     *********************************************************/
    addPrepForm.onsubmit = async (e) => {
      e.preventDefault();

      const title = document.getElementById("title").value.trim();
      const category = document.getElementById("category").value;
      const priority = document.getElementById("priority").value;
      const comment = document.getElementById("comment").value.trim();

      const allergens = Array.from(
        allergenDropdown.querySelectorAll("input:checked")
      ).map((cb) => cb.value);

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

    /*********************************************************
     * RENDER PREP
     *********************************************************/
    function render() {
      activeList.innerHTML = "";
      doneList.innerHTML = "";

      const visible = currentArea
        ? allTasks.filter((t) => t.category === currentArea)
        : allTasks;

      visible.forEach((task) => {
        const el = document.createElement("div");
        el.className = "task-row";

        el.innerHTML = `
          <div>
            <strong>${task.title}</strong>
            ${task.comment ? `<div>${task.comment}</div>` : ""}
          </div>
          <button>${task.status === "active" ? "GJORT" : "ANGRE"}</button>
        `;

        el.querySelector("button").onclick = async () => {
          await db
            .collection("prepTasks")
            .doc(task.id)
            .update({
              status: task.status === "active" ? "done" : "active",
              completedAt:
                task.status === "active"
                  ? firebase.firestore.FieldValue.serverTimestamp()
                  : null
            });
        };

        (task.status === "active" ? activeList : doneList).appendChild(el);
      });
    }

    /*********************************************************
     * SNAPSHOT: PREP
     *********************************************************/
    db.collection("prepTasks")
      .orderBy("createdAt")
      .onSnapshot((snap) => {
        allTasks = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        render();
      });

    /*********************************************************
     * SNAPSHOT: OMRÅDER (TABS + DROPDOWN + INNSTILLINGER)
     *********************************************************/
    db.collection("settings")
      .doc("areas")
      .onSnapshot((doc) => {
        const areas = doc.exists ? doc.data().areas : [];

        // Tabs
        areaTabs.innerHTML = "";

        // Dropdown i add prep
        const categorySelect = document.getElementById("category");
        categorySelect.innerHTML = "";

        // Liste i innstillinger
        const areasList = document.getElementById("areasList");
        areasList.innerHTML = "";

        areas.forEach((a) => {
          /* TAB */
          const btn = document.createElement("button");
          btn.textContent = a;
          btn.onclick = () => {
            currentArea = currentArea === a ? null : a;
            render();
          };
          areaTabs.appendChild(btn);

          /* DROPDOWN */
          const opt = document.createElement("option");
          opt.value = a;
          opt.textContent = a;
          categorySelect.appendChild(opt);

          /* SETTINGS LIST */
          const row = document.createElement("div");
          row.textContent = a;
          areasList.appendChild(row);
        });
      });

    /*********************************************************
     * SETTINGS ACTIONS
     *********************************************************/
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
      prepSnap.forEach((d) => batch.delete(d.ref));

      batch.delete(db.collection("settings").doc("areas"));

      await batch.commit();
    };
  }
})();
