#include <stdio.h>

#include "monitor.h"
#include "utils.hpp"
#include "daemon.h"

#define CUSTOM_TMP_PATH 0
#define SBIN_AS_TMP_PATH 1
#define DEBUG_RAMDISK_AS_TMP_PATH 2

int main(int argc, char **argv) {
  int tmp_path_type = CUSTOM_TMP_PATH;

  if (getenv("TMP_PATH") == NULL) {
    tmp_path_type = SBIN_AS_TMP_PATH;

    FILE *fp = fopen("/sbin", "r");
    if (fp == NULL) {
      tmp_path_type = DEBUG_RAMDISK_AS_TMP_PATH;

      fp = fopen("/debug_ramdisk", "r");

      if (fp == NULL) {
        printf("Cannot find TMP_PATH. You should make an issue about that.\n");

        return 1;
      } else fclose(fp);
    } else fclose(fp);
  } else {
    tmp_path_type = CUSTOM_TMP_PATH;
  }

  switch (tmp_path_type) {
    case CUSTOM_TMP_PATH: {
      zygiskd::Init(getenv("TMP_PATH"));

      break;
    }
    case SBIN_AS_TMP_PATH: {
      zygiskd::Init("/sbin");

      break;
    }
    case DEBUG_RAMDISK_AS_TMP_PATH: {
      zygiskd::Init("/debug_ramdisk");

      break;
    }
  }

  printf("The ReZygisk Tracer %s\n\n", ZKSU_VERSION);

  if (argc >= 2 && strcmp(argv[1], "monitor") == 0) {
    init_monitor();

    printf("[ReZygisk]: Started monitoring...\n");

    return 0;
  } else if (argc >= 3 && strcmp(argv[1], "trace") == 0) {
      if (argc >= 4 && strcmp(argv[3], "--restart") == 0) zygiskd::ZygoteRestart();

      long pid = strtol(argv[2], 0, 0);
      if (!trace_zygote(pid)) {
        kill(pid, SIGKILL);

        return 1;
      }

      printf("[ReZygisk]: Tracing %ld...\n", pid);

      return 0;
  } else if (argc >= 2 && strcmp(argv[1], "ctl") == 0) {
    enum Command command;

    if (strcmp(argv[2], "start") == 0) command = START;
    else if (strcmp(argv[2], "stop") == 0) command = STOP;
    else if (strcmp(argv[2], "exit") == 0) command = EXIT;
    else {
      printf("[ReZygisk]: Usage: %s ctl <start|stop|exit>\n", argv[0]);

      return 1;
    }

    if (send_control_command(command) == -1) {
      printf("[ReZygisk]: Failed to send the command, is the daemon running?\n");

      return 1;
    }

    printf("[ReZygisk]: command sent\n");

    return 0;
  } else if (argc >= 2 && strcmp(argv[1], "version") == 0) {
    printf("ReZygisk Tracer %s\n", ZKSU_VERSION);

    return 0;
  } else if (argc >= 2 && strcmp(argv[1], "info") == 0) {
    printf("ReZygisk Tracer %s\n", ZKSU_VERSION);
    
    struct zygote_info info;
    zygiskd::GetInfo(&info);

    printf("Daemon process PID: %d\n", info.pid);

    switch (info.root_impl) {
      case ZYGOTE_ROOT_IMPL_NONE: {
        printf("Root implementation: none\n");

        break;
      }
      case ZYGOTE_ROOT_IMPL_APATCH: {
        printf("Root implementation: APatch\n");
        
        break;
      }
      case ZYGOTE_ROOT_IMPL_KERNELSU: {
        printf("Root implementation: KernelSU\n");

        break;
      }
      case ZYGOTE_ROOT_IMPL_MAGISK: {
        printf("Root implementation: Magisk\n");

        break;
      }
    }

    printf("Is the daemon running: %s\n", info.running ? "yes" : "no");

    return 0;
  } else {
    printf("ReZygisk Tracer %s\n", ZKSU_VERSION);
    printf(
      "Available commands:\n"
      " - monitor\n"
      " - trace <pid> [--restart]\n"
      " - ctl <start|stop|exit>\n"
      " - version: Shows the version of ReZygisk.\n"
      " - info: Shows information about the created daemon/injection.\n"
      "\n"
      "<...>: Obligatory\n"
      "[...]: Optional\n");

    return 1;
  }
}
