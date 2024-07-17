#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <sys/un.h>

#include <unistd.h>
#include <linux/limits.h>
#include <sched.h>

#include <pthread.h>

void switch_mount_namespace(pid_t pid) {
  char current_path[PATH_MAX];
  if (getcwd(current_path, PATH_MAX) == NULL) {
    /* TODO: Improve error messages */
    perror("getcwd");

    return;
  }

  /* INFO: We will NEVER achieve PATH_MAX value, but this is for ensurance. */
  char path[PATH_MAX];
  snprintf(path, PATH_MAX, "/proc/%d/ns/mnt", pid);

  FILE *mnt_ns = fopen(path, "r");
  if (mnt_ns == NULL) {
    /* TODO: Improve error messages */
    perror("fopen");

    return;
  }

  if (setns(fileno(mnt_ns), 0) == -1) {
    /* TODO: Improve error messages */
    perror("setns");

    return;
  }

  fclose(mnt_ns);

  if (chdir(current_path) == -1) {
    /* TODO: Improve error messages */
    perror("chdir");

    return;
  }
}

int __system_property_get(const char *, char *);

void get_property(const char *name, char *output) {
  __system_property_get(name, output);
}

void set_socket_create_context(const char *context) {
  char path[PATH_MAX];
  snprintf(path, PATH_MAX, "/proc/thread-self/attr/sockcreate");

  FILE *sockcreate = fopen(path, "w");
  if (sockcreate == NULL) {
    perror("fopen");

    return;
  }

  if (fwrite(context, 1, strlen(context), sockcreate) != strlen(context)) {
    perror("fwrite");

    return;
  }

  fclose(sockcreate);
}

void get_current_attr(char *output) {
  char path[PATH_MAX];
  snprintf(path, PATH_MAX, "/proc/self/attr/current");

  FILE *current = fopen(path, "r");
  if (current == NULL) {
    perror("fopen");

    return;
  }

  if (fgets(output, PATH_MAX, current) == NULL) {
    perror("fgets");

    return;
  }

  fclose(current);
}

void unix_datagram_sendto(const char *path, const char *buf) {
  char current_attr[PATH_MAX];
  get_current_attr(current_attr);

  set_socket_create_context(current_attr);

  struct sockaddr_un addr;
  addr.sun_family = AF_UNIX;
  strncpy(addr.sun_path, path, sizeof(addr.sun_path) - 1);

  int socket_fd = socket(AF_UNIX, SOCK_DGRAM, 0);
  if (socket_fd == -1) {
    perror("socket");

    return;
  }

  if (connect(socket_fd, (struct sockaddr *)&addr, sizeof(addr)) == -1) {
    perror("connect");

    return;
  }

  if (sendto(socket_fd, buf, strlen(buf), 0, (struct sockaddr *)&addr, sizeof(addr)) == -1) {
    perror("sendto");

    return;
  }

  set_socket_create_context("u:r:zygote:s0");

  close(socket_fd);
}

int chcon(const char *path, const char *context) {
  char command[PATH_MAX];
  snprintf(command, PATH_MAX, "chcon %s %s", context, path);

  return system(command);
}

int unix_listener_from_path(char *path) {
  remove(path);

  struct sockaddr_un addr;
  addr.sun_family = AF_UNIX;
  strncpy(addr.sun_path, path, sizeof(addr.sun_path) - 1);

  int socket_fd = socket(AF_UNIX, SOCK_STREAM, 0);
  if (socket_fd == -1) {
    perror("socket");

    return -1;
  }

  if (bind(socket_fd, (struct sockaddr *)&addr, sizeof(addr)) == -1) {
    perror("bind");

    return -1;
  }

  if (listen(socket_fd, 2) == -1) {
    perror("listen");

    return -1;
  }

  if (chcon(path, "u:object_r:magisk_file:s0") == -1) {
    perror("chcon");

    return -1;
  }

  return socket_fd;
}