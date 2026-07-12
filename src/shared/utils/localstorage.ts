/* eslint-disable @typescript-eslint/no-unused-vars */
const isServer = typeof window === "undefined"

const getLocalStorage = (key: string, fallback?: string) => {
  if (isServer) return undefined
  let item
  try {
    item = localStorage.getItem(key) || undefined
  } catch (e) {
    // Unsupported
  }
  return item || fallback
}

const setLocalStorage = (key: string, value: string) => {
  if (isServer) return
  try {
    localStorage.setItem(key, value)
  } catch (e) {
    // Unsupported
  }
}

const deleteLocalStorage = (key: string) => {
  if (isServer) return
  try {
    localStorage.removeItem(key)
  } catch (e) {
    // Unsupported
  }
}

export { getLocalStorage, setLocalStorage, deleteLocalStorage }
