import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  getDocs,
  writeBatch
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

export async function resetAllPrep() {
  const snap = await getDocs(collection(db, "prepTasks"));
  const batch = writeBatch(db);

  snap.forEach(d => {
    batch.delete(d.ref);
  });

  await batch.commit();
}
