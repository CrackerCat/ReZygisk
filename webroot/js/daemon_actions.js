import { exec } from './kernelsu.js'

const daemon64_start = document.getElementById('daemon64_start_button')
const daemon64_stop = document.getElementById('daemon64_stop_button')
const daemon64_exit = document.getElementById('daemon64_exit_button')

if (daemon64_start) {
  daemon64_start.addEventListener('click', () => {
    exec('/data/adb/modules/zygisksu/bin/zygisk-ptrace64 ctl start')
  })

  daemon64_stop.addEventListener('click', () => {
    exec('/data/adb/modules/zygisksu/bin/zygisk-ptrace64 ctl stop')
  })

  daemon64_exit.addEventListener('click', () => {
    exec('/data/adb/modules/zygisksu/bin/zygisk-ptrace64 ctl exit')
  })
}

const daemon32_start = document.getElementById('daemon32_start_button')
const daemon32_stop = document.getElementById('daemon32_stop_button')
const daemon32_exit = document.getElementById('daemon32_exit_button')

if (daemon32_start) {
  daemon32_start.addEventListener('click', () => {
    exec('/data/adb/modules/zygisksu/bin/zygisk-ptrace32 ctl start')
  })

  daemon32_stop.addEventListener('click', () => {
    exec('/data/adb/modules/zygisksu/bin/zygisk-ptrace32 ctl stop')
  })

  daemon32_exit.addEventListener('click', () => {
    exec('/data/adb/modules/zygisksu/bin/zygisk-ptrace32 ctl exit')
  })
}