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
const rootCss = document.querySelector(':root')
const button = document.getElementById('theme-switcher')
const module_list_icon = document.getElementById('modules_list_icon')
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
  sys_theme = setData('dark')
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
  sys_theme = setData('light')
  button.innerHTML = light_icon
  module_list_icon.innerHTML = light_module_icon
  return
}

function setData(mode) {
  localStorage.setItem('system-theme', mode)
  return localStorage.getItem('system-theme')
}