# ReZygisk

ReZygisk is a fork of Zygisk Next, which is a standalone implementation of Zygisk, providing Zygisk API support for KernelSU, Magisk (besides built-in) and futurely APatch.

It aims at the modernization and re-write of the codebase to C (from C++ and Rust), allowing a more efficient and faster implementation of the Zygisk API with a more permissive license.

> [!NOTE]
> This module/fork is WIP, only use .zip from the releases.

## Why?

The latest releases of Zygisk Next are not open-source, reserving entirely the code for its developers. Not only that limits our ability to contribute to the project, but also impossibilitates the audit of the code, which is a major concern for security, as Zygisk Next is a module that runs with superuser (root) privileges, having access to the entire system.

The Zygisk Next developers are famous and trusted in the Android community, however this doesn't mean that the code is not malicious or vulnerable. We (PerformanC) understand they have their reasons to keep the code closed-source, but we believe that contrary.

## Features

- FOSS (forever)
- Better hiding standalone

## Dependencies

- rustc
- Android NDK

### Rust side:

- android_logger
- anyhow
- bitflags
- const_format
- futures
- konst
- lazy_static
- libc
- log
- memfd
- num_enum
- passfd
- proc-maps

### C++ side:

- lsplt

## Installation

WIP, do not install yet.

## Usage

WIP

## Support

Any question related to ReZygisk or other PerformanC projects can be made in [PerformanC's Discord server](https://discord.gg/uPveNfTuCJ).

## Contribution

It is mandatory to follow the PerformanC's [contribution guidelines](https://github.com/PerformanC/contributing) to contribute to ReZygisk. Following its Security Policy, Code of Conduct and syntax standard.

## License

ReZygisk is licensed majoritaly under GPL, by Dr-TSNG, but also BSD 2-Clause License for re-written code. You can read more about it on [Open Source Initiative](https://opensource.org/licenses/BSD-2-Clause).
