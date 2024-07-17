#include "kernelsu.h"

#include "common.h"

static enum RootImpl ROOT_IMPL = None;

void root_impls_setup() {
  enum RootImplState ksu_version = ksu_get_kernel_su();

  enum RootImpl impl = None;

  if (ksu_version == Supported) impl = KernelSU;

  ROOT_IMPL = impl;
}

enum RootImpl get_impl() {
  return ROOT_IMPL;
}

bool uid_granted_root(int uid) {
  switch (get_impl()) {
    case KernelSU: {
      return ksu_uid_granted_root(uid);
    }
    default: {
      return false;
    }
  }
}

bool uid_should_umount(int uid) {
  switch (get_impl()) {
    case KernelSU: {
      return ksu_uid_should_umount(uid);
    }
    default: {
      return false;
    }
  }
}

bool uid_is_manager(int uid) {
  switch (get_impl()) {
    case KernelSU: {
      return ksu_uid_is_manager(uid);
    }
    default: {
      return false;
    }
  }
}
