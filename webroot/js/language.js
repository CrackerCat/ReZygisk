import { setError } from './main.js'
import { translateActionPage } from './translate/action.js'
import { translateHomePage } from './translate/home.js'
import { translateModulesPage } from './translate/modules.js'
import { translateSettingsPage } from './translate/settings.js'

export async function setNewLanguage(locate, initialize) {
  const old_translations = await getTranslations(initialize ? 'en_US' : localStorage.getItem('/system/language'))
  const new_translations = await getTranslations(locate)

  translateHomePage(old_translations, new_translations)
  translateModulesPage(new_translations)
  translateActionPage(old_translations, new_translations)
  translateSettingsPage(new_translations)


  /* INFO: error history modal */
  document.getElementById('errorh_modal_title').innerHTML = new_translations.modal.logs.header
  document.getElementById('errorh_panel').placeholder = new_translations.modal.logs.placeholder

  /* INFO: navbar info */
  document.getElementById('nav_home_title').innerHTML = new_translations.page.home.header
  document.getElementById('nav_modules_title').innerHTML = new_translations.page.modules.header
  document.getElementById('nav_actions_title').innerHTML = new_translations.page.action.header
  document.getElementById('nav_settings_title').innerHTML = new_translations.page.settings.header

  /* INFO: Language small page */
  document.getElementById('small_panel_lang_title').innerHTML = new_translations.smallPage.language.header

  /* INFO: Theme small page */
  document.getElementById('small_panel_theme_title').innerHTML = new_translations.smallPage.theme.header
  document.getElementById('small_panel_theme_dark_option').innerHTML = new_translations.smallPage.theme.dark
  document.getElementById('small_panel_theme_light_option').innerHTML = new_translations.smallPage.theme.light
  document.getElementById('small_panel_theme_system_option').innerHTML = new_translations.smallPage.theme.system
}

export async function getTranslations(locate) {
  const translateData = await fetch(`./lang/${locate}.json`)
    .catch((err) => setError('WebUI', err.stack ? err.stack : err.message))

  return translateData.json()
}

/* INFO: This list is in alphabetical order. */
export const avaliableLanguages = [
  'en_US', /* INFO: Translated by @PerformanC (The PerformanC Organization) */
  'ja_JP', /* INFO: Translated by @Fyphen1223 */
  'pt_BR', /* INFO: Translated by @ThePedroo */
  'ro_RO', /* INFO: Translated by @ExtremeXT */
  'ru_RU', /* INFO: Translated by @Emulond & @AJleKcAHgP68 */
  'vi_VN', /* INFO: Translated by @RainyXeon */
  'zh_CN', /* INFO: Translated by @Meltartica & @SheepChef */
  'zh_TW'  /* INFO: Translated by @Meltartica */
]
