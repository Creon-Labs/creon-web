/* eslint-disable @typescript-eslint/no-unused-vars */
const isServer = typeof window === "undefined"

const getLocalStorage = (key: string, fallback?: string) => {
  if (isServer) return undefined
  let theme
  try {
    theme = localStorage.getItem(key) || undefined
  } catch (e) {
    // Unsupported
  }
  return theme || fallback
}

const setLocalStorage = (key: string, value: string) => {
  if (isServer) return
  try {
    localStorage.setItem(key, value)
  } catch (e) {
    // Unsupported
  }
}

export { getLocalStorage, setLocalStorage }
