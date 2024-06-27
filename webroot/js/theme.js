const light_icon = `
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#2c2c2c">
    <path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z"/>
  </svg>
`
const light_module_icon = `
  <svg class="dimc" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#2c2c2c">
    <path d="M627-520h133v-160H627v160Zm-214 0h133v-160H413v160Zm-213 0h133v-160H200v160Zm0 240h133v-160H200v160Zm213 0h133v-160H413v160Zm214 0h133v-160H627v160Zm-507 0v-400q0-33 23.5-56.5T200-760h560q33 0 56.5 23.5T840-680v400q0 33-23.5 56.5T760-200H200q-33 0-56.5-23.5T120-280Z"/>
  </svg>
`
const light_expand_icon = `
  <svg class="dimc" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#2c2c2c">
    <path d="m480-340 180-180-57-56-123 123-123-123-57 56 180 180Zm0 260q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
  </svg>
`
const light_settings_icon = `
  <svg class="dimc" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#2c2c2c">
    <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/>
  </svg>
`
const rootCss = document.querySelector(':root')
const button = document.getElementById('theme-switcher')
// Icon have to change color
const module_list_icon = document.getElementById('modules_list_icon')
const expand_clicker = document.getElementById('expand_clicker_icon')
const settings_icon = document.getElementById('setting_icon')

let sys_theme = localStorage.getItem('system-theme')
if (!sys_theme) sys_theme = setData('dark')

if (sys_theme === 'light') setLight()

button.addEventListener('click', () => {
  switch (sys_theme) {
    case 'dark': setLight(); break;
    case 'light': setDark(); break;
  }
});

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
  settings_icon.innerHTML = '<img class="dimc" src="assets/settings.svg">'
  expand_clicker.innerHTML = '<img class="dimc" src="assets/expand.svg">'
  button.innerHTML = '<img src="assets/dark.svg">'
  module_list_icon.innerHTML = '<img class="dimc" src="assets/module.svg">'
  return
}

function setLight() {
  rootCss.style.setProperty('--background', '#eff1f6')
  rootCss.style.setProperty('--font', '#2c2c2c')
  rootCss.style.setProperty('--desc', '#444444')
  rootCss.style.setProperty('--spliter', '#4f6069')
  rootCss.style.setProperty('--dim', '#e0e0e0')
  rootCss.style.setProperty('--icon', '#acacac')
  rootCss.style.setProperty('--icon-bc', '#c9c9c9')
  rootCss.style.setProperty('--button', '#b3b3b3')
  sys_theme = setData('light')
  settings_icon.innerHTML = light_settings_icon
  expand_clicker.innerHTML = light_expand_icon
  button.innerHTML = light_icon
  module_list_icon.innerHTML = light_module_icon
  return
}

function setData(mode) {
  localStorage.setItem('system-theme', mode)
  return localStorage.getItem('system-theme')
}