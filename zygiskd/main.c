#include <stdio.h>
#include <string.h>

#include <android/log.h>

#include "root_impl/common.h"

#include "utils.h"

// extern "C" {
//     fn __android_log_print(prio: i32, tag: *const c_char, fmt: *const c_char, ...) -> i32;
//     fn __system_property_get(name: *const c_char, value: *mut c_char) -> u32;
//     fn __system_property_set(name: *const c_char, value: *const c_char) -> u32;
//     fn __system_property_find(name: *const c_char) -> *const c_void;
//     fn __system_property_wait(
//         info: *const c_void,
//         old_serial: u32,
//         new_serial: *mut u32,
//         timeout: *const libc::timespec,
//     ) -> bool;
//     fn __system_property_serial(info: *const c_void) -> u32;
// }

int __android_log_print(int prio, const char *tag,  const char *fmt, ...);

int main(int argc, char *argv[]) {
  /* Initialize android logger */
  __android_log_print(ANDROID_LOG_INFO, "zygiskd", "Hello, world! :3");

  if (argc > 1) {
    if (strcmp(argv[0], "companion") == 0) {
      /* WIP */

      return 0;
    }

    else if (strcmp(argv[1], "version") == 0) {
      printf("ReZygisk Daemon %s\n", ZKSU_VERSION);

      return 0;
    }

    else if (strcmp(argv[1], "root") == 0) {
      root_impls_setup();
      enum RootImpl impl = get_impl();

      switch (impl) {
        case None: {
          printf("No root implementation found.\n");

          return 1;
        }

        case Multiple: {
          printf("Multiple root implementations found.\n");

          return 1;
        }

        case KernelSU: {
          printf("KernelSU root implementation found.\n");

          return 0;
        }
      }
      

      return 0;
    }

    else {
      printf("Usage: zygiskd [companion|version|root]\n");

      return 0;
    }
  }

  switch_mount_namespace((pid_t)1);
  root_impls_setup();
  __android_log_print(ANDROID_LOG_INFO, "zygiskd", "Root implementation: %d", get_impl());

  return 0;
}