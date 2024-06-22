import { exec, toast, fullScreen } from './kernelsu.js';

(async () => {
  fullScreen(true)
  const rootCss = document.querySelector(':root');
  const rezygisk_state = document.getElementById('rezygisk_state')
  const rezygisk_settings = document.getElementById("rezygisk_settings")
  const rezygisk_icon_state = document.getElementById('rezygisk_icon_state')
  /* TODO: Implement rezygisk state */
  rezygisk_settings.removeAttribute("style")
  rootCss.style.setProperty('--bright', '#3a4857');
  rezygisk_state.innerHTML = 'ReZygisk is functioning!'
  rezygisk_icon_state.innerHTML = '<img class="brightc" src="assets/tick.svg">'

  const code_version = document.getElementById('version_code')
  const root_impl = document.getElementById('root_impl')

  const is_zygote32_injected = document.getElementById('is_zygote32_injected')
  const is_zygote64_injected = document.getElementById('is_zygote64_injected')

  const { errno, stdout, stderr } = await exec('/data/adb/modules/zygisksu/bin/zygisk-ptrace64 info')

  if (errno === 0) {
    const lines = stdout.split('\n')

    code_version.innerHTML = lines[0].split('Tracer ')[1].split('-')[0]

    root_impl.innerHTML = lines[4].split(': ')[1]

    is_zygote64_injected.innerHTML = lines[5].split(': ')[1] === 'yes' ? 'Injected' : 'Not Injected'
  } else {
    toast(`Failed to get zygisk-ptrace64 info: ${stderr}`)
  }

  const { errno: errno32, stdout: stdout32, stderr: stderr32 } = await exec('/data/adb/modules/zygisksu/bin/zygisk-ptrace32 info')

  if (errno32 === 0) {
    const lines32 = stdout32.split('\n')

    is_zygote32_injected.innerHTML = lines32[5].split(': ')[1] === 'yes' ? 'Injected' : 'Not Injected'
  } else {
    toast(`Failed to get zygisk-ptrace32 info: ${stderr32}`)
  }  

  const modules_list = document.getElementById('modules_list')

  const { errno: errnoModules, stdout: stdoutModules, stderr: stderrModules } = await exec('find /data/adb/modules -type d -name zygisk -exec dirname {} \\;')

  if (errnoModules === 0) {
    modules_list.removeAttribute("style")
    const modules = stdoutModules.split('\n')

    modules_list.innerHTML += 
     `<div class="dimc content" style="font-size: 1.2em;">
        Modules (${modules.length})
      </div>
      <br/>`

    for (const module of modules) {
      const { errno: errnoZygisk, stdout: stdoutZygisk, stderr: stderrZygisk } = await exec(`ls ${module}/zygisk`)
      if (errnoZygisk !== 0) continue

      const bitsUsed = []
      if (stdoutZygisk.split('\n').find(line => [ 'arm64-v8a.so', 'x86_64.so' ].includes(line))) bitsUsed.push('64 bit')
      if (stdoutZygisk.split('\n').find(line => [ 'armeabi-v7a.so', 'x86.so' ].includes(line))) bitsUsed.push('32 bit')
    
      if (bitsUsed.length === 0) bitsUsed.push('N/A')

      const { errno: errnoModule, stdout: stdoutModule, stderr: stderrModule } = await exec(`cat ${module}/module.prop`)

      if (errnoModule === 0) {
        const lines = stdoutModule.split('\n')
        const name = lines.find(line => line.includes('name=')).split('=')[1]

        modules_list.innerHTML += 
        `<div class="dimc content spliter liste" style="padding-top: 3px; padding-bottom: 13px;">
          <div class="dimc">${name}</div>
          <div class="dimc">${bitsUsed.join(' / ')}</div>
        </div>`
      } else {
        toast(`Failed to get module ${module} info: ${stderrModule}`)
      }
    }

    modules_list.innerHTML += '</div>'
  } else {
    toast(`Failed to get modules list: ${stderrModules}`)
  }
})()