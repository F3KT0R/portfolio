// localStorage can be missing or throw (private windows, blocked site data).
// Every read and write goes through here and degrades to "nothing stored".

export function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Storage unavailable: the visit simply is not remembered.
  }
}

export function removeStorage(key: string) {
  try {
    window.localStorage.removeItem(key)
  } catch {
    // Nothing to remove.
  }
}
