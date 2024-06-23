(() => {
  let sys_theme = localStorage.getItem("system-theme");
  const rootCss = document.querySelector(':root')
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    const newColorScheme = event.matches ? "dark" : "light";
    if (sys_theme.lock) return
    switch (newColorScheme) {
      case "dark": {
        rootCss.style.setProperty('--background', '#181c20');
        rootCss.style.setProperty('--font', '#ffffff');
        rootCss.style.setProperty('--desc', '#c9c9c9');
        rootCss.style.setProperty('--spliter', '#283136');
        sys_theme = setData(false, "dark")
        return
      }
      case "light": {
        rootCss.style.setProperty('--background', '#eff1f6');
        rootCss.style.setProperty('--font', '#2c2c2c');
        rootCss.style.setProperty('--desc', '#444444');
        rootCss.style.setProperty('--spliter', '#4f6069');
        sys_theme = setData(false, "light")
        return
      }
    }
  });
  if (!sys_theme) sys_theme = setData(false, "dark")
  if (sys_theme.lock) return
  if (sys_theme.mode === "dark") return
  if (window.matchMedia && !window.matchMedia('(prefers-color-scheme: dark)').matches) {
    rootCss.style.setProperty('--background', '#eff1f6');
    rootCss.style.setProperty('--font', '#2c2c2c');
    rootCss.style.setProperty('--desc', '#444444');
    rootCss.style.setProperty('--spliter', '#4f6069');
    sys_theme = setData(false, "light")
  }
})()

function setData(lock, mode) {
  localStorage.setItem("system-theme", { lock, mode });
  return localStorage.getItem("system-theme")
}