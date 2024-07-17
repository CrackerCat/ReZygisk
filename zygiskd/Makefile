CC := ~/Android/Sdk/ndk/27.0.11902837/toolchains/llvm/prebuilt/linux-x86_64/bin/aarch64-linux-android34-clang

FILES = root_impl/common.c   \
        root_impl/kernelsu.c \
				main.c               \
				utils.c              \

CFLAGS = -D_GNU_SOURCE -Wall -Wextra -Werror -O3 -Iroot_impl -llog

all: CFLAGS += -DDEBUG=0
all:
	$(CC) $(CFLAGS) $(FILES) -o zygiskd

debug: CFLAGS += -DDEBUG=1
debug:
	$(CC) $(CFLAGS) $(FILES) -o zygiskd

clean:
	rm -f zygiskd