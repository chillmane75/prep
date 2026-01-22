import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const col = collection(db, "prepTasks");

export function listenTasks(callback) {
  onSnapshot(col, snap => {
    const tasks = snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
    callback(tasks);
  });
}

export function addTask(data) {
  return addDoc(col, {
    ...data,
    status: "active",
    createdAt: serverTimestamp(),
    completedAt: null
  });
}

export function markDone(id) {
  return updateDoc(doc(db, "prepTasks", id), {
    status: "done",
    completedAt: serverTimestamp()
  });
}

export function undoTask(id) {
  return updateDoc(doc(db, "prepTasks", id), {
    status: "active",
    completedAt: null
  });
}

export async function resetAllTasks() {
  const snap = await getDocs(col);
  await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
}
