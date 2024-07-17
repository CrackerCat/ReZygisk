#ifndef KERNELSU_H
#define KERNELSU_H

#include "../constants.h"

enum RootImplState ksu_get_kernel_su();

bool ksu_uid_granted_root(int uid);

bool ksu_uid_should_umount(int uid);

bool ksu_uid_is_manager(int uid);

#endif