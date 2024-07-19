setData('home')

document.getElementById('panel_home').classList.toggle('show')
document.getElementById(`nibg_home`).classList.toggle('show')

document.querySelectorAll('[name=navbutton]').forEach((element) => {
  element.addEventListener('click', (event) => {
    const value = event.target.value
    const previous = !localStorage.getItem('/cache/navbar/previous') ? setData('home') : localStorage.getItem('/cache/navbar/previous')
    if (previous === value) return;

    /* INFO: Disable icon on old state */
    const pre_input = document.getElementById(`n_${previous}`)
    const pre_background = document.getElementById(`nibg_${previous}`)

    document.getElementById(`panel_${previous}`).classList.remove('show')
    pre_input.removeAttribute('checked')
    pre_background.classList.remove('show')

    /* INFO: Enable icon on new state */
    const curr_input = document.getElementById(`n_${value}`)
    const i_background = document.getElementById(`nibg_${value}`)

    document.getElementById(`panel_${value}`).classList.toggle('show')
    curr_input.setAttribute('checked', '')
    i_background.classList.toggle('show')

    setData(value)
  })
})

function setData(data) {
  localStorage.setItem('/cache/navbar/previous', data)

  return data
}