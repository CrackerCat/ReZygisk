import { fullScreen, exec, toast } from './kernelsu.js';

(async () => {
  fullScreen(true)

  const rootCss = document.querySelector(':root')
  const rezygisk_state = document.getElementById('rezygisk_state')
  const rezygisk_settings = document.getElementById('rezygisk_settings')
  const rezygisk_icon_state = document.getElementById('rezygisk_icon_state')

  const code_version = document.getElementById('version_code')
  const root_impl = document.getElementById('root_impl')

  const is_zygote32_injected = document.getElementById('is_zygote32_injected')
  const is_zygote64_injected = document.getElementById('is_zygote64_injected')

  const ptrace64Cmd = await exec('/data/adb/modules/zygisksu/bin/zygisk-ptrace64 info')

  if (ptrace64Cmd.errno === 0) {
    const lines = ptrace64Cmd.stdout.split('\n')

    code_version.innerHTML = lines[0].split('Tracer ')[1].split('-')[0]

    root_impl.innerHTML = lines[4].split(': ')[1]

    is_zygote64_injected.innerHTML = lines[5].split(': ')[1] === 'yes' ? 'Injected' : 'Not Injected'
  } else {
    toast(`zygisk-ptrace64 error (${ptrace64Cmd.errno}): ${ptrace64Cmd.stderr}`)
  }

  const ptrace32Cmd = await exec('/data/adb/modules/zygisksu/bin/zygisk-ptrace32 info')

  if (ptrace32Cmd.errno === 0) {
    const lines32 = ptrace32Cmd.stdout.split('\n')

    is_zygote32_injected.innerHTML = lines32[5].split(': ')[1] === 'yes' ? 'Injected' : 'Not Injected'
  } else {
    toast(`zygisk-ptrace32 error (${ptrace32Cmd.errno}): ${ptrace32Cmd.stderr}`)
  }

  if (is_zygote32_injected.innerHTML === 'Not Injected' && is_zygote64_injected.innerHTML === 'Not injected') {
    rezygisk_state.innerHTML = 'ReZygisk is not functioning!'
  } else if (is_zygote32_injected.innerHTML === 'Injected' && is_zygote64_injected.innerHTML === 'Injected') {
    rezygisk_state.innerHTML = 'ReZygisk is fully functioning!'

    rezygisk_settings.removeAttribute('style')
    rootCss.style.setProperty('--bright', '#3a4857');
    rezygisk_icon_state.innerHTML = '<img class="brightc" src="assets/tick.svg">'
  } else {
    rezygisk_state.innerHTML = 'ReZygisk is partially functioning!'

    rezygisk_settings.removeAttribute('style')
    rootCss.style.setProperty('--bright', '#ffd000');
    rezygisk_icon_state.innerHTML = '<img class="brightc" src="assets/warn.svg">'
  }

  const modules_list = document.getElementById('modules_list')

  const findModulesCmd = await exec('find /data/adb/modules -type d -name zygisk -exec dirname {} \\;')

  if (findModulesCmd.errno === 0) {
    const modules = findModulesCmd.stdout.split('\n')

    if (modules.length === 0) return;

    modules_list.removeAttribute('style')

    modules_list.innerHTML += 
     `<div class="dimc" style="font-size: 1.2em; display: flex; align-items: center;">
        <div id="modules_list_icon" class="dimc">
          <img class="dimc" src="assets/module.svg">
        </div>
        <div class="dimc" style="padding-bottom: 4px; padding-left: 5px;">Modules (${modules.length})</div>
      </div>
      `

    let index = 0
    for (const module of modules) {
      index += 1
      const lsZygiskCmd = await exec(`ls ${module}/zygisk`)
      if (lsZygiskCmd.errno !== 0) {
        toast(`ls ${module}/zygisk error (${lsZygiskCmd.errno}): ${lsZygiskCmd.stderr}`)
        continue
      }

      const bitsUsed = []
      if (lsZygiskCmd.stdout.split('\n').find((line) => [ 'armeabi-v7a.so', 'x86.so' ].includes(line))) bitsUsed.push('32 bit')
      if (lsZygiskCmd.stdout.split('\n').find((line) => [ 'arm64-v8a.so', 'x86_64.so' ].includes(line))) bitsUsed.push('64 bit')

      if (bitsUsed.length === 0) bitsUsed.push('N/A')

      const catCmd = await exec(`cat ${module}/module.prop`)

      if (catCmd.errno === 0) {
        const lines = catCmd.stdout.split('\n')
        const name = lines.find(line => line.includes('name=')).split('=')[1]

        modules_list.innerHTML += 
        `<div class="dimc content ${index !== modules.length ? "spliter" : ""}" style="padding-top: 10px; padding-bottom: 13px;">
          <div class="dimc">${name}</div>
          <div class="dimc" style="font-size: 0.9em;">Arch: ${bitsUsed.join(' / ')}</div>
        </div>`
      } else {
        toast(`cat ${module} error (${catCmd.errno}): ${catCmd.stderr}`)
      }
    }

    modules_list.innerHTML += '</div>'
  } else {
    toast(`find error (${findModulesCmd.errno}): ${findModulesCmd.stderr}`)
  }
})()