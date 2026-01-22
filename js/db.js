import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  getDocs,
  writeBatch,
  deleteDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* PREP */
export async function addPrepTask(data) {
  await addDoc(collection(db, "prepTasks"), {
    ...data,
    status: "active",
    createdAt: serverTimestamp(),
    completedAt: null
  });
}

export async function markDone(id) {
  await updateDoc(doc(db, "prepTasks", id), {
    status: "done",
    completedAt: serverTimestamp()
  });
}

export async function undoDone(id) {
  await updateDoc(doc(db, "prepTasks", id), {
    status: "active",
    completedAt: null
  });
}

export async function deletePrep(id) {
  await deleteDoc(doc(db, "prepTasks", id));
}

/* AREA HELPERS */
export async function getPrepByArea(area) {
  const snap = await getDocs(collection(db, "prepTasks"));
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(p => p.category === area);
}

export async function movePrepToArea(from, to) {
  const snap = await getDocs(collection(db, "prepTasks"));
  const batch = writeBatch(db);

  snap.forEach(d => {
    if (d.data().category === from) {
      batch.update(d.ref, { category: to });
    }
  });

  await batch.commit();
}

export async function deletePrepInArea(area) {
  const snap = await getDocs(collection(db, "prepTasks"));
  const batch = writeBatch(db);

  snap.forEach(d => {
    if (d.data().category === area) {
      batch.delete(d.ref);
    }
  });

  await batch.commit();
}

export async function deleteArea(area) {
  const ref = doc(db, "settings", "areas");
  const snap = await getDocs(collection(db, "settings"));

  const areasDoc = snap.docs.find(d => d.id === "areas");
  if (!areasDoc) return;

  const areas = areasDoc.data().areas.filter(a => a !== area);
  await setDoc(ref, { areas });
}

export async function addArea(name) {
  const ref = doc(db, "settings", "areas");
  const snap = await getDocs(collection(db, "settings"));

  const areasDoc = snap.docs.find(d => d.id === "areas");
  const areas = areasDoc ? areasDoc.data().areas : [];

  if (!areas.includes(name)) {
    await setDoc(ref, { areas: [...areas, name] });
  }
}
