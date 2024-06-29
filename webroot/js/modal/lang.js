const button = document.getElementById('lang_switcher')
const target = document.getElementById('lang_modal')
const close_button = document.getElementById('lang_modal_close')

let sys_module_mode = localStorage.getItem('lang-modal')
sys_module_mode = setData('closed')

button.addEventListener('click', () => {
  target.style.display = 'block'

  sys_module_mode = setData('opened')
})

close_button.addEventListener('click', () => {
  target.style.display = 'none'

  sys_module_mode = setData('closed')
})

function setData(mode) {
  localStorage.setItem('lang-modal', mode)

  return localStorage.getItem('lang-modal')
}