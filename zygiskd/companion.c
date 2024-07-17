#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <sys/stat.h>
#include <dlfcn.h>

#include <unistd.h>
#include <linux/limits.h>
#include <pthread.h>

#include "dl.h"
#include "utils.h"

typedef void (*ZygiskCompanionEntryFn)(u_int32_t);

ZygiskCompanionEntryFn load_module(u_int32_t fd) {
  char path[PATH_MAX];
  snprintf(path, sizeof(path), "/proc/self/fd/%d", fd);

  void *handle = android_dlopen(path, RTLD_NOW);
  void *entry = dlsym(handle, "zygisk_companion_entry");
  if (entry == NULL) return NULL;

  return (ZygiskCompanionEntryFn)entry;
}

void *ExecuteNew(void *arg) {
  u_int32_t fd = (u_int32_t)arg;

  struct stat st0;
  if (fstat(fd) == -1) {
    printf("Failed to stat client fd\n");

    exit(0);
  }
  entry(fd);

  // Only close client if it is the same file so we don't
  // accidentally close a re-used file descriptor.
  // This check is required because the module companion
  // handler could've closed the file descriptor already.
  struct stat st1;
  if (fstat(fd) == -1) {
    printf("Failed to stat client fd\n");

    exit(0);
  }

  if (st0.st_dev != st1.st_dev || st0.st_ino != st1.st_ino) {
    close(fd);
  }

  return NULL;
}

void entry(u_int32_t fd) {
  printf("companion entry fd=%d\n", fd);

  char name[256];
  read(fd, name, 256);

  int library_fd;
  read(fd, &library_fd, sizeof(library_fd));

  ZygiskCompanionEntryFn entry = load_module(library_fd);

  close(library_fd);

  if (entry == NULL) {
    printf("No companion entry for `%s`\n", name);

    write(fd, (void *)0, 1);

    exit(0);
  }

  printf("Companion process created for `%s`\n", name);

  write(fd, (void *)1, 1);

  while (1) {
    int client_fd;
    read(fd, &client_fd, sizeof(client_fd));

    printf("New companion request from module `%s` fd=`%d`\n", name, client_fd);

    write(fd, (void *)1, 1);

    pthread_t thread;
    pthread_create(&thread, NULL, ExecuteNew, (void *)client_fd);
    pthread_detach(thread);


  }
}
