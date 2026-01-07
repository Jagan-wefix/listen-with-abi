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

// Comments helpers for thoughts
import { collection as _collection, addDoc, getDocs, query as _query, orderBy as _orderBy, onSnapshot as _onSnapshot, serverTimestamp } from 'firebase/firestore';

export async function addCommentToThought(thoughtId, text) {
  const colRef = _collection(db, 'thoughts', thoughtId, 'comments');
  await addDoc(colRef, { text, createdAt: serverTimestamp() });
}

export async function fetchCommentsOnce(thoughtId) {
  const q = _query(_collection(db, 'thoughts', thoughtId, 'comments'), _orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export function subscribeComments(thoughtId, onChange) {
  const q = _query(_collection(db, 'thoughts', thoughtId, 'comments'), _orderBy('createdAt', 'desc'));
  return _onSnapshot(q, (snap) => {
    onChange(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

// Fetch the most recent thought (returns null if none)
import { query as __query, orderBy as __orderBy, limit as __limit } from 'firebase/firestore';
export async function fetchLatestThought() {
  const q = __query(_collection(db, 'thoughts'), __orderBy('createdAt', 'desc'), __limit(1));
  const snap = await getDocs(q);
  if (snap.docs.length === 0) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

// Fetch admin credentials from the TOKENS collection (returns object or null)
export async function getAdminCredentials() {
  try {
    // Try a well-known doc first
    const adminDoc = doc(db, 'TOKENS', 'admin');
    const snap = await getDoc(adminDoc);
    if (snap.exists()) return snap.data();

    // Fallback: search the TOKENS collection for a doc that contains admin fields
    const q = _query(_collection(db, 'TOKENS'));
    const colSnap = await getDocs(q);
    if (colSnap.docs.length > 0) {
      // prefer documents that include one of the expected admin keys
      for (const d of colSnap.docs) {
        const data = d.data();
        if (data && (data.VITE_ADMIN_ID || data.adminId || data.VITE_ADMIN_PASSWORD || data.adminPassword || data.VITE_ADMIN_PIN || data.adminPin)) {
          return data;
        }
      }
      // if none match criteria, return first as a last resort
      return colSnap.docs[0].data();
    }

    return null;
  } catch (err) {
    console.warn('Failed to fetch admin credentials from TOKENS:', err);
    return null;
  }
}