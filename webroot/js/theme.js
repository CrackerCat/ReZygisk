import { 
  light_icon,
  light_logs_icon,
  light_lang_icon,
  light_close_icon,
  light_expand_icon,
  light_module_icon,
  light_settings_icon,
  light_copy_icon
} from "./light.icon.js"
const rootCss = document.querySelector(':root')
const button = document.getElementById('theme_switcher')

/* INFO: Changes the icons to match the theme */
const module_list_icon = document.getElementById('modules_list_icon')
const module_expand = document.getElementById('module_expand_icon')
const settings_expand = document.getElementById('settings_expand_icon')
const settings_icon = document.getElementById('setting_icon')
const lang_switcher = document.getElementById('lang_switcher')
const logs_icon = document.getElementById('logs_icon')
const close_icons = document.getElementsByClassName('close_icon')
const copy_button = document.getElementById('errorh_copy')

let sys_theme = localStorage.getItem('/system/theme')
if (!sys_theme) sys_theme = setData('dark')

if (sys_theme === 'light') setLight()

button.addEventListener('click', () => {
  switch (sys_theme) {
    case 'dark': setLight(); break;
    case 'light': setDark(); break;
  }
})

function setDark() {
  rootCss.style.setProperty('--background', '#181c20')
  rootCss.style.setProperty('--font', '#ffffff')
  rootCss.style.setProperty('--desc', '#c9c9c9')
  rootCss.style.setProperty('--spliter', '#283136')
  rootCss.style.setProperty('--dim', '#1d2327')
  rootCss.style.setProperty('--icon', '#48565e')
  rootCss.style.setProperty('--icon-bc', '#313a3f')
  rootCss.style.setProperty('--button', 'var(--background)')

  sys_theme = setData('dark')

  for (const close_icon of close_icons) {
    close_icon.innerHTML = '<img src="assets/close.svg">'
  }

  settings_icon.innerHTML = '<img class="dimc" src="assets/settings.svg">'
  module_expand.innerHTML = '<img class="dimc" src="assets/expand.svg">'
  settings_expand.innerHTML = '<img class="dimc" src="assets/expand.svg">'
  button.innerHTML = '<img src="assets/dark.svg">'
  module_list_icon.innerHTML = '<img class="dimc" src="assets/module.svg">'
  lang_switcher.innerHTML = '<img src="assets/lang.svg">'
  logs_icon.innerHTML = '<img class="dimc" src="assets/error.svg">'
  copy_button.innerHTML = '<img src="assets/content.svg">'
}

function setLight() {
  rootCss.style.setProperty('--background', '#eff1f6')
  rootCss.style.setProperty('--font', '#181c20')
  rootCss.style.setProperty('--desc', '#484d53')
  rootCss.style.setProperty('--spliter', '#4f6069')
  rootCss.style.setProperty('--dim', '#e0e0e0')
  rootCss.style.setProperty('--icon', '#acacac')
  rootCss.style.setProperty('--icon-bc', '#c9c9c9')
  rootCss.style.setProperty('--button', '#b3b3b3')

  sys_theme = setData('light')

  for (const close_icon of close_icons) {
    close_icon.innerHTML = light_close_icon
  }

  settings_icon.innerHTML = light_settings_icon
  module_expand.innerHTML = light_expand_icon
  settings_expand.innerHTML = light_expand_icon
  button.innerHTML = light_icon
  module_list_icon.innerHTML = light_module_icon
  lang_switcher.innerHTML = light_lang_icon
  logs_icon.innerHTML = light_logs_icon
  copy_button.innerHTML = light_copy_icon
}

function setData(mode) {
  localStorage.setItem('/system/theme', mode)

  return localStorage.getItem('/system/theme')
}