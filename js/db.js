import { db } from "./firebase.js";
import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  getDocs, getDoc, setDoc, onSnapshot, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const tasksCol = collection(db, "prepTasks");
const areasDoc = doc(db, "settings", "areas");

/* TASKS */
export function listenTasks(cb) {
  onSnapshot(tasksCol, snap => {
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

export function addTask(data) {
  return addDoc(tasksCol, {
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
  const snap = await getDocs(tasksCol);
  await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
}

/* AREAS */
export async function getAreas() {
  const snap = await getDoc(areasDoc);
  if (!snap.exists()) {
    const defaults = ["grill", "kald", "dessert", "servering"];
    await setDoc(areasDoc, { areas: defaults });
    return defaults;
  }
  return snap.data().areas;
}

export function saveAreas(areas) {
  return setDoc(areasDoc, { areas });
}
