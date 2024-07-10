window.addEventListener('error', (e) => {
  console.log(e.stack)
  const previousError = localStorage.getItem('/system/error')
  localStorage.setItem('/system/error', previousError + `\n` + e.stack)
  document.getElementById('errorh_panel').innerHTML += e.stack
})

export function sendError(e) {
  console.log(e.stack)
  const previousError = localStorage.getItem('/system/error')
  localStorage.setItem('/system/error', previousError + `\n` + e.stack)
  document.getElementById('errorh_panel').innerHTML += e.stack
}