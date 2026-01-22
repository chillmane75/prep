import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const col = collection(db, "prepTasks");

export function listenTasks(cb) {
  onSnapshot(col, snap => {
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() })));
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
