import { lang } from "../lang/index.js";

const lang_list = document.getElementById("lang_modal_list")
const key_list = Object.keys(lang)
let index = 0

for (const lang_key of key_list) {
  index += 1
  const value = lang[lang_key]
  lang_list.innerHTML += `
    <div class="${index === key_list.length ? '' : 'spliter'}" style="padding-top: 25px; padding-bottom: 25px; font-size: 1.3em;">
      ${value.langName}
    </div>`
}

// for (let i = 0; i < arr_size; i++) {
//   const key = key_list[i]
//   const value = lang[key]
//   lang_list.innerHTML += `
//     <div class="spliter" style="padding-top: 25px; padding-bottom: 25px; font-size: 1.3em;">
//       ${value}
//     </div>`
// }