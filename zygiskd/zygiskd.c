#include <unistd.h>
#include <linux/limits.h>
#include <sys/mman.h>
#include <sys/socket.h>

#include "root_impl/common.h"
#include "constants.h"
#include "utils.h"

struct Module {
  char *name;
  int lib_fd;
}

struct Context {
  struct Module *modules;
}

enum Architecture {
  ARM32,
  ARM64,
  X86,
  X86_64,
}

static char TMP_PATH[] = "/data/adb/rezygisk";
static char CONTROLLER_SOCKET[PATH_MAX];
static char PATH_CP_NAME[PATH_MAX];

enum Architecture get_arch() {
  char system_arch[PROP_VALUE_MAX];
  get_property("ro.product.cpu.abi", system_arch);

  if (strstr(system_arch, "arm") != NULL) return lp_select(ARM32, ARM64);
  if (strstr(system_arch, "x86") != NULL) return lp_select(ARM64, X86_64);

  printf("Unsupported system architecture: %s\n", system_arch);
  exit(1);
}

int create_library_fd(char *so_path) {
  int memfd = memfd_create("jit-cache-zygisk", MFD_ALLOW_SEALING);
  if (memfd == -1) {
    printf("Failed creating memfd: %s\n", strerror(errno));
    return -1;
  }

  int file = open(so_path, O_RDONLY);
  if (file == -1) {
    printf("Failed opening file: %s\n", strerror(errno));
    return -1;
  }

  struct stat st;
  fstat(file, &st);
  ftruncate(memfd, st.st_size);

  void *addr = mmap(NULL, st.st_size, PROT_READ | PROT_WRITE, MAP_SHARED, memfd, 0);
  if (addr == MAP_FAILED) {
    printf("Failed mapping memory: %s\n", strerror(errno));
    return -1;
  }

  read(file, addr, st.st_size);
  munmap(addr, st.st_size);
  close(file);

  unsigned int seals = F_SEAL_SHRINK | F_SEAL_GROW | F_SEAL_WRITE | F_SEAL_SEAL;
  if (fcntl(memfd, F_ADD_SEALS, seals) == -1) {
    printf("Failed adding seals: %s\n", strerror(errno));
    return -1;
  }

  return memfd;
}

/* WARNING: Dynamic memory based */
struct Module **load_modules(enum Architecture arch) {
  struct Module **modules = malloc(sizeof(struct Module *));
  DIR *dir = opendir(PATH_MODULES_DIR);

  struct dirent *entry;
  while ((entry = readdir(dir)) != NULL) {
    char *name = entry->d_name;
    char so_path[PATH_MAX];
    snprintf(so_path, PATH_MAX, "%s/zygisk/%s.so", PATH_MODULES_DIR, name);

    struct stat st;
    if (stat(so_path, &st) == -1) continue;

    char disabled[PATH_MAX];
    snprintf(disabled, PATH_MAX, "%s/disable", PATH_MODULES_DIR);
    if (stat(disabled, &st) != -1) continue;

    printf("Loading module `%s`...\n", name);
    int lib_fd = create_library_fd(so_path);
    if (lib_fd == -1) continue;

    struct Module *module = malloc(sizeof(struct Module));
    module->name = name;
    module->lib_fd = lib_fd;
    modules = realloc(modules, sizeof(modules) + sizeof(module));
    modules[sizeof(modules)] = module;
  }

  return modules;
}

void free_modules(struct Module **modules) {
  for (int i = 0; i < sizeof(modules); i++) {
    free(modules[i]);
  }

  free(modules);
}

int create_daemon_socket() {
  set_socket_create_context("u:r:zygote:s0");
  int socket_fd = unix_listener_from_path(PATH_CP_NAME);

  return socket_fd;
}

void zygiskd_start() {
  printf("Welcome to ReZygisk %s!\n", ZKSU_VERSION);

  snprintf(CONTROLLER_SOCKET, PATH_MAX, "%s/init_monitor", TMP_PATH);
  snprintf(PATH_CP_NAME, PATH_MAX, "%s/%s", TMP_PATH, lp_select("/cp32.sock", "/cp64.sock"));

  Architecture arch = get_arch();
  printf("Daemon architecture: %s\n", arch);

  struct Module **modules = load_modules(arch);

  char *msg = malloc(1);
  size_t msg_len = 1;

  switch (get_impl()) {
    case KernelSU: {
      msg[0] = DAEMON_SET_INFO;

      msg = realloc(msg, strlen("Root: KernelSU, Modules: ") + 1);
      memcpy(msg + 1, "Root: KernelSU, Modules: ", strlen("Root: KernelSU, Modules: "));
      msg_len += strlen("Root: KernelSU, Modules: ");

      for (int i = 0; i < sizeof(modules); i++) {
        msg = realloc(msg, strlen(modules[i]->name) + strlen(", ") + 1);
        memcpy(msg + msg_len, modules[i]->name, strlen(modules[i]->name));
        msg_len += strlen(modules[i]->name);
        memcpy(msg + msg_len, ", ", strlen(", "));
        msg_len += strlen(", ");

        free(modules[i]);
      }
    }
    default: {
      msg[0] = DAEMON_SET_ERROR_INFO;

      msg = realloc(msg, strlen("Invalid root implementation") + 1);
      memcpy(msg + 1, "Invalid root implementation", strlen("Invalid root implementation"));
    }
  }

  msg = realloc(msg, msg_len + 1);
  msg[msg_len] = '\0';

  unix_datagram_sendto(CONTROLLER_SOCKET, msg);

  int socket_fd = create_daemon_socket();
  if (socket_fd == -1) {
    printf("Failed creating daemon socket: %s\n", strerror(errno));

    return;
  }

  while (1) {
    struct sockaddr_un addr;
    socklen_t addr_len = sizeof(addr);
    int client_fd = accept(socket_fd, (struct sockaddr *) &addr, &addr_len);
    if (client_fd == -1) {
      printf("Failed accepting client: %s\n", strerror(errno));

      return;
    }

    char action;
    read(client_fd, &action, 1);

    switch (action) {
      case DAEMON_PING_HEARTBEAT: {
        char value = ZYGOTE_INJECTED;
        unix_datagram_sendto(CONTROLLER_SOCKET, &value);
      }
      case DAEMON_ZYGOTE_RESTART: {
        printf("Zygote restarted, clean up companions\n");

        free_modules(modules);

        /* companion code */
      }
      case DAEMON_SYSTEM_SERVER_STARTED: {
        char value = SYSTEM_SERVER_STARTED;
        unix_datagram_sendto(CONTROLLER_SOCKET, &value);
      }
      default: {
        // WIP
      }
    }
  }
}

void spawn_companion(char *name, int lib_fd) {
  /* Creates 2 connected unix streams */
  int sockets[2];
  socketpair(AF_UNIX, SOCK_STREAM, 0, sockets);

  int daemon_fd = sockets[0];
  int companion_fd = sockets[1];

  pid_t pid = fork();
  if (pid == -1) {
    printf("Failed forking: %s\n", strerror(errno));

    return;
  } else if (pid > 0) {
    close(companion_fd);
  
    int status;
    waitpid(pid, &status, 0);

    if (WIFEXITED(status) && WEXITSTATUS(status) == 0) {
      write(daemon_fd, name, strlen(name));
      write(daemon_fd, &lib_fd, sizeof(lib_fd));

      int response;
      read(daemon_fd, &response, 1);

      if (response == 0) {
        printf("No companion spawned for %s because it has no entry\n", name);
      } else if (response == 1) {
        printf("Spawned companion for %s\n", name);
      } else {
        printf("Invalid companion response\n");
      }
    } else {
      printf("Exited with status %d\n", status);
    }
  } else {
    fcntl(companion_fd, F_SETFD, 0);
  }

  char *args[] = { "zygiskd", "companion", companion_fd, NULL };
  execv("/system/bin/zygiskd", args);

  exit(0);
}

void handle_daemon_action(enum DaemonSocketAction action, int stream_fd, struct Context *context) {
  switch (action) {
    case RequestLogcatFd: {
      while (1) {
        char level;
        read(stream_fd, &level, 1);

        char tag[PATH_MAX];
        read(stream_fd, tag, PATH_MAX);

        char message[PATH_MAX];
        read(stream_fd, message, PATH_MAX);

        __android_log_print(level, tag, message);
      }
    }
    case GetProcessFlags: {
      int uid;
      read(stream_fd, &uid, sizeof(uid));

      int flags = 0;
      if (uid_is_manager(uid)) {
        flags |= PROCESS_IS_MANAGER;
      } else {
        if (uid_granted_root(uid)) {
          flags |= PROCESS_GRANTED_ROOT;
        }
        if (uid_should_umount(uid)) {
          flags |= PROCESS_ON_DENYLIST;
        }
      }

      switch (get_impl()) {
        case KernelSU: {
          flags |= PROCESS_ROOT_IS_KSU;
        }
        // case Magisk: {
        //   flags |= PROCESS_ROOT_IS_MAGISK;
        // }
        // case APatch: {
        //   flags |= PROCESS_ROOT_IS_APATCH;
        // }
      }

      write(stream_fd, &flags, sizeof(flags));
    }
    case GetInfo: {
      int flags = 0;

      switch (get_impl()) {
        case KernelSU: {
          flags |= PROCESS_ROOT_IS_KSU;
        }
        // case Magisk: {
        //   flags |= PROCESS_ROOT_IS_MAGISK;
        // }
        // case APatch: {
        //   flags |= PROCESS_ROOT_IS_APATCH;
        // }
      }

      write(stream_fd, &flags, sizeof(flags));

      int pid = getpid();
      write(stream_fd, &pid, sizeof(pid));
    }
    case ReadModules: {
      int len = sizeof(context->modules);
      write(stream_fd, &len, sizeof(len));

      for (int i = 0; i < len; i++) {
        write(stream_fd, context->modules[i]->name, strlen(context->modules[i]->name));
        send_fd(stream_fd, context->modules[i]->lib_fd);
      }
    }
    case RequestCompanionSocket: {
      /* WIP */

      break;
    }
    case GetModuleDir: {
      int index;
      read(stream_fd, &index, sizeof(index));

      char dir[PATH_MAX];
      snprintf(dir, PATH_MAX, "%s/%s", PATH_MODULES_DIR, context->modules[index]->name);
      int dir_fd = open(dir, O_RDONLY);

      send_fd(stream_fd, dir_fd);
    }
    default: {
      // WIP
    }
  }
}

