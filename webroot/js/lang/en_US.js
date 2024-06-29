export const en_US = {
  langName: 'English (United States)',
  infoCard: {
    status: {
      unknown: 'ReZygisk is at an unknown state!',
      notWorking: 'ReZygisk is not functioning!',
      ok: 'ReZygisk is fully functioning!',
      partially: 'ReZygisk is partially functioning!'
    },
    version: 'Version',
    root: 'Root Implementation',
    zygote: {
      injected: 'Injected',
      notInjected: 'Not Injected',
      unknown: 'Unknown'
    }
  },
  moduleCard: {
    header: 'Modules',
    arch: 'Arch: '
  },
  settings: {
    daemonButton: {
      start: 'Start',
      stop: 'Stop',
      exit: 'Exit'
    }
  },
  cmdErrors: {
    ptrace64: 'Error while executing zygisk-ptrace64',
    ptrace32: 'Error while executing zygisk-ptrace32',
    ls: 'Error while listing files in zygisk folder of module',
    cat: 'Error while reading module.prop from module',
    find: 'Error while finding zygisk modules'
  },
}