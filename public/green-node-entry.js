(() => {
  const unlockKey = 'xethkioz.greenNodeUnlocked'
  const destination = '/green-node?from=argenciencia-wisp'

  try {
    window.sessionStorage.setItem(unlockKey, String(Date.now()))
  } catch {
    // The Green Node will fall back to the public XETHKIOZ home if storage is unavailable.
  }

  window.location.replace(destination)
})()
