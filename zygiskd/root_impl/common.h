#ifndef COMMON_H
#define COMMON_H

#include "../constants.h"

enum RootImpl {
  None,
  Multiple, /* INFO: I know. */
  KernelSU
};

void root_impls_setup();

enum RootImpl get_impl();

bool uid_granted_root(int uid);

bool uid_should_umount(int uid);

bool uid_is_manager(int uid);

#endif /* COMMON_H */
