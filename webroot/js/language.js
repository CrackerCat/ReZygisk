import { lang } from './lang/index.js'

/* INFO: info card */
const version_info_title = document.getElementById('version_info_title')
const root_info_title = document.getElementById('root_info_title')
/* INFO: module card */
const module_card_title = document.getElementById('module_card_title')
/* INFO: settings card */
const settings_card_title = document.getElementById('settings_card_title')
/* INFO: daemon32 small card */
const daemon32_stop_button = document.getElementById('daemon32_stop_button')
const daemon32_start_button = document.getElementById('daemon32_start_button')
const daemon32_exit_button = document.getElementById('daemon32_exit_button')
/* INFO: daemon64 small card */
const daemon64_stop_button = document.getElementById('daemon64_stop_button')
const daemon64_start_button = document.getElementById('daemon64_start_button')
const daemon64_exit_button = document.getElementById('daemon64_exit_button')
/* INFO: lang modal */
const lang_modal_title = document.getElementById('lang_modal_title')

export function setNewLang(locate) {
  const new_lang = lang[locate]
  /* INFO: info card */
  version_info_title.innerHTML = new_lang.infoCard.version
  root_info_title.innerHTML = new_lang.infoCard.root
  /* INFO: module card */
  module_card_title.innerHTML = new_lang.moduleCard.header
  /* INFO: settings card */
  settings_card_title.innerHTML = new_lang.settings.header
  /* INFO: daemon32 small card */
  daemon32_stop_button.innerHTML = new_lang.settings.daemonButton.stop
  daemon32_start_button.innerHTML = new_lang.settings.daemonButton.start
  daemon32_exit_button.innerHTML = new_lang.settings.daemonButton.exit
  /* INFO: daemon64 small card */
  daemon64_stop_button.innerHTML = new_lang.settings.daemonButton.stop
  daemon64_start_button.innerHTML = new_lang.settings.daemonButton.start
  daemon64_exit_button.innerHTML = new_lang.settings.daemonButton.exit
  /* INFO: lang modal */
  lang_modal_title.innerHTML = new_lang.langModal.header
}