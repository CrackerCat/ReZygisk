#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>

#include <android/log.h>

#include "root_impl/common.h"
#include "companion.h"
#include "zygiskd.h"

#include "utils.h"

int __android_log_print(int prio, const char *tag,  const char *fmt, ...);

int main(int argc, char *argv[]) {
  errno = 0;
  /* Initialize android logger */
  LOGI("Initializing zygiskd\n");

  LOGI("Argc: %d\n", argc);
  for (int i = 0; i < argc; i++) {
    LOGI("argv[%d] = %s\n", i, argv[i]);
  }

  if (argc > 1) {
    if (strcmp(argv[1], "companion") == 0) {
      if (argc < 3) {
        LOGI("Usage: zygiskd companion <fd>\n");

        return 1;
      }

        LOGI("Previous error{3}: %s\n", strerror(errno));

      int fd = atoi(argv[2]);
        LOGI("Previous error(4): %s\n", strerror(errno));

      entry(fd);

      return 0;
    }

    else if (strcmp(argv[1], "version") == 0) {
      LOGI("ReZygisk Daemon %s\n", ZKSU_VERSION);

      return 0;
    }

    else if (strcmp(argv[1], "root") == 0) {
      root_impls_setup();
      enum RootImpl impl = get_impl();

      switch (impl) {
        case None: {
          LOGI("No root implementation found.\n");

          return 1;
        }

        case Multiple: {
          LOGI("Multiple root implementations found.\n");

          return 1;
        }

        case KernelSU: {
          LOGI("KernelSU root implementation found.\n");

          return 0;
        }
      }
      

      return 0;
    }

    else {
      LOGI("Usage: zygiskd [companion|version|root]\n");

      return 0;
    }
  }

  LOGI("Previous error{27}: %s\n", strerror(errno));
  switch_mount_namespace((pid_t)1);
  LOGI("Previous error{28}: %s\n", strerror(errno));
  root_impls_setup();
  LOGI("Previous error{29}: %s\n", strerror(errno));
  zygiskd_start();

  return 0;
}
