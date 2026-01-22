import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  getDocs,
  writeBatch,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ---------- PREP ---------- */

export async function addPrepTask(data) {
  await addDoc(collection(db, "prepTasks"), {
    title: data.title,
    category: data.category,
    priority: data.priority,
    comment: data.comment || "",
    allergens: data.allergens || [],
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

/* ---------- HARD RESET ---------- */

export async function resetEverything() {
  const batch = writeBatch(db);

  const prepSnap = await getDocs(collection(db, "prepTasks"));
  prepSnap.forEach(d => batch.delete(d.ref));

  const settingsSnap = await getDocs(collection(db, "settings"));
  settingsSnap.forEach(d => batch.delete(d.ref));

  await batch.commit();
}
