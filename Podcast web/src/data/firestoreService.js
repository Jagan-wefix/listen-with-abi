import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

// path: collection "meta" doc "podcastInfo"
const podcastDocRef = doc(db, "meta", "podcastInfo");

export async function savePodcastInfo(podcastInfo) {
  // overwrites doc
  await setDoc(podcastDocRef, podcastInfo, { merge: true });
  return true;
}

export async function fetchPodcastInfoOnce() {
  const snap = await getDoc(podcastDocRef);
  return snap.exists() ? snap.data() : null;
}

// real-time listener: onChange callback receives data or null
export function subscribePodcastInfo(onChange) {
  return onSnapshot(podcastDocRef, (snap) => {
    onChange(snap.exists() ? snap.data() : null);
  });
}