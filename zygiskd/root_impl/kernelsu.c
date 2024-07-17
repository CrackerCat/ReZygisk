#include <stdlib.h>

#include <sys/stat.h>
#include <sys/prctl.h>

#include "../constants.h"

#include "kernelsu.h"

#define KERNEL_SU_OPTION 0xdeadbeef

#define CMD_GET_VERSION 2
#define CMD_UID_GRANTED_ROOT 12
#define CMD_UID_SHOULD_UMOUNT 13

enum RootImplState ksu_get_kernel_su() {
  int version = 0;
  prctl(KERNEL_SU_OPTION, CMD_GET_VERSION, &version, 0, 0);

  if (version == 0) return -1;

  if (version >= MIN_KSU_VERSION && version <= MAX_KSU_VERSION) return Supported;
  
  if (version >= 1 && version <= MIN_KSU_VERSION - 1) return TooOld;

  return Abnormal;
}

bool ksu_uid_granted_root(int uid) {
  uint32_t result = 0;
  bool granted = false;
  prctl(KERNEL_SU_OPTION, CMD_UID_GRANTED_ROOT, uid, &granted, &result);

  if (result != KERNEL_SU_OPTION) return false;

  return granted;
}

bool ksu_uid_should_umount(int uid) {
  uint32_t result = 0;
  bool umount = false;
  prctl(KERNEL_SU_OPTION, CMD_UID_SHOULD_UMOUNT, uid, &umount, &result);

  if (result != KERNEL_SU_OPTION) return false;

  return umount;
}

bool ksu_uid_is_manager(int uid) {
  struct stat s;
  if (stat("/data/user_de/0/me.weishu.kernelsu", &s) == 0) return s.st_uid == (uid_t)uid;

  return false;
}
