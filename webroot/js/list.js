const button = document.getElementById('expand_clicker')
const icon = document.getElementById('expand_clicker_icon')
const card = document.getElementById('module_card')

let sys_module_mode = localStorage.getItem('system-module-mode')
if (!sys_module_mode) sys_module_mode = setData('closed')

button.addEventListener("click", () => {
  if (sys_module_mode == "closed") {
    sys_module_mode = setData('opend')
    icon.style.transform = 'rotate(180deg)'
    card.style.maxHeight = `${card.scrollHeight}px`

    return;
  }

  sys_module_mode = setData('closed')
  icon.style.transform = 'rotate(0deg)'
  card.style.maxHeight = null
})

function setData(mode) {
  localStorage.setItem('system-module-mode', mode)
  return localStorage.getItem('system-module-mode')
}