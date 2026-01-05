// Unsigned Cloudinary upload helper (client-side)
export async function uploadToCloudinary(file, onProgress) {
  if (!file) throw new Error('No file provided')
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Missing Cloudinary config: set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env and restart the dev server')
  }

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`
  const form = new FormData()
  form.append('file', file)
  form.append('upload_preset', UPLOAD_PRESET)

  const xhr = new XMLHttpRequest()

  return new Promise((resolve, reject) => {
    xhr.open('POST', url)
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText)
          resolve(res)
        } catch (err) {
          reject(err)
        }
      } else {
        const body = xhr.responseText || ''
        reject(new Error(`Cloudinary upload failed: ${xhr.status} ${xhr.statusText} - ${body}`))
      }
    }
    xhr.onerror = () => reject(new Error('Network error during Cloudinary upload'))
    xhr.send(form)
  })
}
