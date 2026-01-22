import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp
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
