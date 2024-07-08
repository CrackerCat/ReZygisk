/* INFO: info card */
const version_info_title = document.getElementById('version_info_title')
const version_code = document.getElementById('version_code')
const root_info_title = document.getElementById('root_info_title')
const root_impl = document.getElementById('root_impl')
/* INFO: module card */
const module_card_title = document.getElementById('module_card_title')
const module_element_arch = document.getElementsByClassName('arch_desc')
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
/* INFO: error history button card */
const errorh_card_title = document.getElementById('errorh_card_title')
/* INFO: error history modal */
const errorh_modal_title = document.getElementById('errorh_modal_title')
const errorh_panel = document.getElementById('errorh_panel')
/* INFO: lang modal */
const lang_modal_title = document.getElementById('lang_modal_title')
/* INFO: Variable fields */
const rezygisk_state = document.getElementById('rezygisk_state')

const zygote32_status_div = document.getElementById('zygote32_status')
const zygote64_status_div = document.getElementById('zygote64_status')

export async function setNewLanguage(locate, initialize) {
  const old_translations = await getTranslations(initialize ? 'en_US' : localStorage.getItem('/system/language'))
  const new_lang = await getTranslations(locate)

  /* INFO: info card */
  version_info_title.innerHTML = new_lang.infoCard.version
  root_info_title.innerHTML = new_lang.infoCard.root

  if (version_code.innerHTML.replace(/(\r\n|\n|\r)/gm,"").trim() === old_translations.global.unknown)
    version_code.innerHTML = new_lang.global.unknown
  if (root_impl.innerHTML.replace(/(\r\n|\n|\r)/gm,"").trim() === old_translations.global.unknown)
    root_impl.innerHTML = new_lang.global.unknown
  /* INFO: module card */
  module_card_title.innerHTML = new_lang.moduleCard.header
  /* INFO: settings card */
  settings_card_title.innerHTML = new_lang.settings.header
  /* INFO: daemon32 small card */
  if (daemon32_stop_button) { /* INFO: Not all devices have 32-bit support */
    daemon32_stop_button.innerHTML = new_lang.settings.daemonButton.stop
    daemon32_start_button.innerHTML = new_lang.settings.daemonButton.start
    daemon32_exit_button.innerHTML = new_lang.settings.daemonButton.exit
  }
  /* INFO: daemon64 small card */
  if (daemon64_stop_button) { /* INFO: Not all devices have 64-bit support */
    daemon64_stop_button.innerHTML = new_lang.settings.daemonButton.stop
    daemon64_start_button.innerHTML = new_lang.settings.daemonButton.start
    daemon64_exit_button.innerHTML = new_lang.settings.daemonButton.exit
  }
  /* INFO: lang modal */
  lang_modal_title.innerHTML = new_lang.langModal.header

  /* INFO: error history button card */
  errorh_card_title.innerHTML = new_lang.errorHistory.header

  /* INFO: error history modal */
  errorh_modal_title.innerHTML = new_lang.errorHistory.header
  errorh_panel.placeholder = new_lang.errorHistory.placeholder

  /* INFO: Translate variables */
  switch (rezygisk_state.innerHTML.replace(/(\r\n|\n|\r)/gm,"").trim()) {
    case old_translations.infoCard.status.ok: {
      rezygisk_state.innerHTML = new_lang.infoCard.status.ok

      break
    }
    case old_translations.infoCard.status.partially: {
      rezygisk_state.innerHTML = new_lang.infoCard.status.partially

      break
    }
    case old_translations.infoCard.status.notWorking: {
      rezygisk_state.innerHTML = new_lang.infoCard.status.notWorking

      break
    }
    case old_translations.infoCard.status.unknown: {
      rezygisk_state.innerHTML = new_lang.infoCard.status.unknown

      break
    }
  }

  if (zygote32_status_div) {
    switch (zygote32_status_div.innerHTML.replace(/(\r\n|\n|\r)/gm,"").trim()) {
      case old_translations.infoCard.zygote.injected: {
        zygote32_status_div.innerHTML = new_lang.infoCard.zygote.injected

        break
      }
      case old_translations.infoCard.zygote.notInjected: {
        zygote32_status_div.innerHTML = new_lang.infoCard.zygote.notInjected

        break
      }
      case old_translations.infoCard.zygote.unknown: {
        zygote32_status_div.innerHTML = new_lang.infoCard.zygote.unknown

        break
      }
    }
  }

  if (zygote64_status_div) {
    switch (zygote64_status_div.innerHTML.replace(/(\r\n|\n|\r)/gm,"").trim()) {
      case old_translations.infoCard.zygote.injected: {
        zygote64_status_div.innerHTML = new_lang.infoCard.zygote.injected

        break
      }
      case old_translations.infoCard.zygote.notInjected: {
        zygote64_status_div.innerHTML = new_lang.infoCard.zygote.notInjected

        break
      }
      case old_translations.infoCard.zygote.unknown: {
        zygote64_status_div.innerHTML = new_lang.infoCard.zygote.unknown

        break
      }
    }
  }

  for (const module of module_element_arch) {
    module.innerHTML = new_lang.moduleCard.arch
  }
}

export async function getTranslations(locate) {
  const translateData = await fetch(`./lang/${locate}.json`)
    .catch(error => reject(error))
  return await translateData.json()
}

/* INFO: This list is in alphabetical order. */
export const avaliableLanguages = [
  "en_US", /* INFO: Translated by @PerformanC (The PerformanC Organization) */
  "ja_JP", /* INFO: Translated by @Fyphen1223 */
  "pt_BR", /* INFO: Translated by @ThePedroo */
  "ro_RO", /* INFO: Translated by @ExtremeXT */
  "ru_RU", /* INFO: Translated by Emulond Argent (@Emulond) */
  "vi_VN", /* INFO: Translated by @RainyXeon (unexpected unresolved) */
  "zh_CN", /* INFO: Translated by @Meltartica */
  "zh_TW", /* INFO: Translated by @Meltartica */
]
