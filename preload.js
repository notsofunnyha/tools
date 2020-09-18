// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  console.log(
    ['electron', 'node', 'chrome'].map((m) => `${m}-version: ${process.versions[m]}`).join(', '),
  )
})
