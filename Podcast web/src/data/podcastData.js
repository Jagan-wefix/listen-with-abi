const cover = "https://res.cloudinary.com/dkyvctkhf/image/upload/v1761031385/listen_with_abi_cover_jryip1.jpg";
export const podcastLogo = "https://res.cloudinary.com/dkyvctkhf/image/upload/v1761031385/listen_with_abi_logo_wuozhi.png";

export const podcastInfo = {
  title: "Listen with Abi Podcast",
  description: "Let's talk about the Real stuff",
  host: "Abi Devpriya",
  email: "adidevpriya@gmail.com",
  instaID: "https://www.instagram.com/listen_with_abi_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
  cover: cover,
  thumbnail: cover,
};

import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { db, auth } from './firebase'
import { signInAnonymously } from 'firebase/auth'

/**
 * Fetch episodes from Firestore and normalize fields to match the UI expectations.
 * If Firestore returns a "missing or insufficient permissions" error and we're
 * running in development, attempt an anonymous sign-in and retry once.
 */
export async function fetchEpisodes() {
  async function doFetch() {
    const q = query(collection(db, 'episodes'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map((d) => {
      const data = d.data()
      return {
        id: d.id,
        title: data.title || '',
        description: data.description || '',
        date: data.pubDate || (data.createdAt ? data.createdAt.toDate().toISOString() : null),
        duration: data.duration || '',
        audioUrl: data.mp3Url || data.audioUrl || null,
        thumbnail: data.thumbnail || '',
        featured: data.featured || false,
      }
    })
  }

  try {
    return await doFetch()
  } catch (err) {
    const msg = (err && err.message) || String(err)
    console.error('Failed to fetch episodes from Firestore', err)

    // If permission issue, try anonymous sign-in once in development and retry
    if ((msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('insufficient')) && import.meta.env.MODE === 'development') {
      try {
        console.warn('Permission error detected — attempting anonymous sign-in and retrying fetch')
        await signInAnonymously(auth)
        return await doFetch()
      } catch (retryErr) {
        console.error('Retry after anonymous sign-in failed', retryErr)
        throw retryErr
      }
    }

    throw err
  }
}