use std::ptr::addr_of;

mod kernelsu;
mod magisk;
mod apatch;

#[derive(Debug)]
pub enum RootImpl {
    None,
    TooOld,
    Abnormal,
    Multiple,
    KernelSU,
    Magisk,
    APatch,
}

static mut ROOT_IMPL: RootImpl = RootImpl::None;

pub fn setup() {
    let apatch_version = apatch::get_apatch();
    let ksu_version = kernelsu::get_kernel_su();
    let magisk_version = magisk::get_magisk();

    let impl_ = match (apatch_version, ksu_version, magisk_version) {
        (None, None, None) => RootImpl::None,
        (Some(_), Some(_), Some(_)) => RootImpl::Multiple,
        (Some(apatch_version),None, None) => match apatch_version {
            apatch::Version::Supported => RootImpl::APatch,
            apatch::Version::TooOld => RootImpl::TooOld,
            apatch::Version::Abnormal => RootImpl::Abnormal,
        },
        (None,Some(ksu_version), None) => match ksu_version {
            kernelsu::Version::Supported => RootImpl::KernelSU,
            kernelsu::Version::TooOld => RootImpl::TooOld,
            kernelsu::Version::Abnormal => RootImpl::Abnormal,
        },
        (None, None, Some(magisk_version)) => match magisk_version {
            magisk::Version::Supported => RootImpl::Magisk,
            magisk::Version::TooOld => RootImpl::TooOld,
        },
        _ => RootImpl::None,
    };
    unsafe {
        ROOT_IMPL = impl_;
    }
}

pub fn get_impl() -> &'static RootImpl {
  unsafe { &*addr_of!(ROOT_IMPL) }
}

pub fn uid_granted_root(uid: i32) -> bool {
    match get_impl() {
        RootImpl::KernelSU => kernelsu::uid_granted_root(uid),
        RootImpl::Magisk => magisk::uid_granted_root(uid),
        RootImpl::APatch => apatch::uid_granted_root(uid),
        _ => panic!("uid_granted_root: unknown root impl {:?}", get_impl()),
    }
}

pub fn uid_should_umount(uid: i32) -> bool {
    match get_impl() {
        RootImpl::KernelSU => kernelsu::uid_should_umount(uid),
        RootImpl::Magisk => magisk::uid_should_umount(uid),
        RootImpl::APatch => apatch::uid_should_umount(uid),
        _ => panic!("uid_should_umount: unknown root impl {:?}", get_impl()),
    }
}

pub fn uid_is_manager(uid: i32) -> bool {
    match get_impl() {
        RootImpl::KernelSU => kernelsu::uid_is_manager(uid),
        RootImpl::Magisk => magisk::uid_is_manager(uid),
        RootImpl::APatch => apatch::uid_is_manager(uid),
        _ => panic!("uid_is_manager: unknown root impl {:?}", get_impl()),
    }
}
