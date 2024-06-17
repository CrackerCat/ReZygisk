#include "main.h"
#include "utils.hpp"
#include "daemon.h"

int main(int argc, char **argv) {
  zygiskd::Init(getenv("TMP_PATH"));
  if (argc >= 2 && strcmp(argv[1], "monitor") == 0) {
    init_monitor();

    return 0;
  } else if (argc >= 3 && strcmp(argv[1], "trace") == 0) {
      if (argc >= 4 && strcmp(argv[3], "--restart") == 0) zygiskd::ZygoteRestart();

      long pid = strtol(argv[2], 0, 0);
      if (!trace_zygote(pid)) {
        kill(pid, SIGKILL);

        return 1;
      }

      return 0;
  } else if (argc >= 2 && strcmp(argv[1], "ctl") == 0) {
    if (argc == 3) {
      if (strcmp(argv[2], "start") == 0) {
        send_control_command(START);

        return 0;
      } else if (strcmp(argv[2], "stop") == 0) {
        send_control_command(STOP);

        return 0;
      } else if (strcmp(argv[2], "exit") == 0) {
        send_control_command(EXIT);

        return 0;
      }
    }

    printf("ReZygisk Tracer %s\n", ZKSU_VERSION);
    printf("Usage: %s ctl start|stop|exit\n", argv[0]);

    return 1;
  } else if (argc >= 2 && strcmp(argv[1], "version") == 0) {
    printf("ReZygisk Tracer %s\n", ZKSU_VERSION);

    return 0;
  } else {
    printf("ReZygisk Tracer %s\n", ZKSU_VERSION);
    printf("usage: %s monitor | trace <pid> | ctl <start|stop|exit> | version\n", argv[0]);

    return 1;
  }
}
