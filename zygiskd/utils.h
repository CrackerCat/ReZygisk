#ifndef UTILS_H
#define UTILS_H

#include <sys/types.h>

void switch_mount_namespace(pid_t pid);

void get_property(const char *name, char *output);

void set_socket_create_context(const char *context);

void unix_datagram_sendto(const char *path, const char *buf);

int unix_listener_from_path(char *path);

#endif /* UTILS_H */