const button = document.getElementById('action_header')
const icon = document.getElementById('action_expand_icon')
const card = document.getElementById('rezygisk_action')

let sys_module_mode = localStorage.getItem('/cache/list/action/state')
sys_module_mode = setData('closed')

button.addEventListener('click', () => {
  if (sys_module_mode === 'closed') {
    sys_module_mode = setData('opened')
    icon.style.transform = 'rotate(180deg)'
    card.style.maxHeight = `${card.scrollHeight}px`

    return;
  }

  sys_module_mode = setData('closed')
  icon.style.transform = 'rotate(0deg)'
  card.style.maxHeight = null
})

function setData(mode) {
  localStorage.setItem('/cache/list/action/state', mode)

  return localStorage.getItem('/cache/list/action/state')
}