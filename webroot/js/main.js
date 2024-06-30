import { fullScreen, exec, toast } from './kernelsu.js'
import { setNewLang } from './language.js'

(async () => {
  const EXPECTED = 1
  const UNEXPECTED_FAIL = 2

  fullScreen(true)

  let sys_lang = localStorage.getItem('/system/language')

  const loading_screen = document.getElementById('loading_screen')

  const rootCss = document.querySelector(':root')

  const rezygisk_state = document.getElementById('rezygisk_state')
  const rezygisk_settings = document.getElementById('rezygisk_settings')
  const rezygisk_icon_state = document.getElementById('rezygisk_icon_state')

  const code_version = document.getElementById('version_code')
  const root_impl = document.getElementById('root_impl')

  const zygote64_div = document.getElementById('zygote64')
  const zygote32_div = document.getElementById('zygote32')

  const daemon64_div = document.getElementById('daemon64')
  const daemon32_div = document.getElementById('daemon32')

  const zygote32_status_div = document.getElementById('zygote32_status')
  const zygote64_status_div = document.getElementById('zygote64_status')

  let zygote64_status = EXPECTED
  let zygote32_status = EXPECTED

  if (!sys_lang) sys_lang = setLangData("en_US")
  if (sys_lang !== "en_US") setNewLang(sys_lang)

  const ptrace64Cmd = await exec('/data/adb/modules/zygisksu/bin/zygisk-ptrace64 info')

  if (ptrace64Cmd.errno === 0) {
    const lines = ptrace64Cmd.stdout.split('\n')

    /* INFO: Root implementation and ReZygisk version parsing */
    code_version.innerHTML = lines[0].split('Tracer ')[1].split('-')[0]
    root_impl.innerHTML = lines[4].split(': ')[1]

    zygote64_status_div.innerHTML = lines[5].split(': ')[1] === 'yes' ? 'Injected' : 'Not Injected'

    if (zygote64_status_div.innerHTML === 'Not Injected') zygote64_status = UNEXPECTED_FAIL
  } else if (ptrace64Cmd.stderr.includes('cannot execute binary file: Exec format error')) {
    zygote64_div.remove()
    daemon64_div.remove()
  } else {
    toast(`zygisk-ptrace64 error (${ptrace64Cmd.errno}): ${ptrace64Cmd.stderr}`)

    zygote64_status = UNEXPECTED_FAIL
  }

  const ptrace32Cmd = await exec('/data/adb/modules/zygisksu/bin/zygisk-ptrace32 info')

  if (ptrace32Cmd.errno === 0) {
    const lines = ptrace32Cmd.stdout.split('\n')

    /* INFO: Root implementation and ReZygisk version parsing -- Necessary if 64-bit fails */
    code_version.innerHTML = lines[0].split('Tracer ')[1].split('-')[0]
    root_impl.innerHTML = lines[4].split(': ')[1]

    zygote32_status_div.innerHTML = lines[5].split(': ')[1] === 'yes' ? 'Injected' : 'Not Injected'

    if (zygote32_status_div.innerHTML === 'Not Injected') zygote32_status = UNEXPECTED_FAIL
  } else if (ptrace32Cmd.stderr.includes('not executable: 32-bit ELF file')) {
    zygote32_div.remove()
    daemon32_div.remove()
  } else {
    toast(`zygisk-ptrace32 error (${ptrace32Cmd.errno}): ${ptrace32Cmd.stderr}`)

    zygote32_status = UNEXPECTED_FAIL
  }

  if (zygote32_status === EXPECTED && zygote64_status === EXPECTED) {
    rezygisk_state.innerHTML = 'ReZygisk is fully functioning!'

    rezygisk_settings.removeAttribute('style')
    rootCss.style.setProperty('--bright', '#3a4857')
    rezygisk_icon_state.innerHTML = '<img class="brightc" src="assets/tick.svg">'
  } else if (zygote64_status === EXPECTED ^ zygote32_status.innerHTML === EXPECTED) {
    rezygisk_state.innerHTML = 'ReZygisk is partially functioning!'

    rezygisk_settings.removeAttribute('style')
    rootCss.style.setProperty('--bright', '#766000')
    rezygisk_icon_state.innerHTML = '<img class="brightc" src="assets/warn.svg">'
  } else {
    rezygisk_state.innerHTML = 'ReZygisk is not functioning!'
  }

  const modules_card = document.getElementById('modules_card')
  const modules_list = document.getElementById('modules_list')

  /* INFO: This hides the throbber screen */
  loading_screen.style.display = 'none'

  const findModulesCmd = await exec('find /data/adb/modules -type d -name zygisk -exec dirname {} \\;')

  if (findModulesCmd.errno === 0) {
    const modules = findModulesCmd.stdout.split('\n')

    if (modules.length === 0) return;

    modules_card.removeAttribute('style')

    let index = 0
    for (const module of modules) {
      index += 1

      const lsZygiskCmd = await exec(`ls ${module}/zygisk`)
      if (lsZygiskCmd.errno !== 0) {
        toast(`ls ${module}/zygisk error (${lsZygiskCmd.errno}): ${lsZygiskCmd.stderr}`)

        continue
      }

      const bitsUsed = []
      if (zygote32_status === EXPECTED && lsZygiskCmd.stdout.split('\n').find((line) => [ 'armeabi-v7a.so', 'x86.so' ].includes(line))) bitsUsed.push('32 bit')
      if (zygote64_status === EXPECTED && lsZygiskCmd.stdout.split('\n').find((line) => [ 'arm64-v8a.so', 'x86_64.so' ].includes(line))) bitsUsed.push('64 bit')

      if (bitsUsed.length === 0) bitsUsed.push('N/A')

      const catCmd = await exec(`cat ${module}/module.prop`)

      if (catCmd.errno === 0) {
        const lines = catCmd.stdout.split('\n')
        const name = lines.find(line => line.includes('name=')).split('=')[1]

        modules_list.innerHTML += 
        `<div class="dimc ${index !== modules.length ? 'spliter' : ''}" style="padding-top: 13px; padding-bottom: 13px;">
          <div class="dimc" style="font-size: 1.1em;">${name}</div>
          <div class="dimc desc" style="font-size: 0.9em; margin-top: 3px;">Arch: ${bitsUsed.join(' / ')}</div>
        </div>`
      } else {
        toast(`cat ${module} error (${catCmd.errno}): ${catCmd.stderr}`)
      }
    }
  } else {
    toast(`find error (${findModulesCmd.errno}): ${findModulesCmd.stderr}`)
  }
})()

function setLangData(mode) {
  localStorage.setItem('/system/language', mode)

  return localStorage.getItem('/system/language')
}